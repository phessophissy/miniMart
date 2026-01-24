'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface Ball {
  id: number;
  size: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
  opacity: number;
}

export default function FloatingBalls() {
  const balls = useMemo<Ball[]>(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      size: Math.random() * 200 + 50,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 10 + 15,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.3 + 0.1,
    }));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {balls.map((ball) => (
        <motion.div
          key={ball.id}
          className="absolute rounded-full"
          style={{
            width: ball.size,
            height: ball.size,
            left: `${ball.x}%`,
            top: `${ball.y}%`,
            background: `radial-gradient(circle at 30% 30%, 
              rgba(251, 191, 36, ${ball.opacity}), 
              rgba(245, 158, 11, ${ball.opacity * 0.5}), 
              rgba(217, 119, 6, ${ball.opacity * 0.2}),
              transparent 70%)`,
            filter: 'blur(2px)',
          }}
          animate={{
            y: [0, -30, -10, -40, 0],
            x: [0, 20, -15, 10, 0],
            scale: [1, 1.1, 0.95, 1.05, 1],
          }}
          transition={{
            duration: ball.duration,
            delay: ball.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
      
      {/* Large ambient glow */}
      <div 
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.1), transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(251, 191, 36, 0.08), transparent 70%)',
          filter: 'blur(50px)',
        }}
      />
    </div>
  );
}
