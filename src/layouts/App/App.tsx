import React, { FC, ReactNode } from 'react'
import { Footer } from './Footer'
import { Header } from './Header'
import { AccountsProvider, RatesProvider, SettingsProvider, TokenRegistryProvider, WalletProvider } from '../../context'

export const AppLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="App">
      <SettingsProvider>
        <WalletProvider>
          <RatesProvider>
            <TokenRegistryProvider>
              <AccountsProvider>
                <Header />
                {children}
                <Footer />
              </AccountsProvider>
            </TokenRegistryProvider>
          </RatesProvider>
        </WalletProvider>
      </SettingsProvider>
    </div>
  )
}
