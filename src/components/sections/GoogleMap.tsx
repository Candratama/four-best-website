"use client";

import { AnimatedSection } from "@/components/ui";

interface GoogleMapProps {
  mapUrl?: string;
  address?: string;
  height?: string;
  lat?: number;
  lng?: number;
}

export default function GoogleMap({
  mapUrl,
  address = "Perum Ungaran Asri, No C1, Ungaran",
  height = "400px",
  lat = -7.156002,
  lng = 110.3945777,
}: GoogleMapProps) {
  // Use OpenStreetMap embed with marker
  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01}%2C${lat - 0.008}%2C${lng + 0.01}%2C${lat + 0.008}&layer=mapnik&marker=${lat}%2C${lng}`;

  // Fallback to Google Maps if mapUrl is provided
  const embedUrl = mapUrl || osmUrl;

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
