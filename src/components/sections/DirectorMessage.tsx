"use client";

import { motion } from "framer-motion";
import { fadeInLeft, fadeInRight, fadeInUp } from "@/lib/animations";

interface DirectorMessageProps {
  name: string;
  role: string;
  image: string;
  message: string;
  subtitle?: string;
  title?: string;
}

export default function DirectorMessage({
  name,
  role,
  image,
  message,
  subtitle = "Sambutan",
  title = "Pesan Direktur Utama",
}: DirectorMessageProps) {
  return (
    <section className="relative overlay-dark-1">
      <div className="container">
        {/* Section Header */}
        <div className="row g-4">
          <div className="col-lg-6 offset-lg-3 text-center">
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

        {/* Director Content: Photo 40% + Message 60% */}
        <div className="row g-4 mt-3 align-items-center">
          {/* Photo Column - 40% */}
          <motion.div
            className="col-lg-5"
            variants={fadeInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="director-photo-wrapper">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt={name}
                className="w-100 rounded-2xl"
                style={{ objectFit: "cover", aspectRatio: "3/4" }}
              />
            </div>
          </motion.div>

          {/* Message Column - 60% */}
          <motion.div
            className="col-lg-7"
            variants={fadeInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="director-message-content">
              {/* Quote Icon */}
              <div className="mb-4">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ opacity: 0.3 }}
                >
                  <path
                    d="M11 7H7.5C6.12 7 5 8.12 5 9.5V11C5 12.1 5.9 13 7 13H9V15H5V17H9C10.1 17 11 16.1 11 15V7ZM19 7H15.5C14.12 7 13 8.12 13 9.5V11C13 12.1 13.9 13 15 13H17V15H13V17H17C18.1 17 19 16.1 19 15V7Z"
                    fill="currentColor"
                  />
                </svg>
              </div>

              {/* Message Text */}
              <blockquote
                className="mb-5"
                style={{
                  fontSize: "1.1rem",
                  lineHeight: "1.9",
                  fontStyle: "italic",
                  borderLeft: "3px solid var(--id-color, #c8a97e)",
                  paddingLeft: "1.5rem",
                }}
              >
                {message}
              </blockquote>

              {/* Signature-style Name & Role */}
              <div
                className="director-signature"
                style={{ borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: "1.25rem" }}
              >
                <h4 className="mb-0" style={{ fontWeight: 600 }}>
                  {name}
                </h4>
                <p className="mb-0" style={{ opacity: 0.7 }}>
                  {role}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
