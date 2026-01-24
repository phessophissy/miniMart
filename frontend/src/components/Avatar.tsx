'use client';

import { motion } from 'framer-motion';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
  status?: 'online' | 'offline' | 'away';
  border?: boolean;
  className?: string;
}

const sizeStyles = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-14 h-14 text-lg',
  xl: 'w-20 h-20 text-xl',
};

const statusColors = {
  online: 'bg-green-500',
  offline: 'bg-gray-500',
  away: 'bg-yellow-500',
};

const statusSizes = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
  xl: 'w-4 h-4',
};

export default function Avatar({
  src,
  alt = 'Avatar',
  size = 'md',
  fallback,
  status,
  border = false,
  className = '',
}: AvatarProps) {
  const initials = fallback?.slice(0, 2).toUpperCase() || '?';

  return (
    <div className={`relative inline-block ${className}`}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        className={`
          ${sizeStyles[size]}
          rounded-full overflow-hidden
          bg-gradient-to-br from-gold-dark to-gold
          flex items-center justify-center
          font-bold text-black
          ${border ? 'ring-2 ring-gold ring-offset-2 ring-offset-black' : ''}
        `}
      >
        {src ? (
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        ) : (
          <span>{initials}</span>
        )}
      </motion.div>
      
      {status && (
        <span
          className={`
            absolute bottom-0 right-0
            ${statusSizes[size]}
            ${statusColors[status]}
            rounded-full
            ring-2 ring-black
          `}
        />
      )}
    </div>
  );
}

interface AvatarGroupProps {
  avatars: { src?: string; fallback?: string }[];
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export function AvatarGroup({ avatars, max = 4, size = 'md' }: AvatarGroupProps) {
  const visible = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <div className="flex -space-x-2">
      {visible.map((avatar, index) => (
        <Avatar
          key={index}
          src={avatar.src}
          fallback={avatar.fallback}
          size={size}
          border
        />
      ))}
      {remaining > 0 && (
        <div
          className={`
            ${sizeStyles[size]}
            rounded-full
            bg-gray-800 border-2 border-black
            flex items-center justify-center
            font-medium text-gray-300
          `}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
