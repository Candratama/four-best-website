import { getPartners } from "@/lib/db";
import type { PartnerCardProps } from "@/components/cards/PartnerCard";
import PartnersClient from "./PartnersClient";

export default async function PartnersPage() {
  let partnerCards: PartnerCardProps[] = [];
  let error: string | null = null;

  try {
    const partners = await getPartners({ activeOnly: true });

    // Sample sizes for partners (in a real app, this would come from the database)
    const partnerSizes = [
      "50+ Projects",
      "30+ Projects",
      "75+ Projects",
      "40+ Projects",
      "60+ Projects",
      "25+ Projects",
    ];

    partnerCards = partners.map((partner, index) => ({
      name: partner.name,
      slug: partner.slug,
      image: partner.logo || `/images/apartment/${(index % 6) + 1}.jpg`,
      size: partnerSizes[index % partnerSizes.length],
      href: `/partners/${partner.slug}`,
    }));
  } catch (err) {
    console.error("Failed to fetch partners:", err);
    error = "Failed to load partners";
  }

  return <PartnersClient partnerCards={partnerCards} error={error} />;
}
