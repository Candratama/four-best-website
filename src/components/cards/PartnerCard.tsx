import Link from "next/link";

export interface PartnerCardProps {
  name: string;
  slug: string;
  image: string;
  productCount: number;
  href?: string;
}

// Generate acronym from partner name (skip common prefixes like PT, CV)
function getAcronym(name: string): string {
  const skipWords = ["pt", "cv", "tbk", "ltd", "inc", "co"];
  const words = name
    .split(/\s+/)
    .filter((word) => !skipWords.includes(word.toLowerCase()));
  return words
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
    .slice(0, 3); // Max 3 characters
}

export default function PartnerCard({
  name,
  slug,
  image,
  productCount,
  href,
}: PartnerCardProps) {
  const linkHref = href || `/partners/${slug}`;
  const hasValidImage = image && !image.includes("placeholder");
  const acronym = getAcronym(name);

  return (
    <Link href={linkHref} className="partner-card-link">
      <div
        className="hover overflow-hidden relative text-light text-center wow zoomIn rounded-2xl transition-all duration-300"
        data-wow-delay=".0s"
      >
        <div className="wow scaleIn overflow-hidden">
          {hasValidImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} className="hover-scale-1-1 w-100" alt={name} />
          ) : (
            <div
              className="hover-scale-1-1 w-100 d-flex align-items-center justify-content-center"
              style={{
                height: "280px",
                background: "linear-gradient(135deg, #162d50 0%, #1e3a5f 100%)",
              }}
            >
              <span
                style={{
                  fontSize: "4rem",
                  fontWeight: "700",
                  color: "rgba(255, 255, 255, 0.3)",
                  letterSpacing: "0.1em",
                }}
              >
                {acronym}
              </span>
            </div>
          )}
        </div>
        <div className="abs w-100 h-100 px-4 hover-op-1 z-4 top-0 left-0 d-flex justify-content-center align-items-center partner-card-cta">
          <span
            className="btn-main btn-line btn-line-light fx-slide"
            data-hover="Lihat Detail"
          >
            <span>Lihat Detail</span>
          </span>
        </div>
        <div className="abs bg-blur z-2 top-0 w-100 h-100 hover-op-1"></div>
        {/* Dark background for text readability - using dark navy color */}
        <div
          className="abs z-3 bottom-0 w-100 h-60"
          style={{
            background:
              "linear-gradient(to top, #162d50 0%, rgba(22, 45, 80, 0.95) 40%, transparent 100%)",
          }}
        ></div>
        <div className="abs z-4 bottom-0 p-30 w-100 text-center hover-op-0">
          <div className="partner-card-info">
            <h3 className="partner-card-name">{name}</h3>
            <div className="partner-card-size">
              {productCount > 0 ? `${productCount} Proyek` : "Belum ada proyek"}
            </div>
          </div>
        </div>
        <div className="gradient-edge-bottom abs w-100 h-40 bottom-0 z-1"></div>
      </div>
    </Link>
  );
}
