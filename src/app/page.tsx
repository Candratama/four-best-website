import {
  Hero,
  Overview,
  ValueProposition,
  PartnersGrid,
  VideoSection,
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
        <section id="contact" className="relative overlay-dark-1">
          <div className="container relative z-2">
            <div className="row g-4 justify-content-center">
              <div className="col-lg-6 text-center">
                <div
                  className="subtitle s2 mb-3 wow fadeInUp"
                  data-wow-delay=".0s"
                >
                  Tim Kami
                </div>
                <h2 className="wow fadeInUp" data-wow-delay=".2s">
                  Kenali Tim 4BEST
                </h2>
              </div>
            </div>

            <div className="row g-4 gx-5 justify-content-center">
              {teamMembers.map((member) => (
                <div key={member.id} className="col-md-3">
                  <div
                    style={{
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={member.image || "/images/team/placeholder.webp"}
                      className="w-100"
                      alt={member.name}
                    />
                    <div className="mt-3" style={{ textAlign: "center" }}>
                      <h4 className="mb-0">{member.name}</h4>
                      <div className="fw-500 id-color">{member.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
