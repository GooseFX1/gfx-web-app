import React, { createContext, FC, ReactNode, useContext, useMemo, useState } from 'react'
import { getWalletAdapters } from '../utils/wallets'
import { WalletProvider as WalletAdapterProvider } from '@solana/wallet-adapter-react'
import { useConnectionConfig } from './settings'
import { WalletsModal } from '../layouts'
import { WalletAdapterNetwork, WalletReadyState } from '@solana/wallet-adapter-base'
import { WalletConnectWalletAdapter } from '@solana/wallet-adapter-walletconnect'

interface WalletModalContextState {
  visible: boolean
  setVisible: (open: boolean) => void
}

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
  const walletConnect = useMemo(
    () =>
      new WalletConnectWalletAdapter({
        network: network == WalletAdapterNetwork.Testnet ? WalletAdapterNetwork.Devnet : network,
        options: {
          projectId: process.env.REACT_APP_WALLETCONNECT_ID
        }
      }),
    [network]
  )
  const wallets = useMemo(() => {
    const proposedWallets = getWalletAdapters(network)
    proposedWallets.push(walletConnect)
    return proposedWallets.filter((a) => a.readyState !== WalletReadyState.Unsupported)
  }, [network, walletConnect])

  return (
    <WalletAdapterProvider wallets={wallets} localStorageKey="wallet" autoConnect>
      <WalletModalProvider modal={<WalletsModal />}>{children}</WalletModalProvider>
    </WalletAdapterProvider>
  )
}

export const useWalletModal = (): WalletModalContextState => useContext(WalletModalContext)
