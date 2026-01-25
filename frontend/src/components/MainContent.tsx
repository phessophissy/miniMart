'use client';

import { useState } from 'react';
import { WalletProvider, useWallet } from '@/contexts/WalletContext';
import FloatingBalls from '@/components/FloatingBalls';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import CollectibleCard from '@/components/CollectibleCard';
import { motion } from 'framer-motion';

const collectibles = [
  {
    tier: 'common' as const,
    name: 'Common Collectible',
    price: 0.01,
    supply: 10000,
    minted: 0,
  },
  {
    tier: 'rare' as const,
    name: 'Rare Collectible',
    price: 0.035,
    supply: 7500,
    minted: 0,
  },
  {
    tier: 'epic' as const,
    name: 'Epic Collectible',
    price: 0.05,
    supply: 5000,
    minted: 0,
  },
  {
    tier: 'legendary' as const,
    name: 'Legendary Collectible',
    price: 0.07,
    supply: 1000,
    minted: 0,
  },
  {
    tier: 'ultimate' as const,
    name: 'Ultimate Collectible',
    price: 0.1,
    supply: 100,
    minted: 0,
  },
];

const howItWorksSteps = [
  {
    step: '01',
    title: 'Connect Wallet',
    description: 'Connect your Stacks wallet (Leather or Xverse) to get started.',
    icon: '🔗',
  },
  {
    step: '02',
    title: 'Choose Rarity',
    description: 'Select from five exclusive rarity tiers based on your preference.',
    icon: '💎',
  },
  {
    step: '03',
    title: 'Mint & Own',
    description: 'Mint your NFT and own a piece of Bitcoin-secured digital art.',
    icon: '✨',
  },
];

function Content() {
  const { isConnected } = useWallet();
  const [mintingTier, setMintingTier] = useState<string | null>(null);

  const handleMint = async (tier: string) => {
    setMintingTier(tier);
    setTimeout(() => setMintingTier(null), 2000);
  };

  return (
    <div className="min-h-screen relative">
      <FloatingBalls />
      <Header />
      <main className="relative z-10">
        <Hero />
        
        {/* Collections Section */}
        <section id="collections" className="py-28 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-20"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-purple-100 text-purple-600 text-sm font-medium mb-4">
                NFT Collections
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <span className="purple-gradient">Exclusive</span> Collections
              </h2>
              <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                Choose from five rarity tiers, each with unique characteristics
                and limited supply. The rarer the tier, the more exclusive your collectible.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {collectibles.map((collectible, i) => (
                <motion.div
                  key={collectible.tier}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <CollectibleCard
                    {...collectible}
                    onMint={() => handleMint(collectible.tier)}
                    isMinting={mintingTier === collectible.tier}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-28 px-6 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-50/50 to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-20"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-purple-100 text-purple-600 text-sm font-medium mb-4">
                Simple Process
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                How It <span className="purple-gradient">Works</span>
              </h2>
              <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                Minting your collectible is simple and secure, powered by Bitcoin&apos;s security.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {howItWorksSteps.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="card p-8 text-center group"
                >
                  <motion.div 
                    className="text-6xl mb-6"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  >
                    {item.icon}
                  </motion.div>
                  <div className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-600 font-mono text-sm font-bold mb-4">
                    STEP {item.step}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-800">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-28 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="card p-10 md:p-14 text-center"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-purple-100 text-purple-600 text-sm font-medium mb-6">
                About Us
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-8">
                About <span className="purple-gradient">MintMart</span>
              </h2>
              <p className="text-gray-600 text-lg md:text-xl mb-10 leading-relaxed">
                MintMart is a collectible minting platform built on Stacks, the leading
                Bitcoin Layer 2 solution. Every NFT you mint is secured by Bitcoin&apos;s
                proof-of-work consensus, making your digital collectibles truly immutable.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a 
                  href="https://stacks.co" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Learn about Stacks
                </motion.a>
                <motion.a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View on GitHub
                </motion.a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-purple-200/50 bg-white/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-2xl font-bold purple-gradient">MintMart</span>
            </motion.div>
            <p className="text-gray-500 text-sm">
              © 2026 MintMart. Built on Stacks.
            </p>
                        <div className="flex gap-6">
              {[
                { name: 'Twitter', href: 'https://twitter.com/mintmart' },
                { name: 'Discord', href: 'https://discord.gg/mintmart' },
                { name: 'GitHub', href: 'https://github.com/phessophissy/miniMart' }
              ].map((social) => (
                <motion.a 
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-purple-600 transition-colors font-medium"
                  whileHover={{ y: -2 }}
                >
                  {social.name}
                </motion.a>
              ))}
            </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default function MainContent() {
  return (
    <WalletProvider>
      <Content />
    </WalletProvider>
  );
}
