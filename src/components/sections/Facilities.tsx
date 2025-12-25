"use client";

interface FacilitiesProps {
  subtitle?: string;
  title: string;
  facilities: string[];
  className?: string;
}

export default function Facilities({
  subtitle = "Facilities",
  title,
  facilities,
  className = "",
}: FacilitiesProps) {
  // Split facilities into two columns
  const midpoint = Math.ceil(facilities.length / 2);
  const leftColumn = facilities.slice(0, midpoint);
  const rightColumn = facilities.slice(midpoint);

  return (
    <section className={`section-dark bg-dark text-light ${className}`}>
      <div className="container">
        <div className="row g-4 justify-content-between">
          <div className="col-lg-4 relative z-3">
            <div className="me-lg-3">
              <div className="subtitle wow fadeInUp" data-wow-delay=".0s">
                {subtitle}
              </div>
              <h2 className="wow fadeInUp" data-wow-delay=".2s">
                {title}
              </h2>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="spacer-single spacer-double"></div>
            <div className="row">
              <div className="col-md-5 wow fadeInUp" data-wow-delay=".2s">
                <ul className="ul-check fs-500 text-light">
                  {leftColumn.map((facility, index) => (
                    <li key={index}>{facility}</li>
                  ))}
                </ul>
              </div>

              <div className="col-md-5 wow fadeInUp" data-wow-delay=".4s">
                <ul className="ul-check fs-500 text-light">
                  {rightColumn.map((facility, index) => (
                    <li key={index}>{facility}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
