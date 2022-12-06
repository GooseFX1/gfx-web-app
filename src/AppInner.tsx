import React from 'react'
import { Router } from './Router'
import {
  AccountsProvider,
  DarkModeProvider,
  SettingsProvider,
  TokenRegistryProvider,
  WalletProvider,
  RewardToggleProvider,
  CryptoProvider,
  useRPCContext
} from './context'
import ThemeProvider from './theme'
import './App.less'

export default function AppInner(): JSX.Element {
  const { rpcHealth } = useRPCContext()
  return rpcHealth ? (
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
  ) : null
}
