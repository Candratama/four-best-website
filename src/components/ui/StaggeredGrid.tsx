"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StaggeredGridProps {
  children: ReactNode[];
  className?: string;
  itemClassName?: string;
  staggerDelay?: number;
  duration?: number;
}

/**
 * StaggeredGrid - Reusable component for staggered reveal animations on grid items
 * Each child appears with a delay after the previous one
 */
export default function StaggeredGrid({
  children,
  className = "row g-4",
  itemClassName = "",
  staggerDelay = 0.3,
  duration = 0.6,
}: StaggeredGridProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      {children.map((child, index) => (
        <motion.div
          key={index}
          className={itemClassName}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration,
            delay: index * staggerDelay,
            ease: "easeOut",
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
