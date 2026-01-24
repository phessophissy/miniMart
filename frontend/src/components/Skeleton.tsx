'use client';

import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export default function Skeleton({
  className = '',
  variant = 'text',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) {
  const variantStyles = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: '',
    rounded: 'rounded-xl',
  };

  const style: React.CSSProperties = {
    width: width ?? (variant === 'circular' ? 40 : '100%'),
    height: height ?? (variant === 'circular' ? 40 : variant === 'text' ? 16 : 100),
  };

  if (animation === 'wave') {
    return (
      <div
        className={`relative overflow-hidden bg-gray-800 ${variantStyles[variant]} ${className}`}
        style={style}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  if (animation === 'pulse') {
    return (
      <motion.div
        className={`bg-gray-800 ${variantStyles[variant]} ${className}`}
        style={style}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      />
    );
  }

  return (
    <div
      className={`bg-gray-800 ${variantStyles[variant]} ${className}`}
      style={style}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <Skeleton variant="rounded" height={200} className="mb-4" />
      <Skeleton variant="text" width="60%" className="mb-2" />
      <Skeleton variant="text" width="80%" className="mb-4" />
      <div className="flex gap-2">
        <Skeleton variant="rounded" width={80} height={32} />
        <Skeleton variant="rounded" width={80} height={32} />
      </div>
    </div>
  );
}

export function CollectibleCardSkeleton() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <div className="flex justify-between items-start mb-4">
        <Skeleton variant="rounded" width={60} height={24} />
        <Skeleton variant="circular" width={40} height={40} />
      </div>
      <Skeleton variant="text" width="70%" height={28} className="mb-2" />
      <Skeleton variant="text" width="50%" className="mb-4" />
      <Skeleton variant="rounded" height={8} className="mb-4" />
      <div className="flex justify-between">
        <Skeleton variant="text" width="30%" />
        <Skeleton variant="text" width="20%" />
      </div>
      <Skeleton variant="rounded" height={48} className="mt-4" />
    </div>
  );
}
