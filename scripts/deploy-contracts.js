/**
 * MintMart Contract Deployment Script
 * Deploys all 5 NFT contracts to Stacks mainnet
 */
import {
  makeContractDeploy,
  broadcastTransaction,
  AnchorMode
} from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';
import { generateWallet } from '@stacks/wallet-sdk';
import fetch from 'node-fetch';
import https from 'https';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { DEPLOYER_ADDRESS } from './config.js';

dotenv.config();

// Use Hiro API directly
const API_URL = 'https://api.hiro.so';
const network = new StacksMainnet({ url: API_URL });

const DEPLOYER_MNEMONIC = process.env.DEPLOYER_MNEMONIC;

if (!DEPLOYER_MNEMONIC) {
  console.error('❌ DEPLOYER_MNEMONIC not found in .env file');
  process.exit(1);
}

// Custom fetch with agent
const agent = new https.Agent({ rejectUnauthorized: false });

async function fetchAPI(url) {
  const response = await fetch(url, { agent });
  return response.json();
}

async function getPrivateKeyFromMnemonic(mnemonic) {
  const wallet = await generateWallet({
    secretKey: mnemonic,
    password: ''
  });
  const account = wallet.accounts[0];
  return account.stxPrivateKey;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getDeployerNonce() {
  const data = await fetchAPI(`${API_URL}/extended/v1/address/${DEPLOYER_ADDRESS}/nonces`);
  return data.possible_next_nonce;
}

async function deployContract(name, sourceFile, nonce, privateKey) {
  const contractPath = path.join('./contracts', sourceFile);
  const codeBody = fs.readFileSync(contractPath, 'utf8');
  
  console.log(`\n📜 Deploying ${name}...`);
  console.log(`   Source: ${contractPath}`);
  console.log(`   Size: ${codeBody.length} bytes`);
  
  const txOptions = {
    contractName: name,
    codeBody,
    senderKey: privateKey,
    network,
    nonce: BigInt(nonce),
    anchorMode: AnchorMode.Any,
    fee: BigInt(100000)
  };

  const transaction = await makeContractDeploy(txOptions);
  const broadcastResponse = await broadcastTransaction(transaction, network);
  
  if (broadcastResponse.error) {
    console.log(`   ❌ Failed: ${broadcastResponse.error}`);
    return { success: false, error: broadcastResponse.error };
  }
  
  const contractAddress = `${DEPLOYER_ADDRESS}.${name}`;
  console.log(`   ✅ Broadcast: ${contractAddress}`);
  console.log(`   📝 TX: ${broadcastResponse.txid}`);
  
  return {
    success: true,
    name,
    address: contractAddress,
    txid: broadcastResponse.txid
  };
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('           MintMart Contract Deployer v1.0');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`\n🚀 Deploying contracts to Stacks Mainnet`);
  console.log(`📍 Deployer: ${DEPLOYER_ADDRESS}`);
  
  console.log(`\n🔑 Deriving private key from mnemonic...`);
  const privateKey = await getPrivateKeyFromMnemonic(DEPLOYER_MNEMONIC);
  console.log(`   ✅ Key derived successfully`);
  
  const balanceData = await fetchAPI(`${API_URL}/extended/v1/address/${DEPLOYER_ADDRESS}/stx`);
  const balance = parseInt(balanceData.balance) / 1000000;
  
  console.log(`💰 Deployer balance: ${balance.toFixed(4)} STX`);
  
  const requiredBalance = 5 * 0.1;
  if (balance < requiredBalance) {
    console.error(`\n❌ Insufficient balance! Need: ${requiredBalance} STX, Have: ${balance.toFixed(4)} STX`);
    process.exit(1);
  }
  
  let currentNonce = await getDeployerNonce();
  console.log(`\n🔢 Starting nonce: ${currentNonce}`);
  
  const contracts = [
    { name: 'common-collectible', file: 'common-collectible.clar' },
    { name: 'rare-collectible', file: 'rare-collectible.clar' },
    { name: 'epic-collectible', file: 'epic-collectible.clar' },
    { name: 'legendary-collectible', file: 'legendary-collectible.clar' },
    { name: 'ultimate-collectible', file: 'ultimate-collectible.clar' }
  ];
  
  const results = [];
  
  for (const contract of contracts) {
    try {
      const result = await deployContract(contract.name, contract.file, currentNonce, privateKey);
      results.push(result);
      currentNonce++;
      await delay(2000);
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      results.push({ success: false, name: contract.name, error: error.message });
    }
  }
  
  fs.writeFileSync('./deployment-results.json', JSON.stringify({
    network: 'mainnet',
    deployer: DEPLOYER_ADDRESS,
    timestamp: new Date().toISOString(),
    contracts: results
  }, null, 2));
  
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('                  DEPLOYMENT COMPLETE');
  console.log('═══════════════════════════════════════════════════════════');
  
  const successful = results.filter(r => r.success);
  console.log(`   ✅ Deployed: ${successful.length}/5 contracts`);
  
  if (successful.length > 0) {
    console.log('\n📋 Contract Addresses:');
    for (const r of successful) {
      console.log(`   ${r.name}: ${r.address}`);
    }
  }
  console.log('\n💾 Results saved to deployment-results.json\n');
}

main().catch(console.error);
