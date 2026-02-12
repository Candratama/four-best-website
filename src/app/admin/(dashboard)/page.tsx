import { getPartners, getProducts } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Package, Building, Home, Plus, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const partners = await getPartners({ activeOnly: false });
  const products = await getProducts({ activeOnly: false });

  const activePartners = partners.filter((p) => p.is_active === 1).length;
  const activeProducts = products.filter((p) => p.is_active === 1).length;
  const commercialCount = products.filter((p) => p.category === "commercial").length;
  const subsidiCount = products.filter((p) => p.category === "subsidi").length;

  const stats = [
    {
      title: "Total Partner",
      value: partners.length,
      active: activePartners,
      icon: Users,
      href: "/admin/partners",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Perumahan",
      value: products.length,
      active: activeProducts,
      icon: Package,
      href: "/admin/products",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Komersial",
      value: commercialCount,
      icon: Building,
      href: "/admin/products?category=commercial",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Subsidi",
      value: subsidiCount,
      icon: Home,
      href: "/admin/products?category=subsidi",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Selamat datang! Berikut ringkasan konten Anda.
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href="/admin/partners/new">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Partner
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Perumahan
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                {stat.active !== undefined && (
                  <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-green-600">{stat.active} aktif</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Partners */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Partner Terbaru</CardTitle>
              <CardDescription>Data partner terkini</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/partners">
                Lihat semua
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {partners.slice(0, 5).map((partner) => (
                <Link
                  key={partner.id}
                  href={`/admin/partners/${partner.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{partner.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {partner.short_description?.slice(0, 40) || "Belum ada deskripsi"}
                        {partner.short_description && partner.short_description.length > 40 ? "..." : ""}
                      </p>
                    </div>
                  </div>
                  <Badge variant={partner.is_active ? "default" : "secondary"}>
                    {partner.is_active ? "Aktif" : "Nonaktif"}
                  </Badge>
                </Link>
              ))}
              {partners.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Belum ada partner</p>
                  <Button variant="link" asChild className="mt-2">
                    <Link href="/admin/partners/new">Tambah partner pertama</Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Perumahan Terbaru</CardTitle>
              <CardDescription>Data perumahan terkini</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/products">
                Lihat semua
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.slice(0, 5).map((product) => (
                <Link
                  key={product.id}
                  href={`/admin/products/${product.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {product.category === "commercial" ? "Komersial" : "Subsidi"} • {product.location || "Belum ada lokasi"}
                      </p>
                    </div>
                  </div>
                  <Badge variant={product.is_active ? "default" : "secondary"}>
                    {product.is_active ? "Aktif" : "Nonaktif"}
                  </Badge>
                </Link>
              ))}
              {products.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Belum ada perumahan</p>
                  <Button variant="link" asChild className="mt-2">
                    <Link href="/admin/products/new">Tambah perumahan pertama</Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
