import Image from "next/image";
import { getCompanyInfo, getSocialLinks, getSiteSettings } from "@/lib/db";

export default async function Footer() {
  const currentYear = new Date().getFullYear();

  // Fetch data from database
  const companyInfo = await getCompanyInfo();
  const socialLinks = await getSocialLinks({ activeOnly: true });
  const siteSettings = await getSiteSettings();

  const address = companyInfo?.address || "Perum Ungaran Asri, No C1, Ungaran";
  const phone =
    companyInfo?.whatsapp || companyInfo?.phone || "+62 812 3456 7890";
  const openingHours = companyInfo?.opening_hours || "Sen - Sab 08:00 - 17:00";
  const email = companyInfo?.email || "contact@4best.id";
  
  // Get Instagram from social links
  const instagramLink = socialLinks.find(
    (link) => link.platform.toLowerCase() === "instagram"
  );
  const instagram = instagramLink?.url
    ? `@${instagramLink.url.replace(/^https?:\/\/(www\.)?instagram\.com\//, "").replace(/\/$/, "")}`
    : "@4best.id";
  
  // Get logo from site settings
  const logo = siteSettings?.logo || "https://cdn.4best.id/branding/logo.svg";

  return (
    <footer className="section-dark footer-compact">
      <div className="container h-100 d-flex flex-column justify-content-center align-items-center">
        {/* Logo and Address Section */}
        <div className="text-center">
          <div className="footer-logo-wrapper">
            <Image
              src={logo}
              alt="4best Logo"
              width={150}
              height={50}
              className="logo-white footer-logo"
            />
          </div>
          <div className="footer-address mt-3">
            <i className="fa-solid fa-location-dot footer-inline-icon"></i>
            {address}
          </div>
        </div>

        {/* Contact Info with small icons */}
        <div className="d-flex flex-wrap justify-content-center gap-3 footer-contact-row mt-4">
          <span className="footer-contact-item">
            <i className="fa-brands fa-whatsapp footer-inline-icon"></i>
            {phone}
          </span>
          <span className="footer-contact-divider">|</span>
          <span className="footer-contact-item">
            <i className="fa-solid fa-clock footer-inline-icon"></i>
            {openingHours}
          </span>
          <span className="footer-contact-divider">|</span>
          <span className="footer-contact-item">
            <i className="fa-solid fa-envelope footer-inline-icon"></i>
            {email}
          </span>
          <span className="footer-contact-divider">|</span>
          <span className="footer-contact-item">
            <i className="fa-brands fa-instagram footer-inline-icon"></i>
            {instagram}
          </span>
        </div>

        {/* Copyright */}
        <div className="text-center footer-copyright mt-4">
          Copyright {currentYear} - 4best by Designesia
        </div>
      </div>
    </footer>
  );
}
