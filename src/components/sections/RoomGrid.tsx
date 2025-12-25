"use client";

import { PartnerCard } from "@/components/cards";
import type { PartnerCardProps } from "@/components/cards/PartnerCard";

interface RoomGridProps {
  subtitle?: string;
  title: string;
  rooms: PartnerCardProps[];
}

export default function RoomGrid({
  subtitle = "Elevated Comfort",
  title = "Choose a Room",
  rooms,
}: RoomGridProps) {
  return (
    <section className="relative">
      <div className="container relative z-2">
        <div className="row g-4 justify-content-center">
          <div className="col-lg-6 text-center">
            <div className="subtitle wow fadeInUp" data-wow-delay=".0s">
              {subtitle}
            </div>
            <h2 className="wow fadeInUp" data-wow-delay=".2s">
              {title}
            </h2>
          </div>
        </div>

        <div className="row g-4">
          {rooms.map((room) => (
            <div key={room.slug} className="col-md-6">
              <PartnerCard {...room} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
