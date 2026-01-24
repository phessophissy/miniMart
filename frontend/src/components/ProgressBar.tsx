'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  max: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'gold' | 'green' | 'blue' | 'red';
  animated?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

const colorStyles = {
  gold: 'bg-gradient-to-r from-gold-dark via-gold to-gold-light',
  green: 'bg-gradient-to-r from-green-600 to-green-400',
  blue: 'bg-gradient-to-r from-blue-600 to-blue-400',
  red: 'bg-gradient-to-r from-red-600 to-red-400',
};

export default function ProgressBar({
  value,
  max,
  showLabel = false,
  size = 'md',
  color = 'gold',
  animated = true,
  className = '',
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-400">Progress</span>
          <span className="text-gold font-medium">{percentage.toFixed(1)}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-800 rounded-full overflow-hidden ${sizeStyles[size]}`}>
        {animated ? (
          <motion.div
            className={`h-full rounded-full ${colorStyles[color]}`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        ) : (
          <div
            className={`h-full rounded-full ${colorStyles[color]}`}
            style={{ width: `${percentage}%` }}
          />
        )}
      </div>
      {showLabel && (
        <div className="flex justify-between text-xs mt-1 text-gray-500">
          <span>{value.toLocaleString()} minted</span>
          <span>{max.toLocaleString()} max</span>
        </div>
      )}
    </div>
  );
}
