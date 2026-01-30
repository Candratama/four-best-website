"use client";

import { motion } from "framer-motion";
import { fadeInUp, zoomIn } from "@/lib/animations";

interface AboutContentProps {
  subtitle?: string;
  title: string;
  description: string;
  images: {
    left: string;
    right: string;
  };
}

export default function AboutContent({
  subtitle = "About Us",
  title,
  description,
  images,
}: AboutContentProps) {
  return (
    <section>
      <div className="container relative z-1">
        <div className="row g-4 gx-5 align-items-center justify-content-between">
          <div className="col-lg-6">
            <div className="row g-4">
              <div className="col-sm-6">
                <div className="row g-4">
                  <div className="col-lg-12">
                    <motion.div
                      className="overflow-hidden"
                      variants={zoomIn}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={images.left}
                        className="w-100 rounded-2xl"
                        alt=""
                      />
                    </motion.div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="row g-4">
                  <div className="spacer-single sm-hide"></div>
                  <div className="col-lg-12">
                    <motion.div
                      className="overflow-hidden rounded-2xl"
                      variants={zoomIn}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={images.right}
                        className="w-100"
                        alt=""
                      />
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
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
          </div>
        </div>
      </div>
    </section>
  );
}
