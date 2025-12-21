import { ImageSlider } from '@/components/ui';
import { Button } from '@/components/ui';

interface HeroProps {
  title: string;
  subtitle?: string;
  address?: string;
  slides?: { image: string; alt?: string }[];
  ctaText?: string;
  ctaHref?: string;
  height?: string;
}

export default function Hero({
  title,
  subtitle,
  address,
  slides,
  ctaText = 'Schedule Visit',
  ctaHref = '/contact',
  height = 'h-screen',
}: HeroProps) {
  const defaultSlides = [
    { image: '/images/hero-1.jpg', alt: 'Hero 1' },
    { image: '/images/hero-2.jpg', alt: 'Hero 2' },
  ];

  return (
    <section className={`relative ${height} text-white`}>
      {/* Background Slider */}
      <ImageSlider
        slides={slides || defaultSlides}
        height="h-full"
        className="absolute inset-0"
      />

      {/* Content Overlay */}
      <div className="absolute inset-0 z-10 flex items-end pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl">
            {subtitle && (
              <p className="subtitle text-white/70 mb-2">{subtitle}</p>
            )}
            <h1 className="text-5xl lg:text-7xl font-light uppercase leading-tight mb-4">
              {title}
            </h1>
            {address && (
              <div className="flex items-center gap-4 mb-6">
                <p className="text-lg">{address}</p>
                <a
                  href="#"
                  className="btn-line fx-slide px-4 py-1 text-sm border border-white/30"
                >
                  <span>View on Map</span>
                </a>
              </div>
            )}
            {ctaText && (
              <Button href={ctaHref} variant="primary">
                {ctaText}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
