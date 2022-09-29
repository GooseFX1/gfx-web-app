import React, { useEffect } from 'react'
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
import { checkMobile } from './utils'
import { logData } from './api'

export default function App(): JSX.Element {
  useEffect(() => {
    if (checkMobile()) logData('mobile_view')
  }, [])

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
