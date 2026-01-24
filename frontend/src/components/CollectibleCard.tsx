'use client';

import { motion } from 'framer-motion';
import { useWallet } from '@/contexts/WalletContext';

interface CollectibleCardProps {
  tier: 'common' | 'rare' | 'epic' | 'legendary' | 'ultimate';
  name: string;
  price: number;
  supply: number;
  minted: number;
  onMint: () => void;
  isMinting?: boolean;
}

const tierColors = {
  common: {
    bg: 'from-gray-600 to-gray-800',
    border: 'border-gray-500',
    glow: 'rgba(156, 163, 175, 0.3)',
    text: 'text-gray-300',
  },
  rare: {
    bg: 'from-blue-600 to-blue-800',
    border: 'border-blue-500',
    glow: 'rgba(59, 130, 246, 0.3)',
    text: 'text-blue-300',
  },
  epic: {
    bg: 'from-purple-600 to-purple-800',
    border: 'border-purple-500',
    glow: 'rgba(147, 51, 234, 0.3)',
    text: 'text-purple-300',
  },
  legendary: {
    bg: 'from-yellow-500 to-yellow-700',
    border: 'border-yellow-400',
    glow: 'rgba(245, 158, 11, 0.4)',
    text: 'text-yellow-300',
  },
  ultimate: {
    bg: 'from-red-500 to-red-700',
    border: 'border-red-400',
    glow: 'rgba(239, 68, 68, 0.4)',
    text: 'text-red-300',
  },
};

export default function CollectibleCard({
  tier,
  name,
  price,
  supply,
  minted,
  onMint,
  isMinting = false,
}: CollectibleCardProps) {
  const { isConnected, connect } = useWallet();
  const colors = tierColors[tier];
  const available = supply - minted;
  const progress = (minted / supply) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="relative group"
    >
      <div
        className={`card p-6 ${colors.border} border-2 overflow-hidden`}
        style={{
          boxShadow: `0 0 30px ${colors.glow}`,
        }}
      >
        {/* Tier Badge */}
        <div className="absolute top-4 right-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider 
              bg-gradient-to-r ${colors.bg} text-white`}
          >
            {tier}
          </span>
        </div>

        {/* Collectible Image Placeholder */}
        <div
          className={`w-full aspect-square rounded-xl bg-gradient-to-br ${colors.bg} 
            flex items-center justify-center mb-6 relative overflow-hidden`}
        >
          <motion.div
            className="absolute inset-0 bg-white/5"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            style={{
              backgroundImage:
                'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)',
              backgroundSize: '200% 200%',
            }}
          />
          <span className="text-6xl opacity-50">💎</span>
        </div>

        {/* Name */}
        <h3 className={`text-xl font-bold mb-2 ${colors.text}`}>{name}</h3>

        {/* Supply Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Minted</span>
            <span className={colors.text}>
              {minted.toLocaleString()} / {supply.toLocaleString()}
            </span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className={`h-full bg-gradient-to-r ${colors.bg} rounded-full`}
            />
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-400">Price</span>
          <span className="text-xl font-bold text-yellow-400">
            {price} STX
          </span>
        </div>

        {/* Mint Button */}
        {isConnected ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onMint}
            disabled={isMinting || available === 0}
            className={`w-full py-3 rounded-xl font-bold text-black transition-all
              ${available === 0
                ? 'bg-gray-600 cursor-not-allowed'
                : `bg-gradient-to-r ${colors.bg} hover:opacity-90`
              }
              ${isMinting ? 'animate-pulse' : ''}
            `}
          >
            {isMinting ? 'Minting...' : available === 0 ? 'Sold Out' : 'Mint Now'}
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={connect}
            className="w-full btn-primary"
          >
            Connect to Mint
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
