"use client";

import { useCounter } from "@/hooks";

interface Stat {
  value: number;
  label: string;
  suffix?: string;
}

interface StatsProps {
  stats: Stat[];
  className?: string;
}

function StatCounter({ value, label, suffix = "" }: Stat) {
  const { ref, displayValue } = useCounter({
    to: value,
    duration: 3000,
    suffix,
  });

  return (
    <div className="de_count relative fs-15 wow fadeInRight">
      <h3 className="fs-60 mb-0">
        <span ref={ref} className="timer">
          {displayValue}
        </span>
      </h3>
      <div>{label}</div>
    </div>
  );
}

export default function Stats({ stats, className = "" }: StatsProps) {
  return (
    <section className={`text-center pt60 pb50 ${className}`}>
      <div className="container">
        <div className="row g-4">
          {stats.map((stat, index) => (
            <div key={index} className="col-lg-3 col-sm-6 mb-sm-30">
              <StatCounter {...stat} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
