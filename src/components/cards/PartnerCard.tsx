import Link from "next/link";

export interface PartnerCardProps {
  name: string;
  slug: string;
  image: string;
  size: string;
  href?: string;
}

export default function PartnerCard({
  name,
  slug,
  image,
  size,
  href,
}: PartnerCardProps) {
  const linkHref = href || `/partners/${slug}`;

  return (
    <div
      className="hover overflow-hidden relative text-light text-center wow zoomIn"
      data-wow-delay=".0s"
    >
      <div className="wow scaleIn overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} className="hover-scale-1-1 w-100" alt={name} />
      </div>
      <div className="abs w-100 px-4 hover-op-1 z-4 hover-mt-40 abs-centered">
        <Link
          href={linkHref}
          className="btn-main btn-line fx-slide"
          data-hover="View Details"
        >
          <span>View Details</span>
        </Link>
      </div>
      <div className="abs bg-blur z-2 top-0 w-100 h-100 hover-op-1"></div>
      {/* Dark background for text readability - using bg-dark-2 color */}
      <div
        className="abs z-3 bottom-0 w-100 h-50"
        style={{
          background:
            "linear-gradient(to top, var(--bg-dark-2) 0%, rgba(30, 70, 69, 0.6) 50%, transparent 100%)",
        }}
      ></div>
      <div className="abs z-4 bottom-0 p-30 w-100 text-center hover-op-0">
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="mb-0">{name}</h3>
          <div>{size}</div>
        </div>
      </div>
      <div className="gradient-edge-bottom abs w-100 h-40 bottom-0 z-1"></div>
    </div>
  );
}
