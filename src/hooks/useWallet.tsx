import { useMemo, useCallback } from 'react'
import { PublicKey, type Transaction, type VersionedTransaction } from '@solana/web3.js'
import {
  type Adapter,
  type MessageSignerWalletAdapterProps,
  type SignerWalletAdapterProps,
  type SignInMessageSignerWalletAdapterProps,
  type WalletAdapterProps,
  type WalletName,
  type WalletReadyState
} from '@solana/wallet-adapter-base'
import { useWallet as useReactWallet } from '@solana/wallet-adapter-react'
import {
  useAppKitAccount,
  useDisconnect,
  useAppKitProvider
} from '@reown/appkit/react'
import type { Provider } from '@reown/appkit-adapter-solana/react'

export interface Wallet {
  adapter: Adapter
  readyState: WalletReadyState
}

export interface IUseWallet {
  // TODO: Deprecate these
  autoConnect: boolean
  wallets: Wallet[]
  wallet: Wallet | null
  connecting: boolean
  disconnecting: boolean
  select(walletName: WalletName | null): void
  connect(): Promise<void>
  sendTransaction: WalletAdapterProps['sendTransaction']
  signTransaction: SignerWalletAdapterProps['signTransaction'] | undefined
  signAllTransactions: SignerWalletAdapterProps['signAllTransactions'] | undefined
  signMessage: MessageSignerWalletAdapterProps['signMessage'] | undefined
  signIn: SignInMessageSignerWalletAdapterProps['signIn'] | undefined

  // permanent properties
  publicKey: PublicKey | null
  connected: boolean
  disconnect: () => Promise<void>
  // reown wallet adapter provider
  walletProvider: Provider | Adapter | undefined
}

export interface AnchorWallet {
  publicKey: PublicKey
  signTransaction<T extends Transaction | VersionedTransaction>(transaction: T): Promise<T>
  signAllTransactions<T extends Transaction | VersionedTransaction>(transactions: T[]): Promise<T[]>
}

export const useWallet = (): IUseWallet => {
  // https://docs.reown.com/appkit/react/core/hooks#ethereum%2Fsolana-library
  // https://github.com/reown-com/appkit
  const { address, isConnected } = useAppKitAccount({ namespace: 'solana' })
  const { disconnect } = useDisconnect()
  const { walletProvider: appkitWalletProvider } = useAppKitProvider<Provider>('solana')
  const reactWallet = useReactWallet()

  const disconnectMemo = useCallback(() => {
    if (appkitWalletProvider?.publicKey) {
      disconnect()
    } else {
      reactWallet.disconnect()
    }
  }, [disconnect, appkitWalletProvider?.publicKey, reactWallet])

  const publicKey: PublicKey | null = useMemo(() => {
    if (appkitWalletProvider && appkitWalletProvider.publicKey) {
      return appkitWalletProvider.publicKey
    }
    if (reactWallet && reactWallet.publicKey) {
      return reactWallet.publicKey
    }
    return null
  }, [address, appkitWalletProvider, reactWallet])

  const currentWalletProvider = useMemo(() => {
    if (appkitWalletProvider) {
      return appkitWalletProvider
    }
    if (reactWallet && reactWallet.wallet && reactWallet.wallet.adapter) {
      return reactWallet.wallet.adapter
    }
    return undefined
  }, [appkitWalletProvider, reactWallet])

  const connected = isConnected || (reactWallet && reactWallet.connected)

  return useMemo(
    () => ({
      ...reactWallet,
      walletProvider: currentWalletProvider,
      publicKey,
      connected,
      disconnect: disconnectMemo
    }),
    [disconnectMemo, currentWalletProvider, publicKey, connected, reactWallet]
  )
}
