'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { STACKS_MAINNET } from '@stacks/network';

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  connect: () => void;
  disconnect: () => void;
  userSession: UserSession | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const network = STACKS_MAINNET;

// Create app config and user session lazily to avoid SSR issues
let appConfig: AppConfig | null = null;
let userSession: UserSession | null = null;

function getAppConfig() {
  if (!appConfig) {
    appConfig = new AppConfig(['store_write', 'publish_data']);
  }
  return appConfig;
}

function getUserSession() {
  if (!userSession) {
    userSession = new UserSession({ appConfig: getAppConfig() });
  }
  return userSession;
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [session, setSession] = useState<UserSession | null>(null);

  // Check if user is already signed in - use useEffect, not useState
  useEffect(() => {
    const currentSession = getUserSession();
    setSession(currentSession);
    
    if (currentSession.isUserSignedIn()) {
      const userData = currentSession.loadUserData();
      setIsConnected(true);
      setAddress(userData.profile.stxAddress.mainnet);
    }
  }, []);

  const connect = useCallback(() => {
    const currentSession = getUserSession();
    showConnect({
      appDetails: {
        name: 'MintMart',
        icon: '/logo.png',
      },
      redirectTo: '/',
      onFinish: () => {
        const userData = currentSession.loadUserData();
        setIsConnected(true);
        setAddress(userData.profile.stxAddress.mainnet);
        window.location.reload();
      },
      userSession: currentSession,
    });
  }, []);

  const disconnect = useCallback(() => {
    const currentSession = getUserSession();
    currentSession.signUserOut();
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
        userSession: session,
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
