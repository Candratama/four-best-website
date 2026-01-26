import Link from "next/link";
import { getPartners } from "@/lib/db";
import { PartnerCard } from "@/components/cards";

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
    size: string;
    href: string;
  }> = [];

  try {
    const dbPartners = await getPartners({ activeOnly: true });
    const partnerSizes = [
      "50+ Projects",
      "30+ Projects",
      "75+ Projects",
      "40+ Projects",
    ];

    partners = dbPartners.slice(0, limit).map((partner, index) => ({
      name: partner.name,
      slug: partner.slug,
      image: partner.logo || `/images/apartment/${(index % 6) + 1}.jpg`,
      size: partnerSizes[index % partnerSizes.length],
      href: `/partners/${partner.slug}`,
    }));
  } catch (error) {
    console.error("Failed to fetch partners:", error);
  }

  if (partners.length === 0) {
    return null;
  }

  return (
    <section className="relative">
      <div className="container relative z-2">
        <div className="row g-4 justify-content-center">
          <div className="col-lg-6 text-center">
            <div className="subtitle wow fadeInUp" data-wow-delay=".0s">
              {subtitle}
            </div>
            <h2 className="wow fadeInUp" data-wow-delay=".2s">
              {title}
            </h2>
          </div>
        </div>

        <div className="row g-4">
          {partners.map((partner) => (
            <div key={partner.slug} className="col-md-6">
              <PartnerCard {...partner} />
            </div>
          ))}
        </div>

        <div className="row mt-4">
          <div className="col-12 text-center">
            <Link
              href="/partners"
              className="btn-main btn-line fx-slide"
              data-hover="View All Partners"
            >
              <span>View All Partners</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
