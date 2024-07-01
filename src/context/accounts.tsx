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
import { TOKEN_PROGRAM_ID, WRAPPED_SOL_MINT } from 'openbook-ts/serum/lib/token-instructions'
import { useWallet } from '@solana/wallet-adapter-react'
import { Connection, PublicKey } from '@solana/web3.js'
import { useConnectionConfig } from './settings'
import { useTokenRegistry } from './token_registry'
import { findAssociatedTokenAddress } from '../web3'

export type IAccount = {
  amount: string
  decimals: number
  uiAmount: number
  uiAmountString: string
}

export interface IAccounts {
  [mint: string]: IAccount
}

interface IAccountsConfig {
  balances: IAccounts
  fetchAccounts: () => number[]
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
  const { wallet } = useWallet()
  const [balances, setBalances] = useState<IAccounts>({})
  const [fetching, setFetching] = useState(false)
  const { publicKey } = wallet?.adapter || {}

  const handleAccountChange = async (sub: number[], connection: Connection, owner: PublicKey, mint: PublicKey) => {
    try {
      const associatedTokenAddress = await findAssociatedTokenAddress(owner, mint)
      sub.push(
        connection.onAccountChange(associatedTokenAddress, async () => {
          try {
            const accountArr = (await connection.getParsedTokenAccountsByOwner(owner, { mint })).value
            const account = accountArr?.[0]?.account
            setBalances((prevState) => ({
              ...prevState,
              [mint.toString()]: account?.data?.parsed?.info?.tokenAmount
            }))
          } catch (err) {
            console.log(err)
          }
        })
      )
    } catch (e) {
      console.log(e)
    }
  }

  const fetchAccounts = useCallback(() => {
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
          return acc
        }, {})

        const amount = solAmount.toString()
        const uiAmount = solAmount / 10 ** 9
        accounts[WRAPPED_SOL_MINT.toString()] = {
          amount,
          decimals: 9,
          uiAmount,
          uiAmountString: uiAmount.toString()
        }
        setBalances(accounts)

        Promise.all(parsedAccounts.value.map(({account}) => {
          const {mint} = account.data.parsed.info
          return handleAccountChange(subscriptions, connection, publicKey, new PublicKey(mint))
        }))
      } catch (e: any) {
        console.log('check account fetch')
      }

      setFetching(false)
    })()

    return subscriptions
  }, [connection, publicKey])

  useEffect(() => {
    let cancelled = false
    const subscriptions: number[] = !cancelled && publicKey ? fetchAccounts() : []

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

  return context
}
