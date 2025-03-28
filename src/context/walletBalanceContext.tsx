import { createContext, useContext, useEffect } from 'react'
import { ParsedAccountData, PublicKey, TokenAmount, Transaction, TransactionInstruction } from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'
import { useConnectionConfig } from '@/context/settings'
// It exists :/
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { createAssociatedTokenAccountInstruction } from '@solana/spl-token-v2'
import { confirmTransaction } from '@/web3'
import { toast } from 'sonner'
import { fetchTokensByPublicKey } from '@/api/gamma'
import Decimal from 'decimal.js-light'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEY } from '@/queries/query.helper'
import { INTERVALS } from '@/utils/time'

const NATIVE_MINT = new PublicKey('So11111111111111111111111111111111111111112')
type TokenType = 'spl-token' | 'native' | 'spl-token-2022'

export interface UserTokenAccounts {
  symbol: string
  name: string
  logoURI: string
  decimals: number
  mint: string
  pda: PublicKey
  tokenAmount: TokenAmount
  value: Decimal
  price: number
  tokenType: TokenType
}

export type Balance = Record<string, UserTokenAccounts>
type CreateTokenAccountParams = { pda: PublicKey; mint: PublicKey }

export interface IWalletBalanceContext {
  balance: Balance
  topBalances: UserTokenAccounts[]
  publicKey: PublicKey | null
  base58PublicKey: string
  createTokenAccountInstruction: (data: CreateTokenAccountParams) => TransactionInstruction
  createTokenAccountInstructions: (data: CreateTokenAccountParams[]) => TransactionInstruction[]
  createTokenAccount: (data: CreateTokenAccountParams) => Promise<void>
  createTokenAccounts: (data: CreateTokenAccountParams[]) => Promise<void>
  walletValue: string
}

const WalletBalanceContext = createContext<IWalletBalanceContext>(null)

