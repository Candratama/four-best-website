import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  name: string;
  slug: string;
  partnerSlug: string;
  image?: string;
  category?: "komersil" | "subsidi";
  location?: string;
  price?: string;
  specs?: {
    bedrooms?: number;
    bathrooms?: number;
    size?: string;
  };
}

export default function ProductCard({
  name,
  slug,
  partnerSlug,
  image,
  category,
  location,
  price,
  specs,
}: ProductCardProps) {
  return (
    <Link
      href={`/partners/${partnerSlug}/products/${slug}`}
      className="block group"
    >
      <div className="hover overflow-hidden relative text-white">
        {/* Card Image */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover hover-scale-1-1 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}

          {/* Category Badge */}
          {category && (
            <div
              className={`absolute top-4 left-4 px-3 py-1 text-xs font-semibold uppercase rounded ${
                category === "subsidi"
                  ? "bg-secondary text-white"
                  : "bg-primary text-white"
              }`}
            >
              {category}
            </div>
          )}

          {/* Overlay on hover */}
          <div className="abs bg-blur z-2 top-0 w-100 h-100 hover-op-1" />
          <div className="abs w-100 px-4 hover-op-1 z-4 hover-mt-40 abs-centered text-center">
            <span
              className="btn-line fx-slide px-6 py-2 text-sm border border-white/30 inline-block"
              data-hover="View Details"
            >
              <span>View Details</span>
            </span>
          </div>
        </div>

        {/* Card Info */}
        <div className="p-4 bg-white text-gray-900">
          <h3 className="text-lg font-medium mb-1 group-hover:text-primary transition-colors">
            {name}
          </h3>
          {location && <p className="text-sm text-gray-500 mb-2">{location}</p>}

          {/* Specs */}
          {specs && (
            <div className="flex gap-4 text-sm text-gray-600 mb-2">
              {specs.bedrooms && <span>{specs.bedrooms} BR</span>}
              {specs.bathrooms && <span>{specs.bathrooms} BA</span>}
              {specs.size && <span>{specs.size}</span>}
            </div>
          )}

          {/* Price */}
          {price && (
            <div className="text-lg font-semibold text-primary">
              {price}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
