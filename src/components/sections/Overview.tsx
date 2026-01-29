"use client";

import { AnimatedButton } from "@/components/ui";

interface OverviewProps {
  subtitle?: string;
  title: string;
  description: string;
  ctaText?: string;
  ctaHref?: string;
  images?: string[];
}

export default function Overview({
  subtitle = "Home Overview",
  title,
  description,
  ctaText = "Schedule Visit",
  ctaHref = "/contact",
  images = [
    "https://cdn.4best.id/misc/s2.webp",
    "https://cdn.4best.id/misc/s3.webp",
    "https://cdn.4best.id/misc/s4.webp",
    "https://cdn.4best.id/misc/s5.webp",
  ],
}: OverviewProps) {
  return (
    <section id="section-overview">
      <div className="container">
        <div className="row g-4 align-items-center justify-content-between">
          {/* Text Content */}
          <div className="col-lg-5">
            <div className="ps-lg-3">
              <div className="subtitle wow fadeInUp" data-wow-delay=".2s">
                {subtitle}
              </div>
              <h2 className="wow fadeInUp" data-wow-delay=".4s">
                {title}
              </h2>
              <p className="wow fadeInUp" data-wow-delay=".6s">
                {description}
              </p>
              <AnimatedButton href={ctaHref}>
                {ctaText}
              </AnimatedButton>
            </div>
          </div>

          {/* Images Grid */}
          <div className="col-lg-6">
            <div className="row g-4">
              <div className="col-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={images[0]}
                  className="img-fluid mb-4 w-70 ms-30 wow scaleIn rounded-2xl"
                  alt="Overview 1"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={images[1]}
                  className="img-fluid wow scaleIn rounded-2xl"
                  alt="Overview 2"
                />
              </div>
              <div className="col-6">
                <div className="spacer-single sm-hide"></div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={images[2]}
                  className="img-fluid mb-4 wow scaleIn rounded-2xl"
                  alt="Overview 3"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={images[3]}
                  className="img-fluid w-70 wow scaleIn rounded-2xl"
                  alt="Overview 4"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
