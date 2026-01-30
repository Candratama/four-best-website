import { getCompanyInfo, getSocialLinks, getPageSectionContent } from "@/lib/db";
import type { HeroSectionContent } from "@/lib/db";
import { Hero } from "@/components/sections";
import ContactPageClient from "./ContactPageClient";

// Force dynamic rendering to always fetch fresh data from database
export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const companyInfo = await getCompanyInfo();
  const socialLinks = await getSocialLinks({ activeOnly: true });
  const heroContent = await getPageSectionContent<HeroSectionContent>("contact", "hero");

  // Find Instagram from social links
  const instagramLink = socialLinks.find(
    (link) => link.platform.toLowerCase() === "instagram",
  );
  const instagramHandle = instagramLink?.url
    ? `@${instagramLink.url.replace(/^https?:\/\/(www\.)?instagram\.com\//, "").replace(/\/$/, "")}`
    : "@4best.id";

  const contactData = {
    address:
      companyInfo?.address ||
      "Perum Ungaran Asri JL. Serasi Raya Atas No C1, Ungaran, Kab. Semarang",
    whatsapp: companyInfo?.whatsapp || "+62 812 3456 7890",
    email: companyInfo?.email || "contact@4best.id",
    openingHours: companyInfo?.opening_hours || "Sen - Sab 08:00 - 17:00",
    instagram: instagramHandle,
    mapUrl:
      companyInfo?.map_url ||
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3958.8!2d110.4!3d-7.15!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e708b5d4e4b0001%3A0x1234567890abcdef!2sPerum%20Ungaran%20Asri!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid",
  };

  return (
    <>
      <Hero
        variant="parallax-contact"
        title={heroContent?.title || "Hubungi Kami"}
        subtitle={heroContent?.subtitle || "Kami Siap Membantu Anda!"}
        backgroundImage={heroContent?.background_image || "https://cdn.4best.id/backgrounds/8.webp"}
      />
      <ContactPageClient contactData={contactData} />
    </>
  );
}
