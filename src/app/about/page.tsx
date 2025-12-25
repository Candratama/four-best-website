"use client";

import { useWow } from "@/hooks";
import {
  Hero,
  AboutContent,
  Mission,
  Stats,
  Team,
  CTABanner,
} from "@/components/sections";
import { TeamMember } from "@/components/cards/TeamCard";

// Team members data
const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Barbara Charline",
    role: "Property Manager",
    image: "/images/team/1.webp",
    social: {
      facebook: "#",
      twitter: "#",
      instagram: "#",
    },
  },
  {
    id: "2",
    name: "Thomas Bennett",
    role: "Leasing Consultant",
    image: "/images/team/2.webp",
    social: {
      facebook: "#",
      twitter: "#",
      instagram: "#",
    },
  },
  {
    id: "3",
    name: "Madison Jane",
    role: "Community Coordinator",
    image: "/images/team/3.webp",
    social: {
      facebook: "#",
      twitter: "#",
      instagram: "#",
    },
  },
  {
    id: "4",
    name: "Joshua Henry",
    role: "Maintenance Supervisor",
    image: "/images/team/4.webp",
    social: {
      facebook: "#",
      twitter: "#",
      instagram: "#",
    },
  },
];

// Stats data
const statsData = [
  { value: 25000, label: "Square Areas" },
  { value: 150, label: "Luxurious Unit" },
  { value: 300, label: "Parking Spaces" },
  { value: 20, label: "Public Facilities" },
];

export default function AboutPage() {
  useWow();

  return (
    <>
      {/* Hero Section */}
      <Hero
        variant="parallax-about"
        title="About Us"
        subtitle="Creating Spaces You Love to Live In"
        backgroundImage="/images/background/5.webp"
      />

      {/* About Content Section */}
      <AboutContent
        subtitle="About Us"
        title="Welcome to Residem, Where Comfort Meets Community"
        description="At Residem, we believe that home is more than just a place — it's where your story unfolds. Located in the heart of New York, our apartments are designed to offer a perfect blend of modern living, convenience, and community. Whether you're a young professional, a growing family, or someone looking to downsize, we provide a living experience that fits your lifestyle."
        images={{
          left: "/images/misc/p1.webp",
          right: "/images/misc/p2.webp",
        }}
      />

      {/* Mission Section */}
      <Mission
        subtitle="Our Mission"
        title="To create welcoming, well-maintained, and thoughtfully designed living spaces where residents feel proud to call home."
        backgroundImage="/images/misc/l9.webp"
      />

      {/* Stats Section */}
      <Stats stats={statsData} className="relative" />

      {/* Team Section */}
      <Team subtitle="Our Team" title="Meet the Team" members={teamMembers} />

      {/* CTA Banner */}
      <CTABanner
        title="Ready to make your next move?"
        buttonText="Schedule a Visit"
        buttonHref="/contact"
      />
    </>
  );
}
