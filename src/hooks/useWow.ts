'use client';

/**
 * useWow Hook - React hook for scroll-triggered animations
 * Provides WOW.js-like functionality using framer-motion
 * 
 * Requirements: 8.1, 2.8
 */

import { useInView, Variants } from 'framer-motion';
import { useRef, RefObject } from 'react';
import { 
  AnimationType, 
  getAnimation, 
  defaultViewport,
} from '@/lib/animations';

interface UseWowOptions {
  /** Animation type to use */
  animation?: AnimationType;
  /** Delay before animation starts (in seconds) */
  delay?: number;
  /** Duration of the animation (in seconds) */
  duration?: number;
  /** Whether animation should only trigger once */
  once?: boolean;
  /** Amount of element that needs to be visible (0-1) */
  amount?: number;
  /** Custom animation variants */
  customVariants?: Variants;
}

interface UseWowReturn {
  /** Ref to attach to the animated element */
  ref: RefObject<HTMLDivElement | null>;
  /** Whether the element is in view */
  isInView: boolean;
  /** Animation variants to use with motion components */
  variants: Variants;
  /** Initial animation state */
  initial: string;
  /** Animate state (changes based on isInView) */
  animate: string;
  /** Transition configuration */
  transition: {
    delay: number;
    duration: number;
  };
}

/**
 * Hook for creating scroll-triggered animations similar to WOW.js
 * 
 * @example
 * ```tsx
 * const { ref, variants, initial, animate } = useWow({ 
 *   animation: 'fadeInUp', 
 *   delay: 0.2 
 * });
 * 
 * return (
 *   <motion.div
 *     ref={ref}
 *     variants={variants}
 *     initial={initial}
 *     animate={animate}
 *   >
 *     Content
 *   </motion.div>
 * );
 * ```
 */
export function useWow(options: UseWowOptions = {}): UseWowReturn {
  const {
    animation = 'fadeInUp',
    delay = 0,
    duration = 0.6,
    once = true,
    amount = defaultViewport.amount,
    customVariants,
  } = options;

  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { 
    once, 
    amount,
    margin: defaultViewport.margin as `${number}px ${number}px ${number}px ${number}px`,
  });

  // Get base variants or use custom ones
  const baseVariants = customVariants || getAnimation(animation);
  
  // Apply custom duration to variants
  const variants: Variants = {
    ...baseVariants,
    visible: {
      ...(baseVariants.visible as object),
      transition: {
        ...((baseVariants.visible as { transition?: object })?.transition || {}),
        duration,
        delay,
      },
    },
  };

  return {
    ref,
    isInView,
    variants,
    initial: 'hidden',
    animate: isInView ? 'visible' : 'hidden',
    transition: {
      delay,
      duration,
    },
  };
}

export default useWow;
