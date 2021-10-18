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
import { TOKEN_PROGRAM_ID, WRAPPED_SOL_MINT } from '@project-serum/serum/lib/token-instructions'
import { useWallet } from '@solana/wallet-adapter-react'
import { Connection, PublicKey } from '@solana/web3.js'
import { useConnectionConfig } from './settings'
import { useTokenRegistry } from './token_registry'
import { findAssociatedTokenAddress } from '../web3'
import { notify } from '../utils'

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
  fetchAccounts: (x: PublicKey) => number[]
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

  const handleAccountChange = async (sub: number[], connection: Connection, owner: PublicKey, mint: PublicKey) => {
    const associatedTokenAddress = await findAssociatedTokenAddress(owner, mint)
    sub.push(
      connection.onAccountChange(associatedTokenAddress, async () => {
        const [{ account }] = (await connection.getParsedTokenAccountsByOwner(owner, { mint })).value
        setBalances((prevState) => ({ ...prevState, [mint.toString()]: account.data.parsed.info.tokenAmount }))
      })
    )
  }

  const fetchAccounts = useCallback(
    (publicKey: PublicKey) => {
      const subscriptions: number[] = []

      ;(async () => {
        setFetching(true)

        try {
          const [parsedAccounts, solAmount] = await Promise.all([
            connection.getParsedTokenAccountsByOwner(publicKey, { programId: TOKEN_PROGRAM_ID }),
            connection.getBalance(publicKey)
          ])

          const accounts = parsedAccounts.value.reduce((acc: IAccounts, { account }) => {
            const { mint, tokenAmount } = account.data.parsed.info
            acc[mint] = tokenAmount
            handleAccountChange(subscriptions, connection, publicKey, new PublicKey(mint))
            return acc
          }, {})

          const amount = solAmount.toString()
          const uiAmount = solAmount / 10 ** 9
          accounts[WRAPPED_SOL_MINT.toString()] = { amount, decimals: 9, uiAmount, uiAmountString: uiAmount.toString() }
          setBalances(accounts)
        } catch (e: any) {
          notify({ type: 'error', message: `Error fetching accounts`, icon: 'error' }, e)
        }

        setFetching(false)
      })()

      return subscriptions
    },
    [connection]
  )

  useEffect(() => {
    let cancelled = false
    const subscriptions: number[] = !cancelled && publicKey ? fetchAccounts(publicKey) : []

    return () => {
      cancelled = true
      subscriptions.forEach((subscription) => connection.removeAccountChangeListener(subscription))
    }
  }, [connection, fetchAccounts, publicKey, tokenRegistry])

  return (
    <AccountsContext.Provider
      value={{
        balances,
        fetchAccounts,
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

  return {
    balances: context.balances,
    fetching: context.fetching,
    fetchAccounts: context.fetchAccounts,
    getAmount: context.getAmount,
    getUIAmount: context.getUIAmount,
    getUIAmountString: context.getUIAmountString,
    setBalances: context.setBalances,
    setFetching: context.setFetching
  }
}
