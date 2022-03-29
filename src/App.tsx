import React from 'react'
import { Router } from './Router'
import {
  AccountsProvider,
  DarkModeProvider,
  SettingsProvider,
  TokenRegistryProvider,
  WalletProvider,
  RewardToggleProvider,
  CryptoProvider
} from './context'
import ThemeProvider from './theme'
import './App.less'

export default function App(): JSX.Element {
  return (
    <DarkModeProvider>
      <ThemeProvider>
        <SettingsProvider>
          <WalletProvider>
            <TokenRegistryProvider>
              <AccountsProvider>
                <RewardToggleProvider>
                  <CryptoProvider>
                    <Router />
                  </CryptoProvider>
                </RewardToggleProvider>
              </AccountsProvider>
            </TokenRegistryProvider>
          </WalletProvider>
        </SettingsProvider>
      </ThemeProvider>
    </DarkModeProvider>
  )
}
