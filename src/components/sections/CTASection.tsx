"use client";

import { AnimatedSection } from "@/components/ui";

interface CTASectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  backgroundImage?: string;
}

export default function CTASection({
  title = "Siap Menemukan Properti Impian Anda?",
  subtitle = "Hubungi Kami",
  description = "Tim profesional kami siap membantu Anda menemukan properti yang tepat. Konsultasi gratis dan tanpa komitmen.",
  primaryButtonText = "Hubungi via WhatsApp",
  primaryButtonHref = "https://wa.me/6281234567890",
  secondaryButtonText = "Jadwalkan Konsultasi",
  secondaryButtonHref = "/contact",
  backgroundImage = "https://cdn.4best.id/backgrounds/8.webp",
}: CTASectionProps) {
  return (
    <section className="cta-section">
      <div
        className="cta-background"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        <div className="cta-overlay"></div>
      </div>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            <AnimatedSection animation="fadeInUp">
              <p className="cta-subtitle">{subtitle}</p>
              <h2 className="cta-title">{title}</h2>
              <p className="cta-description">{description}</p>

              <div className="cta-buttons">
                <a
                  href={primaryButtonHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-main btn-cta-primary fx-slide"
                  data-hover={primaryButtonText}
                >
                  <span>{primaryButtonText}</span>
                </a>
                <a
                  href={secondaryButtonHref}
                  className="btn-main btn-cta-secondary fx-slide"
                  data-hover={secondaryButtonText}
                >
                  <span>{secondaryButtonText}</span>
                </a>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
