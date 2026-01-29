'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';
import { timing, easing, shadows } from '@/lib/animation-config';

interface AnimatedCardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  hoverEffect?: 'lift' | 'glow' | 'none';
  className?: string;
}

export default function AnimatedCard({
  children,
  hoverEffect = 'lift',
  className = '',
  ...props
}: AnimatedCardProps) {
  const hoverAnimations = {
    lift: {
      y: -4,
      boxShadow: shadows.lg,
    },
    glow: {
      boxShadow: '0 0 20px rgba(22, 45, 80, 0.2)',
    },
    none: {},
  };

  return (
    <motion.div
      className={`rounded-xl overflow-hidden ${className}`}
      whileHover={hoverAnimations[hoverEffect]}
      transition={{
        duration: timing.fast,
        ease: easing.smooth,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
