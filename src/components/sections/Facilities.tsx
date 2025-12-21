import { AnimatedSection } from '@/components/ui';

interface FacilitiesProps {
  subtitle?: string;
  title: string;
  facilities: string[];
  className?: string;
}

export default function Facilities({
  subtitle = 'Facilities',
  title,
  facilities,
  className = '',
}: FacilitiesProps) {
  // Split facilities into two columns
  const midpoint = Math.ceil(facilities.length / 2);
  const leftColumn = facilities.slice(0, midpoint);
  const rightColumn = facilities.slice(midpoint);

  return (
    <section className={`section-dark py-20 lg:py-32 ${className}`}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Title */}
          <div>
            <AnimatedSection animation="fadeInUp" delay={0}>
              <p className="subtitle">{subtitle}</p>
            </AnimatedSection>
            <AnimatedSection animation="fadeInUp" delay={0.2}>
              <h2 className="text-3xl lg:text-4xl font-light text-white">
                {title}
              </h2>
            </AnimatedSection>
          </div>

          {/* Facilities List */}
          <div className="lg:mt-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
              <AnimatedSection animation="fadeInUp" delay={0.2}>
                <ul className="ul-check text-light">
                  {leftColumn.map((facility, index) => (
                    <li key={index}>{facility}</li>
                  ))}
                </ul>
              </AnimatedSection>
              <AnimatedSection animation="fadeInUp" delay={0.4}>
                <ul className="ul-check text-light">
                  {rightColumn.map((facility, index) => (
                    <li key={index}>{facility}</li>
                  ))}
                </ul>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
