"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Partner, Product } from "@/lib/db";
import { ContactForm } from "@/components/sections";
import { AnimatedButton } from "@/components/ui";
import { fadeInUp, staggerContainer, zoomIn } from "@/lib/animations";

interface PartnerDetailsClientProps {
  partner: Partner;
  products: Product[];
}

type FilterType = 'all' | 'commercial' | 'subsidi';

// Generate acronym from partner name (skip common prefixes like PT, CV)
function getAcronym(name: string): string {
  const skipWords = ["pt", "cv", "tbk", "ltd", "inc", "co"];
  const words = name
    .split(/\s+/)
    .filter((word) => !skipWords.includes(word.toLowerCase()));
  return words
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
    .slice(0, 3); // Max 3 characters
}

export default function PartnerDetailsClient({
  partner,
  products,
}: PartnerDetailsClientProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  // Group products by category
  const commercialProducts = products.filter(
    (p) => p.category === "commercial",
  );
  const subsidiProducts = products.filter((p) => p.category === "subsidi");

  // Get filtered products based on active filter
  const getFilteredProducts = () => {
    if (activeFilter === 'all') return products;
    if (activeFilter === 'commercial') return commercialProducts;
    return subsidiProducts;
  };

  const filteredProducts = getFilteredProducts();

  const hasHeroImage = partner.hero_image && !partner.hero_image.includes("placeholder");
  const hasLogo = partner.logo && !partner.logo.includes("placeholder");
  const acronym = getAcronym(partner.name);

  return (
    <>
      {/* Hero Section with background image and dark overlay */}
      <section
        className="section-dark text-light no-top no-bottom relative overflow-hidden"
        style={{
          backgroundImage: hasHeroImage ? `url(${partner.hero_image})` : undefined,
          backgroundColor: hasHeroImage ? undefined : "#162d50",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "70vh",
        }}
      >
        {/* Acronym overlay when no hero image */}
        {!hasHeroImage && (
          <div
            className="abs w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ zIndex: 1 }}
          >
            <span
              style={{
                fontSize: "20rem",
                fontWeight: "700",
                color: "rgba(255, 255, 255, 0.05)",
                letterSpacing: "0.2em",
              }}
            >
              {acronym}
            </span>
          </div>
        )}
        <div className="gradient-edge-top op-6"></div>
        <div className="abs z-2 w-100" style={{ bottom: "120px" }}>
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <motion.div
                  className="relative overflow-hidden"
                  variants={staggerContainer(0.2)}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <motion.div variants={fadeInUp}>
                    <div className="subtitle text-light">
                      Developer Partner
                    </div>
                  </motion.div>
                  <motion.div variants={fadeInUp}>
                    <h1 className="fs-120 text-uppercase fs-sm-10vw mb-2 lh-1">
                      {partner.name}
                    </h1>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
        <div className="sw-overlay op-5"></div>
      </section>

      {/* Floating Logo between Hero and Profile */}
      <div
        className="relative z-10"
        style={{ marginTop: "-100px", marginBottom: "-200px" }}
      >
        <div className="container">
          <div className="d-flex justify-content-center">
            <motion.div
              className="rounded-2xl bg-white d-flex justify-content-center align-items-center"
              variants={zoomIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              style={{
                width: "300px",
                height: "300px",
                boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
                overflow: "hidden",
                padding: "40px",
              }}
            >
              {hasLogo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={partner.logo!}
                  alt={partner.name}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <span
                  style={{
                    fontSize: "5rem",
                    fontWeight: "700",
                    color: "#162d50",
                    letterSpacing: "0.1em",
                  }}
                >
                  {acronym}
                </span>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Company Profile Section */}
      <section id="section-profile" style={{ paddingTop: "220px" }}>
        <div className="container">
          <div className="row g-4 justify-content-center">
            <div className="spacer-double"></div>
            <div className="col-lg-8">
              <motion.div
                className="text-center"
                variants={staggerContainer(0.2)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.div variants={fadeInUp}>
                  <div className="subtitle">Tentang Kami</div>
                </motion.div>
                <motion.div variants={fadeInUp}>
                  <h2>Profil Perusahaan</h2>
                </motion.div>
              </motion.div>
              <div className="spacer-single"></div>
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {partner.full_profile ? (
                  <div
                    className="text-content"
                    dangerouslySetInnerHTML={{ __html: partner.full_profile }}
                  />
                ) : partner.short_description ? (
                  <p className="lead text-center">
                    {partner.short_description}
                  </p>
                ) : (
                  <p className="lead text-center text-muted">
                    Informasi profil belum tersedia.
                  </p>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      {products.length > 0 && (
        <section id="section-products" className="bg-color-op-1">
          <div className="container">
            <div className="row g-4 gx-5 justify-content-center">
              <motion.div
                className="col-lg-6 text-center"
                variants={staggerContainer(0.2)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.div variants={fadeInUp}>
                  <div className="subtitle s2 mb-3">Proyek Kami</div>
                </motion.div>
                <motion.div variants={fadeInUp}>
                  <h2>Daftar Produk</h2>
                </motion.div>
                <motion.div variants={fadeInUp}>
                  <p>{filteredProducts.length} proyek tersedia dari {partner.name}</p>
                </motion.div>
              </motion.div>
            </div>

            {/* Filter Buttons */}
            <div className="row justify-content-center mt-4">
              <div className="col-auto">
                <div className="d-flex gap-3 flex-wrap justify-content-center">
                  <button
                    onClick={() => setActiveFilter('all')}
                    className={`btn rounded-pill px-4 py-2`}
                    style={{
                      backgroundColor: activeFilter === 'all' ? '#162d50' : 'transparent',
                      color: activeFilter === 'all' ? '#ffffff' : '#162d50',
                      border: '2px solid #162d50',
                      transition: 'all 0.3s ease',
                      fontWeight: '500',
                    }}
                  >
                    Semua
                  </button>
                  <button
                    onClick={() => setActiveFilter('commercial')}
                    className={`btn rounded-pill px-4 py-2`}
                    style={{
                      backgroundColor: activeFilter === 'commercial' ? '#162d50' : 'transparent',
                      color: activeFilter === 'commercial' ? '#ffffff' : '#162d50',
                      border: '2px solid #162d50',
                      transition: 'all 0.3s ease',
                      fontWeight: '500',
                    }}
                  >
                    Komersial
                  </button>
                  <button
                    onClick={() => setActiveFilter('subsidi')}
                    className={`btn rounded-pill px-4 py-2`}
                    style={{
                      backgroundColor: activeFilter === 'subsidi' ? '#162d50' : 'transparent',
                      color: activeFilter === 'subsidi' ? '#ffffff' : '#162d50',
                      border: '2px solid #162d50',
                      transition: 'all 0.3s ease',
                      fontWeight: '500',
                    }}
                  >
                    Subsidi
                  </button>
                </div>
              </div>
            </div>

            {/* Unified Product Grid */}
            <div className="spacer-single"></div>
            {filteredProducts.length > 0 ? (
              <motion.div 
                className="row g-4"
                variants={staggerContainer(0.1)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    className="col-lg-4 col-md-6"
                    variants={fadeInUp}
                  >
                    <div className="de-item hover-shadow rounded-1 overflow-hidden">
                      <div className="d-img position-relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={
                            product.main_image ||
                            "https://cdn.4best.id/misc/property-placeholder.webp"
                          }
                          className="w-100"
                          alt={product.name}
                          style={{ height: "220px", objectFit: "cover" }}
                        />
                        {/* Category Badge */}
                        <span
                          className="badge position-absolute"
                          style={{
                            top: '12px',
                            right: '12px',
                            backgroundColor: product.category === 'commercial' ? '#162d50' : '#f97316',
                            color: '#ffffff',
                            padding: '6px 12px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            zIndex: 2,
                          }}
                        >
                          {product.category === 'commercial' ? 'Komersial' : 'Subsidi'}
                        </span>
                      </div>
                      <div className="d-info p-4">
                        <h4 className="mb-2">{product.name}</h4>
                        {product.location && (
                          <p className="text-muted mb-2">
                            <i className="fa fa-map-marker me-2"></i>
                            {product.location}
                          </p>
                        )}
                        {product.description && (
                          <p className="mb-3 text-truncate-2">
                            {product.description}
                          </p>
                        )}
                        <AnimatedButton
                          href={`/products/${product.slug}`}
                          size="sm"
                        >
                          Lihat Detail
                        </AnimatedButton>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="row justify-content-center">
                <div className="col-lg-6 text-center">
                  <p className="text-muted" style={{ transition: 'opacity 0.3s ease' }}>
                    {activeFilter === 'commercial' 
                      ? 'Belum ada properti komersial tersedia.'
                      : 'Belum ada rumah subsidi tersedia.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* No Products Message */}
      {products.length === 0 && (
        <section className="bg-color-op-1">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6 text-center">
                <p className="text-muted">
                  Belum ada produk yang tersedia dari partner ini.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="section-contact">
        <div className="container">
          <div className="row g-4 justify-content-center">
            <motion.div
              className="col-lg-6 text-center"
              variants={staggerContainer(0.2)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div variants={fadeInUp}>
                <div className="subtitle s2 mb-3">Hubungi Kami</div>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <h2>Tertarik dengan Proyek Kami?</h2>
              </motion.div>
            </motion.div>
          </div>

          <div className="row g-4 justify-content-center">
            {/* Partner Contact Info */}
            <div className="col-md-4">
              <div className="bg-color-op-1 p-4 rounded-1 h-100">
                <h4 className="mb-4">Kontak {partner.name}</h4>

                {partner.contact_phone && (
                  <div className="mb-3">
                    <div className="fw-600 mb-1">Telepon</div>
                    <a
                      href={`tel:${partner.contact_phone}`}
                      className="id-color"
                    >
                      <i className="fa fa-phone me-2"></i>
                      {partner.contact_phone}
                    </a>
                  </div>
                )}

                {partner.contact_email && (
                  <div className="mb-3">
                    <div className="fw-600 mb-1">Email</div>
                    <a
                      href={`mailto:${partner.contact_email}`}
                      className="id-color"
                    >
                      <i className="fa fa-envelope me-2"></i>
                      {partner.contact_email}
                    </a>
                  </div>
                )}

                {!partner.contact_phone && !partner.contact_email && (
                  <p className="text-muted">
                    Informasi kontak belum tersedia. Silakan hubungi kami
                    melalui form di samping.
                  </p>
                )}
              </div>
            </div>

            {/* Contact Form */}
            <div className="col-md-5">
              <ContactForm variant="inline" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
