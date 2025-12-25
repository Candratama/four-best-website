/**
 * Animation utilities for scroll-triggered animations
 * Replaces WOW.js with React-friendly framer-motion approach
 */

import { Variants } from 'framer-motion';

/**
 * Animation variants matching the original template's WOW.js animations
 * These can be used with framer-motion's motion components
 */

// fadeInUp animation - element fades in while moving up
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

// fadeInDown animation - element fades in while moving down
export const fadeInDown: Variants = {
  hidden: {
    opacity: 0,
    y: -40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

// fadeInLeft animation - element fades in while moving from left
export const fadeInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -40,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

// fadeInRight animation - element fades in while moving from right
export const fadeInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 40,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

// scaleIn animation - element scales up from smaller size
export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

// zoomIn animation - element zooms in from very small
export const zoomIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.5,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

// fadeIn animation - simple fade in
export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

/**
 * Helper function to create staggered children animations
 * @param staggerDelay - delay between each child animation
 */
export const staggerContainer = (staggerDelay: number = 0.1): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: staggerDelay,
    },
  },
});

/**
 * Helper function to add custom delay to any variant
 * @param variant - the base animation variant
 * @param delay - delay in seconds
 */
export const withDelay = (variant: Variants, delay: number): Variants => ({
  ...variant,
  visible: {
    ...(variant.visible as object),
    transition: {
      ...((variant.visible as { transition?: object })?.transition || {}),
      delay,
    },
  },
});

/**
 * Default viewport settings for scroll-triggered animations
 * Matches WOW.js default behavior
 */
export const defaultViewport = {
  once: true,
  amount: 0.2,
  margin: '0px 0px -100px 0px',
};

/**
 * Animation type mapping for easy reference
 */
export type AnimationType = 
  | 'fadeInUp' 
  | 'fadeInDown' 
  | 'fadeInLeft' 
  | 'fadeInRight' 
  | 'scaleIn' 
  | 'zoomIn' 
  | 'fadeIn';

/**
 * Get animation variant by name
 * @param type - animation type name
 */
export const getAnimation = (type: AnimationType): Variants => {
  const animations: Record<AnimationType, Variants> = {
    fadeInUp,
    fadeInDown,
    fadeInLeft,
    fadeInRight,
    scaleIn,
    zoomIn,
    fadeIn,
  };
  return animations[type];
};
