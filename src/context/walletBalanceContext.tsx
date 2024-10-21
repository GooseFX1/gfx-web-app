import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  GetProgramAccountsFilter,
  ParsedAccountData,
  PublicKey,
  TokenAmount,
  Transaction,
  TransactionInstruction
} from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'
import { useConnectionConfig } from '@/context/settings'
import { useSolSubActivityMulti } from '@/hooks/useSolSubActivity'
import { SubType } from '@/hooks/useSolSub'
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { createAssociatedTokenAccountInstruction } from '@solana/spl-token-v2'
import { confirmTransaction } from '@/web3'
import { toast } from 'sonner'
import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey'
import { fetchTokensByPublicKey } from '@/api/gamma'
import Decimal from 'decimal.js-light'

const NATIVE_MINT = new PublicKey('So11111111111111111111111111111111111111112')

interface UserTokenAccounts {
  symbol: string
  name: string
  logoURI: string
  decimals: number
  mint: string
  pda: PublicKey
  tokenAmount: TokenAmount
  value: Decimal
  price: number
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
    return values.filter((v) => v.value.gt(0)).sort((a, b) => (a.value.gte(b.value) ? -1 : 1))
  }, [balance])

  useSolSubActivityMulti({
    subType: SubType.AccountChange,
    publicKeys: tokenAccounts.map((account) => {
      const callback = async () => {
        if (account.mint == NATIVE_MINT.toBase58()) {
          const t = await connection.getBalance(account.pda)
          const dec = account.decimals || 9
          setBalanceBySymbol(account.mint, {
            amount: t.toString(),
            decimals: dec,
            uiAmount: t / 10 ** dec,
            uiAmountString: (t / 10 ** dec).toFixed(2)
          })
          return
        }
        const t = await connection.getTokenAccountBalance(account.pda, 'confirmed')
        setBalanceBySymbol(account.mint, t.value)
      }
      return {
        publicKey: account.pda,
        callback
      }
    }),
    callOnReactivation: true
  })

  useEffect(() => {
    if (!publicKey) {
      setTokenAccounts([])
      setBalance({})
      return
    }
    getTokenAccounts()
  }, [connection, network, publicKey])

  function setBalanceBySymbol(mint: string, amount: TokenAmount) {
    setBalance((prev) => {
      const originalValue = prev[mint];
      return {
        ...prev,
        [mint]: {
          ...prev[mint],
          tokenAmount: amount,
          value: new Decimal(amount.uiAmount).mul(originalValue.price)
        },
        [originalValue.symbol]: {
          ...prev[mint],
          tokenAmount: amount,
          value: new Decimal(amount.uiAmount).mul(originalValue.price)
        }
      }
    })
  }

  async function getTokenAccounts() {
    if (!publicKey) return

    const filters: GetProgramAccountsFilter[] = [
      {
        dataSize: 165 //size of account (bytes)
      },
      {
        memcmp: {
          offset: 32, //location of our query in the account (bytes)
          bytes: publicKey.toBase58() //our search criteria, a base58 encoded string
        }
      }
    ]

    const accounts = await connection.getParsedProgramAccounts(
      TOKEN_PROGRAM_ID, //SPL Token Program, new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
      { filters: filters }
    )
    const tokenAccounts = {}
    const tokenInfo = {}
    let addresses = NATIVE_MINT.toBase58() + ','
    accounts.forEach((account) => {
      const data = account.account.data as ParsedAccountData
      addresses += data.parsed.info.mint + ','
      tokenInfo[data.parsed.info.mint] = data.parsed.info
    })

    addresses = addresses.slice(0, -1)

    const solBalance = await connection.getBalance(publicKey)
    const solUIAmount = solBalance / 10 ** 9

    tokenAccounts[NATIVE_MINT.toBase58()] = {
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
      value: new Decimal(0.0)
    }
    let currentWalletValue = new Decimal(0.0)
    const tokenListResponse = await fetchTokensByPublicKey(addresses)

    if (tokenListResponse.success && tokenListResponse.data.tokens.length > 0) {
      for (const data of tokenListResponse.data.tokens) {
        const { address, ...rest } = data
        if (!(data.address in tokenAccounts) && (data.address in tokenInfo)) {
          tokenAccounts[data.address] = {...tokenInfo[data.address]}
        }

        tokenAccounts[data.address].mint = address
        tokenAccounts[data.address] = Object.assign(tokenAccounts[data.address], rest)
        tokenAccounts[data.address].price = data.price
        const value = new Decimal(tokenAccounts[data.address].tokenAmount.uiAmount).mul(data.price)
        tokenAccounts[data.address].value = value
        currentWalletValue = currentWalletValue.add(value)

        if (address != 'SOL') {
          tokenAccounts[data.address].pda = findProgramAddressSync(
            [publicKey.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), new PublicKey(address).toBuffer()],
            ASSOCIATED_TOKEN_PROGRAM_ID
          )[0]
        }
        tokenAccounts[data.symbol] = tokenAccounts[data.address]
      }
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
    get: function(target: Balance, prop: string) {
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
        walletValue
      }}
    >
      {children}
    </WalletBalanceContext.Provider>
  )
}

export default WalletBalanceProvider
const useWalletBalance = (): IWalletBalanceContext => useContext(WalletBalanceContext)

export { useWalletBalance }