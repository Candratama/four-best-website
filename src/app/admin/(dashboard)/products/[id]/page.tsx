import { notFound } from "next/navigation";
import { getProductById, getPartners } from "@/lib/db";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(parseInt(id));
  const partners = await getPartners({ activeOnly: true });

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Product: {product.name}</h1>
      <ProductForm product={product} partners={partners} mode="edit" />
    </div>
  );
}
