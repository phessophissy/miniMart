'use client';

import { motion } from 'framer-motion';
import { useWallet } from '@/contexts/WalletContext';

export default function Hero() {
  const { isConnected, connect } = useWallet();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <motion.div 
        className="max-w-7xl mx-auto px-6 text-center z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div variants={itemVariants}>
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full
            bg-white/60 backdrop-blur-md border border-purple-200 text-purple-600 text-sm font-medium
            shadow-sm hover:shadow-md transition-shadow cursor-default">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            Built on Stacks (Bitcoin L2)
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl lg:text-8xl font-bold mt-8 mb-6 leading-tight"
        >
          Collect <span className="purple-gradient">Rare</span> Digital
          <br />
          Treasures on <span className="purple-gradient">Bitcoin</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          MintMart brings exclusive NFT collectibles to the Bitcoin ecosystem.
          Five rarity tiers, limited supply, secured by the world&apos;s most trusted blockchain.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          {isConnected ? (
            <a href="#collections">
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary text-lg px-10 py-5 rounded-2xl"
              >
                View Collections
              </motion.button>
            </a>
          ) : (
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={connect}
              className="btn-primary text-lg px-10 py-5 rounded-2xl"
            >
              Connect Wallet to Start
            </motion.button>
          )}
          <a href="#how-it-works">
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="btn-secondary text-lg px-10 py-5 rounded-2xl"
            >
              Learn More
            </motion.button>
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-4xl mx-auto"
        >
          {[
            { label: 'Total Supply', value: '23,600', icon: '🎨' },
            { label: 'Rarity Tiers', value: '5', icon: '💎' },
            { label: 'Min Price', value: '0.01 STX', icon: '💰' },
            { label: 'Network', value: 'Stacks', icon: '⚡' },
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              className="card p-5 text-center"
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl md:text-3xl font-bold purple-gradient mb-1">
                {stat.value}
              </div>
              <div className="text-gray-500 text-sm font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-sm text-purple-400 font-medium">Scroll to explore</span>
          <div className="w-7 h-12 rounded-full border-2 border-purple-300 flex justify-center pt-2">
            <motion.div 
              className="w-2 h-2 rounded-full bg-purple-500"
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
