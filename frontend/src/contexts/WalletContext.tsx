'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { StacksMainnet } from '@stacks/network';

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  connect: () => void;
  disconnect: () => void;
  userSession: UserSession | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

export const network = new StacksMainnet();

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  // Check if user is already signed in
  useState(() => {
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      setIsConnected(true);
      setAddress(userData.profile.stxAddress.mainnet);
    }
  });

  const connect = useCallback(() => {
    showConnect({
      appDetails: {
        name: 'MintMart',
        icon: '/logo.png',
      },
      redirectTo: '/',
      onFinish: () => {
        const userData = userSession.loadUserData();
        setIsConnected(true);
        setAddress(userData.profile.stxAddress.mainnet);
        window.location.reload();
      },
      userSession,
    });
  }, []);

  const disconnect = useCallback(() => {
    userSession.signUserOut();
    setIsConnected(false);
    setAddress(null);
  }, []);

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        address,
        connect,
        disconnect,
        userSession,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
