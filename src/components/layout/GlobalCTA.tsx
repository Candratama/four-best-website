"use client";

import { usePathname } from "next/navigation";
import CTASection from "@/components/sections/CTASection";

const EXCLUDED_PATHS = ["/contact"];

interface GlobalCTAProps {
  subtitle?: string;
  title?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  backgroundImage?: string;
}

export default function GlobalCTA({
  subtitle,
  title,
  description,
  primaryButtonText,
  primaryButtonHref,
  secondaryButtonText,
  secondaryButtonHref,
  backgroundImage,
}: GlobalCTAProps) {
  const pathname = usePathname();

  // Don't render CTA on excluded pages
  if (EXCLUDED_PATHS.includes(pathname)) {
    return null;
  }

  return (
    <CTASection
      subtitle={subtitle}
      title={title}
      description={description}
      primaryButtonText={primaryButtonText}
      primaryButtonHref={primaryButtonHref}
      secondaryButtonText={secondaryButtonText}
      secondaryButtonHref={secondaryButtonHref}
      backgroundImage={backgroundImage}
    />
  );
}
