import React from 'react'
import { Router } from './Router'
import { AccountsProvider, DarkModeProvider, SettingsProvider, TokenRegistryProvider, WalletProvider } from './context'
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
                <Router />
              </AccountsProvider>
            </TokenRegistryProvider>
          </WalletProvider>
        </SettingsProvider>
      </ThemeProvider>
    </DarkModeProvider>
  )
}
