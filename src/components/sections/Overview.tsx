import { AnimatedSection, Button } from '@/components/ui';
import Image from 'next/image';

interface OverviewProps {
  subtitle?: string;
  title: string;
  description: string;
  ctaText?: string;
  ctaHref?: string;
  images?: string[];
}

export default function Overview({
  subtitle = 'Home Overview',
  title,
  description,
  ctaText = 'Schedule Visit',
  ctaHref = '/contact',
  images = [],
}: OverviewProps) {
  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="lg:pr-8">
            <AnimatedSection animation="fadeInUp" delay={0.2}>
              <p className="subtitle">{subtitle}</p>
            </AnimatedSection>
            <AnimatedSection animation="fadeInUp" delay={0.4}>
              <h2 className="text-3xl lg:text-4xl font-light leading-tight mb-6">
                {title}
              </h2>
            </AnimatedSection>
            <AnimatedSection animation="fadeInUp" delay={0.6}>
              <p className="text-gray-600 mb-8 leading-relaxed">{description}</p>
              <Button href={ctaHref}>{ctaText}</Button>
            </AnimatedSection>
          </div>

          {/* Images Grid */}
          <div className="grid grid-cols-2 gap-4">
            {images.length > 0 ? (
              images.slice(0, 4).map((img, index) => (
                <AnimatedSection
                  key={index}
                  animation="scaleIn"
                  delay={0.2 * index}
                  className={index % 2 === 1 ? 'mt-8' : ''}
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded">
                    <Image
                      src={img}
                      alt={`Overview ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </AnimatedSection>
              ))
            ) : (
              // Placeholder grid
              <>
                <div className="aspect-[4/5] bg-gray-200 rounded" />
                <div className="aspect-[4/5] bg-gray-200 rounded mt-8" />
                <div className="aspect-[4/5] bg-gray-200 rounded" />
                <div className="aspect-[4/5] bg-gray-200 rounded mt-8" />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
