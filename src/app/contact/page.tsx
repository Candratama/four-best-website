import { getCompanyInfo, getSocialLinks } from "@/lib/db";
import { Hero } from "@/components/sections";
import ContactPageClient from "./ContactPageClient";

export default async function ContactPage() {
  const companyInfo = await getCompanyInfo();
  const socialLinks = await getSocialLinks({ activeOnly: true });

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
      "https://www.google.com/maps?q=Perum+Ungaran+Asri+Jalan+Serasi&output=embed",
  };

  return (
    <>
      <Hero
        variant="parallax-contact"
        title="Hubungi Kami"
        subtitle="Kami Siap Membantu Anda!"
        backgroundImage="/images/background/8.webp"
      />
      <ContactPageClient contactData={contactData} />
    </>
  );
}
