import {
    useAppKitAccount,
    useDisconnect,
    useWalletInfo,
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
    type WalletReadyState,
} from '@solana/wallet-adapter-base';
import { PublicKey } from '@solana/web3.js';

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

type ConnectedWalletInfo = {
    name: string;
    icon?: string;
    type?: string;
    [key: string]: unknown;
};

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

type UseWalletReturn = {
    publicKey: PublicKey
    connected: boolean
    status: string
    walletInfo: ConnectedWalletInfo
    walletProvider: any
    disconnect: () => Promise<void>
};

const useWallet = (): UseWalletReturn => {
    const { address, isConnected, status } = useAppKitAccount();
    const publicKey = address ? new PublicKey(address) : null;
    const { disconnect } = useDisconnect();
    const { walletInfo } = useWalletInfo();
    const { walletProvider } = useAppKitProvider<Provider>('solana')
    console.log({walletProvider})

    return {
        publicKey,
        connected: isConnected,
        status,
        walletInfo,
        walletProvider,
        disconnect
    }
}

export default useWallet;