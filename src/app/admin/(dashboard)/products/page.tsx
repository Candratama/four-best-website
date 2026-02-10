import Link from "next/link";
import { getProducts, getPartners } from "@/lib/db";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Building2 } from "lucide-react";
import MoveButtons from "@/components/admin/MoveButtons";

export const dynamic = "force-dynamic";

export default async function ProductsListPage() {
  const products = await getProducts();
  const partners = await getPartners();

  // Group products by partner_id
  const productsByPartner = products.reduce((acc, product) => {
    const partnerId = product.partner_id;
    if (!acc[partnerId]) acc[partnerId] = [];
    acc[partnerId].push(product);
    return acc;
  }, {} as Record<number, typeof products>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      {partners.map((partner) => {
        const partnerProducts = productsByPartner[partner.id] || [];
        if (partnerProducts.length === 0) return null;

        return (
          <Card key={partner.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <CardTitle>{partner.name}</CardTitle>
                <Badge className="ml-2 bg-gray-200 text-gray-700 hover:bg-gray-300">
                  {partnerProducts.length} product{partnerProducts.length !== 1 ? "s" : ""}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="border-r text-center w-[80px]">Order</TableHead>
                    <TableHead className="border-r text-center">Name</TableHead>
                    <TableHead className="border-r text-center">Category</TableHead>
                    <TableHead className="border-r text-center">Status</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {partnerProducts.map((product, index) => (
                    <TableRow key={product.id}>
                      <TableCell className="text-center">
                        <MoveButtons
                          id={product.id}
                          isFirst={index === 0}
                          isLast={index === partnerProducts.length - 1}
                          prevId={index > 0 ? partnerProducts[index - 1].id : undefined}
                          nextId={index < partnerProducts.length - 1 ? partnerProducts[index + 1].id : undefined}
                          apiEndpoint="/api/admin/products/reorder"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="text-center">
                        <Badge
                          className={product.category === "commercial"
                            ? "bg-blue-900 hover:bg-blue-950 text-white"
                            : "bg-orange-500 hover:bg-orange-600 text-white"
                          }
                        >
                          {product.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={product.is_active ? "default" : "outline"}>
                          {product.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-2">
                          <Link href={`/admin/products/${product.id}`}>
                            <Button variant="ghost" size="sm">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="sm" className="text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );
      })}

      {products.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No products found</h3>
            <p className="text-muted-foreground mb-4">
              Create your first product to get started
            </p>
            <Link href="/admin/products/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
