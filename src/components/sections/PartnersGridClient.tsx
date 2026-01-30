"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { PartnerCard } from "@/components/cards";
import { fadeInUp, staggerContainer } from "@/lib/animations";

interface Partner {
  name: string;
  slug: string;
  image: string;
  productCount: number;
  href: string;
}

interface PartnersGridClientProps {
  subtitle?: string;
  title?: string;
  partners: Partner[];
}

export default function PartnersGridClient({
  subtitle = "Our Partners",
  title = "Trusted Partners",
  partners,
}: PartnersGridClientProps) {
  return (
    <section className="relative">
      <div className="container relative z-2">
        <div className="row g-4 justify-content-center">
          <div className="col-lg-6 text-center">
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
          </div>
        </div>

        <motion.div
          className="row g-4"
          variants={staggerContainer(0.15)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {partners.map((partner, index) => (
            <motion.div
              key={partner.slug}
              className="col-md-6"
              variants={fadeInUp}
              transition={{ delay: index * 0.15 }}
            >
              <PartnerCard {...partner} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="row mt-4"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <div className="col-12 text-center">
            <Link
              href="/partners"
              className="btn-main btn-line fx-slide"
              data-hover="View All Partners"
            >
              <span>View All Partners</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
