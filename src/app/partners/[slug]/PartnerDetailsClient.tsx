"use client";

import { useEffect } from "react";
import type { Partner } from "@/lib/db";
import { Tabs } from "@/components/ui";
import { Gallery, ContactForm } from "@/components/sections";
import type { GalleryItem } from "@/components/sections/Gallery";

interface PartnerDetailsClientProps {
  partner: Partner;
}

// Sample gallery data
const galleryItems: GalleryItem[] = [
  { id: "1", image: "/images/gallery/l1.webp", category: "interior" },
  { id: "2", image: "/images/gallery/l2.webp", category: "interior" },
  { id: "3", image: "/images/gallery/l3.webp", category: "interior" },
  { id: "4", image: "/images/gallery/l4.webp", category: "interior" },
  { id: "5", image: "/images/gallery/l5.webp", category: "interior" },
  { id: "6", image: "/images/gallery/l6.webp", category: "exterior" },
  { id: "7", image: "/images/gallery/l7.webp", category: "exterior" },
  { id: "8", image: "/images/gallery/l8.webp", category: "exterior" },
  { id: "9", image: "/images/gallery/l9.webp", category: "facilities" },
  { id: "10", image: "/images/gallery/l10.webp", category: "facilities" },
  { id: "11", image: "/images/gallery/l11.webp", category: "facilities" },
  { id: "12", image: "/images/gallery/l12.webp", category: "facilities" },
];

