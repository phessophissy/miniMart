/**
 * MintMart Wallet Funder
 * Funds 500 wallets from the funder wallet for minting
 * 
 * Funder: SP1QPNQB6R3EFMTQYGHG9J7N03S3K52ARSE1VEVX4
 */
import {
  makeSTXTokenTransfer,
  broadcastTransaction,
  AnchorMode,
  getNonce
} from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';
import fs from 'fs';
import dotenv from 'dotenv';
import { CONTRACTS, WALLET_FILES, TX_DELAY, FUNDER_ADDRESS, API_URL } from './config.js';

dotenv.config();

const network = new StacksMainnet({ url: API_URL });

// Get funder private key from environment
const FUNDER_PRIVATE_KEY = process.env.FUNDER_PRIVATE_KEY;

if (!FUNDER_PRIVATE_KEY) {
  console.error('❌ FUNDER_PRIVATE_KEY not found in .env file');
  process.exit(1);
}

/**
 * Delay helper
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Get current nonce for funder
 */
async function getFunderNonce() {
  const response = await fetch(`${API_URL}/extended/v1/address/${FUNDER_ADDRESS}/nonces`);
  const data = await response.json();
  return data.possible_next_nonce;
}

/**
 * Fund a single wallet
 */
async function fundWallet(wallet, nonce) {
  const txOptions = {
    recipient: wallet.address,
    amount: BigInt(wallet.fundAmount),
    senderKey: FUNDER_PRIVATE_KEY,
    network,
    nonce: BigInt(nonce),
    memo: `mintmart-${wallet.tier}`,
    anchorMode: AnchorMode.Any,
    fee: BigInt(10000) // 0.01 STX fee
  };

  const transaction = await makeSTXTokenTransfer(txOptions);
  const broadcastResponse = await broadcastTransaction(transaction, network);
  
  return {
    wallet: wallet.address,
    tier: wallet.tier,
    amount: wallet.fundAmount,
    txid: broadcastResponse.txid,
    error: broadcastResponse.error
  };
}

/**
 * Fund all wallets for a tier
 */
async function fundTier(tier, startNonce) {
  const walletFile = WALLET_FILES[tier];
  
  if (!fs.existsSync(walletFile)) {
    console.error(`❌ Wallet file not found: ${walletFile}`);
    console.error('   Run: npm run generate-wallets first');
    return { funded: 0, failed: 0 };
  }

  const data = JSON.parse(fs.readFileSync(walletFile, 'utf8'));
  const wallets = data.wallets;
  
  console.log(`\n💰 Funding ${wallets.length} ${tier.toUpperCase()} wallets...`);
  console.log(`   Amount per wallet: ${(CONTRACTS[tier].fundAmount / 1000000).toFixed(4)} STX`);
  
  const results = [];
  let currentNonce = startNonce;
  
  for (let i = 0; i < wallets.length; i++) {
    const wallet = {
      ...wallets[i],
      tier,
      fundAmount: CONTRACTS[tier].fundAmount
    };
    
    try {
      const result = await fundWallet(wallet, currentNonce);
      results.push(result);
      
      if (result.error) {
        console.log(`   ❌ Failed: ${wallet.address.slice(0, 12)}... - ${result.error}`);
      } else {
        console.log(`   ✅ Funded: ${wallet.address.slice(0, 12)}... | TX: ${result.txid.slice(0, 12)}...`);
      }
      
      currentNonce++;
      await delay(TX_DELAY);
    } catch (error) {
      console.log(`   ❌ Error funding ${wallet.address.slice(0, 12)}...: ${error.message}`);
      results.push({
        wallet: wallet.address,
        tier,
        error: error.message
      });
    }
  }
  
  const funded = results.filter(r => !r.error).length;
  const failed = results.filter(r => r.error).length;
  
  // Save funding results
  const resultsFile = `./wallets/${tier}-funding-results.json`;
  fs.writeFileSync(resultsFile, JSON.stringify({
    tier,
    timestamp: new Date().toISOString(),
    funded,
    failed,
    results
  }, null, 2));
  
  console.log(`   📊 ${tier}: ${funded} funded, ${failed} failed`);
  
  return { funded, failed, nextNonce: currentNonce };
}

/**
 * Main funding function
 */
async function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('           MintMart Wallet Funder v1.0');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`\n💳 Funder wallet: ${FUNDER_ADDRESS}`);
  
  // Check funder balance first
  const balanceResponse = await fetch(`${API_URL}/extended/v1/address/${FUNDER_ADDRESS}/stx`);
  const balanceData = await balanceResponse.json();
  const balance = parseInt(balanceData.balance) / 1000000;
  
  console.log(`💰 Funder balance: ${balance.toFixed(4)} STX`);
  
  // Calculate required funding
  let totalRequired = 0;
  const tiers = ['common', 'rare', 'epic', 'legendary', 'ultimate'];
  
  for (const tier of tiers) {
    totalRequired += CONTRACTS[tier].fundAmount * CONTRACTS[tier].walletCount;
  }
  // Add gas for 500 transfer transactions
  totalRequired += 500 * 10000;
  
  console.log(`📊 Total required: ${(totalRequired / 1000000).toFixed(4)} STX`);
  
  if (balance * 1000000 < totalRequired) {
    console.error('\n❌ Insufficient funder balance!');
    console.error(`   Need: ${(totalRequired / 1000000).toFixed(4)} STX`);
    console.error(`   Have: ${balance.toFixed(4)} STX`);
    process.exit(1);
  }
  
  // Get starting nonce
  let currentNonce = await getFunderNonce();
  console.log(`\n🔢 Starting nonce: ${currentNonce}`);
  
  // Fund each tier
  let totalFunded = 0;
  let totalFailed = 0;
  
  for (const tier of tiers) {
    const result = await fundTier(tier, currentNonce);
    totalFunded += result.funded;
    totalFailed += result.failed;
    currentNonce = result.nextNonce || currentNonce + CONTRACTS[tier].walletCount;
  }
  
  // Summary
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('                    FUNDING COMPLETE');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`   ✅ Funded: ${totalFunded} wallets`);
  console.log(`   ❌ Failed: ${totalFailed} wallets`);
  console.log('═══════════════════════════════════════════════════════════\n');
  
  if (totalFailed > 0) {
    console.log('⚠️  Some wallets failed to fund. Check *-funding-results.json files.');
  }
}

main().catch(console.error);
