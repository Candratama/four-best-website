"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { fadeInUp, scaleIn } from "@/lib/animations";

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
              <motion.div
                className="subtitle"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {subtitle}
              </motion.div>
              <motion.h2
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                {title}
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                {description}
              </motion.p>
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
              >
                <Link
                  href={ctaHref}
                  className="btn-main fx-slide"
                  data-hover={ctaText}
                >
                  <span>{ctaText}</span>
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Images Grid */}
          <div className="col-lg-6">
            <div className="row g-4">
              <div className="col-6">
                <motion.img
                  src={images[0]}
                  className="img-fluid mb-4 w-70 ms-30 rounded-2xl"
                  alt="Overview 1"
                  variants={scaleIn}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                />
                <motion.img
                  src={images[1]}
                  className="img-fluid rounded-2xl"
                  alt="Overview 2"
                  variants={scaleIn}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 }}
                />
              </div>
              <div className="col-6">
                <div className="spacer-single sm-hide"></div>
                <motion.img
                  src={images[2]}
                  className="img-fluid mb-4 rounded-2xl"
                  alt="Overview 3"
                  variants={scaleIn}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                />
                <motion.img
                  src={images[3]}
                  className="img-fluid w-70 rounded-2xl"
                  alt="Overview 4"
                  variants={scaleIn}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: 0.45 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
