'use client';

import { useState, useEffect, useCallback } from 'react';
import { callReadOnlyFunction, cvToJSON, ClarityType } from '@stacks/transactions';
import { network } from '@/contexts/WalletContext';

const API_URL = 'https://stacks-node-api.mainnet.stacks.co';

interface ContractState {
  lastTokenId: number;
  maxSupply: number;
  mintPrice: number;
  available: number;
}

const DEPLOYER = 'SP2KYZRNME33Y39GP3RKC90DQJ45EF1N0NZNVRE09';

const CONTRACT_NAMES = {
  common: 'common-collectible',
  rare: 'rare-collectible',
  epic: 'epic-collectible',
  legendary: 'legendary-collectible',
  ultimate: 'ultimate-collectible',
};

export function useContractRead(tier: string) {
  const [state, setState] = useState<ContractState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContractState = useCallback(async () => {
    const contractName = CONTRACT_NAMES[tier as keyof typeof CONTRACT_NAMES];
    if (!contractName) {
      setError('Invalid tier');
      return;
    }

    try {
      setLoading(true);

      // Fetch last token ID
      const lastTokenIdResponse = await callReadOnlyFunction({
        contractAddress: DEPLOYER,
        contractName,
        functionName: 'get-last-token-id',
        functionArgs: [],
        network,
        senderAddress: DEPLOYER,
      });

      // Fetch max supply
      const maxSupplyResponse = await callReadOnlyFunction({
        contractAddress: DEPLOYER,
        contractName,
        functionName: 'get-max-supply',
        functionArgs: [],
        network,
        senderAddress: DEPLOYER,
      });

      // Fetch mint price
      const mintPriceResponse = await callReadOnlyFunction({
        contractAddress: DEPLOYER,
        contractName,
        functionName: 'get-mint-price',
        functionArgs: [],
        network,
        senderAddress: DEPLOYER,
      });

      const lastTokenId = parseInt(cvToJSON(lastTokenIdResponse).value.value);
      const maxSupply = parseInt(cvToJSON(maxSupplyResponse).value.value);
      const mintPrice = parseInt(cvToJSON(mintPriceResponse).value.value);

      setState({
        lastTokenId,
        maxSupply,
        mintPrice,
        available: maxSupply - lastTokenId,
      });
    } catch (err) {
      console.error('Error fetching contract state:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  }, [tier]);

  useEffect(() => {
    fetchContractState();
  }, [fetchContractState]);

  return {
    state,
    loading,
    error,
    refetch: fetchContractState,
  };
}
