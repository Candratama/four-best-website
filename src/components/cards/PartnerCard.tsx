import Image from 'next/image';
import Link from 'next/link';

interface PartnerCardProps {
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  location?: string;
  productCount?: number;
}

export default function PartnerCard({
  name,
  slug,
  logo,
  description,
  location,
  productCount,
}: PartnerCardProps) {
  return (
    <Link href={`/partners/${slug}`} className="block group">
      <div className="hover overflow-hidden relative text-white">
        {/* Card Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {logo ? (
            <Image
              src={logo}
              alt={name}
              fill
              className="object-cover hover-scale-1-1 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-[var(--bg-dark-2)] flex items-center justify-center">
              <span className="text-4xl font-bold text-white/20">
                {name.charAt(0)}
              </span>
            </div>
          )}
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors" />

          {/* Content on hover */}
          <div className="abs w-full px-4 hover-op-1 z-4 abs-centered text-center">
            <span className="btn-line fx-slide px-6 py-2 text-sm border border-white/30 inline-block">
              <span>View Details</span>
            </span>
          </div>
        </div>

        {/* Card Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
          <div className="gradient-edge-bottom absolute inset-0 -z-10" />
          <h3 className="text-xl font-medium mb-1">{name}</h3>
          <div className="flex items-center justify-between text-sm text-white/70">
            {location && <span>{location}</span>}
            {productCount !== undefined && (
              <span>{productCount} Products</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
