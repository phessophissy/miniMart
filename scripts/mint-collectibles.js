/**
 * MintMart Minting Script
 * Mints collectibles from 500 wallets across 5 rarity tiers
 * 
 * Each wallet mints 1 NFT from its assigned tier contract
 */
import {
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  FungibleConditionCode,
  makeStandardSTXPostCondition
} from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';
import fs from 'fs';
import dotenv from 'dotenv';
import { CONTRACTS, WALLET_FILES, TX_DELAY, DEPLOYER_ADDRESS, API_URL } from './config.js';

dotenv.config();

const network = new StacksMainnet({ url: API_URL });

/**
 * Delay helper
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Get nonce for a wallet
 */
async function getWalletNonce(address) {
  const response = await fetch(`${API_URL}/extended/v1/address/${address}/nonces`);
  const data = await response.json();
  return data.possible_next_nonce;
}

/**
 * Mint a collectible from a wallet
 */
async function mintCollectible(wallet, tier, contractInfo) {
  const [contractAddress, contractName] = contractInfo.address.split('.');
  
  // Post condition: wallet sends mint price to contract owner
  const postConditions = [
    makeStandardSTXPostCondition(
      wallet.address,
      FungibleConditionCode.Equal,
      BigInt(contractInfo.mintPrice)
    )
  ];

  const txOptions = {
    contractAddress,
    contractName,
    functionName: 'mint',
    functionArgs: [],
    senderKey: wallet.privateKey,
    network,
    postConditions,
    postConditionMode: PostConditionMode.Deny,
    anchorMode: AnchorMode.Any,
    fee: BigInt(10000)
  };

  const transaction = await makeContractCall(txOptions);
  const broadcastResponse = await broadcastTransaction(transaction, network);
  
  return {
    wallet: wallet.address,
    tier,
    contract: contractInfo.address,
    txid: broadcastResponse.txid,
    error: broadcastResponse.error
  };
}

/**
 * Mint collectibles for a tier
 */
async function mintTier(tier) {
  const walletFile = WALLET_FILES[tier];
  const contractInfo = CONTRACTS[tier];
  
  if (!fs.existsSync(walletFile)) {
    console.error(`❌ Wallet file not found: ${walletFile}`);
    console.error('   Run: npm run generate-wallets first');
    return { minted: 0, failed: 0 };
  }

  const data = JSON.parse(fs.readFileSync(walletFile, 'utf8'));
  const wallets = data.wallets;
  
  console.log(`\n🎨 Minting ${tier.toUpperCase()} collectibles...`);
  console.log(`   Contract: ${contractInfo.address}`);
  console.log(`   Mint price: ${(contractInfo.mintPrice / 1000000).toFixed(4)} STX`);
  console.log(`   Wallets: ${wallets.length}`);
  
  const results = [];
  
  for (let i = 0; i < wallets.length; i++) {
    const wallet = wallets[i];
    
    try {
      const result = await mintCollectible(wallet, tier, contractInfo);
      results.push(result);
      
      if (result.error) {
        console.log(`   ❌ Failed: ${wallet.address.slice(0, 12)}... - ${result.error}`);
      } else {
        console.log(`   ✅ Minted: ${wallet.address.slice(0, 12)}... | TX: ${result.txid.slice(0, 12)}...`);
      }
      
      await delay(TX_DELAY);
    } catch (error) {
      console.log(`   ❌ Error: ${wallet.address.slice(0, 12)}... - ${error.message}`);
      results.push({
        wallet: wallet.address,
        tier,
        error: error.message
      });
    }
  }
  
  const minted = results.filter(r => !r.error).length;
  const failed = results.filter(r => r.error).length;
  
  // Save minting results
  const resultsFile = `./wallets/${tier}-minting-results.json`;
  fs.writeFileSync(resultsFile, JSON.stringify({
    tier,
    contract: contractInfo.address,
    timestamp: new Date().toISOString(),
    minted,
    failed,
    results
  }, null, 2));
  
  console.log(`   📊 ${tier}: ${minted} minted, ${failed} failed`);
  
  return { minted, failed };
}

/**
 * Main minting function
 */
async function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('           MintMart Collectible Minter v1.0');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`\n🎨 Minting collectibles from 500 wallets...`);
  console.log(`📍 Deployer (receives payments): ${DEPLOYER_ADDRESS}`);
  
  const tiers = ['common', 'rare', 'epic', 'legendary', 'ultimate'];
  
  let totalMinted = 0;
  let totalFailed = 0;
  
  for (const tier of tiers) {
    const result = await mintTier(tier);
    totalMinted += result.minted;
    totalFailed += result.failed;
  }
  
  // Summary
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('                    MINTING COMPLETE');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`   ✅ Minted: ${totalMinted} collectibles`);
  console.log(`   ❌ Failed: ${totalFailed} mints`);
  console.log('═══════════════════════════════════════════════════════════\n');
  
  // Calculate revenue
  let totalRevenue = 0;
  for (const tier of tiers) {
    const successfulMints = JSON.parse(
      fs.readFileSync(`./wallets/${tier}-minting-results.json`, 'utf8')
    ).minted;
    totalRevenue += successfulMints * CONTRACTS[tier].mintPrice;
  }
  
  console.log(`💰 Total revenue collected: ${(totalRevenue / 1000000).toFixed(4)} STX`);
  
  if (totalFailed > 0) {
    console.log('\n⚠️  Some mints failed. Check *-minting-results.json files.');
  }
}

main().catch(console.error);
