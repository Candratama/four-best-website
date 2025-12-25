"use client";

interface AboutContentProps {
  subtitle?: string;
  title: string;
  description: string;
  images: {
    left: string;
    right: string;
  };
}

export default function AboutContent({
  subtitle = "About Us",
  title,
  description,
  images,
}: AboutContentProps) {
  return (
    <section>
      <div className="container relative z-1">
        <div className="row g-4 gx-5 align-items-center justify-content-between">
          <div className="col-lg-6">
            <div className="row g-4">
              <div className="col-sm-6">
                <div className="row g-4">
                  <div className="col-lg-12">
                    <div className="overflow-hidden wow zoomIn">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={images.left}
                        className="w-100 wow scaleIn"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="row g-4">
                  <div className="spacer-single sm-hide"></div>
                  <div className="col-lg-12">
                    <div
                      className="overflow-hidden wow zoomIn"
                      data-wow-delay=".3s"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={images.right}
                        className="w-100 wow scaleIn"
                        alt=""
                        data-wow-delay=".3s"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="subtitle wow fadeInUp" data-wow-delay=".2s">
              {subtitle}
            </div>
            <h2 className="wow fadeInUp" data-wow-delay=".4s">
              {title}
            </h2>
            <p className="wow fadeInUp" data-wow-delay=".6s">
              {description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
