import { getPartnersWithProductCount } from "@/lib/db";
import type { PartnerCardProps } from "@/components/cards/PartnerCard";
import PartnersClient from "./PartnersClient";

export default async function PartnersPage() {
  let partnerCards: PartnerCardProps[] = [];
  let error: string | null = null;

  try {
    const partners = await getPartnersWithProductCount({ activeOnly: true });

    partnerCards = partners.map((partner) => ({
      name: partner.name,
      slug: partner.slug,
      image: partner.hero_image || "",
      productCount: partner.product_count,
      href: `/partners/${partner.slug}`,
    }));
  } catch (err) {
    console.error("Failed to fetch partners:", err);
    error = "Gagal memuat data partner";
  }

  return <PartnersClient partnerCards={partnerCards} error={error} />;
}
