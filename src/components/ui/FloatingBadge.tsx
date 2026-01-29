'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FloatingBadgeProps {
  children: ReactNode;
  variant?: 'new' | 'promo' | 'sale' | 'default';
  className?: string;
  animate?: boolean;
}

const variants = {
  new: 'bg-green-500 text-white',
  promo: 'bg-orange-500 text-white',
  sale: 'bg-red-500 text-white',
  default: 'bg-[#162d50] text-white',
};

export default function FloatingBadge({
  children,
  variant = 'default',
  className = '',
  animate = true,
}: FloatingBadgeProps) {
  return (
    <motion.span
      className={`
        inline-block px-3 py-1
        text-xs font-semibold uppercase tracking-wide
        rounded-full
        ${variants[variant]}
        ${className}
      `}
      animate={animate ? {
        y: [-2, 2, -2],
      } : {}}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.span>
  );
}
