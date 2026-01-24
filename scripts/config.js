/**
 * MintMart Configuration
 * Central configuration for all scripts
 */
import dotenv from 'dotenv';
dotenv.config();

// Network Configuration
export const NETWORK = 'mainnet';
export const API_URL = 'https://stacks-node-api.mainnet.stacks.co';

// Deployer wallet (receives mint payments)
export const DEPLOYER_ADDRESS = 'SP2KYZRNME33Y39GP3RKC90DQJ45EF1N0NZNVRE09';

// Funder wallet (funds the 500 minting wallets)
export const FUNDER_ADDRESS = 'SP1QPNQB6R3EFMTQYGHG9J7N03S3K52ARSE1VEVX4';

// Contract addresses (to be updated after deployment)
export const CONTRACTS = {
  common: {
    name: 'common-collectible',
    address: process.env.COMMON_CONTRACT_ADDRESS || `${DEPLOYER_ADDRESS}.common-collectible`,
    mintPrice: 10000,      // 0.01 STX in microSTX
    maxSupply: 10000,
    walletCount: 100,      // 100 wallets will mint Common
    fundAmount: 20000      // 0.02 STX (mint + gas)
  },
  rare: {
    name: 'rare-collectible',
    address: process.env.RARE_CONTRACT_ADDRESS || `${DEPLOYER_ADDRESS}.rare-collectible`,
    mintPrice: 35000,      // 0.035 STX
    maxSupply: 7500,
    walletCount: 100,
    fundAmount: 45000      // 0.045 STX
  },
  epic: {
    name: 'epic-collectible',
    address: process.env.EPIC_CONTRACT_ADDRESS || `${DEPLOYER_ADDRESS}.epic-collectible`,
    mintPrice: 50000,      // 0.05 STX
    maxSupply: 5000,
    walletCount: 100,
    fundAmount: 60000      // 0.06 STX
  },
  legendary: {
    name: 'legendary-collectible',
    address: process.env.LEGENDARY_CONTRACT_ADDRESS || `${DEPLOYER_ADDRESS}.legendary-collectible`,
    mintPrice: 70000,      // 0.07 STX
    maxSupply: 1000,
    walletCount: 100,
    fundAmount: 80000      // 0.08 STX
  },
  ultimate: {
    name: 'ultimate-collectible',
    address: process.env.ULTIMATE_CONTRACT_ADDRESS || `${DEPLOYER_ADDRESS}.ultimate-collectible`,
    mintPrice: 100000,     // 0.1 STX
    maxSupply: 100,
    walletCount: 100,
    fundAmount: 110000     // 0.11 STX
  }
};

// Gas fee estimate
export const GAS_FEE = 10000; // 0.01 STX

// Total wallets to generate
export const TOTAL_WALLETS = 500;

// Wallet file paths (gitignored)
export const WALLET_DIR = './wallets';
export const WALLET_FILES = {
  common: `${WALLET_DIR}/common-wallets.json`,
  rare: `${WALLET_DIR}/rare-wallets.json`,
  epic: `${WALLET_DIR}/epic-wallets.json`,
  legendary: `${WALLET_DIR}/legendary-wallets.json`,
  ultimate: `${WALLET_DIR}/ultimate-wallets.json`,
  all: `${WALLET_DIR}/all-wallets.json`
};

// Delay between transactions (ms) to avoid rate limiting
export const TX_DELAY = 1000;

// Batch size for parallel operations
export const BATCH_SIZE = 10;

export default {
  NETWORK,
  API_URL,
  DEPLOYER_ADDRESS,
  FUNDER_ADDRESS,
  CONTRACTS,
  GAS_FEE,
  TOTAL_WALLETS,
  WALLET_DIR,
  WALLET_FILES,
  TX_DELAY,
  BATCH_SIZE
};
