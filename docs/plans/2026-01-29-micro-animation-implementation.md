# Micro Animation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement comprehensive micro animations across the Four Best website using Framer Motion, replacing WOW.js.

**Architecture:** Centralized animation config with reusable animated components. All animations follow "Subtle & Professional" personality (150-500ms, smooth easing).

**Tech Stack:** Framer Motion (already installed), React hooks, TypeScript

---

## Task 1: Create Animation Config

**Files:**
- Create: `src/lib/animation-config.ts`

**Step 1: Create the animation config file**

```typescript
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
```

**Step 2: Verify file created**

Run: `cat src/lib/animation-config.ts | head -20`
Expected: File content displayed

**Step 3: Commit**

```bash
git add src/lib/animation-config.ts
git commit -m "feat(animation): add animation config with timing and easing presets"
```

---

## Task 2: Extend animations.ts with New Variants

**Files:**
- Modify: `src/lib/animations.ts`

**Step 1: Add shake animation for error feedback**

Add after `fadeIn` variant (around line 121):

```typescript
// shake animation - for error feedback
export const shake: Variants = {
  hidden: { x: 0 },
  visible: {
    x: [0, -4, 4, -4, 4, 0],
    transition: {
      duration: 0.4,
      ease: 'easeInOut',
    },
  },
};
```

**Step 2: Add pulse animation for attention**

```typescript
// pulse animation - for attention grabbing
export const pulse: Variants = {
  hidden: { scale: 1 },
  visible: {
    scale: [1, 1.02, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      repeatDelay: 3,
      ease: 'easeInOut',
    },
  },
};
```

**Step 3: Add float animation**

```typescript
// float animation - subtle floating effect
export const float: Variants = {
  hidden: { y: 0 },
  visible: {
    y: [-3, 3, -3],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};
```

**Step 4: Update AnimationType to include new types**

Update the type definition:

```typescript
export type AnimationType =
  | 'fadeInUp'
  | 'fadeInDown'
  | 'fadeInLeft'
  | 'fadeInRight'
  | 'scaleIn'
  | 'zoomIn'
  | 'fadeIn'
  | 'shake'
  | 'pulse'
  | 'float';
```

**Step 5: Update getAnimation function**

```typescript
export const getAnimation = (type: AnimationType): Variants => {
  const animations: Record<AnimationType, Variants> = {
    fadeInUp,
    fadeInDown,
    fadeInLeft,
    fadeInRight,
    scaleIn,
    zoomIn,
    fadeIn,
    shake,
    pulse,
    float,
  };
  return animations[type];
};
```

**Step 6: Commit**

```bash
git add src/lib/animations.ts
git commit -m "feat(animation): add shake, pulse, and float animation variants"
```

---

## Task 3: Create AnimatedButton Component

**Files:**
- Create: `src/components/ui/AnimatedButton.tsx`

**Step 1: Create AnimatedButton component**

```typescript
'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import Link from 'next/link';
import { ReactNode, forwardRef } from 'react';
import { timing, easing, hoverScale, tapScale, shadows } from '@/lib/animation-config';

interface AnimatedButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode;
  href?: string;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  loading?: boolean;
  disabled?: boolean;
}

const variants = {
  primary: 'bg-[#162d50] text-white hover:bg-[#1e3a5f]',
  outline: 'border-2 border-[#162d50] text-[#162d50] hover:bg-[#162d50] hover:text-white',
  ghost: 'text-[#162d50] hover:bg-[#162d50]/10',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({
    children,
    href,
    variant = 'primary',
    size = 'md',
    pulse = false,
    loading = false,
    disabled = false,
    className = '',
    ...props
  }, ref) => {
    const baseClasses = `
      inline-flex items-center justify-center gap-2
      font-semibold rounded-lg
      transition-colors duration-300
      disabled:opacity-50 disabled:cursor-not-allowed
      ${variants[variant]}
      ${sizes[size]}
      ${className}
    `.trim().replace(/\s+/g, ' ');

    const motionProps = {
      whileHover: disabled ? {} : {
        scale: hoverScale.button,
        boxShadow: shadows.md,
      },
      whileTap: disabled ? {} : {
        scale: tapScale.button
      },
      transition: {
        duration: timing.fast,
        ease: easing.smooth,
      },
      ...(pulse && !disabled ? {
        animate: {
          boxShadow: [
            '0 0 0 0 rgba(22, 45, 80, 0.4)',
            '0 0 0 8px rgba(22, 45, 80, 0)',
          ],
        },
        transition: {
          duration: 1.5,
          repeat: Infinity,
          repeatDelay: 3,
        },
      } : {}),
    };

    if (href && !disabled) {
      return (
        <motion.div {...motionProps}>
          <Link href={href} className={baseClasses}>
            {loading ? <LoadingSpinner /> : children}
          </Link>
        </motion.div>
      );
    }

    return (
      <motion.button
        ref={ref}
        className={baseClasses}
        disabled={disabled || loading}
        {...motionProps}
        {...props}
      >
        {loading ? <LoadingSpinner /> : children}
      </motion.button>
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';

function LoadingSpinner() {
  return (
    <motion.span
      className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
    />
  );
}

export default AnimatedButton;
```

