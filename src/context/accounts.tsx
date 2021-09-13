import React, { FC, ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { TOKEN_PROGRAM_ID } from '@project-serum/serum/lib/token-instructions'
import { useWallet } from '@solana/wallet-adapter-react'
import { useConnectionConfig } from './settings'
import { useTokenRegistry } from './token_registry'
import { SOLANA_REGISTRY_TOKEN_MINT } from '../web3'

interface IAccounts {
  [mint: string]: {
    amount: string
    decimals: number
    uiAmount: number
    uiAmountString: string
  }
}

interface IAccountsConfig {
  accounts: IAccounts
  fetching: boolean
}

const AccountsContext = createContext<IAccountsConfig | null>(null)

export const AccountsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { connection } = useConnectionConfig()
  const { tokens: tokenRegistry } = useTokenRegistry()
  const { publicKey } = useWallet()
  const [accounts, setAccounts] = useState<IAccountsConfig>({ accounts: {}, fetching: false })

  useEffect(() => {
    let interval: NodeJS.Timer
    if (publicKey) {
      const fetch = async () => {
        setAccounts(({ accounts }) => ({ accounts, fetching: true }))
        const [parsedAccounts, solAmount] = await Promise.all([
          connection.getParsedTokenAccountsByOwner(publicKey, { programId: TOKEN_PROGRAM_ID }),
          connection.getBalance(publicKey)
        ])
        const accounts = parsedAccounts.value.reduce((acc: IAccounts, { account }) => {
          const { mint, tokenAmount } = account.data.parsed.info
          acc[mint] = tokenAmount
          return acc
        }, {})
        const amount = solAmount.toString()
        const uiAmount = solAmount / 10 ** 9
        accounts[SOLANA_REGISTRY_TOKEN_MINT] = { amount, decimals: 9, uiAmount, uiAmountString: uiAmount.toString() }
        setAccounts(() => ({ accounts, fetching: false }))
      }

      fetch().catch(() => {})
      interval = setInterval(fetch, 10000)
    }

    return () => interval && clearInterval(interval)
  }, [connection, publicKey, tokenRegistry])

  return <AccountsContext.Provider value={accounts}>{children}</AccountsContext.Provider>
}

export const useAccounts = (): IAccountsConfig => {
  const context = useContext(AccountsContext)
  if (!context) {
    throw new Error('Missing accounts context')
  }

  const { accounts, fetching } = context
  return { accounts, fetching }
}
