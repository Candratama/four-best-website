import { getPartners, getProducts } from "@/lib/db";
import PartnersGridClient from "./PartnersGridClient";

interface PartnersGridProps {
  subtitle?: string;
  title?: string;
  limit?: number;
}

export default async function PartnersGrid({
  subtitle = "Our Partners",
  title = "Trusted Partners",
  limit = 4,
}: PartnersGridProps) {
  let partners: Array<{
    name: string;
    slug: string;
    image: string;
    productCount: number;
    href: string;
  }> = [];

  try {
    const dbPartners = await getPartners({ activeOnly: true });

    // Get product counts for each partner
    const partnersWithCounts = await Promise.all(
      dbPartners.slice(0, limit).map(async (partner) => {
        const products = await getProducts({
          partnerId: partner.id,
          activeOnly: true,
        });
        return {
          name: partner.name,
          slug: partner.slug,
          image: partner.hero_image || "",
          productCount: products.length,
          href: `/partners/${partner.slug}`,
        };
      })
    );

    partners = partnersWithCounts;
  } catch (error) {
    console.error("Failed to fetch partners:", error);
  }

  if (partners.length === 0) {
    return null;
  }

  return (
    <PartnersGridClient
      subtitle={subtitle}
      title={title}
      partners={partners}
    />
  );
}