**Step 2: Verify file created**

Run: `cat src/components/ui/AnimatedButton.tsx | head -20`

**Step 3: Commit**

```bash
git add src/components/ui/AnimatedButton.tsx
git commit -m "feat(ui): add AnimatedButton component with hover/tap effects"
```

---

## Task 4: Create AnimatedCard Component

**Files:**
- Create: `src/components/ui/AnimatedCard.tsx`

**Step 1: Create AnimatedCard component**

```typescript
'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';
import { timing, easing, hoverScale, shadows } from '@/lib/animation-config';

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
```

**Step 2: Commit**

```bash
git add src/components/ui/AnimatedCard.tsx
git commit -m "feat(ui): add AnimatedCard component with lift/glow hover effects"
```

---

## Task 5: Create AnimatedCounter Component

**Files:**
- Create: `src/components/ui/AnimatedCounter.tsx`

**Step 1: Create AnimatedCounter component**

```typescript
'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { easing } from '@/lib/animation-config';

interface AnimatedCounterProps {
  from?: number;
  to: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export default function AnimatedCounter({
  from = 0,
  to,
  duration = 2,
  suffix = '',
  prefix = '',
  className = '',
}: AnimatedCounterProps) {
  const [count, setCount] = useState(from);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = performance.now();
    const difference = to - from;

    // Decelerate easing function
    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

    const animate = (currentTime: number) => {
      const elapsed = (currentTime - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);

      setCount(Math.round(from + difference * easedProgress));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, from, to, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{count}{suffix}
    </span>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/ui/AnimatedCounter.tsx
git commit -m "feat(ui): add AnimatedCounter component with scroll-triggered counting"
```

---

## Task 6: Create Toast Component

**Files:**
- Create: `src/components/ui/Toast.tsx`

**Step 1: Create Toast component**

```typescript
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { timing, easing } from '@/lib/animation-config';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
  isVisible: boolean;
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const colors = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

const iconColors = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500',
};

export default function Toast({
  message,
  type = 'info',
  duration = 5000,
  onClose,
  isVisible,
}: ToastProps) {
  const Icon = icons[type];

  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 100, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{
            duration: timing.normal,
            ease: easing.decelerate,
          }}
          className={`
            fixed bottom-4 right-4 z-50
            flex items-center gap-3
            px-4 py-3 rounded-lg border
            shadow-lg max-w-sm
            ${colors[type]}
          `}
        >
          <Icon className={`w-5 h-5 flex-shrink-0 ${iconColors[type]}`} />
          <p className="text-sm font-medium flex-1">{message}</p>
          <button
            onClick={onClose}
            className="p-1 hover:bg-black/5 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/ui/Toast.tsx
git commit -m "feat(ui): add Toast component with slide-in animation"
```

---

## Task 7: Create LoadingDots Component

**Files:**
- Create: `src/components/ui/LoadingDots.tsx`

**Step 1: Create LoadingDots component**

```typescript
'use client';

import { motion } from 'framer-motion';

interface LoadingDotsProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

const sizes = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
  lg: 'w-3 h-3',
};

export default function LoadingDots({
  size = 'md',
  color = 'bg-current',
  className = '',
}: LoadingDotsProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className={`${sizes[size]} ${color} rounded-full`}
          animate={{
            y: [0, -4, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/ui/LoadingDots.tsx
git commit -m "feat(ui): add LoadingDots component with stagger animation"
```

---

## Task 8: Create FloatingBadge Component

**Files:**
- Create: `src/components/ui/FloatingBadge.tsx`

**Step 1: Create FloatingBadge component**

```typescript
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
```

**Step 2: Commit**

```bash
git add src/components/ui/FloatingBadge.tsx
git commit -m "feat(ui): add FloatingBadge component with float animation"
```

---

## Task 9: Migrate not-found.tsx from WOW.js to Framer Motion

**Files:**
- Modify: `src/app/not-found.tsx`

**Step 1: Replace WOW.js with Framer Motion**

Rewrite the entire file:

