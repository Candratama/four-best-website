"use client";

interface MissionProps {
  subtitle?: string;
  title: string;
  backgroundImage: string;
}

export default function Mission({
  subtitle = "Our Mission",
  title,
  backgroundImage,
}: MissionProps) {
  return (
    <section className="bg-dark section-dark text-light relative no-top no-bottom overflow-hidden">
      <div className="container-fluid position-relative half-fluid">
        <div className="container">
          <div className="row gx-5">
            {/* Image */}
            <div className="col-lg-6 position-lg-absolute right-half h-100 overflow-hidden">
              <div
                className="image"
                data-bgimage={`url(${backgroundImage}) center`}
                style={{
                  backgroundImage: `url(${backgroundImage})`,
                  backgroundPosition: "center",
                }}
              ></div>
            </div>
            {/* Text */}
            <div className="col-lg-6 relative z-3">
              <div className="me-lg-5 pe-lg-5 py-5 my-5">
                <div className="subtitle">{subtitle}</div>
                <h3 className="fs-40 lh-1-3">{title}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
