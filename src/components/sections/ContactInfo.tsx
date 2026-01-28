"use client";

import { AnimatedSection } from "@/components/ui";

interface ContactInfoProps {
  address?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  openingHours?: string;
  instagram?: string;
}

export default function ContactInfo({
  address = "Perum Ungaran Asri, No C1, Ungaran",
  phone,
  whatsapp = "+62 812 3456 7890",
  email = "contact@4best.id",
  openingHours = "Sen - Sab 08:00 - 17:00",
  instagram = "@4best.id",
}: ContactInfoProps) {
  // Format WhatsApp number for link (remove spaces and +)
  const whatsappNumber = (whatsapp || phone || "")
    .replace(/\s+/g, "")
    .replace("+", "");
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  const contactItems = [
    {
      icon: "fa-solid fa-location-dot",
      label: "Alamat",
      value: address,
      href: null,
    },
    {
      icon: "fa-brands fa-whatsapp",
      label: "WhatsApp",
      value: whatsapp || phone,
      href: whatsappLink,
    },
    {
      icon: "fa-solid fa-envelope",
      label: "Email",
      value: email,
      href: `mailto:${email}`,
    },
    {
      icon: "fa-solid fa-clock",
      label: "Jam Operasional",
      value: openingHours,
      href: null,
    },
    {
      icon: "fa-brands fa-instagram",
      label: "Instagram",
      value: instagram,
      href: `https://instagram.com/${instagram?.replace("@", "")}`,
    },
  ];

  return (
    <div className="contact-info">
      <AnimatedSection animation="fadeInUp">
        <h3 className="contact-info-title mb-4">Hubungi Kami</h3>
      </AnimatedSection>

      <div className="contact-info-list">
        {contactItems.map((item, index) => (
          <AnimatedSection
            key={item.label}
            animation="fadeInUp"
            delay={0.1 * (index + 1)}
          >
            <div className="contact-info-item">
              <div className="contact-info-icon">
                <i className={item.icon}></i>
              </div>
              <div className="contact-info-content">
                <span className="contact-info-label">{item.label}</span>
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-info-value contact-info-link"
                  >
                    {item.value}
                  </a>
                ) : (
                  <span className="contact-info-value">{item.value}</span>
                )}
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>

      {/* WhatsApp CTA Button */}
      <AnimatedSection animation="fadeInUp" delay={0.6}>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp mt-4"
        >
          <i className="fa-brands fa-whatsapp me-2"></i>
          Hubungi via WhatsApp
        </a>
      </AnimatedSection>
    </div>
  );
}
