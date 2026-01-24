'use client';

import { useWallet } from '@/contexts/WalletContext';
import { motion } from 'framer-motion';

export default function Header() {
  const { isConnected, address, connect, disconnect } = useWallet();

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/50 border-b border-gold-800/30"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.div 
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
            <span className="text-black font-bold text-xl">M</span>
          </div>
          <span className="text-2xl font-bold gold-gradient">MintMart</span>
        </motion.div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#collections" className="text-yellow-100/80 hover:text-yellow-400 transition-colors">
            Collections
          </a>
          <a href="#how-it-works" className="text-yellow-100/80 hover:text-yellow-400 transition-colors">
            How It Works
          </a>
          <a href="#about" className="text-yellow-100/80 hover:text-yellow-400 transition-colors">
            About
          </a>
        </nav>

        {/* Wallet Button */}
        {isConnected ? (
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-900/20 border border-yellow-600/30">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-yellow-100 font-mono text-sm">
                {truncateAddress(address!)}
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={disconnect}
              className="btn-secondary text-sm"
            >
              Disconnect
            </motion.button>
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={connect}
            className="btn-primary"
          >
            Connect Wallet
          </motion.button>
        )}
      </div>
    </motion.header>
  );
}
