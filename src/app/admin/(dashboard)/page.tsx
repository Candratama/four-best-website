import { getPartners, getProducts } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, Building, Home } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const partners = await getPartners({ activeOnly: true });
  const products = await getProducts({ activeOnly: true });

  const commercialCount = products.filter((p) => p.category === "commercial").length;
  const subsidiCount = products.filter((p) => p.category === "subsidi").length;

  const stats = [
    {
      title: "Total Partners",
      value: partners.length,
      icon: Users,
      href: "/admin/partners",
    },
    {
      title: "Total Products",
      value: products.length,
      icon: Package,
      href: "/admin/products",
    },
    {
      title: "Commercial",
      value: commercialCount,
      icon: Building,
      href: "/admin/products?category=commercial",
    },
    {
      title: "Subsidi",
      value: subsidiCount,
      icon: Home,
      href: "/admin/products?category=subsidi",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-5 w-5 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Partners */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Partners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {partners.slice(0, 5).map((partner) => (
                <Link
                  key={partner.id}
                  href={`/admin/partners/${partner.id}`}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md"
                >
                  <span className="font-medium">{partner.name}</span>
                  <span className="text-sm text-gray-500">
                    {partner.is_active ? "Active" : "Inactive"}
                  </span>
                </Link>
              ))}
              {partners.length === 0 && (
                <p className="text-gray-500 text-sm">No partners yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Products */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {products.slice(0, 5).map((product) => (
                <Link
                  key={product.id}
                  href={`/admin/products/${product.id}`}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md"
                >
                  <span className="font-medium">{product.name}</span>
                  <span className="text-sm text-gray-500 capitalize">
                    {product.category}
                  </span>
                </Link>
              ))}
              {products.length === 0 && (
                <p className="text-gray-500 text-sm">No products yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Link
            href="/admin/partners/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            + Add Partner
          </Link>
          <Link
            href="/admin/products/new"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            + Add Product
          </Link>
          <Link
            href="/admin/content/hero-slides"
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Edit Hero
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
