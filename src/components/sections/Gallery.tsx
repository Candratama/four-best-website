"use client";

import { useState } from "react";
import Lightbox from "../ui/Lightbox";

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
            <div className="subtitle s2 mb-3 wow fadeInUp" data-wow-delay=".0s">
              Discover Gallery
            </div>
            <h2 className="wow fadeInUp" data-wow-delay=".2s">
              Exterior &amp; Interior
            </h2>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12 text-center">
            <ul id="filters" className="wow fadeInUp" data-wow-delay="0s">
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
            </ul>
          </div>
        </div>

        <div id="gallery" className="row g-3 wow fadeInUp" data-wow-delay=".3s">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              className={`col-md-3 col-sm-6 col-12 item ${item.category}`}
            >
              <a
                href="#"
                className="image-popup d-block hover"
                onClick={(e) => {
                  e.preventDefault();
                  handleImageClick(idx);
                }}
              >
                <div className="relative overflow-hidden rounded-1">
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
            </div>
          ))}
        </div>
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
