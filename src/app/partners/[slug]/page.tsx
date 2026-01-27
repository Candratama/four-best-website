import { getPartnerBySlug, getProducts } from "@/lib/db";
import { notFound } from "next/navigation";
import PartnerDetailsClient from "./PartnerDetailsClient";

interface PartnerDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PartnerDetailsPage({
  params,
}: PartnerDetailsPageProps) {
  const { slug } = await params;
  const partner = await getPartnerBySlug(slug);

  if (!partner) {
    notFound();
  }

  // Fetch products for this partner
  const products = await getProducts({
    partnerId: partner.id,
    activeOnly: true,
  });

  return <PartnerDetailsClient partner={partner} products={products} />;
}
