import Link from "next/link";
import { getProducts, getPartners } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ProductsTable from "@/components/admin/ProductsTable";

export const dynamic = "force-dynamic";

export default async function ProductsListPage() {
  const [products, partners] = await Promise.all([
    getProducts(),
    getPartners(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Perumahan
          </Button>
        </Link>
      </div>

      <ProductsTable products={products} partners={partners} />
    </div>
  );
}
