import React, { createContext, FC, ReactNode, useContext, useMemo, useState } from 'react'
import { WalletProvider as WalletAdapterProvider } from '@solana/wallet-adapter-react'
import { useConnectionConfig } from './settings'
import { WalletsModal } from '../layouts'
import { WalletAdapter, WalletAdapterNetwork, WalletReadyState } from '@solana/wallet-adapter-base'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare'
import { LedgerWalletAdapter } from '@solana/wallet-adapter-ledger'
import { CoinbaseWalletAdapter } from '@solana/wallet-adapter-coinbase'

import { WalletConnectWalletAdapter } from '@walletconnect/solana-adapter'
import { MoongateWalletAdapter } from '@moongate/moongate-adapter'
import {
  createDefaultAddressSelector,
  createDefaultAuthorizationResultCache,
  createDefaultWalletNotFoundHandler,
  SolanaMobileWalletAdapter
} from '@solana-mobile/wallet-adapter-mobile'

interface WalletModalContextState {
  visible: boolean
  setVisible: (open: boolean) => void
}

const getWalletAdapters = (network: WalletAdapterNetwork): WalletAdapter[] => [
  new SolanaMobileWalletAdapter({
    addressSelector: createDefaultAddressSelector(),
    appIdentity: {
      name: 'GooseFX',
      uri: 'https://app.goosefx.io/',
      icon: '/img/crypto/GOFX.svg'
    },
    authorizationResultCache: createDefaultAuthorizationResultCache(),
    cluster: network,
    onWalletNotFound: createDefaultWalletNotFoundHandler()
  }),
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter({ network }),
  new MoongateWalletAdapter({ position: 'bottom-right' }),
  new LedgerWalletAdapter(),
  new WalletConnectWalletAdapter({
    network: WalletAdapterNetwork.Mainnet,
    options: {
      projectId: 'bd4997ce3ede37c95770ba10a3804dad'
    }
  }),
  new CoinbaseWalletAdapter()
]


const WalletModalContext = createContext<WalletModalContextState>({} as WalletModalContextState)

const WalletModalProvider: FC<{ children: ReactNode; modal: ReactNode }> = ({ children, modal }) => {
  const [visible, setVisible] = useState(false)

  return (
    <WalletModalContext.Provider value={{ visible, setVisible }}>
      {children}
      {modal}
    </WalletModalContext.Provider>
  )
}

export const WalletProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { network } = useConnectionConfig()

  const wallets = useMemo(() => {
    const proposedWallets = getWalletAdapters(network)
    return proposedWallets.filter((a) => a.readyState !== WalletReadyState.Unsupported)
  }, [network])

  return (
    <WalletAdapterProvider wallets={wallets} localStorageKey="wallet" autoConnect={true}>
      <WalletModalProvider modal={<WalletsModal />}>{children}</WalletModalProvider>
    </WalletAdapterProvider>
  )
}

export const useWalletModal = (): WalletModalContextState => useContext(WalletModalContext)
