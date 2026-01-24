'use client';

import { motion } from 'framer-motion';
import { useWallet } from '@/contexts/WalletContext';

export default function Hero() {
  const { isConnected, connect } = useWallet();

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20">
      <div className="max-w-7xl mx-auto px-6 text-center z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
            bg-yellow-900/30 border border-yellow-600/40 text-yellow-400 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            Built on Stacks (Bitcoin L2)
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold mt-8 mb-6"
        >
          Collect <span className="gold-gradient">Rare</span> Digital
          <br />
          Treasures on <span className="gold-gradient">Bitcoin</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-gray-400 max-w-2xl mx-auto mb-8"
        >
          MintMart brings exclusive NFT collectibles to the Bitcoin ecosystem.
          Five rarity tiers, limited supply, secured by the world&apos;s most trusted blockchain.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          {isConnected ? (
            <a href="#collections">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary text-lg px-8 py-4"
              >
                View Collections
              </motion.button>
            </a>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={connect}
              className="btn-primary text-lg px-8 py-4"
            >
              Connect Wallet to Start
            </motion.button>
          )}
          <a href="#how-it-works">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-secondary text-lg px-8 py-4"
            >
              Learn More
            </motion.button>
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto"
        >
          {[
            { label: 'Total Supply', value: '23,600' },
            { label: 'Rarity Tiers', value: '5' },
            { label: 'Min Price', value: '0.01 STX' },
            { label: 'Network', value: 'Stacks' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-bold gold-gradient mb-1">
                {stat.value}
              </div>
              <div className="text-gray-500 text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-yellow-600/40 flex justify-center pt-2"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
        </motion.div>
      </motion.div>
    </section>
  );
}
