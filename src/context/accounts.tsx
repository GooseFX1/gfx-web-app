import React, {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'
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
  balances: IAccounts
  fetching: boolean
  getAmount: (x: string) => string
  getUIAmount: (x: string) => number
  getUIAmountString: (x: string) => string
  setBalances: Dispatch<SetStateAction<IAccounts>>
  setFetching: Dispatch<SetStateAction<boolean>>
}

const AccountsContext = createContext<IAccountsConfig | null>(null)

export const AccountsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { connection } = useConnectionConfig()
  const { tokens: tokenRegistry } = useTokenRegistry()
  const { publicKey } = useWallet()
  const [balances, setBalances] = useState<IAccounts>({})
  const [fetching, setFetching] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timer
    if (publicKey) {
      const fetch = async () => {
        setFetching(true)
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
        setBalances(accounts)
        setFetching(false)
      }

      fetch().catch(() => {})
      interval = setInterval(fetch, 10000)
    }

    return () => interval && clearInterval(interval)
  }, [connection, publicKey, tokenRegistry])

  return (
    <AccountsContext.Provider
      value={{
        balances,
        fetching,
        getAmount: useCallback((address: string) => balances[address]?.amount || '0', [balances]),
        getUIAmount: useCallback((address: string) => balances[address]?.uiAmount || 0, [balances]),
        getUIAmountString: useCallback((address: string) => balances[address]?.uiAmountString || '0', [balances]),
        setBalances,
        setFetching
      }}
    >
      {children}
    </AccountsContext.Provider>
  )
}

export const useAccounts = (): IAccountsConfig => {
  const context = useContext(AccountsContext)
  if (!context) {
    throw new Error('Missing accounts context')
  }

  const { balances, fetching, getAmount, getUIAmount, getUIAmountString, setBalances, setFetching } = context
  return { balances, fetching, getAmount, getUIAmount, getUIAmountString, setBalances, setFetching }
}