```typescript
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { timing, easing } from '@/lib/animation-config';

export default function NotFound() {
  return (
    <section
      className="section-dark text-light no-top no-bottom relative overflow-hidden"
      style={{
        backgroundColor: '#162d50',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Background Pattern */}
      <div
        className="abs w-100 h-100 d-flex align-items-center justify-content-center"
        style={{ zIndex: 1 }}
      >
        <span
          style={{
            fontSize: '25rem',
            fontWeight: '700',
            color: 'rgba(255, 255, 255, 0.03)',
            letterSpacing: '0.2em',
            lineHeight: 1,
          }}
        >
          404
        </span>
      </div>

      <div className="container relative" style={{ zIndex: 2 }}>
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            <motion.div
              variants={staggerContainer(0.2)}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={fadeInUp}>
                <h1
                  className="mb-4"
                  style={{
                    fontSize: '8rem',
                    fontWeight: '700',
                    lineHeight: 1,
                    color: '#ffffff',
                  }}
                >
                  404
                </h1>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <h2 className="mb-4" style={{ color: '#ffffff' }}>
                  Halaman Tidak Ditemukan
                </h2>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <p
                  className="lead mb-5"
                  style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                >
                  Maaf, halaman yang Anda cari tidak dapat ditemukan. Halaman
                  mungkin telah dipindahkan atau tidak tersedia.
                </p>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                  <Link
                    href="/"
                    className="btn-main fx-slide"
                    data-hover="Kembali ke Beranda"
                  >
                    <span>Kembali ke Beranda</span>
                  </Link>
                  <Link
                    href="/partners"
                    className="btn-main btn-outline fx-slide"
                    data-hover="Lihat Partner"
                    style={{
                      backgroundColor: 'transparent',
                      border: '2px solid #ffffff',
                      color: '#ffffff',
                    }}
                  >
                    <span>Lihat Partner</span>
                  </Link>
                </div>
              </motion.div>

              <div className="spacer-double"></div>

              <motion.div variants={fadeInUp}>
                <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>
                  Butuh bantuan?{' '}
                  <Link href="/contact" className="id-color">
                    Hubungi kami
                  </Link>
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="sw-overlay op-5"></div>
    </section>
  );
}
```

**Step 2: Verify the changes**

Run: `npm run build`
Expected: Build succeeds without errors

**Step 3: Commit**

```bash
git add src/app/not-found.tsx
git commit -m "refactor: migrate not-found page from WOW.js to Framer Motion"
```

---

## Task 10: Migrate PartnerDetailsClient.tsx from WOW.js

**Files:**
- Modify: `src/app/partners/[slug]/PartnerDetailsClient.tsx`

**Step 1: Remove WOW.js import and useEffect**

Remove lines 33-40 (the useEffect with WOW.js initialization).

**Step 2: Add Framer Motion imports**

Add at top of file:

```typescript
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, zoomIn } from '@/lib/animations';
```

**Step 3: Wrap animated elements with motion components**

Replace `wow fadeInUp` classes with motion components. This is a larger refactor - wrap key sections with `<motion.div variants={fadeInUp}>`.

**Step 4: Verify the changes**

Run: `npm run build`
Expected: Build succeeds

**Step 5: Commit**

```bash
git add src/app/partners/[slug]/PartnerDetailsClient.tsx
git commit -m "refactor: migrate PartnerDetailsClient from WOW.js to Framer Motion"
```

---

## Task 11: Remove WOW.js Dependency

**Files:**
- Modify: `package.json`
- Delete: `src/types/wowjs.d.ts`

**Step 1: Remove wowjs from package.json**

Remove line with `"wowjs": "^1.1.3"` from dependencies.

**Step 2: Delete type definition file**

```bash
rm src/types/wowjs.d.ts
```

**Step 3: Uninstall package**

```bash
npm uninstall wowjs
```

**Step 4: Verify no WOW.js references remain**

```bash
grep -r "wowjs\|WOW" src/ --include="*.tsx" --include="*.ts"
```
Expected: No results

**Step 5: Commit**

```bash
git add -A
git commit -m "chore: remove WOW.js dependency, fully migrated to Framer Motion"
```

---

## Task 12: Export New Components from Index

**Files:**
- Modify or Create: `src/components/ui/index.ts`

**Step 1: Create/update index file**

```typescript
export { default as AnimatedButton } from './AnimatedButton';
export { default as AnimatedCard } from './AnimatedCard';
export { default as AnimatedCounter } from './AnimatedCounter';
export { default as AnimatedSection } from './AnimatedSection';
export { default as Button } from './Button';
export { default as FloatingBadge } from './FloatingBadge';
export { default as LoadingDots } from './LoadingDots';
export { default as Toast } from './Toast';
export * from './card';
```

**Step 2: Commit**

```bash
git add src/components/ui/index.ts
git commit -m "feat(ui): export all animated components from index"
```

---

## Summary

| Task | Description | Files |
|------|-------------|-------|
| 1 | Create animation config | `animation-config.ts` |
| 2 | Extend animations.ts | `animations.ts` |
| 3 | Create AnimatedButton | `AnimatedButton.tsx` |
| 4 | Create AnimatedCard | `AnimatedCard.tsx` |
| 5 | Create AnimatedCounter | `AnimatedCounter.tsx` |
| 6 | Create Toast | `Toast.tsx` |
| 7 | Create LoadingDots | `LoadingDots.tsx` |
| 8 | Create FloatingBadge | `FloatingBadge.tsx` |
| 9 | Migrate not-found.tsx | `not-found.tsx` |
| 10 | Migrate PartnerDetailsClient | `PartnerDetailsClient.tsx` |
| 11 | Remove WOW.js | `package.json`, `wowjs.d.ts` |
| 12 | Export components | `ui/index.ts` |

Total: 12 tasks, ~12 commits
