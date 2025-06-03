import { useMemo, useCallback } from 'react'
import { PublicKey } from '@solana/web3.js'
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

export interface WalletContextState {
  autoConnect: boolean
  wallets: Wallet[]
  wallet: Wallet | null
  publicKey: PublicKey | null
  connecting: boolean
  connected: boolean
  disconnecting: boolean

  select(walletName: WalletName | null): void
  connect(): Promise<void>
  disconnect(): Promise<void>

  sendTransaction: WalletAdapterProps['sendTransaction']
  signTransaction: SignerWalletAdapterProps['signTransaction'] | undefined
  signAllTransactions: SignerWalletAdapterProps['signAllTransactions'] | undefined
  signMessage: MessageSignerWalletAdapterProps['signMessage'] | undefined
  signIn: SignInMessageSignerWalletAdapterProps['signIn'] | undefined
  walletProvider: Provider | undefined
}

export const useWallet = (): WalletContextState => {
  // https://docs.reown.com/appkit/react/core/hooks#ethereum%2Fsolana-library
  // https://github.com/reown-com/appkit
  const { address, isConnected, status } = useAppKitAccount({ namespace: 'solana' })
  const { disconnect } = useDisconnect()
  const { walletProvider } = useAppKitProvider<Provider>('solana')
  const reactWallet = useReactWallet()

  const disconnectMemo = useCallback(() => {
    disconnect()
  }, [disconnect])

  return useMemo(
    () => ({
      ...reactWallet,
      walletProvider,
      publicKey: address ? new PublicKey(address) : null,
      connecting: status.includes('connecting'),
      connected: isConnected,
      disconnect: disconnectMemo
    }),
    [walletProvider, address, isConnected, status, disconnectMemo, reactWallet]
  )
}
