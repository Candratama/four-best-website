"use client";

import TeamCard, { TeamMember } from "@/components/cards/TeamCard";

interface TeamProps {
  subtitle?: string;
  title?: string;
  members: TeamMember[];
}

export default function Team({
  subtitle = "Our Team",
  title = "Meet the Team",
  members,
}: TeamProps) {
  return (
    <section className="relative overlay-dark-1">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-6 offset-lg-3 text-center">
            <div className="subtitle wow fadeInUp">{subtitle}</div>
            <h2 className="wow fadeInUp" data-wow-delay=".2s">
              {title}
            </h2>
          </div>
        </div>
        <div className="row g-4">
          {members.map((member) => (
            <TeamCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}
