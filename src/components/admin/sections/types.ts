import type { PageSection, AboutPage, HeroSlide, Mission } from "@/lib/db";

export type { PageSection, AboutPage, HeroSlide, Mission };

export interface HeroContent {
  title: string;
  subtitle?: string;
  background_image?: string;
}

export interface OverviewContent {
  subtitle: string;
  title: string;
  description: string;
  cta_text: string;
  cta_href: string;
  images: string[];
}

export interface AboutFormData {
  intro_subtitle: string;
  intro_title: string;
  intro_description: string;
  intro_image_left: string;
  intro_image_right: string;
  vision_subtitle: string;
  vision_title: string;
  vision_text: string;
  mission_subtitle: string;
  mission_title: string;
}

export function parseContent<T>(
  pageSection: PageSection | undefined,
  defaultValue: T,
): T {
  if (!pageSection) return defaultValue;
  try {
    const parsed = JSON.parse(pageSection.content) as T;
    return { ...defaultValue, ...parsed };
  } catch {
    return defaultValue;
  }
}
