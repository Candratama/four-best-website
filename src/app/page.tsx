import {
  Hero,
  Overview,
  ValueProposition,
  Facilities,
  PartnersGrid,
  HalfFluid,
  Stats,
} from "@/components/sections";
import { HotspotImage } from "@/components/ui";

// Facilities list
const facilities = [
  "Swimming Pools",
  "Fitness Center",
  "Rooftop Lounge",
  "Community Event Spaces",
  "Play Areas",
  "Tennis and Sports Courts",
  "Restaurant and Café",
  "Business Center",
  "Sauna and Spa",
  "Parking Facilities",
];

// Hotspots for the interactive image
const hotspots = [
  {
    id: "office",
    title: "Office Area",
    description:
      "Eiusmod quis est do id excepteur ut mollit cupidatat quis consequat cillum aute culpa aliqua ut dolor.",
    left: "61%",
    top: "10%",
  },
  {
    id: "garden",
    title: "City Garden",
    description:
      "Eiusmod quis est do id excepteur ut mollit cupidatat quis consequat cillum aute culpa aliqua ut dolor.",
    left: "68%",
    top: "77%",
  },
  {
    id: "sports",
    title: "Sports Center",
    description:
      "Eiusmod quis est do id excepteur ut mollit cupidatat quis consequat cillum aute culpa aliqua ut dolor.",
    left: "30%",
    top: "35%",
  },
  {
    id: "lake",
    title: "Lake",
    description:
      "Eiusmod quis est do id excepteur ut mollit cupidatat quis consequat cillum aute culpa aliqua ut dolor.",
    left: "4%",
    top: "58%",
  },
];

// Stats data
const stats = [
  { value: 25000, label: "Square Areas" },
  { value: 150, label: "Luxurious Unit" },
  { value: 300, label: "Parking Spaces" },
  { value: 20, label: "Public Facilities" },
];

export default function Home() {
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
        ctaText="Schedule Visit"
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
        subtitle="Our Partners"
        title="Trusted Partners"
        limit={4}
      />

      {/* Value Proposition Section */}
      <ValueProposition />

      {/* Half-Fluid Sections */}
      {/* <HalfFluid
        subtitle="Facilities"
        title="Comfort. Style. Location"
        description="Discover modern, light-filled apartments that blend style, comfort, and convenience in every detail. Choose from cozy studios to spacious three-bedrooms, each designed to suit your lifestyle. Enjoy exclusive amenities like rooftop lounges and a fitness center, all in a vibrant city location. Welcome to a community where luxury living meets urban energy."
        backgroundImage="/images/misc/l4.webp"
        imagePosition="right"
      />

      <HalfFluid
        subtitle="Facilities"
        title="Live. Laugh. Lounge."
        description="Discover modern, light-filled apartments that blend style, comfort, and convenience in every detail. Choose from cozy studios to spacious three-bedrooms, each designed to suit your lifestyle. Enjoy exclusive amenities like rooftop lounges and a fitness center, all in a vibrant city location. Welcome to a community where luxury living meets urban energy."
        backgroundImage="/images/misc/l5.webp"
        imagePosition="left"
      /> */}

      {/* Stats Section */}
      {/* <Stats stats={stats} /> */}

      {/* Video Section */}
      <section
        aria-label="section"
        className="section-dark relative p-0 text-light"
      >
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <a
                className="d-block hover popup-youtube"
                href="https://www.youtube.com/watch?v=C6rf51uHWJg"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="relative overflow-hidden z-3">
                  <div className="absolute start-0 w-100 abs-middle fs-36 text-white text-center z-2">
                    <div className="player circle wow scaleIn">
                      <span></span>
                    </div>
                  </div>
                  <div className="absolute w-100 h-100 top-0 bg-dark hover-op-05"></div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/background/3.webp"
                    className="w-100 hover-scale-1-1"
                    alt="Virtual Tour"
                  />
                </div>
              </a>
            </div>
          </div>
        </div>

        <div className="abs bottom-10 z-2 w-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-6">
                <h1 className="fs-120 text-uppercase fs-sm-10vw mb-4 lh-1">
                  Virtual Tour
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact/Agents Section */}
      <section id="contact" className="relative">
        <div className="container relative z-2">
          <div className="row g-4 justify-content-center">
            <div className="col-lg-6 text-center">
              <div
                className="subtitle s2 mb-3 wow fadeInUp"
                data-wow-delay=".0s"
              >
                Contact Us
              </div>
              <h2 className="wow fadeInUp" data-wow-delay=".2s">
                Talk to a Sales Agent
              </h2>
            </div>
          </div>

          <div className="row g-4 gx-5">
            <div className="col-md-4">
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
                  src="/images/agents/1.webp"
                  className="w-60 circle"
                  alt="Emily Rodriguez"
                />
                <div className="mt-3" style={{ textAlign: "center" }}>
                  <h4 className="mb-0">Emily Rodriguez</h4>
                  <div className="fw-500 id-color">(555) 234-5678</div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
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
                  src="/images/agents/2.webp"
                  className="w-60 circle"
                  alt="Michael Chen"
                />
                <div className="mt-3" style={{ textAlign: "center" }}>
                  <h4 className="mb-0">Michael Chen</h4>
                  <div className="fw-500 id-color">(555) 345-6789</div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
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
                  src="/images/agents/3.webp"
                  className="w-60 circle"
                  alt="Jessica Patel"
                />
                <div className="mt-3" style={{ textAlign: "center" }}>
                  <h4 className="mb-0">Jessica Patel</h4>
                  <div className="fw-500 id-color">(555) 567-8901</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
