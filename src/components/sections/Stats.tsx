"use client";

import { motion } from "framer-motion";
import { useCounter } from "@/hooks";
import { fadeInRight } from "@/lib/animations";

interface Stat {
  value: number;
  label: string;
  suffix?: string;
}

interface StatsProps {
  stats: Stat[];
  className?: string;
}

function StatCounter({ value, label, suffix = "", index }: Stat & { index: number }) {
  const { ref, displayValue } = useCounter({
    to: value,
    duration: 3000,
    suffix,
  });

  return (
    <motion.div
      className="de_count relative fs-15"
      variants={fadeInRight}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ delay: index * 0.15 }}
    >
      <h3 className="fs-60 mb-0">
        <span ref={ref} className="timer">
          {displayValue}
        </span>
      </h3>
      <div>{label}</div>
    </motion.div>
  );
}

export default function Stats({ stats, className = "" }: StatsProps) {
  return (
    <section className={`text-center pt60 pb50 ${className}`}>
      <div className="container">
        <div className="row g-4">
          {stats.map((stat, index) => (
            <div key={index} className="col-lg-3 col-sm-6 mb-sm-30">
              <StatCounter {...stat} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