function WalletBalanceProvider({ children }: { children?: React.ReactNode }): JSX.Element {
  const { wallet, sendTransaction } = useWallet()

  const publicKey: PublicKey | null = wallet?.adapter?.publicKey ?? null
  const base58PublicKey = publicKey?.toBase58() ?? ''
  const { connection } = useConnectionConfig()

  const onChainTokenQuery = useQuery({
    queryKey: [QUERY_KEY, 'wallet-tokens-onchain', base58PublicKey],
    queryFn: async () => {
      const [standardTokens, token2022, solBalance] = await Promise.all([
        connection.getParsedTokenAccountsByOwner(publicKey, {
          programId: TOKEN_PROGRAM_ID
        }),
        connection.getParsedTokenAccountsByOwner(publicKey, {
          programId: TOKEN_2022_PROGRAM_ID
        }),
        connection.getBalance(publicKey)
      ])

      const accounts = [...standardTokens.value, ...token2022.value]
      return { accounts, solBalance }
    },
    staleTime: Infinity,
    enabled: !!base58PublicKey
  })
  const gammaTokenQuery = useQuery({
    queryKey: [
      QUERY_KEY,
      'wallet-gamma-tokens',
      onChainTokenQuery.data?.accounts?.length,
      onChainTokenQuery.data?.solBalance
    ],
    queryFn: async () => {
      try {
        const tokenAccounts: Balance = {}
        const tokenInfo = {}
        let addresses = NATIVE_MINT.toBase58() + ','
        onChainTokenQuery.data.accounts.forEach((account) => {
          const data = account.account.data as ParsedAccountData
          addresses += data.parsed.info.mint + ','
          tokenInfo[data.parsed.info.mint] = data.parsed.info
          tokenInfo[data.parsed.info.mint].pda = account.pubkey
          tokenInfo[data.parsed.info.mint].tokenType = data.program
        })

        addresses = addresses.slice(0, -1)

        const solUIAmount = onChainTokenQuery.data.solBalance / 10 ** 9

        const sol = {
          isNative: true,
          symbol: 'SOL',
          name: 'Solana',
          logoURI:
            'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/' +
            'mainnet/So11111111111111111111111111111111111111112/logo.png',
          decimals: 9,
          mint: NATIVE_MINT.toBase58(),
          pda: publicKey,
          tokenAmount: {
            amount: onChainTokenQuery.data.solBalance.toString(),
            decimals: 9,
            uiAmountString: solUIAmount.toFixed(2),
            uiAmount: solUIAmount
          },
          price: 0.0,
          value: new Decimal(0.0),
          tokenType: 'native' as TokenType
        }
        tokenAccounts[NATIVE_MINT.toBase58()] = sol
        tokenAccounts[publicKey.toBase58()] = sol

        const tokenListResponse = await fetchTokensByPublicKey(addresses)

        let currentWalletValue = new Decimal(0.0)
        if (tokenListResponse.success && tokenListResponse.data.tokens.length > 0) {
          for (const data of tokenListResponse.data.tokens) {
            const { address, ...rest } = data
            if (!(data.address in tokenAccounts) && data.address in tokenInfo) {
              tokenAccounts[data.address] = { ...tokenInfo[data.address] }
            }

            tokenAccounts[data.address].mint = address
            tokenAccounts[data.address] = Object.assign(tokenAccounts[data.address], rest)
            tokenAccounts[data.address].price = data.price
            const value = new Decimal(tokenAccounts[data.address].tokenAmount.uiAmount).mul(data.price)
            tokenAccounts[data.address].value = value
            currentWalletValue = currentWalletValue.add(value)
          }
        }
        const values = Object.values(tokenAccounts)
        const alreadyAdded = new Set<string>()
        const topBalances = values
          .filter((v) => {
            if (alreadyAdded.has(v.symbol) || v.value.isZero()) {
              return false
            }
            alreadyAdded.add(v.symbol)
            return true
          })
          .sort((a, b) => (a.value.gte(b.value) ? -1 : 1))
        return {
          tokenAccounts: Object.values(tokenAccounts),
          balance: tokenAccounts,
          walletValue: currentWalletValue.toFixed(2),
          topBalances
        }
      } catch (e) {
        console.error('Error fetching token list', e)
      }
    },
    placeholderData: {
      tokenAccounts: [],
      balance: {},
      walletValue: '0.0',
      topBalances: []
    },
    staleTime: INTERVALS.MINUTE,
    enabled: onChainTokenQuery.isSuccess && !onChainTokenQuery.isFetching && !!base58PublicKey
  })

  useEffect(() => {
    if (!base58PublicKey) return
    const id = connection.onAccountChange(publicKey, () => onChainTokenQuery.refetch(), {
      commitment: 'confirmed'
    })
    return () => {
      connection.removeAccountChangeListener(id)
    }
  }, [connection, base58PublicKey, publicKey])

  function createTokenAccountInstruction(data: CreateTokenAccountParams) {
    return createAssociatedTokenAccountInstruction(publicKey, data.pda, publicKey, data.mint)
  }

  function createTokenAccountInstructions(data: CreateTokenAccountParams[]) {
    return data.map((d) => createTokenAccountInstruction(d))
  }

  async function createTokenAccount(data: CreateTokenAccountParams) {
    const txnInstruction = createTokenAccountInstruction(data)
    const txn = new Transaction().add(txnInstruction)
    const txnSig = await sendTransaction(txn, connection).catch(() => {
      console.error('Error creating token account')
      return ''
    })
    await confirmTransaction(connection, txnSig, 'confirmed')
      .then(() => toast.success('Token account created!'))
      .catch(() => toast.error('Error creating token account!'))
  }

  async function createTokenAccounts(data: CreateTokenAccountParams[]) {
    const txnInstruction = createTokenAccountInstructions(data)
    const txn = new Transaction().add(...txnInstruction)
    const txnSig = await sendTransaction(txn, connection).catch(() => {
      console.error('Error creating token account')
      return ''
    })
    await confirmTransaction(connection, txnSig, 'confirmed')
      .then(() => toast.success('Token account(s) created!'))
      .catch(() => toast.error('Error creating token account(s)!'))
  }

  const balanceProxyHandler = {
    get: function (target: Balance, prop: string) {
      if (prop in target) {
        return target[prop]
      } else if (prop.toLowerCase() in target) {
        return target[prop.toLowerCase()]
      } else if (prop.toUpperCase() in target) {
        return target[prop.toUpperCase()]
      }
      return {
        symbol: '',
        name: '',
        logoURI: '',
        decimals: 0,
        mint: PublicKey.default,
        pda: PublicKey.default,
        tokenAmount: {
          amount: '0',
          decimals: 0,
          uiAmount: 0,
          uiAmountString: '0'
        },
        price: 0.0,
        value: new Decimal(0.0)
      }
    }
  }
  const balanceProxy = new Proxy(gammaTokenQuery.data?.balance, balanceProxyHandler)

  return (
    <WalletBalanceContext.Provider
      value={{
        balance: balanceProxy,
        topBalances: gammaTokenQuery.data?.topBalances ?? [],
        publicKey: publicKey,
        base58PublicKey,
        createTokenAccountInstruction,
        createTokenAccountInstructions,
        createTokenAccount,
        createTokenAccounts,
        walletValue: gammaTokenQuery.data?.walletValue ?? '0.0'
      }}
    >
      {children}
    </WalletBalanceContext.Provider>
  )
}

export default WalletBalanceProvider
const useWalletBalance = (): IWalletBalanceContext => useContext(WalletBalanceContext)

export { useWalletBalance }
