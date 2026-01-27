import { getPartners, getProducts } from "@/lib/db";
import type { PartnerCardProps } from "@/components/cards/PartnerCard";
import PartnersClient from "./PartnersClient";

export default async function PartnersPage() {
  let partnerCards: PartnerCardProps[] = [];
  let error: string | null = null;

  try {
    const partners = await getPartners({ activeOnly: true });

    // Get product counts for each partner
    const partnerCardsPromises = partners.map(async (partner) => {
      const products = await getProducts({
        partnerId: partner.id,
        activeOnly: true,
      });

      return {
        name: partner.name,
        slug: partner.slug,
        image: partner.hero_image || "/images/misc/company-placeholder.webp",
        productCount: products.length,
        href: `/partners/${partner.slug}`,
      };
    });

    partnerCards = await Promise.all(partnerCardsPromises);
  } catch (err) {
    console.error("Failed to fetch partners:", err);
    error = "Failed to load partners";
  }

  return <PartnersClient partnerCards={partnerCards} error={error} />;
}
