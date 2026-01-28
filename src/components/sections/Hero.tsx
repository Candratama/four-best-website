"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

interface HeroSlide {
  image: string;
  overlay?: number;
}

interface HeroProps {
  variant?:
    | "slider"
    | "parallax"
    | "parallax-about"
    | "parallax-contact"
    | "static";
  title: string;
  subtitle?: string;
  address?: string;
  mapUrl?: string;
  slides?: HeroSlide[];
  backgroundImage?: string;
}

export default function Hero({
  variant = "slider",
  title,
  subtitle,
  address,
  mapUrl,
  slides = [
    { image: "/images/slider/apt-1.webp", overlay: 0.4 },
    { image: "/images/slider/apt-2.webp", overlay: 0.4 },
  ],
  backgroundImage,
}: HeroProps) {
  // Contact page parallax variant with bottom-positioned content and mh-600
  if (variant === "parallax-contact") {
    return (
      <section
        id="section-hero"
        className="section-dark text-light no-top no-bottom relative overflow-hidden mh-600 jarallax"
        style={{
          minHeight: "600px",
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        data-jarallax
        data-speed="0.5"
      >
        <div className="gradient-edge-top op-6"></div>
        <div className="abs bottom-10 z-2 w-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="relative overflow-hidden">
                  <div className="wow fadeInUpBig" data-wow-duration="1.5s">
                    <h1 className="fs-120 text-uppercase fs-sm-10vw mb-2 lh-1">
                      {title}
                    </h1>
                    {subtitle && <h3>{subtitle}</h3>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="sw-overlay op-5"></div>
      </section>
    );
  }

  // About page parallax variant with bottom-positioned content
  if (variant === "parallax-about") {
    return (
      <section
        id="section-hero"
        className="section-dark text-light no-top no-bottom relative overflow-hidden jarallax"
        style={{
          minHeight: "600px",
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        data-jarallax
        data-speed="0.5"
      >
        <div className="gradient-edge-top op-6"></div>
        <div className="abs bottom-10 z-2 w-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="relative overflow-hidden">
                  <div className="wow fadeInUpBig" data-wow-duration="1.5s">
                    <h1 className="fs-120 text-uppercase fs-sm-10vw mb-2 lh-1">
                      {title}
                    </h1>
                    {subtitle && <h3>{subtitle}</h3>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="sw-overlay op-5"></div>
      </section>
    );
  }

  if (variant === "parallax") {
    return (
      <section
        id="section-hero"
        className="section-dark text-light no-top no-bottom relative overflow-hidden z-1000 jarallax"
        data-jarallax
        data-speed="0.5"
      >
        <div
          className="jarallax-img"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
        <div className="gradient-edge-top abs w-100 h-40 top-0 z-2" />
        <div className="container py-32">
          <div className="row">
            <div className="col-lg-6">
              {subtitle && (
                <div className="subtitle wow fadeInUp">{subtitle}</div>
              )}
              <h1 className="fs-120 text-uppercase fs-sm-10vw mb-4 lh-1">
                {title}
              </h1>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="section-hero"
      className="section-dark text-light no-top no-bottom relative overflow-hidden"
      style={{ zIndex: 1 }}
    >
      {/* Content Overlay - positioned at bottom */}
      <div className="abs bottom-10 z-2 w-100">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h1 
                className="fs-120 text-uppercase fs-sm-10vw mb-2 lh-1 hero-title"
              >
                {title}
              </h1>
              {address && (
                <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                  <h4 className="fw-500 mb-3 mb-md-0 me-md-4 hero-address">
                    {address}
                  </h4>
                  <div className="d-flex flex-wrap gap-2">
                    {/* Primary CTA */}
                    <a
                      className="btn-main fx-slide"
                      href="/contact"
                      data-hover="Jadwalkan Kunjungan"
                    >
                      <span>Jadwalkan Kunjungan</span>
                    </a>
                    {/* Secondary CTA - Map */}
                    {mapUrl && (
                      <a
                        className="btn-main btn-line btn-line-light fx-slide"
                        href={mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-hover="Lihat di Peta"
                      >
                        <span>Lihat di Peta</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Swiper Slider */}
      <div className="h-screen" style={{ height: "100vh" }}>
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop={true}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          pagination={{
            el: ".swiper-pagination",
            clickable: true,
          }}
          style={{ height: "100%" }}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index} style={{ height: "100%" }}>
              <div
                className="swiper-inner"
                style={{
                  backgroundImage: `url(${slide.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
              >
                <div
                  className={`sw-overlay op-${Math.round(
                    (slide.overlay || 0.4) * 10,
                  )}`}
                />
              </div>
            </SwiperSlide>
          ))}

          {/* Navigation - Swiper creates these automatically */}
          <div className="swiper-pagination" />
        </Swiper>
      </div>
    </section>
  );
}
