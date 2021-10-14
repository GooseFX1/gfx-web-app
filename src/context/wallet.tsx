import React, { createContext, FC, ReactNode, useContext, useMemo, useState } from 'react'
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
import { WalletProvider as WalletAdapterProvider } from '@solana/wallet-adapter-react'
import { WalletsModal } from '../layouts/App/WalletsModal'
import { useConnectionConfig } from './settings'

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

  return (
    <WalletAdapterProvider wallets={wallets} autoConnect>
      <WalletModalProvider modal={<WalletsModal />}>{children}</WalletModalProvider>
    </WalletAdapterProvider>
  )
}

export const useWalletModal = (): WalletModalContextState => {
  return useContext(WalletModalContext)
}
