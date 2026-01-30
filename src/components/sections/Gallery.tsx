"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lightbox from "../ui/Lightbox";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export interface GalleryItem {
  id: string;
  image: string;
  category: string;
}

export interface GalleryProps {
  items: GalleryItem[];
  filters: string[];
}

export default function Gallery({ items, filters }: GalleryProps) {
  const [activeFilter, setActiveFilter] = useState<string>("*");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const filteredItems =
    activeFilter === "*"
      ? items
      : items.filter((item) => item.category === activeFilter);

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section id="section-gallery">
      <div className="container">
        <div className="row g-4 gx-5 justify-content-center">
          <div className="col-lg-6 text-center">
            <motion.div
              className="subtitle s2 mb-3"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Discover Gallery
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Exterior &amp; Interior
            </motion.h2>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12 text-center">
            <motion.ul
              id="filters"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <li>
                <a
                  href="#"
                  data-filter="*"
                  className={activeFilter === "*" ? "selected" : ""}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveFilter("*");
                  }}
                >
                  View All
                </a>
              </li>
              {filters.map((filter) => (
                <li key={filter}>
                  <a
                    href="#"
                    data-filter={`.${filter}`}
                    className={activeFilter === filter ? "selected" : ""}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveFilter(filter);
                    }}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </a>
                </li>
              ))}
            </motion.ul>
          </div>
        </div>

        <motion.div
          id="gallery"
          className="row g-3"
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item.id}
                className={`col-md-3 col-sm-6 col-12 item ${item.category}`}
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: idx * 0.05 }}
                layout
              >
                <a
                  href="#"
                  className="image-popup d-block hover"
                  onClick={(e) => {
                    e.preventDefault();
                    handleImageClick(idx);
                  }}
                >
                  <div className="relative overflow-hidden rounded-2xl">
                    <div className="absolute start-0 w-100 hover-op-1 p-5 abs-middle z-2 text-center text-white z-3">
                      View
                    </div>
                    <div className="absolute start-0 w-100 h-100 overlay-dark-7 hover-op-1 z-2"></div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      className="w-100 hover-scale-1-2"
                      alt=""
                    />
                  </div>
                </a>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {lightboxOpen && (
        <Lightbox
          images={filteredItems.map((item) => item.image)}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </section>
  );
}
