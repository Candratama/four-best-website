"use client";

import Link from "next/link";

interface CTABannerProps {
  title: string;
  buttonText: string;
  buttonHref: string;
}

export default function CTABanner({
  title,
  buttonText,
  buttonHref,
}: CTABannerProps) {
  return (
    <section className="bg-color section-dark text-light pt-50 pb-50">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-9">
            <h3 className="mb-0 fs-32">{title}</h3>
          </div>
          <div className="col-lg-3 text-lg-end">
            <Link
              className="btn-main fx-slide btn-line"
              href={buttonHref}
              data-hover={buttonText}
            >
              <span>{buttonText}</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
