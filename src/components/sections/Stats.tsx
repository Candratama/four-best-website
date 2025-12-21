'use client';

import { AnimatedSection } from '@/components/ui';
import { useEffect, useState, useRef } from 'react';

interface Stat {
  value: number;
  label: string;
  suffix?: string;
}

interface StatsProps {
  stats: Stat[];
  className?: string;
}

function Counter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = value / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function Stats({ stats, className = '' }: StatsProps) {
  return (
    <section className={`py-16 bg-[var(--bg-light)] ${className}`}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <AnimatedSection
              key={index}
              animation="fadeInUp"
              delay={0.1 * index}
              className="text-center"
            >
              <div className="text-4xl lg:text-5xl font-light text-[var(--primary-color)] mb-2">
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-gray-600 uppercase tracking-wider text-sm">
                {stat.label}
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
