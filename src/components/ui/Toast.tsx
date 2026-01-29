'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
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
            px-4 py-3 rounded-2xl border
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
