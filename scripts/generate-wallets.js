/**
 * MintMart Wallet Generator
 * Generates 500 real Stacks mainnet wallets for minting
 */
import { generateWallet, generateSecretKey } from '@stacks/wallet-sdk';
import { getAddressFromPrivateKey, TransactionVersion } from '@stacks/transactions';
import fs from 'fs';
import { CONTRACTS, WALLET_DIR, WALLET_FILES, TOTAL_WALLETS } from './config.js';

if (!fs.existsSync(WALLET_DIR)) {
  fs.mkdirSync(WALLET_DIR, { recursive: true });
}

async function generateStacksWallet(index) {
  const mnemonic = generateSecretKey(256);
  
  const wallet = await generateWallet({
    secretKey: mnemonic,
    password: ''
  });
  
  const account = wallet.accounts[0];
  const privateKey = account.stxPrivateKey;
  
  // Get mainnet address from private key
  const address = getAddressFromPrivateKey(privateKey, TransactionVersion.Mainnet);
  
  return {
    index,
    address,
    mnemonic,
    privateKey,
    createdAt: new Date().toISOString()
  };
}

async function generateTierWallets(tier, count, startIndex) {
  console.log(`\n🔐 Generating ${count} wallets for ${tier.toUpperCase()} tier...`);
  
  const wallets = [];
  
  for (let i = 0; i < count; i++) {
    const wallet = await generateStacksWallet(startIndex + i);
    wallet.tier = tier;
    wallet.contractName = CONTRACTS[tier].name;
    wallet.fundAmount = CONTRACTS[tier].fundAmount;
    wallets.push(wallet);
    
    if ((i + 1) % 20 === 0) {
      process.stdout.write(`  Generated ${i + 1}/${count} wallets\r`);
    }
  }
  
  console.log(`  ✅ Generated ${count} ${tier} wallets                    `);
  return wallets;
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('           MintMart Wallet Generator v1.0');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`\n📊 Total wallets to generate: ${TOTAL_WALLETS}`);
  
  const allWallets = [];
  const tierWallets = {};
  let currentIndex = 0;
  
  const tiers = ['common', 'rare', 'epic', 'legendary', 'ultimate'];
  
  for (const tier of tiers) {
    const count = CONTRACTS[tier].walletCount;
    const wallets = await generateTierWallets(tier, count, currentIndex);
    
    tierWallets[tier] = wallets;
    allWallets.push(...wallets);
    currentIndex += count;
    
    const tierFile = WALLET_FILES[tier];
    fs.writeFileSync(
      tierFile,
      JSON.stringify({
        tier,
        count: wallets.length,
        fundAmountPerWallet: CONTRACTS[tier].fundAmount,
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
  
  fs.writeFileSync(
    WALLET_FILES.all,
    JSON.stringify({
      totalWallets: allWallets.length,
      generatedAt: new Date().toISOString(),
      wallets: allWallets.map(w => ({
        index: w.index,
        tier: w.tier,
        address: w.address,
        mnemonic: w.mnemonic,
        privateKey: w.privateKey
      }))
    }, null, 2)
  );
  
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('                    FUNDING SUMMARY');
  console.log('═══════════════════════════════════════════════════════════');
  
  let totalFunding = 0;
  for (const tier of tiers) {
    const tierFunding = CONTRACTS[tier].fundAmount * CONTRACTS[tier].walletCount;
    totalFunding += tierFunding;
    console.log(`  ${tier.padEnd(12)} : ${(tierFunding / 1000000).toFixed(4)} STX`);
  }
  
  console.log('───────────────────────────────────────────────────────────');
  console.log(`  TOTAL        : ${(totalFunding / 1000000).toFixed(4)} STX`);
  console.log('═══════════════════════════════════════════════════════════\n');
  
  const addressList = allWallets.map(w => w.address).join('\n');
  fs.writeFileSync(`${WALLET_DIR}/addresses.txt`, addressList);
  
  console.log('✅ Wallet generation complete!');
  console.log(`📁 Files saved to ${WALLET_DIR}/\n`);
}

main().catch(console.error);
