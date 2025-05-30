import {
    useAppKitAccount,
    useDisconnect,
    // useWalletInfo,
    useAppKitProvider
} from "@reown/appkit/react";
import type { Provider } from "@reown/appkit-adapter-solana/react";
import {
    type Adapter,
    type MessageSignerWalletAdapterProps,
    type SignerWalletAdapterProps,
    type SignInMessageSignerWalletAdapterProps,
    type WalletAdapterProps,
    type WalletName,
    type WalletReadyState
} from '@solana/wallet-adapter-base';
import { PublicKey } from '@solana/web3.js';
import { useMemo, useCallback } from "react";

export interface Wallet {
    adapter: Adapter;
    readyState: WalletReadyState;
}

export interface WalletContextState {
    autoConnect: boolean;
    wallets: Wallet[];
    wallet: Wallet | null;
    publicKey: PublicKey | null;
    connecting: boolean;
    connected: boolean;
    disconnecting: boolean;

    select(walletName: WalletName | null): void;
    connect(): Promise<void>;
    disconnect(): Promise<void>;

    sendTransaction: WalletAdapterProps['sendTransaction'];
    signTransaction: SignerWalletAdapterProps['signTransaction'] | undefined;
    signAllTransactions: SignerWalletAdapterProps['signAllTransactions'] | undefined;
    signMessage: MessageSignerWalletAdapterProps['signMessage'] | undefined;
    signIn: SignInMessageSignerWalletAdapterProps['signIn'] | undefined;
}

// type ConnectedWalletInfo = {
//     name: string;
//     icon?: string;
//     type?: string;
//     [key: string]: unknown;
// };


// type UseWalletReturn = {
//     publicKey: PublicKey
//     connected: boolean
//     status: string
//     walletInfo: ConnectedWalletInfo
//     walletProvider: any
//     disconnect: () => Promise<void>
// };

export const useWallet = (): WalletContextState => {
  const { address, isConnected, status } = useAppKitAccount({ namespace: 'solana' })
  const { disconnect } = useDisconnect()
  const { walletProvider } = useAppKitProvider<Provider>('solana')

  const {
    autoConnect = false,
    wallets = [],
    wallet = null,
    select,
    connect,
    sendTransaction,
    signTransaction,
    signAllTransactions,
    signMessage,
    signIn,
    disconnecting = false,
  } = walletProvider || {}

  const disconnectMemo = useCallback(() => disconnect(), [disconnect])

  return useMemo(() => ({
    autoConnect,
    wallets,
    wallet,
    publicKey: address ? new PublicKey(address) : null,
    connecting: status,
    connected: isConnected,
    disconnecting,
    select,
    connect,
    disconnect: disconnectMemo,
    sendTransaction,
    signTransaction,
    signAllTransactions,
    signMessage,
    signIn,
  }), [
    autoConnect,
    wallets,
    wallet,
    address,
    status,
    isConnected,
    disconnecting,
    select,
    connect,
    disconnectMemo,
    sendTransaction,
    signTransaction,
    signAllTransactions,
    signMessage,
    signIn,
  ])
}
