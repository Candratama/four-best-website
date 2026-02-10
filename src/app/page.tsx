import {
  Hero,
  Overview,
  ValueProposition,
  PartnersGrid,
  Team,
} from "@/components/sections";
import { 
  getTeamMembers, 
  getCompanyInfo, 
  getHeroSlides, 
  getPageSectionContent, 
  getValuePropositions 
} from "@/lib/db";
import type { OverviewSectionContent, HeroSectionContent } from "@/lib/db";

// Force dynamic rendering to fetch from database at runtime
export const dynamic = "force-dynamic";

export default async function Home() {
  // Fetch all data from database
  const teamMembers = await getTeamMembers({ activeOnly: true });
  const companyInfo = await getCompanyInfo();
  const heroSlides = await getHeroSlides({ pageSlug: 'home', activeOnly: true });
  const heroContent = await getPageSectionContent<HeroSectionContent>('home', 'hero');
  const overviewContent = await getPageSectionContent<OverviewSectionContent>('home', 'overview');
  const valueProps = await getValuePropositions({ activeOnly: true });


  // Transform hero slides for component
  const slides = heroSlides.length > 0 
    ? heroSlides.map(slide => ({
        image: slide.image,
        overlay: slide.overlay_opacity,
      }))
    : [
        { image: "https://cdn.4best.id/slider/apt-1.webp", overlay: 0.4 },
        { image: "https://cdn.4best.id/slider/apt-2.webp", overlay: 0.4 },
      ];

  return (
    <>
      {/* Hero Section with Swiper Slider */}
      <Hero
        title={heroContent?.title || "Property Agency"}
        address={heroContent?.subtitle || companyInfo?.address || "Perum Ungaran Asri, No C1, Ungaran"}
        mapUrl={companyInfo?.map_url || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3958.8!2d110.4!3d-7.15!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e708b5d4e4b0001%3A0x1234567890abcdef!2sPerum%20Ungaran%20Asri!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"}
        slides={slides}
      />

      {/* Overview Section */}
      <Overview
        subtitle={overviewContent?.subtitle || "4Best"}
        title={overviewContent?.title || "Pilihan Tepat, Hasil Terbaik"}
        description={overviewContent?.description || "4Best Agent Property adalah perusahaan agen properti profesional. Kami menyediakan layanan jual, beli, dan sewa properti dengan pendekatan terpercaya dan berorientasi hasil."}
        ctaText={overviewContent?.cta_text || "Hubungi Kami"}
        ctaHref={overviewContent?.cta_href || "/contact"}
        images={overviewContent?.images || [
          "https://cdn.4best.id/misc/s2.webp",
          "https://cdn.4best.id/misc/s3.webp",
          "https://cdn.4best.id/misc/s4.webp",
          "https://cdn.4best.id/misc/s5.webp",
        ]}
      />

      {/* Partners Grid Section */}
      <PartnersGrid
        subtitle="Partner Kami"
        title="Partner Terpercaya"
        limit={4}
      />

      {/* Value Proposition Section */}
      <ValueProposition items={valueProps.length > 0 ? valueProps : undefined} />

      {/* Team Section */}
      {teamMembers.length > 0 && (
        <Team
          subtitle="Tim Kami"
          title="Kenali Tim 4BEST"
          members={teamMembers}
        />
      )}
    </>
  );
}
