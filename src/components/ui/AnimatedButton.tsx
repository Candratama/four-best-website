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
