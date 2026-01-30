"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";

interface HalfFluidProps {
  subtitle?: string;
  title: string;
  description: string;
  backgroundImage: string;
  imagePosition?: "left" | "right";
}

export default function HalfFluid({
  subtitle = "Facilities",
  title,
  description,
  backgroundImage,
  imagePosition = "right",
}: HalfFluidProps) {
  const isRight = imagePosition === "right";

  return (
    <section className="bg-dark section-dark text-light relative no-top no-bottom overflow-hidden">
      <div className="container-fluid position-relative half-fluid">
        <div className="container">
          <div className="row gx-5">
            {/* Image */}
            <div
              className={`col-lg-6 position-lg-absolute ${
                isRight ? "right-half" : "left-half"
              } h-100 overflow-hidden`}
            >
              <div
                className="image"
                data-bgimage={`url(${backgroundImage}) center`}
                style={{
                  backgroundImage: `url(${backgroundImage})`,
                  backgroundPosition: "center",
                }}
              ></div>
            </div>

            {/* Text */}
            <div
              className={`col-lg-6 ${
                !isRight ? "offset-lg-6" : ""
              } relative z-3`}
            >
              <div
                className={`${
                  isRight ? "me-lg-5 pe-lg-5" : "ms-lg-5 ps-lg-5"
                } py-5 my-5`}
              >
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
        </div>
      </div>
    </section>
  );
}
