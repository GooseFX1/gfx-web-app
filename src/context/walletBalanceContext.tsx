import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  AccountInfo,
  ParsedAccountData,
  PublicKey,
  TokenAmount,
  Transaction,
  TransactionInstruction
} from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'
import { useConnectionConfig } from '@/context/settings'
import { useSolSubMulti } from '@/hooks/useSolSubActivity'
import { SubType } from '@/hooks/useSolSub'
// It exists :/
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { createAssociatedTokenAccountInstruction } from '@solana/spl-token-v2'
import { AccountLayout, confirmTransaction } from '@/web3'
import { toast } from 'sonner'
import { fetchTokensByPublicKey } from '@/api/gamma'
import Decimal from 'decimal.js-light'

const NATIVE_MINT = new PublicKey('So11111111111111111111111111111111111111112')

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
  tokenType: 'spl-token' | 'native' | 'spl-token-2022'
}

type Balance = Record<string, UserTokenAccounts>
type CreateTokenAccountParams = { pda: PublicKey; mint: PublicKey }

interface IWalletBalanceContext {
  balance: Balance
  topBalances: UserTokenAccounts[]
  publicKey: PublicKey | null
  base58PublicKey: string
  createTokenAccountInstruction: (data: CreateTokenAccountParams) => TransactionInstruction
  createTokenAccountInstructions: (data: CreateTokenAccountParams[]) => TransactionInstruction[]
  createTokenAccount: (data: CreateTokenAccountParams) => Promise<void>
  createTokenAccounts: (data: CreateTokenAccountParams[]) => Promise<void>
  walletValue: string
  refreshTokenBalance: () => void
}

const WalletBalanceContext = createContext<IWalletBalanceContext>(null)

function WalletBalanceProvider({ children }: { children?: React.ReactNode }): JSX.Element {
  const { wallet, sendTransaction } = useWallet()

  const publicKey: PublicKey | null = wallet?.adapter?.publicKey ?? null
  const base58PublicKey = publicKey?.toBase58() ?? ''
  const { network, connection } = useConnectionConfig()
  const [balance, setBalance] = useState<Balance>({})
  const [tokenAccounts, setTokenAccounts] = useState<UserTokenAccounts[]>([])
  const [walletValue, setWalletValue] = useState<string>('0.0')

  const topBalances: UserTokenAccounts[] = useMemo(() => {
    const values = Object.values(balance)
    const alreadyAdded = new Set<string>()
    return values.filter((v) => {
      if (alreadyAdded.has(v.symbol) || v.value.isZero()) {
        return false
      }
      alreadyAdded.add(v.symbol)
      return true
    }).sort((a, b) => (a.value.gte(b.value) ? -1 : 1))
  }, [balance])

  const tokens = tokenAccounts.map((account) => ({
    publicKey: account.pda,
    callback: async (accountInfo: AccountInfo<Buffer>) => {
      console.log(`updating balance for ${account.symbol}`, account)

      if (account.mint === NATIVE_MINT.toBase58()) {
        const dec = account.decimals || 9
        const uiAmount = new Decimal(accountInfo.lamports).div(10 ** dec).toNumber()
        setBalanceBySymbol(account.mint, {
          amount: accountInfo.lamports.toString(),
          decimals: dec,
          uiAmount: uiAmount,
          uiAmountString: uiAmount.toFixed(2)
        })
        console.log('updating balance for - sol', uiAmount)
        return
      }
      const decodedAccount = AccountLayout.decode(accountInfo.data)
      const uiAmount = new Decimal(decodedAccount.amount.toString()).div(10 ** account.decimals).toNumber()
      const amount: TokenAmount = {
        amount: decodedAccount.amount.toString(),
        decimals: account.decimals,
        uiAmount: uiAmount,
        uiAmountString: uiAmount.toFixed(2)
      }
      console.log(`updating balance for - ${account.symbol}`, uiAmount)
      setBalanceBySymbol(account.mint, amount)
    }
  }))

  const { callbackOn, callbackOff } = useSolSubMulti({
    subType: SubType.AccountChange,
    publicKeys: tokens
  })
  useEffect(() => {
    if (tokenAccounts.length > 0) {
      callbackOn()
    }
    return () => {
      callbackOff()
    }
  }, [tokenAccounts])
  useEffect(() => {
    if (!publicKey) {
      callbackOff
      setTokenAccounts([])
      setBalance({})
      return
    }
    getTokenAccounts()
  }, [connection, network, publicKey])

  function setBalanceBySymbol(mint: string, amount: TokenAmount) {
    setBalance((prev) => {
      const originalValue = prev[mint]
      return {
        ...prev,
        [mint]: {
          ...prev[mint],
          tokenAmount: amount,
          value: new Decimal(amount.uiAmount).mul(originalValue.price)
        }
      }
    })
  }

  async function getTokenAccounts() {
    if (!publicKey) return

    const standardTokens: { pubkey: PublicKey; account: AccountInfo<ParsedAccountData> }[] =
      (
        (await connection.getParsedTokenAccountsByOwner(publicKey, {
          programId: TOKEN_PROGRAM_ID
        })) as any
      )?.value || []

    const token2022: { pubkey: PublicKey; account: AccountInfo<ParsedAccountData> }[] =
      (
        (await connection.getParsedTokenAccountsByOwner(publicKey, {
          programId: TOKEN_2022_PROGRAM_ID
        })) as any
      )?.value || []

    const accounts = [...standardTokens, ...token2022]
    const tokenAccounts = {}
    const tokenInfo = {}
    let addresses = NATIVE_MINT.toBase58() + ','
    accounts.forEach((account) => {
      const data = account.account.data as ParsedAccountData
      addresses += data.parsed.info.mint + ','
      tokenInfo[data.parsed.info.mint] = data.parsed.info
      tokenInfo[data.parsed.info.mint].pda = account.pubkey
      tokenInfo[data.parsed.info.mint].tokenType = data.program
    })

    addresses = addresses.slice(0, -1)

    const solBalance = await connection.getBalance(publicKey)
    const solUIAmount = solBalance / 10 ** 9

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
        amount: solBalance.toString(),
        decimals: 9,
        uiAmountString: solUIAmount.toFixed(2),
        uiAmount: solUIAmount
      },
      price: 0.0,
      value: new Decimal(0.0),
      tokenType: 'native'
    }
    tokenAccounts[NATIVE_MINT.toBase58()] = sol
    tokenAccounts[publicKey.toBase58()] = sol
    let currentWalletValue = new Decimal(0.0)
    try {
      const tokenListResponse = await fetchTokensByPublicKey(addresses)

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
      console.log('tokenAccounts', { tokenAccounts, tokenListResponse })
    } catch (e) {
      console.error('Error fetching token list', e)
    }
    setTokenAccounts(Object.values(tokenAccounts))
    setBalance(tokenAccounts)
    setWalletValue(currentWalletValue.toFixed(2))
  }

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
  const balanceProxy = new Proxy(balance, balanceProxyHandler)

  return (
    <WalletBalanceContext.Provider
      value={{
        balance: balanceProxy,
        topBalances,
        publicKey: publicKey,
        base58PublicKey,
        createTokenAccountInstruction,
        createTokenAccountInstructions,
        createTokenAccount,
        createTokenAccounts,
        walletValue,
        refreshTokenBalance: getTokenAccounts
      }}
    >
      {children}
    </WalletBalanceContext.Provider>
  )
}

export default WalletBalanceProvider
const useWalletBalance = (): IWalletBalanceContext => useContext(WalletBalanceContext)

export { useWalletBalance }
