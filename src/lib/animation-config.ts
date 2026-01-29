/**
 * Animation configuration for consistent micro animations
 * Personality: Subtle & Professional
 */

// Timing constants (in seconds for framer-motion)
export const timing = {
  instant: 0.15,   // micro feedback (click, toggle)
  fast: 0.25,      // hover states
  normal: 0.35,    // reveals, transitions
  slow: 0.5,       // page transitions
} as const;

// Easing presets (cubic-bezier arrays)
export const easing = {
  smooth: [0.4, 0, 0.2, 1],      // standard - most animations
  decelerate: [0, 0, 0.2, 1],    // entering elements
  accelerate: [0.4, 0, 1, 1],    // exiting elements
} as const;

// Hover animation presets
export const hoverScale = {
  button: 1.02,
  card: 1.01,
  icon: 1.1,
} as const;

// Tap/press animation presets
export const tapScale = {
  button: 0.98,
  card: 0.99,
} as const;

// Shadow presets for hover states
export const shadows = {
  none: '0 0 0 rgba(0,0,0,0)',
  sm: '0 2px 8px rgba(0,0,0,0.08)',
  md: '0 4px 12px rgba(0,0,0,0.12)',
  lg: '0 8px 24px rgba(0,0,0,0.15)',
} as const;

// Reduced motion media query helper
export const prefersReducedMotion =
  typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;
