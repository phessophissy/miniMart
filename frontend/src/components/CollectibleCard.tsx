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

const tierConfig = {
  common: {
    gradient: 'from-gray-400 via-gray-500 to-gray-600',
    border: 'border-gray-300',
    glow: 'rgba(107, 114, 128, 0.2)',
    text: 'text-gray-700',
    badge: 'bg-gray-100 text-gray-700',
    icon: '⚪',
  },
  rare: {
    gradient: 'from-blue-400 via-blue-500 to-blue-600',
    border: 'border-blue-300',
    glow: 'rgba(59, 130, 246, 0.25)',
    text: 'text-blue-600',
    badge: 'bg-blue-100 text-blue-700',
    icon: '🔵',
  },
  epic: {
    gradient: 'from-purple-400 via-purple-500 to-purple-600',
    border: 'border-purple-300',
    glow: 'rgba(139, 92, 246, 0.3)',
    text: 'text-purple-600',
    badge: 'bg-purple-100 text-purple-700',
    icon: '🟣',
  },
  legendary: {
    gradient: 'from-amber-400 via-yellow-500 to-orange-500',
    border: 'border-amber-300',
    glow: 'rgba(245, 158, 11, 0.35)',
    text: 'text-amber-600',
    badge: 'bg-amber-100 text-amber-700',
    icon: '🟡',
  },
  ultimate: {
    gradient: 'from-rose-400 via-red-500 to-pink-600',
    border: 'border-rose-300',
    glow: 'rgba(239, 68, 68, 0.35)',
    text: 'text-rose-600',
    badge: 'bg-rose-100 text-rose-700',
    icon: '🔴',
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
  const config = tierConfig[tier];
  const available = supply - minted;
  const progress = (minted / supply) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="relative group"
    >
      <div
        className={`card p-6 ${config.border} border-2 overflow-hidden relative`}
        style={{
          boxShadow: `0 8px 32px ${config.glow}`,
        }}
      >
        {/* Shimmer effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            style={{
              animation: 'shimmer 2s infinite',
              backgroundSize: '200% 100%',
            }}
          />
        </div>

        {/* Tier Badge */}
        <div className="absolute top-4 right-4">
          <motion.span
            whileHover={{ scale: 1.1 }}
            className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider
              ${config.badge} shadow-sm flex items-center gap-1.5`}
          >
            <span>{config.icon}</span>
            {tier}
          </motion.span>
        </div>

        {/* Collectible Image */}
        <div
          className={`w-full aspect-square rounded-2xl bg-gradient-to-br ${config.gradient}
            flex items-center justify-center mb-6 relative overflow-hidden shadow-lg`}
        >
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)',
                'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)',
              ],
              backgroundPosition: ['200% 0%', '-200% 0%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{ backgroundSize: '200% 100%' }}
          />
          <motion.span 
            className="text-7xl drop-shadow-lg"
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            💎
          </motion.span>
        </div>

        {/* Name */}
        <h3 className={`text-xl font-bold mb-3 ${config.text}`}>{name}</h3>

        {/* Supply Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500 font-medium">Minted</span>
            <span className={`${config.text} font-semibold`}>
              {minted.toLocaleString()} / {supply.toLocaleString()}
            </span>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${progress}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className={`h-full bg-gradient-to-r ${config.gradient} rounded-full`}
            />
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-5 p-3 bg-purple-50/50 rounded-xl">
          <span className="text-gray-600 font-medium">Price</span>
          <span className="text-2xl font-bold purple-gradient">
            {price} STX
          </span>
        </div>

        {/* Mint Button */}
        {isConnected ? (
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onMint}
            disabled={isMinting || available === 0}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg
              ${available === 0
                ? 'bg-gray-400 cursor-not-allowed shadow-none'
                : `bg-gradient-to-r ${config.gradient} hover:shadow-xl`
              }
              ${isMinting ? 'animate-pulse' : ''}
            `}
          >
            {isMinting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Minting...
              </span>
            ) : available === 0 ? (
              'Sold Out'
            ) : (
              'Mint Now'
            )}
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={connect}
            className="w-full btn-primary py-4 rounded-xl"
          >
            Connect to Mint
          </motion.button>
        )}

        {/* Available count */}
        {available > 0 && (
          <p className="text-center text-sm text-gray-500 mt-3">
            {available.toLocaleString()} available
          </p>
        )}
      </div>
    </motion.div>
  );
}
