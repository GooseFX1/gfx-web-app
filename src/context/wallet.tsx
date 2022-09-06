import React, { createContext, FC, ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { getWalletAdapters } from '../utils/wallets'
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

  const wallets = useMemo(() => getWalletAdapters(network), [network])

  useEffect(() => {
    disconnect && disconnect().catch()
  }, [disconnect, network])

  return (
    <WalletAdapterProvider wallets={wallets} localStorageKey="wallet">
      <WalletModalProvider modal={<WalletsModal />}>{children}</WalletModalProvider>
    </WalletAdapterProvider>
  )
}

export const useWalletModal = (): WalletModalContextState => useContext(WalletModalContext)
