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
  color: string;
  blur: number;
}

const purpleColors = [
  'rgba(168, 85, 247, opacity)', // purple-500
  'rgba(147, 51, 234, opacity)', // purple-600
  'rgba(192, 132, 252, opacity)', // purple-400
  'rgba(167, 139, 250, opacity)', // lavender-400
  'rgba(139, 92, 246, opacity)', // lavender-500
  'rgba(221, 214, 254, opacity)', // lavender-200
  'rgba(196, 181, 253, opacity)', // lavender-300
  'rgba(216, 180, 254, opacity)', // purple-300
  'rgba(233, 213, 255, opacity)', // purple-200
  'rgba(243, 232, 255, opacity)', // purple-100
];

export default function FloatingBalls() {
  const balls = useMemo<Ball[]>(() => {
    return Array.from({ length: 25 }, (_, i) => {
      const opacity = Math.random() * 0.4 + 0.15;
      const colorTemplate = purpleColors[Math.floor(Math.random() * purpleColors.length)];
      return {
        id: i,
        size: Math.random() * 180 + 40,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 15 + 20,
        delay: Math.random() * 8,
        opacity,
        color: colorTemplate.replace('opacity', String(opacity)),
        blur: Math.random() * 3 + 1,
      };
    });
  }, []);

  const largeBalls = useMemo<Ball[]>(() => {
    return Array.from({ length: 8 }, (_, i) => {
      const opacity = Math.random() * 0.2 + 0.08;
      const colorTemplate = purpleColors[Math.floor(Math.random() * 5)];
      return {
        id: i + 100,
        size: Math.random() * 300 + 200,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 25 + 30,
        delay: Math.random() * 10,
        opacity,
        color: colorTemplate.replace('opacity', String(opacity)),
        blur: Math.random() * 40 + 30,
      };
    });
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Large ambient background balls */}
      {largeBalls.map((ball) => (
        <motion.div
          key={ball.id}
          className="absolute rounded-full"
          style={{
            width: ball.size,
            height: ball.size,
            left: `${ball.x}%`,
            top: `${ball.y}%`,
            background: `radial-gradient(circle at 30% 30%, ${ball.color}, transparent 70%)`,
            filter: `blur(${ball.blur}px)`,
          }}
          animate={{
            y: [0, -60, -30, -80, 0],
            x: [0, 40, -30, 20, 0],
            scale: [1, 1.1, 0.95, 1.08, 1],
          }}
          transition={{
            duration: ball.duration,
            delay: ball.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Medium floating balls */}
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
              ${ball.color}, 
              transparent 70%)`,
            filter: `blur(${ball.blur}px)`,
          }}
          animate={{
            y: [0, -40, -20, -50, 0],
            x: [0, 25, -20, 15, 0],
            scale: [1, 1.15, 0.9, 1.1, 1],
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{
            duration: ball.duration,
            delay: ball.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
      
      {/* Top left gradient glow */}
      <div 
        className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15), transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      
      {/* Top right gradient glow */}
      <div 
        className="absolute -top-40 right-0 w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12), transparent 70%)',
          filter: 'blur(100px)',
        }}
      />
      
      {/* Bottom center gradient glow */}
      <div 
        className="absolute -bottom-32 left-1/3 w-[700px] h-[700px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(167, 139, 250, 0.1), transparent 70%)',
          filter: 'blur(90px)',
        }}
      />

      {/* Center accent glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(192, 132, 252, 0.08), transparent 60%)',
          filter: 'blur(120px)',
        }}
      />
    </div>
  );
}
