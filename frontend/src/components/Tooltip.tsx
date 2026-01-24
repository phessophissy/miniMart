'use client';

import { motion } from 'framer-motion';

interface TooltipProps {
  children: React.ReactNode;
  content: string | React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export default function Tooltip({
  children,
  content,
  position = 'top',
  delay = 0.3,
}: TooltipProps) {
  const positionStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowStyles = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-gray-800',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-800',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-gray-800',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-gray-800',
  };

  const initialPosition = {
    top: { opacity: 0, y: 5 },
    bottom: { opacity: 0, y: -5 },
    left: { opacity: 0, x: 5 },
    right: { opacity: 0, x: -5 },
  };

  return (
    <motion.div className="relative inline-block group">
      {children}
      <motion.div
        initial={initialPosition[position]}
        whileHover={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.2, delay }}
        className={`
          absolute ${positionStyles[position]}
          px-3 py-2
          bg-gray-800 border border-gray-700
          rounded-lg
          text-sm text-gray-200
          whitespace-nowrap
          pointer-events-none
          opacity-0 group-hover:opacity-100
          z-50
        `}
      >
        {content}
        <div
          className={`
            absolute ${arrowStyles[position]}
            border-4 border-transparent
          `}
        />
      </motion.div>
    </motion.div>
  );
}
