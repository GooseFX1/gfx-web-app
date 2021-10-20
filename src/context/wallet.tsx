import React, { createContext, FC, ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import {
  getLedgerWallet,
  getMathWallet,
  getPhantomWallet,
  getSolflareWallet,
  getSolletWallet,
  getSolongWallet,
  getSlopeWallet,
  getTorusWallet
} from '@solana/wallet-adapter-wallets'
import { useWallet, WalletProvider as WalletAdapterProvider } from '@solana/wallet-adapter-react'
import { useConnectionConfig } from './settings'
import { WalletsModal } from '../layouts/App/WalletsModal'

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
  const { disconnect } = useWallet()

  const wallets = useMemo(
    () => [
      getPhantomWallet(),
      getSolflareWallet(),
      getLedgerWallet(),
      getMathWallet(),
      getSolongWallet(),
      getSlopeWallet(),
      getTorusWallet({
        options: { clientId: 'Get a client ID @ https://developer.tor.us' }
      }),
      getSolletWallet({ network })
    ],
    [network]
  )

  useEffect(() => {
    disconnect && disconnect().catch()
  }, [disconnect, network])

  return (
    <WalletAdapterProvider wallets={wallets} autoConnect localStorageKey="wallet">
      <WalletModalProvider modal={<WalletsModal />}>{children}</WalletModalProvider>
    </WalletAdapterProvider>
  )
}

export const useWalletModal = (): WalletModalContextState => {
  return useContext(WalletModalContext)
}
