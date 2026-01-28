"use client";

import { useEffect } from "react";
import { PartnerCard } from "@/components/cards";
import type { PartnerCardProps } from "@/components/cards/PartnerCard";

interface PartnersClientProps {
  partnerCards: PartnerCardProps[];
  error: string | null;
}

export default function PartnersClient({
  partnerCards,
  error,
}: PartnersClientProps) {
  useEffect(() => {
    // Initialize jarallax for parallax effect
    if (typeof window !== "undefined") {
      import("jarallax").then(({ jarallax }) => {
        jarallax(document.querySelectorAll(".jarallax"), {
          speed: 0.5,
        });
      });
    }
  }, []);

  return (
    <>
      {/* Hero Section - Exact match to template */}
      <section
        id="section-hero"
        className="section-dark text-light no-top no-bottom relative overflow-hidden mh-600 jarallax"
        data-jarallax
        data-speed="0.5"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/background/3.webp" className="jarallax-img" alt="" />
        <div className="gradient-edge-top op-6"></div>
        <div className="abs bottom-10 z-2 w-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="relative overflow-hidden">
                  <div className="wow fadeInUpBig" data-wow-duration="1.5s">
                    <h1 className="fs-120 text-uppercase fs-sm-10vw mb-2 lh-1">
                      Partner
                    </h1>
                    <h3>Kolaborasi untuk Hasil Terbaik</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="sw-overlay op-5"></div>
      </section>

      {/* Partners Grid Section */}
      <section className="relative bg-gray no-top" style={{ backgroundColor: "#f5f5f5", padding: "60px 0" }}>
        <div className="container">
          <div className="row g-4">
            {error ? (
              <div className="col-12 text-center py-5">
                <p className="text-danger">{error}</p>
              </div>
            ) : partnerCards.length === 0 ? (
              <div className="col-12 text-center py-5">
                <p>Belum ada partner.</p>
              </div>
            ) : (
              partnerCards.map((partner) => (
                <div key={partner.slug} className="col-md-6">
                  <PartnerCard {...partner} />
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}
