/**
 * MintMart Wallet Generator
 * Generates 500 real Stacks mainnet wallets for minting
 * 
 * SECURITY: Generated wallets contain private keys!
 * The wallets/ directory is gitignored for safety.
 */
import { generateWallet, generateSecretKey } from '@stacks/wallet-sdk';
import { TransactionVersion } from '@stacks/transactions';
import fs from 'fs';
import path from 'path';
import { CONTRACTS, WALLET_DIR, WALLET_FILES, TOTAL_WALLETS } from './config.js';

// Ensure wallets directory exists
if (!fs.existsSync(WALLET_DIR)) {
  fs.mkdirSync(WALLET_DIR, { recursive: true });
}

/**
 * Generate a single Stacks wallet with mainnet address
 */
async function generateStacksWallet(index) {
  // Generate a random mnemonic (24 words for security)
  const mnemonic = generateSecretKey(256);
  
  // Create wallet from mnemonic
  const wallet = await generateWallet({
    secretKey: mnemonic,
    password: ''
  });
  
  // Get the first account
  const account = wallet.accounts[0];
  
  // Get mainnet address (SP prefix)
  const address = account.stxAddress.mainnet;
  
  return {
    index,
    address,
    mnemonic,
    privateKey: account.stxPrivateKey,
    publicKey: account.stxPublicKey,
    createdAt: new Date().toISOString()
  };
}

/**
 * Generate wallets for a specific rarity tier
 */
async function generateTierWallets(tier, count, startIndex) {
  console.log(`\n🔐 Generating ${count} wallets for ${tier.toUpperCase()} tier...`);
  
  const wallets = [];
  
  for (let i = 0; i < count; i++) {
    const wallet = await generateStacksWallet(startIndex + i);
    wallet.tier = tier;
    wallet.contractName = CONTRACTS[tier].name;
    wallet.fundAmount = CONTRACTS[tier].fundAmount;
    wallets.push(wallet);
    
    // Progress indicator
    if ((i + 1) % 10 === 0) {
      process.stdout.write(`  Generated ${i + 1}/${count} wallets\r`);
    }
  }
  
  console.log(`  ✅ Generated ${count} ${tier} wallets`);
  return wallets;
}

/**
 * Main wallet generation function
 */
async function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('           MintMart Wallet Generator v1.0');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`\n📊 Total wallets to generate: ${TOTAL_WALLETS}`);
  console.log('📂 Output directory: ./wallets/ (gitignored)\n');
  
  const allWallets = [];
  const tierWallets = {};
  let currentIndex = 0;
  
  // Generate wallets for each tier
  const tiers = ['common', 'rare', 'epic', 'legendary', 'ultimate'];
  
  for (const tier of tiers) {
    const count = CONTRACTS[tier].walletCount;
    const wallets = await generateTierWallets(tier, count, currentIndex);
    
    tierWallets[tier] = wallets;
    allWallets.push(...wallets);
    currentIndex += count;
    
    // Save tier-specific wallet file
    const tierFile = WALLET_FILES[tier];
    fs.writeFileSync(
      tierFile,
      JSON.stringify({
        tier,
        count: wallets.length,
        fundAmountPerWallet: CONTRACTS[tier].fundAmount,
        totalFundRequired: CONTRACTS[tier].fundAmount * wallets.length,
        generatedAt: new Date().toISOString(),
        wallets: wallets.map(w => ({
          index: w.index,
          address: w.address,
          mnemonic: w.mnemonic,
          privateKey: w.privateKey
        }))
      }, null, 2)
    );
    console.log(`  💾 Saved to ${tierFile}`);
  }
  
  // Save combined wallet file
  fs.writeFileSync(
    WALLET_FILES.all,
    JSON.stringify({
      totalWallets: allWallets.length,
      generatedAt: new Date().toISOString(),
      tiers: Object.keys(tierWallets).map(tier => ({
        tier,
        count: tierWallets[tier].length,
        fundAmount: CONTRACTS[tier].fundAmount
      })),
      wallets: allWallets.map(w => ({
        index: w.index,
        tier: w.tier,
        address: w.address,
        mnemonic: w.mnemonic,
        privateKey: w.privateKey
      }))
    }, null, 2)
  );
  
  // Calculate funding summary
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('                    FUNDING SUMMARY');
  console.log('═══════════════════════════════════════════════════════════');
  
  let totalFunding = 0;
  for (const tier of tiers) {
    const tierFunding = CONTRACTS[tier].fundAmount * CONTRACTS[tier].walletCount;
    totalFunding += tierFunding;
    console.log(`  ${tier.padEnd(12)} : ${(tierFunding / 1000000).toFixed(4)} STX (${CONTRACTS[tier].walletCount} wallets × ${(CONTRACTS[tier].fundAmount / 1000000).toFixed(4)} STX)`);
  }
  
  console.log('───────────────────────────────────────────────────────────');
  console.log(`  TOTAL        : ${(totalFunding / 1000000).toFixed(4)} STX`);
  console.log('═══════════════════════════════════════════════════════════\n');
  
  // Generate address list for quick reference
  const addressList = allWallets.map(w => w.address).join('\n');
  fs.writeFileSync(`${WALLET_DIR}/addresses.txt`, addressList);
  
  console.log('✅ Wallet generation complete!');
  console.log(`📁 Files saved to ${WALLET_DIR}/`);
  console.log('\n⚠️  SECURITY WARNING: Keep wallet files secure!');
  console.log('   Never commit them to version control.\n');
}

main().catch(console.error);
