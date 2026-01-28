"use client";

import { AnimatedSection } from "@/components/ui";

interface GoogleMapProps {
  mapUrl?: string;
  address?: string;
  height?: string;
}

export default function GoogleMap({
  mapUrl,
  address = "Perum Ungaran Asri, No C1, Ungaran",
  height = "400px",
}: GoogleMapProps) {
  // Default map URL - embed URL for Ungaran area
  // This should be replaced with actual Google Maps embed URL from database
  const defaultMapUrl =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.0!2d110.4!3d-7.15!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sUngaran%2C%20Semarang!5e0!3m2!1sen!2sid!4v1234567890";

  const embedUrl = mapUrl || defaultMapUrl;

  return (
    <section className="section-map">
      <AnimatedSection animation="fadeInUp">
        <div className="map-wrapper">
          <iframe
            src={embedUrl}
            width="100%"
            height={height}
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Lokasi ${address}`}
          ></iframe>
        </div>
      </AnimatedSection>
    </section>
  );
}
