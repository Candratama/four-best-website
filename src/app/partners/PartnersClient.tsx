"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { PartnerCard } from "@/components/cards";
import type { PartnerCardProps } from "@/components/cards/PartnerCard";
import { fadeInUp, fadeInUpBig } from "@/lib/animations";

interface HeroData {
  title: string;
  subtitle?: string | null;
  background_image?: string | null;
}

interface PartnersClientProps {
  partnerCards: PartnerCardProps[];
  error: string | null;
  heroData?: HeroData;
}

export default function PartnersClient({
  partnerCards,
  error,
  heroData,
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

  const title = heroData?.title || "Partner";
  const subtitle = heroData?.subtitle || "Kolaborasi untuk Hasil Terbaik";
  const backgroundImage = heroData?.background_image || "https://cdn.4best.id/misc/gallery/l15.webp";

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
        <img src={backgroundImage} className="jarallax-img" alt="" />
        <div className="gradient-edge-top op-6"></div>
        <div className="abs bottom-10 z-2 w-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="relative overflow-hidden">
                  <motion.h1
                    className="fs-120 text-uppercase fs-sm-10vw mb-2 lh-1"
                    variants={fadeInUpBig}
                    initial="hidden"
                    animate="visible"
                  >
                    {title}
                  </motion.h1>
                  <motion.h3
                    variants={fadeInUpBig}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.1 }}
                  >
                    {subtitle}
                  </motion.h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="sw-overlay op-5"></div>
      </section>

      {/* Partners Grid Section */}
      <section className="relative partners-grid-section">
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
              partnerCards.map((partner, index) => (
                <motion.div 
                  key={partner.slug} 
                  className="col-md-6"
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <PartnerCard {...partner} />
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}
