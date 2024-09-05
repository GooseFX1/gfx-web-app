import React, { createContext, useState, useContext, useCallback } from 'react';
import { Connection, EpochInfo } from '@solana/web3.js';
import { useConnectionConfig } from '@/context';

interface EpochInfoContextType {
  getEpochInfo: () => Promise<EpochInfo | undefined>;
  epochInfo: EpochInfo | null;
}

const EpochInfoContext = createContext<EpochInfoContextType | undefined>(undefined);

async function retry<T>(fn: () => Promise<T>, retries: number = 3): Promise<T> {
  let result: T;
  while (retries > 0) {
    try {
      result = await fn();
      return result;
    } catch (error) {
      retries--;
      if (retries === 0) throw error;
    }
  }
  return result as T;
}

let epochInfoCache = { time: 0, loading: false };

export const EpochInfoProvider: React.FC = ({ children }) => {
  const [epochInfo, setEpochInfo] = useState<EpochInfo | null>(null); 
  const { connection } = useConnectionConfig(); 

  const getEpochInfo = useCallback(async () => {
    if (!connection) return undefined;

    if (epochInfo && Date.now() - epochInfoCache.time <= 30 * 1000) {
      return epochInfo;
    }

    if (epochInfoCache.loading) {
      return epochInfo;
    }

    epochInfoCache.loading = true;
    try {
      const newEpochInfo = await retry(() => connection.getEpochInfo());
      epochInfoCache = { time: Date.now(), loading: false };
      setEpochInfo(newEpochInfo); 
      return newEpochInfo;
    } catch (error) {
      epochInfoCache.loading = false;
      throw error;
    }
  }, [connection, epochInfo]);

  return (
    <EpochInfoContext.Provider value={{ getEpochInfo, epochInfo }}>
      {children}
    </EpochInfoContext.Provider>
  );
};

export const useEpochInfo = (): EpochInfoContextType => {
  const context = useContext(EpochInfoContext);
  if (!context) {
    throw new Error('useEpochInfo must be used within an EpochInfoProvider');
  }
  return context;
};
