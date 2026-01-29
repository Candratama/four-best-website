import {
  Hero,
  Overview,
  ValueProposition,
  PartnersGrid,
  Team,
} from "@/components/sections";
import { getTeamMembers } from "@/lib/db";

// Force dynamic rendering to fetch from database at runtime
export const dynamic = "force-dynamic";

export default async function Home() {
  // Fetch team members from database
  const teamMembers = await getTeamMembers({ activeOnly: true });

  return (
    <>
      {/* Hero Section with Swiper Slider */}
      <Hero
        title="Property Agency"
        address="Perum Ungaran Asri, No C1, Ungaran"
        mapUrl="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3958.8!2d110.4!3d-7.15!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e708b5d4e4b0001%3A0x1234567890abcdef!2sPerum%20Ungaran%20Asri!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
        slides={[
          { image: "https://cdn.4best.id/slider/apt-1.webp", overlay: 0.4 },
          { image: "https://cdn.4best.id/slider/apt-2.webp", overlay: 0.4 },
        ]}
      />

      {/* Overview Section */}
      <Overview
        subtitle="4Best"
        title="Pilihan Tepat, Hasil Terbaik"
        description="4Best Agent Property adalah perusahaan agen properti profesional. Kami menyediakan layanan jual, beli, dan sewa properti dengan pendekatan terpercaya dan berorientasi hasil."
        ctaText="Jadwalkan Kunjungan"
        ctaHref="/contact"
        images={[
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
      <ValueProposition />

      {/* Video Section */}
      {/* <VideoSection
        youtubeUrl="https://www.youtube.com/watch?v=C6rf51uHWJg"
        thumbnailImage="https://cdn.4best.id/backgrounds/3.webp"
        title="Virtual Tour"
      /> */}

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
