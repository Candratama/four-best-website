"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";

interface FacilitiesProps {
  subtitle?: string;
  title: string;
  facilities: string[];
  className?: string;
}

export default function Facilities({
  subtitle = "Facilities",
  title,
  facilities,
  className = "",
}: FacilitiesProps) {
  // Split facilities into two columns
  const midpoint = Math.ceil(facilities.length / 2);
  const leftColumn = facilities.slice(0, midpoint);
  const rightColumn = facilities.slice(midpoint);

  return (
    <section className={`section-dark bg-dark text-light ${className}`}>
      <div className="container">
        <div className="row g-4 justify-content-between">
          <div className="col-lg-4 relative z-3">
            <div className="me-lg-3">
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

          <div className="col-lg-6">
            <div className="spacer-single spacer-double"></div>
            <div className="row">
              <motion.div
                className="col-md-5"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <ul className="ul-check fs-500 text-light">
                  {leftColumn.map((facility, index) => (
                    <li key={index}>{facility}</li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                className="col-md-5"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <ul className="ul-check fs-500 text-light">
                  {rightColumn.map((facility, index) => (
                    <li key={index}>{facility}</li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
