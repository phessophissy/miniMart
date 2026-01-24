/**
 * MintMart Wallet Funder
 */
import {
  makeSTXTokenTransfer,
  broadcastTransaction,
  AnchorMode,
  getAddressFromPrivateKey,
  TransactionVersion
} from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';
import { generateWallet } from '@stacks/wallet-sdk';
import fetch from 'node-fetch';
import fs from 'fs';
import dotenv from 'dotenv';
import { CONTRACTS } from './config.js';

dotenv.config();

const API_URL = 'https://api.hiro.so';
const network = new StacksMainnet({ url: API_URL });
const START_FROM = parseInt(process.env.START_FROM || '0');

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
  console.log('           MintMart Wallet Funder v1.0');
  console.log('═══════════════════════════════════════════════════════════');

  const mnemonic = process.env.FUNDER_MNEMONIC;
  if (!mnemonic) { console.error('❌ FUNDER_MNEMONIC not set'); process.exit(1); }

  const wallet = await generateWallet({ secretKey: mnemonic, password: '' });
  const privateKey = wallet.accounts[0].stxPrivateKey;
  const address = getAddressFromPrivateKey(privateKey, TransactionVersion.Mainnet);

  console.log(`\n📍 Funder: ${address}`);

  const balData = await fetchAPI(`${API_URL}/extended/v1/address/${address}/balances`);
  if (!balData?.stx) { console.error('❌ Could not fetch balance'); process.exit(1); }
  console.log(`💰 Balance: ${(parseInt(balData.stx.balance) / 1e6).toFixed(4)} STX`);

  const allWallets = JSON.parse(fs.readFileSync('./wallets/all-wallets.json', 'utf8')).wallets.slice(START_FROM);
  console.log(`📊 Wallets: ${allWallets.length} (from ${START_FROM})`);

  const nonceData = await fetchAPI(`${API_URL}/extended/v1/address/${address}/nonces`);
  if (!nonceData) { console.error('❌ Could not fetch nonce'); process.exit(1); }
  let nonce = nonceData.possible_next_nonce;
  console.log(`🔢 Nonce: ${nonce}\n`);

  let funded = 0, failed = 0;

  for (let i = 0; i < allWallets.length; i++) {
    const w = allWallets[i];
    const idx = START_FROM + i;
    const amount = CONTRACTS[w.tier]?.fundAmount;
    
    if (!amount) { console.log(`  ⚠️ [${idx+1}] Unknown tier`); continue; }

    try {
      const tx = await makeSTXTokenTransfer({
        recipient: w.address,
        amount: BigInt(amount),
        senderKey: privateKey,
        network,
        nonce: BigInt(nonce),
        anchorMode: AnchorMode.Any,
        fee: BigInt(2000)
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
        console.log(`  ❌ [${idx+1}/500] ${err.slice(0, 50)}`);
      } else {
        funded++;
        nonce++;
        console.log(`  ✅ [${idx+1}/500] ${w.tier}: ${w.address.slice(0,12)}...`);
      }
      await delay(2500);
    } catch (e) {
      if (e.message?.includes('rate') || e.message?.includes('EAI_AGAIN')) {
        console.log(`  ⏳ Network error, waiting 60s...`);
        await delay(60000);
        i--; continue;
      }
      failed++;
      console.log(`  ❌ [${idx+1}/500] ${e.message?.slice(0,50)}`);
    }
  }

  console.log(`\n═══════════════════════════════════════════════════════════`);
  console.log(`   ✅ Funded: ${funded} | ❌ Failed: ${failed}`);
  console.log(`═══════════════════════════════════════════════════════════\n`);
}

main().catch(e => console.error('Fatal:', e.message));
