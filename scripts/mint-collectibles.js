/**
 * MintMart Minting Script
 */
import {
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode
} from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';
import fetch from 'node-fetch';
import fs from 'fs';
import dotenv from 'dotenv';
import { DEPLOYER_ADDRESS, WALLET_FILES, CONTRACTS } from './config.js';

dotenv.config();

const API_URL = 'https://api.hiro.so';
const network = new StacksMainnet({ url: API_URL });

const TIER = process.env.TIER || 'common';
const START_FROM = parseInt(process.env.START_FROM || '0');
const LIMIT = parseInt(process.env.LIMIT || '100');

const delay = ms => new Promise(r => setTimeout(r, ms));

async function fetchAPI(url) {
  for (let i = 0; i < 10; i++) {
    try {
      const res = await fetch(url);
      const text = await res.text();
      if (text.includes('Per-minute')) {
        console.log('  ⏳ Rate limited, waiting 60s...');
        await delay(60000);
        continue;
      }
      return JSON.parse(text);
    } catch (e) {
      console.log(`  ⚠️ Retry ${i+1}/10: ${e.message}`);
      await delay(5000);
    }
  }
  return null;
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('           MintMart NFT Minter v1.0');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`\n🎯 Tier: ${TIER.toUpperCase()}`);
  console.log(`📜 Contract: ${DEPLOYER_ADDRESS}.${CONTRACTS[TIER].name}`);
  
  const tierFile = WALLET_FILES[TIER];
  const tierData = JSON.parse(fs.readFileSync(tierFile, 'utf8'));
  const wallets = tierData.wallets.slice(START_FROM, START_FROM + LIMIT);
  
  console.log(`📊 Wallets: ${wallets.length} (from ${START_FROM})\n`);
  
  let minted = 0, failed = 0;

  for (let i = 0; i < wallets.length; i++) {
    const wallet = wallets[i];
    const idx = START_FROM + i;
    
    try {
      // Get nonce
      const nonceData = await fetchAPI(`${API_URL}/extended/v1/address/${wallet.address}/nonces`);
      if (!nonceData) { console.log(`  ❌ [${idx+1}] Could not get nonce`); failed++; continue; }
      
      const tx = await makeContractCall({
        contractAddress: DEPLOYER_ADDRESS,
        contractName: CONTRACTS[TIER].name,
        functionName: 'mint',
        functionArgs: [],
        senderKey: wallet.privateKey,
        network,
        nonce: BigInt(nonceData.possible_next_nonce),
        anchorMode: AnchorMode.Any,
        postConditionMode: PostConditionMode.Allow,
        fee: BigInt(5000)
      });

      const result = await broadcastTransaction(tx, network);

      if (result.error) {
        const err = typeof result.error === 'string' ? result.error : JSON.stringify(result.error);
        if (err.includes('Per-minute') || err.includes('rate')) {
          console.log(`  ⏳ Rate limited at [${idx+1}], waiting 60s...`);
          await delay(60000);
          i--; continue;
        }
        failed++;
        console.log(`  ❌ [${idx+1}/100] ${err.slice(0, 50)}`);
      } else {
        minted++;
        console.log(`  ✅ [${idx+1}/100] Minted: ${wallet.address.slice(0,12)}...`);
      }
      await delay(2500);
    } catch (e) {
      if (e.message?.includes('rate') || e.message?.includes('EAI_AGAIN')) {
        console.log(`  ⏳ Network error, waiting 60s...`);
        await delay(60000);
        i--; continue;
      }
      failed++;
      console.log(`  ❌ [${idx+1}/100] ${e.message?.slice(0,50)}`);
    }
  }

  fs.writeFileSync(`./mint-results-${TIER}.json`, JSON.stringify({
    tier: TIER,
    contract: CONTRACTS[TIER].name,
    timestamp: new Date().toISOString(),
    startedFrom: START_FROM,
    minted, failed
  }, null, 2));

  console.log(`\n═══════════════════════════════════════════════════════════`);
  console.log(`   ✅ Minted: ${minted} | ❌ Failed: ${failed}`);
  console.log(`═══════════════════════════════════════════════════════════\n`);
}

main().catch(e => console.error('Fatal:', e.message));
