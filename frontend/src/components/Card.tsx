'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export default function Card({
  children,
  className = '',
  hover = false,
  glow = false,
  padding = 'md',
  onClick,
}: CardProps) {
  const baseClasses = `
    bg-gray-900/80 
    backdrop-blur-sm 
    border border-gray-800 
    rounded-2xl 
    ${paddingStyles[padding]}
    ${glow ? 'shadow-lg shadow-gold/10' : ''}
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `;

  if (hover) {
    return (
      <motion.div
        className={baseClasses}
        whileHover={{ 
          scale: 1.02, 
          borderColor: 'rgba(212, 175, 55, 0.5)',
          boxShadow: '0 0 30px rgba(212, 175, 55, 0.2)'
        }}
        transition={{ duration: 0.3 }}
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={baseClasses} onClick={onClick}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`border-b border-gray-800 pb-4 mb-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

export function CardFooter({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`border-t border-gray-800 pt-4 mt-4 ${className}`}>
      {children}
    </div>
  );
}
