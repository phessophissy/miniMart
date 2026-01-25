'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

// Dynamically import the main content to avoid SSR issues with @stacks packages
const MainContent = dynamic(() => import('@/components/MainContent'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-lavender-100 to-purple-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-6"
      >
        {/* Logo */}
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: 'easeInOut' 
          }}
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-xl shadow-purple-500/30"
        >
          <span className="text-white font-bold text-3xl">M</span>
        </motion.div>
        
        {/* Loading spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 rounded-full border-3 border-purple-200 border-t-purple-500"
          style={{ borderWidth: '3px' }}
        />
        
        {/* Loading text */}
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-purple-600 font-medium"
        >
          Loading MintMart...
        </motion.p>
      </motion.div>
    </div>
  ),
});

export default function Home() {
  return <MainContent />;
}
