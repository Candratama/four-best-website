'use client';

/**
 * useCounter Hook - Animated counter for statistics
 * Provides the timer/counter animation effect from the template
 * 
 * Requirements: 8.5, 2.7
 */

import { useState, useEffect, useRef, RefObject } from 'react';
import { useInView } from 'framer-motion';

interface UseCounterOptions {
  /** Target number to count to */
  to: number;
  /** Starting number (default: 0) */
  from?: number;
  /** Animation duration in milliseconds (default: 3000) */
  duration?: number;
  /** Easing function type */
  easing?: 'linear' | 'easeOut' | 'easeInOut';
  /** Decimal places to show (default: 0) */
  decimals?: number;
  /** Prefix to add before the number */
  prefix?: string;
  /** Suffix to add after the number */
  suffix?: string;
  /** Separator for thousands (default: ',') */
  separator?: string;
  /** Whether to only animate once when in view */
  once?: boolean;
}

interface UseCounterReturn {
  /** Ref to attach to the counter element */
  ref: RefObject<HTMLSpanElement | null>;
  /** Current animated value */
  value: number;
  /** Formatted display value with prefix/suffix */
  displayValue: string;
  /** Whether the counter is currently animating */
  isAnimating: boolean;
  /** Whether the element is in view */
  isInView: boolean;
  /** Reset the counter to start value */
  reset: () => void;
}

/**
 * Easing functions for smooth animations
 */
const easingFunctions = {
  linear: (t: number) => t,
  easeOut: (t: number) => 1 - Math.pow(1 - t, 3),
  easeInOut: (t: number) => t < 0.5 
    ? 4 * t * t * t 
    : 1 - Math.pow(-2 * t + 2, 3) / 2,
};

/**
 * Format number with separators and decimals
 */
function formatNumber(
  value: number, 
  decimals: number, 
  separator: string
): string {
  const fixed = value.toFixed(decimals);
  const parts = fixed.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  return parts.join('.');
}

/**
 * Hook for creating animated counters that trigger on scroll
 * Matches the template's timer/countTo functionality
 * 
 * @example
 * ```tsx
 * const { ref, displayValue } = useCounter({ 
 *   to: 25000, 
 *   duration: 3000,
 *   suffix: '+' 
 * });
 * 
 * return <span ref={ref}>{displayValue}</span>;
 * ```
 */
export function useCounter(options: UseCounterOptions): UseCounterReturn {
  const {
    to,
    from = 0,
    duration = 3000,
    easing = 'easeOut',
    decimals = 0,
    prefix = '',
    suffix = '',
    separator = ',',
    once = true,
  } = options;

  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(from);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const animationRef = useRef<number | null>(null);
  
  const isInView = useInView(ref, { 
    once: false, // We handle "once" logic ourselves
    amount: 0.5,
    margin: '0px 0px -50px 0px',
  });

  // Reset function
  const reset = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setValue(from);
    setIsAnimating(false);
    setHasAnimated(false);
  };

  useEffect(() => {
    // Don't animate if already animated and once is true
    if (once && hasAnimated) return;
    
    // Don't animate if not in view
    if (!isInView) {
      // Reset value when out of view (if not once mode)
      if (!once && !isAnimating) {
        setValue(from);
      }
      return;
    }

    // Start animation
    setIsAnimating(true);
    const startTime = performance.now();
    const easingFn = easingFunctions[easing];
    const range = to - from;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easingFn(progress);
      const currentValue = from + range * easedProgress;

      setValue(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setValue(to);
        setIsAnimating(false);
        setHasAnimated(true);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView, to, from, duration, easing, once, hasAnimated]);

  // Format the display value
  const displayValue = `${prefix}${formatNumber(value, decimals, separator)}${suffix}`;

  return {
    ref,
    value,
    displayValue,
    isAnimating,
    isInView,
    reset,
  };
}

export default useCounter;
