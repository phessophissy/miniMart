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

function Content() {
  const { isConnected } = useWallet();
  const [mintingTier, setMintingTier] = useState<string | null>(null);

  const handleMint = async (tier: string) => {
    setMintingTier(tier);
    setTimeout(() => setMintingTier(null), 2000);
  };

  return (
    <>
      <FloatingBalls />
      <Header />
      <main className="relative z-10">
        <Hero />
        
        {/* Collections Section */}
        <section id="collections" className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="gold-gradient">Exclusive</span> Collections
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Choose from five rarity tiers, each with unique characteristics
                and limited supply. The rarer the tier, the more exclusive your collectible.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {collectibles.map((collectible, i) => (
                <motion.div
                  key={collectible.tier}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
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
        <section id="how-it-works" className="py-24 px-6 bg-black/30">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                How It <span className="gold-gradient">Works</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Minting your collectible is simple and secure, powered by Bitcoin&apos;s security.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
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
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="card p-8 text-center"
                >
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <div className="text-sm text-yellow-500 font-mono mb-2">
                    STEP {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-yellow-100">
                    {item.title}
                  </h3>
                  <p className="text-gray-400">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                About <span className="gold-gradient">MintMart</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                MintMart is a collectible minting platform built on Stacks, the leading
                Bitcoin Layer 2 solution. Every NFT you mint is secured by Bitcoin&apos;s
                proof-of-work consensus, making your digital collectibles truly immutable.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="https://stacks.co" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  Learn about Stacks
                </a>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  View on GitHub
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-yellow-900/30">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                <span className="text-black font-bold">M</span>
              </div>
              <span className="text-xl font-bold gold-gradient">MintMart</span>
            </div>
            <p className="text-gray-500 text-sm">
              © 2026 MintMart. Built on Stacks.
            </p>
            <div className="flex gap-6">
              <a href="https://twitter.com/mintmart" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-400 transition-colors">
                Twitter
              </a>
              <a href="https://discord.gg/mintmart" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-400 transition-colors">
                Discord
              </a>
              <a href="https://github.com/phessophissy/miniMart" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-400 transition-colors">
                GitHub
              </a>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}

export default function MainContent() {
  return (
    <WalletProvider>
      <Content />
    </WalletProvider>
  );
}
