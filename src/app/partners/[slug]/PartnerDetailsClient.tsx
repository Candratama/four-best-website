"use client";

import { useEffect } from "react";
import Link from "next/link";
import type { Partner, Product } from "@/lib/db";
import { ContactForm } from "@/components/sections";

interface PartnerDetailsClientProps {
  partner: Partner;
  products: Product[];
}

export default function PartnerDetailsClient({
  partner,
  products,
}: PartnerDetailsClientProps) {
  useEffect(() => {
    // Initialize WOW animations
    if (typeof window !== "undefined") {
      import("wowjs").then((WOW) => {
        new WOW.WOW({ live: false }).init();
      });
    }
  }, []);

  // Group products by category
  const commercialProducts = products.filter(
    (p) => p.category === "commercial",
  );
  const subsidiProducts = products.filter((p) => p.category === "subsidi");

  return (
    <>
      {/* Hero Section with background image and dark overlay */}
      <section
        className="section-dark text-light no-top no-bottom relative overflow-hidden"
        style={{
          backgroundImage: `url(${partner.hero_image || "/images/misc/company-placeholder.webp"})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "70vh",
        }}
      >
        <div className="gradient-edge-top op-6"></div>
        <div className="abs z-2 w-100" style={{ bottom: "120px" }}>
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="relative overflow-hidden">
                  <div className="wow fadeInUpBig" data-wow-duration="1.5s">
                    <div
                      className="subtitle text-light wow fadeInUp"
                      data-wow-delay=".2s"
                    >
                      Developer Partner
                    </div>
                    <h1
                      className="fs-120 text-uppercase fs-sm-10vw mb-2 lh-1 wow fadeInUp"
                      data-wow-delay=".4s"
                    >
                      {partner.name}
                    </h1>
                  </div>
                </div>
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
            <div
              className="rounded-2xl bg-white d-flex justify-content-center align-items-center wow zoomIn"
              style={{
                width: "300px",
                height: "300px",
                boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
                overflow: "hidden",
                padding: "40px",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={partner.logo || "/images/misc/company-placeholder.webp"}
                alt={partner.name}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Company Profile Section */}
      <section id="section-profile" style={{ paddingTop: "220px" }}>
        <div className="container">
          <div className="row g-4 justify-content-center">
            <div className="spacer-double"></div>
            <div className="col-lg-8">
              <div className="text-center">
                <div className="subtitle wow fadeInUp" data-wow-delay=".2s">
                  Tentang Kami
                </div>
                <h2 className="wow fadeInUp" data-wow-delay=".4s">
                  Profil Perusahaan
                </h2>
              </div>
              <div className="spacer-single"></div>
              <div className="wow fadeInUp" data-wow-delay=".6s">
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
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      {products.length > 0 && (
        <section id="section-products" className="bg-color-op-1">
          <div className="container">
            <div className="row g-4 gx-5 justify-content-center">
              <div className="col-lg-6 text-center">
                <div
                  className="subtitle s2 mb-3 wow fadeInUp"
                  data-wow-delay=".0s"
                >
                  Proyek Kami
                </div>
                <h2 className="wow fadeInUp" data-wow-delay=".2s">
                  Daftar Produk
                </h2>
                <p className="wow fadeInUp" data-wow-delay=".4s">
                  {products.length} proyek tersedia dari {partner.name}
                </p>
              </div>
            </div>

            {/* Commercial Products */}
            {commercialProducts.length > 0 && (
              <>
                <div className="spacer-single"></div>
                <h4 className="text-center mb-4 wow fadeInUp">
                  Properti Komersial ({commercialProducts.length})
                </h4>
                <div className="row g-4">
                  {commercialProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className="col-lg-4 col-md-6 wow fadeInUp"
                      data-wow-delay={`${index * 0.1}s`}
                    >
                      <div className="de-item hover-shadow rounded-1 overflow-hidden">
                        <div className="d-img">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={
                              product.main_image ||
                              "/images/misc/property-placeholder.webp"
                            }
                            className="w-100"
                            alt={product.name}
                            style={{ height: "220px", objectFit: "cover" }}
                          />
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
                          <Link
                            href={`/products/${product.slug}`}
                            className="btn-main btn-sm fx-slide"
                            data-hover="Lihat Detail"
                          >
                            <span>Lihat Detail</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Subsidi Products */}
            {subsidiProducts.length > 0 && (
              <>
                <div className="spacer-double"></div>
                <h4 className="text-center mb-4 wow fadeInUp">
                  Rumah Subsidi ({subsidiProducts.length})
                </h4>
                <div className="row g-4">
                  {subsidiProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className="col-lg-4 col-md-6 wow fadeInUp"
                      data-wow-delay={`${index * 0.1}s`}
                    >
                      <div className="de-item hover-shadow rounded-1 overflow-hidden">
                        <div className="d-img">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={
                              product.main_image ||
                              "/images/misc/property-placeholder.webp"
                            }
                            className="w-100"
                            alt={product.name}
                            style={{ height: "220px", objectFit: "cover" }}
                          />
                        </div>
                        <div className="d-info p-4">
                          <span className="badge bg-secondary mb-2">Subsidi</span>
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
                          <Link
                            href={`/products/${product.slug}`}
                            className="btn-main btn-sm fx-slide"
                            data-hover="Lihat Detail"
                          >
                            <span>Lihat Detail</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
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
            <div className="col-lg-6 text-center">
              <div
                className="subtitle s2 mb-3 wow fadeInUp"
                data-wow-delay=".0s"
              >
                Hubungi Kami
              </div>
              <h2 className="wow fadeInUp" data-wow-delay=".2s">
                Tertarik dengan Proyek Kami?
              </h2>
            </div>
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
