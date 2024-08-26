import React, { useEffect } from 'react'
import { Router } from './Router'
import { DarkModeProvider, SettingsProvider, useConnectionConfig, WalletProvider } from './context'
import ThemeProvider from './theme'
import queryString from 'query-string'
import WalletBalanceProvider from '@/context/walletBalanceContext'

export default function AppInner(): JSX.Element {
  // init cache at highest level
  useConnectionConfig()

  useEffect(() => {
    const values = queryString.parse(window.location?.search)
    if (values.r && !localStorage.getItem('referrer')) {
      localStorage.setItem('referrer', values.r as string)
    }
  })

  useEffect(() => {
    const values = queryString.parse(window.location?.search)

    console.log(window.location, values)
  }, [])

  return (
    <DarkModeProvider>
      <ThemeProvider>
        <SettingsProvider>
          <WalletProvider>
            <WalletBalanceProvider>
              <Router />
            </WalletBalanceProvider>
          </WalletProvider>
        </SettingsProvider>
      </ThemeProvider>
    </DarkModeProvider>
  )
}
