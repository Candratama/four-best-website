"use client";

import { useState } from "react";

interface Hotspot {
  id: string;
  title: string;
  description: string;
  left: string;
  top: string;
}

interface HotspotImageProps {
  image: string;
  hotspots: Hotspot[];
  alt?: string;
}

export default function HotspotImage({
  image,
  hotspots,
  alt = "Interactive image",
}: HotspotImageProps) {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  return (
    <section className="section-dark p-0">
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} className="w-100" alt={alt} />

        {hotspots.map((hotspot) => (
          <div
            key={hotspot.id}
            className={`de-dot mt-20 ${
              activeHotspot === hotspot.id ? "active" : ""
            }`}
            style={{ left: hotspot.left, top: hotspot.top }}
            onMouseEnter={() => setActiveHotspot(hotspot.id)}
            onMouseLeave={() => setActiveHotspot(null)}
            onClick={() =>
              setActiveHotspot(activeHotspot === hotspot.id ? null : hotspot.id)
            }
          >
            <div className="d-content text-light">
              <h5>{hotspot.title}</h5>
              {hotspot.description}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
