import { getPartners } from "@/lib/db";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const partners = await getPartners({ activeOnly: true });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Add New Product</h1>
      <ProductForm partners={partners} mode="create" />
    </div>
  );
}
