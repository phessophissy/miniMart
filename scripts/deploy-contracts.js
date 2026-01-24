/**
 * MintMart Contract Deployment Script
 * Deploys all 5 NFT contracts to Stacks mainnet
 * 
 * Deployer: SP2KYZRNME33Y39GP3RKC90DQJ45EF1N0NZNVRE09
 */
import {
  makeContractDeploy,
  broadcastTransaction,
  AnchorMode
} from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { CONTRACTS, DEPLOYER_ADDRESS, API_URL } from './config.js';

dotenv.config();

const network = new StacksMainnet({ url: API_URL });

const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY;

if (!DEPLOYER_PRIVATE_KEY) {
  console.error('❌ DEPLOYER_PRIVATE_KEY not found in .env file');
  process.exit(1);
}

/**
 * Delay helper
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Get deployer nonce
 */
async function getDeployerNonce() {
  const response = await fetch(`${API_URL}/extended/v1/address/${DEPLOYER_ADDRESS}/nonces`);
  const data = await response.json();
  return data.possible_next_nonce;
}

/**
 * Deploy a single contract
 */
async function deployContract(name, sourceFile, nonce) {
  const contractPath = path.join('./contracts', sourceFile);
  const codeBody = fs.readFileSync(contractPath, 'utf8');
  
  console.log(`\n📜 Deploying ${name}...`);
  console.log(`   Source: ${contractPath}`);
  console.log(`   Size: ${codeBody.length} bytes`);
  
  const txOptions = {
    contractName: name,
    codeBody,
    senderKey: DEPLOYER_PRIVATE_KEY,
    network,
    nonce: BigInt(nonce),
    anchorMode: AnchorMode.Any,
    fee: BigInt(100000) // 0.1 STX deployment fee
  };

  const transaction = await makeContractDeploy(txOptions);
  const broadcastResponse = await broadcastTransaction(transaction, network);
  
  if (broadcastResponse.error) {
    console.log(`   ❌ Failed: ${broadcastResponse.error}`);
    return { success: false, error: broadcastResponse.error };
  }
  
  const contractAddress = `${DEPLOYER_ADDRESS}.${name}`;
  console.log(`   ✅ Deployed: ${contractAddress}`);
  console.log(`   📝 TX: ${broadcastResponse.txid}`);
  
  return {
    success: true,
    name,
    address: contractAddress,
    txid: broadcastResponse.txid
  };
}

/**
 * Main deployment function
 */
async function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('           MintMart Contract Deployer v1.0');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`\n🚀 Deploying contracts to Stacks Mainnet`);
  console.log(`📍 Deployer: ${DEPLOYER_ADDRESS}`);
  
  // Check deployer balance
  const balanceResponse = await fetch(`${API_URL}/extended/v1/address/${DEPLOYER_ADDRESS}/stx`);
  const balanceData = await balanceResponse.json();
  const balance = parseInt(balanceData.balance) / 1000000;
  
  console.log(`💰 Deployer balance: ${balance.toFixed(4)} STX`);
  
  // Each contract deployment costs ~0.1 STX
  const requiredBalance = 5 * 0.1;
  if (balance < requiredBalance) {
    console.error(`\n❌ Insufficient balance for deployment!`);
    console.error(`   Need: ${requiredBalance} STX`);
    console.error(`   Have: ${balance.toFixed(4)} STX`);
    process.exit(1);
  }
  
  // Get starting nonce
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
      const result = await deployContract(contract.name, contract.file, currentNonce);
      results.push(result);
      currentNonce++;
      
      // Wait between deployments
      await delay(2000);
    } catch (error) {
      console.log(`   ❌ Error deploying ${contract.name}: ${error.message}`);
      results.push({
        success: false,
        name: contract.name,
        error: error.message
      });
    }
  }
  
  // Save deployment results
  const deploymentResults = {
    network: 'mainnet',
    deployer: DEPLOYER_ADDRESS,
    timestamp: new Date().toISOString(),
    contracts: results
  };
  
  fs.writeFileSync('./deployment-results.json', JSON.stringify(deploymentResults, null, 2));
  
  // Summary
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('                  DEPLOYMENT COMPLETE');
  console.log('═══════════════════════════════════════════════════════════');
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`   ✅ Deployed: ${successful.length} contracts`);
  console.log(`   ❌ Failed: ${failed.length} contracts`);
  
  if (successful.length > 0) {
    console.log('\n📋 Contract Addresses:');
    for (const result of successful) {
      console.log(`   ${result.name}: ${result.address}`);
    }
  }
  
  console.log('\n💾 Results saved to deployment-results.json');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  // Generate .env updates
  if (successful.length > 0) {
    console.log('📝 Add these to your .env file:\n');
    for (const result of successful) {
      const envKey = result.name.toUpperCase().replace(/-/g, '_') + '_ADDRESS';
      console.log(`${envKey}=${result.address}`);
    }
    console.log('');
  }
}

main().catch(console.error);
