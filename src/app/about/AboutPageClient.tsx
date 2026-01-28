"use client";

import { useWow } from "@/hooks";
import {
  Hero,
  AboutContent,
  VisionMission,
  ValueProposition,
  Stats,
  Team,
  CTABanner,
} from "@/components/sections";
import { AboutPage } from "@/lib/db";

interface TeamMemberData {
  id: number;
  name: string;
  role: string | null;
  image: string | null;
  social_facebook?: string | null;
  social_twitter?: string | null;
  social_instagram?: string | null;
  social_linkedin?: string | null;
}

interface StatData {
  value: number;
  label: string;
  suffix?: string;
}

interface MissionItem {
  text: string;
}

interface AboutPageClientProps {
  aboutData: AboutPage | null;
  missionItems: MissionItem[];
  statsData: StatData[];
  teamData: TeamMemberData[];
}

// Default fallback data
const defaultAboutData = {
  hero_title: "Tentang 4BEST",
  hero_subtitle: "Pilihan Tepat, Hasil Terbaik",
  hero_background_image: "/images/background/5.webp",
  intro_subtitle: "Tentang Kami",
  intro_title: "4Best Agent Property",
  intro_description:
    "4Best Agent Property adalah perusahaan agen properti profesional yang menyediakan layanan jual, beli, dan sewa properti dengan pendekatan terpercaya dan berorientasi hasil.",
  intro_image_left: "/images/misc/p1.webp",
  intro_image_right: "/images/misc/p2.webp",
  vision_subtitle: "Visi Kami",
  vision_title: "Menjadi yang Terdepan",
  vision_text:
    "Menjadi agen pemasaran properti terpercaya, profesional, dan berorientasi hasil yang memberikan solusi terbaik bagi klien serta berkontribusi dalam pertumbuhan sektor properti di Indonesia.",
  mission_subtitle: "Misi Kami",
  mission_title: "Komitmen untuk Hasil Terbaik",
  cta_title: "Siap menemukan properti impian Anda?",
  cta_button_text: "Konsultasi Gratis",
  cta_button_href: "/contact",
};

const defaultMissions = [
  {
    text: "Memberikan layanan pemasaran properti yang jujur, transparan, dan bertanggung jawab kepada setiap klien.",
  },
  {
    text: "Mengembangkan tim yang kompeten, berintegritas, dan berdaya saing tinggi di bidang properti.",
  },
  {
    text: "Memanfaatkan teknologi dan media digital secara optimal untuk meningkatkan jangkauan dan kecepatan pemasaran.",
  },
  {
    text: "Membangun hubungan jangka panjang dengan klien, mitra, dan developer berdasarkan kepercayaan dan profesionalisme.",
  },
];

const defaultStats = [
  { value: 500, label: "Properti Terjual", suffix: "+" },
  { value: 1000, label: "Klien Puas", suffix: "+" },
  { value: 10, label: "Tahun Pengalaman", suffix: "+" },
  { value: 50, label: "Partner Developer", suffix: "+" },
];

export default function AboutPageClient({
  aboutData,
  missionItems,
  statsData,
  teamData,
}: AboutPageClientProps) {
  useWow();

  // Use data from DB or fallback to defaults
  const data = aboutData || defaultAboutData;
  const missions = missionItems.length > 0 ? missionItems : defaultMissions;
  const stats = statsData.length > 0 ? statsData : defaultStats;

  return (
    <>
      {/* Hero Section */}
      <Hero
        variant="parallax-about"
        title={data.hero_title || defaultAboutData.hero_title}
        subtitle={data.hero_subtitle || defaultAboutData.hero_subtitle}
        backgroundImage={
          data.hero_background_image || defaultAboutData.hero_background_image
        }
      />

      {/* About Content Section */}
      <AboutContent
        subtitle={data.intro_subtitle || defaultAboutData.intro_subtitle}
        title={data.intro_title || defaultAboutData.intro_title}
        description={
          data.intro_description || defaultAboutData.intro_description
        }
        images={{
          left: data.intro_image_left || defaultAboutData.intro_image_left,
          right: data.intro_image_right || defaultAboutData.intro_image_right,
        }}
      />

      {/* Vision & Mission Section */}
      <VisionMission
        visionSubtitle={data.vision_subtitle || defaultAboutData.vision_subtitle}
        visionTitle={data.vision_title || defaultAboutData.vision_title}
        visionText={data.vision_text || defaultAboutData.vision_text}
        missionSubtitle={
          data.mission_subtitle || defaultAboutData.mission_subtitle
        }
        missionTitle={data.mission_title || defaultAboutData.mission_title}
        missions={missions}
      />

      {/* Value Proposition Section */}
      <ValueProposition />

      {/* Stats Section */}
      <Stats stats={stats} className="relative" />

      {/* Team Section */}
      {teamData.length > 0 && (
        <Team subtitle="Tim Kami" title="Kenali Tim 4BEST" members={teamData} />
      )}

      {/* CTA Banner */}
      <CTABanner
        title={data.cta_title || defaultAboutData.cta_title}
        buttonText={data.cta_button_text || defaultAboutData.cta_button_text}
        buttonHref={data.cta_button_href || defaultAboutData.cta_button_href}
      />
    </>
  );
}