export default function PartnerDetailsClient({
  partner,
}: PartnerDetailsClientProps) {
  useEffect(() => {
    // Initialize WOW animations
    if (typeof window !== "undefined") {
      import("wowjs").then((WOW) => {
        new WOW.WOW({ live: false }).init();
      });
    }
  }, []);

  return (
    <>
      {/* Hero Section with large featured image */}
      <section className="bg-color-op-2 pb-0">
        <div className="container">
          <div className="spacer-double sm-hide"></div>
          <div className="row g-4 gx-5 align-items-center justify-content-center">
            <div className="col-lg-6 text-center">
              <div className="subtitle wow fadeInUp" data-wow-delay=".2s">
                Urban Lifestyle
              </div>
              <h1 className="wow fadeInUp" data-wow-delay=".4s">
                {partner.name}
              </h1>
            </div>

            <div className="spacer-single"></div>

            <div className="col-lg-12">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={partner.logo || "/images/misc/w1.webp"}
                className="w-100 rounded-1 mb-min-100"
                alt={partner.name}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section with Feature Icons */}
      <section id="section-overview">
        <div className="container">
          <div className="row g-4 justify-content-between">
            <div className="spacer-double"></div>
            <div className="col-lg-5">
              <div className="ps-lg-3">
                <div className="subtitle wow fadeInUp" data-wow-delay=".2s">
                  Home Overview
                </div>
                <h2 className="wow fadeInUp" data-wow-delay=".4s">
                  Luxury living where comfort meets timeless style, effortlessly
                </h2>
                <p className="wow fadeInUp" data-wow-delay=".6s">
                  {partner.full_profile || partner.short_description}
                </p>

                <a
                  className="btn-main fx-slide"
                  href="#section-contact"
                  data-hover="Schedule a Visit"
                >
                  <span>Schedule a Visit</span>
                </a>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="h-100 rounded-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/icons-color/1.png"
                      className="w-70px mb-4 wow scaleIn"
                      alt="Smart Home System"
                    />
                    <div className="relative wow fadeInUp">
                      <h4>Smart Home System</h4>
                      <p className="mb-0">
                        Velit irure occaecat do consectetur dolore officia magna
                        ut anim ut.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="h-100 rounded-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/icons-color/2.png"
                      className="w-70px mb-4 wow scaleIn"
                      alt="Solar Energy Panels"
                    />
                    <div className="relative wow fadeInUp">
                      <h4>Solar Energy Panels</h4>
                      <p className="mb-0">
                        Velit irure occaecat do consectetur dolore officia magna
                        ut anim ut.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="h-100 rounded-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/icons-color/3.png"
                      className="w-70px mb-4 wow scaleIn"
                      alt="Central Air Conditioning"
                    />
                    <div className="relative wow fadeInUp">
                      <h4>Central Air Conditioning</h4>
                      <p className="mb-0">
                        Velit irure occaecat do consectetur dolore officia magna
                        ut anim ut.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="h-100 rounded-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/icons-color/4.png"
                      className="w-70px mb-4 wow scaleIn"
                      alt="Home Security System"
                    />
                    <div className="relative wow fadeInUp">
                      <h4>Home Security System</h4>
                      <p className="mb-0">
                        Velit irure occaecat do consectetur dolore officia magna
                        ut anim ut.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Room Discovery Section with Tabs */}
      <section id="section-rooms" className="bg-color-op-1">
        <div className="container">
          <div className="row g-4 gx-5 justify-content-center">
            <div className="col-lg-6 text-center">
              <div
                className="subtitle s2 mb-3 wow fadeInUp"
                data-wow-delay=".0s"
              >
                Room Details
              </div>
              <h2 className="wow fadeInUp" data-wow-delay=".2s">
                Discover Rooms
              </h2>
            </div>
          </div>
          <div className="row g-4 gx-5 justify-content-center wow fadeInUp">
            <div className="col-lg-12">
              <Tabs
                items={[
                  {
                    label: "Living Room",
                    content: (
                      <div className="row g-4 gx-5 align-items-center justify-content-between">
                        <div className="col-lg-3">
                          <h3 className="fs-32 text-dark mb-4">Living Room</h3>
                          <p>
                            A cozy, social hub with plush seating and
                            entertainment. Ideal for relaxing, gatherings, and
                            family time.
                          </p>
                        </div>

                        <div className="col-lg-8">
                          <div className="relative">
                            <div className="bg-blur abs p-2 bottom-0 rounded-2 px-4 m-4 text-white">
                              <h4 className="mb-0">20 m²</h4>
                            </div>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src="/images/discover-rooms/l1.webp"
                              className="w-100 rounded-1"
                              alt="Living Room"
                            />
                          </div>
                        </div>
                      </div>
                    ),
                  },
                  {
                    label: "Dinning Room",
                    content: (
                      <div className="row g-4 gx-5 align-items-center justify-content-between">
                        <div className="col-lg-3">
                          <h3 className="fs-32 text-dark mb-4">Dinning Room</h3>
                          <p>
                            A modern space for cooking and creativity. Equipped
                            with appliances and a central island for easy meal
                            prep.
                          </p>
                        </div>

                        <div className="col-lg-8">
                          <div className="relative">
                            <div className="bg-blur abs p-2 bottom-0 rounded-2 px-4 m-4 text-white">
                              <h4 className="mb-0">15 m²</h4>
                            </div>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src="/images/discover-rooms/l2.webp"
                              className="w-100 rounded-1"
                              alt="Dinning Room"
                            />
                          </div>
                        </div>
                      </div>
                    ),
                  },
                  {
                    label: "Kitchen",
                    content: (
                      <div className="row g-4 gx-5 align-items-center justify-content-between">
                        <div className="col-lg-3">
                          <h3 className="fs-32 text-dark mb-4">Kitchen</h3>
                          <p>
                            A warm, inviting area to share meals and
                            conversations. Positioned between the kitchen and
                            living room.
                          </p>
                        </div>

                        <div className="col-lg-8">
                          <div className="relative">
                            <div className="bg-blur abs p-2 bottom-0 rounded-2 px-4 m-4 text-white">
                              <h4 className="mb-0">15 m²</h4>
                            </div>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src="/images/discover-rooms/l3.webp"
                              className="w-100 rounded-1"
                              alt="Kitchen"
                            />
                          </div>
                        </div>
                      </div>
                    ),
                  },
                  {
                    label: "Master Bedroom",
                    content: (
                      <div className="row g-4 gx-5 align-items-center justify-content-between">
                        <div className="col-lg-3">
                          <h3 className="fs-32 text-dark mb-4">
                            Master Bedroom
                          </h3>
                          <p>
                            The bedroom is your personal sanctuary—a calming
                            space designed for deep rest and peaceful
                            beginnings.
                          </p>
                        </div>

                        <div className="col-lg-8">
                          <div className="relative">
                            <div className="bg-blur abs p-2 bottom-0 rounded-2 px-4 m-4 text-white">
                              <h4 className="mb-0">16 m²</h4>
                            </div>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src="/images/discover-rooms/l4.webp"
                              className="w-100 rounded-1"
                              alt="Master Bedroom"
                            />
                          </div>
                        </div>
                      </div>
                    ),
                  },
                  {
                    label: "Bathroom",
                    content: (
                      <div className="row g-4 gx-5 align-items-center justify-content-between">
                        <div className="col-lg-3">
                          <h3 className="fs-32 text-dark mb-4">Bathroom</h3>
                          <p>
                            A compact wellness zone with spa-like touches.
                            Features sleek fixtures and a relaxing ambiance.
                          </p>
                        </div>

                        <div className="col-lg-8">
                          <div className="relative">
                            <div className="bg-blur abs p-2 bottom-0 rounded-2 px-4 m-4 text-white">
                              <h4 className="mb-0">6 m²</h4>
                            </div>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src="/images/discover-rooms/l5.webp"
                              className="w-100 rounded-1"
                              alt="Bathroom"
                            />
                          </div>
                        </div>
                      </div>
                    ),
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Floorplan Section */}
      <section id="section-floorplan" className="bg-color-op-1">
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-lg-4">
              <div className="pe-lg-3">
                <div className="subtitle wow fadeInUp" data-wow-delay=".2s">
                  Discover
                </div>
                <h2 className="wow fadeInUp" data-wow-delay=".4s">
                  Home Floorplans
                </h2>
                <p className="wow fadeInUp" data-wow-delay=".6s">
                  Dolor ad consectetur dolore incididunt pariatur aliqua ut
                  laborum aliquip eiusmod officia tempor ex commodo amet
                  voluptate.
                </p>

                <div className="relative overflow-hidden">
                  <div className="d-flex bg-color-op-1 px-4 py-2">
                    <div className="w-60">Living Room</div>
                    <div className="w-40 fw-600">20 m²</div>
                  </div>
                  <div className="d-flex px-4 py-2">
                    <div className="w-60">Dinning Room</div>
                    <div className="w-40 fw-600">15 m²</div>
                  </div>
                  <div className="d-flex bg-color-op-1 px-4 py-2">
                    <div className="w-60">Kitchen</div>
                    <div className="w-40 fw-600">15 m²</div>
                  </div>
                  <div className="d-flex px-4 py-2">
                    <div className="w-60">Master Bedroom</div>
                    <div className="w-40 fw-600">16 m²</div>
                  </div>
                  <div className="d-flex bg-color-op-1 px-4 py-2">
                    <div className="w-60">Kids Bedroom 1</div>
                    <div className="w-40 fw-600">12 m²</div>
                  </div>
                  <div className="d-flex px-4 py-2">
                    <div className="w-60">Kids Bedroom 2</div>
                    <div className="w-40 fw-600">12 m²</div>
                  </div>
                  <div className="d-flex bg-color-op-1 px-4 py-2">
                    <div className="w-60">Bath Room</div>
                    <div className="w-40 fw-600">6 m²</div>
                  </div>
                  <div className="d-flex px-4 py-2">
                    <div className="w-60">Garage</div>
                    <div className="w-40 fw-600">40 m²</div>
                  </div>
                  <div className="d-flex px-4 bg-color-op-1 py-2">
                    <div className="w-60">Warehouse</div>
                    <div className="w-40 fw-600">4 m²</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/misc/floorplan-2-color.webp"
                className="w-100 wow fadeInUp"
                data-wow-delay=".2s"
                alt="Floorplan"
              />
            </div>
          </div>

          <div className="spacer-double"></div>

          <div className="row g-3">
            <div className="col-md-3 col-6">
              <div className="text-center">
                <h4>Size</h4>
                <div className="d-flex justify-content-center align-items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/svg/size.svg"
                    className="w-40px me-3"
                    alt="Size"
                  />
                  <div className="">1665 sqft</div>
                </div>
              </div>
            </div>

            <div className="col-md-3 col-6">
              <div className="text-center">
                <h4>Beds</h4>
                <div className="d-flex justify-content-center align-items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/svg/bed.svg"
                    className="w-40px me-3"
                    alt="Beds"
                  />
                  <div className="">5</div>
                </div>
              </div>
            </div>

            <div className="col-md-3 col-6">
              <div className="text-center">
                <h4>Baths</h4>
                <div className="d-flex justify-content-center align-items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/svg/bath.svg"
                    className="w-40px me-3"
                    alt="Baths"
                  />
                  <div className="">5</div>
                </div>
              </div>
            </div>

            <div className="col-md-3 col-6">
              <div className="text-center">
                <h4>Parking Slots</h4>
                <div className="d-flex justify-content-center align-items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/svg/car.svg"
                    className="w-40px me-3"
                    alt="Parking"
                  />
                  <div className="">5</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <Gallery
        items={galleryItems}
        filters={["exterior", "interior", "facilities"]}
      />

      {/* Nearby Places Section */}
      <section>
        <div className="container relative z-2">
          <div className="row g-4 gx-5 justify-content-center">
            <div className="col-lg-6 text-center">
              <div
                className="subtitle s2 mb-3 wow fadeInUp"
                data-wow-delay=".0s"
              >
                Near by Places
              </div>
              <h2 className="wow fadeInUp" data-wow-delay=".2s">
                Highlights Nearby
              </h2>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-lg-3 col-md-6">
              <div
                className="overflow-hidden pb-0 mb-4 bottom-0 text-center z-index-2 wow scaleIn"
                data-wow-delay=".0s"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/facilities-nearby/1.webp"
                  className="w-100 rounded-1 mb-2"
                  alt="Airport"
                />
                <div className="py-3">
                  <h4 className="no-bottom">Airport</h4>
                  <p className="small mb-1">18 miles</p>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div
                className="overflow-hidden pb-0 mb-4 bottom-0 text-center z-index-2 wow scaleIn"
                data-wow-delay=".2s"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/facilities-nearby/2.webp"
                  className="w-100 rounded-1 mb-2"
                  alt="School"
                />
                <div className="py-3">
                  <h4 className="no-bottom">School</h4>
                  <p className="small mb-1">5 miles</p>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div
                className="overflow-hidden pb-0 mb-4 bottom-0 text-center z-index-2 wow scaleIn"
                data-wow-delay=".4s"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/facilities-nearby/3.webp"
                  className="w-100 rounded-1 mb-2"
                  alt="University"
                />
                <div className="py-3">
                  <h4 className="no-bottom">University</h4>
                  <p className="small mb-1">10 miles</p>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div
                className="overflow-hidden pb-0 mb-4 bottom-0 text-center z-index-2 wow scaleIn"
                data-wow-delay=".6s"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/facilities-nearby/4.webp"
                  className="w-100 rounded-1 mb-2"
                  alt="Shopping Mall"
                />
                <div className="py-3">
                  <h4 className="no-bottom">Shopping Mall</h4>
                  <p className="small mb-1">6 miles</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="section-contact">
        <div className="container">
          <div className="row g-4 justify-content-center">
            <div className="col-lg-6 text-center">
              <div
                className="subtitle s2 mb-3 wow fadeInUp"
                data-wow-delay=".0s"
              >
                Contact Us
              </div>
              <h2 className="wow fadeInUp" data-wow-delay=".2s">
                Schedule a Visit
              </h2>
            </div>
          </div>

          <div className="row g-4 justify-content-center">
            <div className="col-md-3">
              <div className="text-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/agents/1.webp"
                  className="w-100 rounded-1"
                  alt="Emily Rodriguez"
                />

                <div className="mt-3">
                  <h4 className="mb-0">Emily Rodriguez</h4>
                  <div className="fw-500 id-color">(555) 234-5678</div>
                </div>
              </div>
            </div>

            <div className="col-md-5">
              <ContactForm variant="inline" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
