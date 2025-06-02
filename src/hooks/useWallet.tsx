import { useMemo, useCallback, useEffect } from 'react'
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
  const { address, isConnected, status, embeddedWalletInfo } = useAppKitAccount({ namespace: 'solana' })
  const { disconnect } = useDisconnect()
  const { walletProvider } = useAppKitProvider<Provider>('solana')
  const reactWallet = useReactWallet()

  useEffect(() => {
    console.log('WALLET PROVIDER', walletProvider, isConnected)
    console.log('EMBEDDED WALLET INFO', embeddedWalletInfo)
    console.log('REACT WALLET', reactWallet)
  }, [reactWallet, walletProvider, embeddedWalletInfo])

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
