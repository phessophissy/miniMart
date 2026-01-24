'use client';

import { useState, useCallback } from 'react';
import {
  makeContractCall,
  PostConditionMode,
  FungibleConditionCode,
  makeStandardSTXPostCondition,
  AnchorMode,
} from '@stacks/transactions';
import { openContractCall } from '@stacks/connect';
import { useWallet, network } from '@/contexts/WalletContext';

interface ContractConfig {
  address: string;
  name: string;
  mintPrice: number;
}

const CONTRACTS: Record<string, ContractConfig> = {
  common: {
    address: 'SP2KYZRNME33Y39GP3RKC90DQJ45EF1N0NZNVRE09',
    name: 'common-collectible',
    mintPrice: 10000, // 0.01 STX
  },
  rare: {
    address: 'SP2KYZRNME33Y39GP3RKC90DQJ45EF1N0NZNVRE09',
    name: 'rare-collectible',
    mintPrice: 35000, // 0.035 STX
  },
  epic: {
    address: 'SP2KYZRNME33Y39GP3RKC90DQJ45EF1N0NZNVRE09',
    name: 'epic-collectible',
    mintPrice: 50000, // 0.05 STX
  },
  legendary: {
    address: 'SP2KYZRNME33Y39GP3RKC90DQJ45EF1N0NZNVRE09',
    name: 'legendary-collectible',
    mintPrice: 70000, // 0.07 STX
  },
  ultimate: {
    address: 'SP2KYZRNME33Y39GP3RKC90DQJ45EF1N0NZNVRE09',
    name: 'ultimate-collectible',
    mintPrice: 100000, // 0.1 STX
  },
};

interface MintResult {
  success: boolean;
  txId?: string;
  error?: string;
}

export function useMint() {
  const { address, isConnected } = useWallet();
  const [isMinting, setIsMinting] = useState(false);
  const [mintingTier, setMintingTier] = useState<string | null>(null);

  const mint = useCallback(
    async (tier: string): Promise<MintResult> => {
      if (!isConnected || !address) {
        return { success: false, error: 'Wallet not connected' };
      }

      const contract = CONTRACTS[tier];
      if (!contract) {
        return { success: false, error: 'Invalid tier' };
      }

      setIsMinting(true);
      setMintingTier(tier);

      try {
        // Post condition: user sends exact mint price
        const postConditions = [
          makeStandardSTXPostCondition(
            address,
            FungibleConditionCode.Equal,
            BigInt(contract.mintPrice)
          ),
        ];

        await openContractCall({
          network,
          contractAddress: contract.address,
          contractName: contract.name,
          functionName: 'mint',
          functionArgs: [],
          postConditions,
          postConditionMode: PostConditionMode.Deny,
          anchorMode: AnchorMode.Any,
          onFinish: (data) => {
            console.log('Mint transaction:', data.txId);
          },
          onCancel: () => {
            console.log('Mint cancelled');
          },
        });

        return { success: true };
      } catch (error) {
        console.error('Mint error:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Mint failed',
        };
      } finally {
        setIsMinting(false);
        setMintingTier(null);
      }
    },
    [address, isConnected]
  );

  return {
    mint,
    isMinting,
    mintingTier,
  };
}
