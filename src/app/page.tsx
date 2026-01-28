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
        mapUrl="https://maps.app.goo.gl/BSpMhDN2Z6Jgp9UL6"
        slides={[
          { image: "/images/slider/apt-1.webp", overlay: 0.4 },
          { image: "/images/slider/apt-2.webp", overlay: 0.4 },
        ]}
      />

      {/* Overview Section */}
      <Overview
        subtitle="4Best"
        title="Pilihan Tepat, Hasil Terbaik"
        description="4Best Agent Property adalah perusahaan agen properti	profesional yang menyediakan layanan jual, beli, dan sewa	properti dengan pendekatan terpercaya dan berorientasi hasil.	Didukung oleh tim berpengalaman, pemahaman pasar yang	kuat, serta sistem kerja transparan, kami berkomitmen membantu klien mendapatkan solusi properti terbaik dan bernilai investasi jangka panjang."
        ctaText="Jadwalkan Kunjungan"
        ctaHref="/contact"
        images={[
          "/images/misc/s2.webp",
          "/images/misc/s3.webp",
          "/images/misc/s4.webp",
          "/images/misc/s5.webp",
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
        thumbnailImage="/images/background/3.webp"
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
