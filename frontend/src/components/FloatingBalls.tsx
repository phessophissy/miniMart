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

const woodColors = [
  'rgba(154, 103, 54, opacity)', // wood-500
  'rgba(127, 83, 40, opacity)', // wood-600
  'rgba(185, 132, 82, opacity)', // wood-400
  'rgba(195, 155, 110, opacity)', // sand-400
  'rgba(173, 127, 79, opacity)', // sand-500
  'rgba(232, 210, 184, opacity)', // sand-200
  'rgba(216, 185, 146, opacity)', // sand-300
  'rgba(209, 169, 123, opacity)', // wood-300
  'rgba(227, 198, 166, opacity)', // wood-200
  'rgba(241, 227, 209, opacity)', // wood-100
];

export default function FloatingBalls() {
  const balls = useMemo<Ball[]>(() => {
    return Array.from({ length: 25 }, (_, i) => {
      const opacity = Math.random() * 0.4 + 0.15;
      const colorTemplate = woodColors[Math.floor(Math.random() * woodColors.length)];
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
      const colorTemplate = woodColors[Math.floor(Math.random() * 5)];
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
          background: 'radial-gradient(circle, rgba(154, 103, 54, 0.15), transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      
      {/* Top right gradient glow */}
      <div 
        className="absolute -top-40 right-0 w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(185, 132, 82, 0.12), transparent 70%)',
          filter: 'blur(100px)',
        }}
      />
      
      {/* Bottom center gradient glow */}
      <div 
        className="absolute -bottom-32 left-1/3 w-[700px] h-[700px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(173, 127, 79, 0.1), transparent 70%)',
          filter: 'blur(90px)',
        }}
      />

      {/* Center accent glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(209, 169, 123, 0.08), transparent 60%)',
          filter: 'blur(120px)',
        }}
      />
    </div>
  );
}
