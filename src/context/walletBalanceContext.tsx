import { createContext, useContext, useEffect, useState } from 'react'
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
import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { ASSOCIATED_TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction } from '@solana/spl-token-v2'
import { confirmTransaction } from '@/web3'
import { toast } from 'sonner'

const NATIVE_MINT = new PublicKey('So11111111111111111111111111111111111111112')

interface UserTokenAccounts {
  symbol: string
  name: string
  logoURI: string
  decimals: number
  mint: PublicKey
  pda: PublicKey
  tokenAmount: TokenAmount
}

type Balance = Record<string, UserTokenAccounts>
type CreateTokenAccountParams = { pda: PublicKey; mint: PublicKey }

interface IWalletBalanceContext {
  balance: Balance
  publicKey: PublicKey | null
  createTokenAccountInstruction: (data: CreateTokenAccountParams) => TransactionInstruction
  createTokenAccountInstructions: (data: CreateTokenAccountParams[]) => TransactionInstruction[]
  createTokenAccount: (data: CreateTokenAccountParams) => Promise<void>
  createTokenAccounts: (data: CreateTokenAccountParams[]) => Promise<void>
}

const SUPPORTED_TOKENS: Record<string, Omit<UserTokenAccounts, 'mint' | 'pda' | 'tokenAmount'>> = {
  So11111111111111111111111111111111111111112: {
    symbol: 'SOL',
    name: 'Solana',
    logoURI:
      'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/' +
      'mainnet/So11111111111111111111111111111111111111112/logo.png',
    decimals: 9
  },
  EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v: {
    symbol: 'USDC',
    name: 'USD Coin',
    logoURI:
      'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/' +
      'mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
    decimals: 6
  },
  Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB: {
    symbol: 'USDT',
    name: 'Tether',
    logoURI:
      'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/' +
      'mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.png',
    decimals: 6
  },
  DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263: {
    symbol: 'BONK',
    name: 'BONK',
    logoURI:
      'https://quei6zhlcfsxdfyes577gy7bkxmuz7qqakyt72xlbkyh7fysmoza.arweave.net/' +
      'hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I',
    decimals: 5
  },
  mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So: {
    symbol: 'mSOL',
    name: 'Marinade Staked SOL',
    logoURI:
      'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/' +
      'mainnet/mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So/logo.png',
    decimals: 9
  },
  J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn: {
    symbol: 'JitoSOL',
    name: 'Raydium',
    logoURI: 'https://storage.googleapis.com/token-metadata/JitoSOL-256.png',
    decimals: 9
  },
  GFX1ZjR2P15tmrSwow6FjyDYcEkoFb4p4gJCpLBjaxHD: {
    symbol: 'GOFX',
    name: 'GooseFX',
    logoURI:
      'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/' +
      'mainnet/GFX1ZjR2P15tmrSwow6FjyDYcEkoFb4p4gJCpLBjaxHD/logo.png',
    decimals: 9
  }
}
const WalletBalanceContext = createContext<IWalletBalanceContext>(null)

function WalletBalanceProvider({ children }: { children?: React.ReactNode }): JSX.Element {
  const { wallet, sendTransaction } = useWallet()
  const publicKey: PublicKey | null = wallet?.adapter?.publicKey ?? null
  const { network, connection } = useConnectionConfig()
  const [balance, setBalance] = useState<Balance>({})
  const [tokenAccounts, setTokenAccounts] = useState<UserTokenAccounts[]>([])

  useSolSubActivityMulti({
    subType: SubType.AccountChange,
    publicKeys: tokenAccounts.map((account) => {
      const callback = async () => {
        console.log('Setting balance for', account.symbol)
        if (account.symbol == 'SOL') {
          const t = await connection.getBalance(account.pda)
          setBalanceBySymbol(account.symbol, {
            amount: t.toString(),
            decimals: 9,
            uiAmount: t / 10 ** 9,
            uiAmountString: (t / 10 ** 9).toFixed(2)
          })
          return
        }
        const t = await connection.getTokenAccountBalance(account.pda, 'confirmed')
        setBalanceBySymbol(account.symbol, t.value)
      }
      return {
        publicKey: account.pda,
        callback
      }
    })
  })

  useEffect(() => {
    if (!publicKey) {
      setTokenAccounts([])
      setBalance({})
      return
    }
    getTokenAccounts()
  }, [connection, network, publicKey])

  function setBalanceBySymbol(symbol: string, amount: TokenAmount) {
    setBalance((prev) => ({
      ...prev,
      [symbol]: {
        ...prev[symbol],
        tokenAmount: amount
      }
    }))
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
    accounts.forEach((account) => {
      const data = account.account.data as ParsedAccountData
      if (data.parsed.info.mint in SUPPORTED_TOKENS) {
        const supportedToken = SUPPORTED_TOKENS[data.parsed.info.mint]
        tokenAccounts[supportedToken.symbol] = {
          ...data.parsed.info,
          ...supportedToken,
          pda: findProgramAddressSync(
            [publicKey.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), new PublicKey(data.parsed.info.mint).toBuffer()],
            ASSOCIATED_TOKEN_PROGRAM_ID
          )[0]
        }
      }
    })
    const solBalance = await connection.getBalance(publicKey)
    const solUIAmount = solBalance / 10 ** 9

    tokenAccounts['SOL'] = {
      ...SUPPORTED_TOKENS[NATIVE_MINT.toBase58()],
      mint: NATIVE_MINT,
      pda: publicKey,
      tokenAmount: {
        amount: solBalance.toString(),
        decimals: 9,
        uiAmountString: solUIAmount.toFixed(2),
        uiAmount: solUIAmount
      }
    }
    setTokenAccounts(Object.values(tokenAccounts))
    setBalance(tokenAccounts)
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
        sumbol: '',
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
        }
      }
    }
  }
  const balanceProxy = new Proxy(balance, balanceProxyHandler)
  return (
    <WalletBalanceContext.Provider
      value={{
        balance: balanceProxy,
        publicKey: publicKey,
        createTokenAccountInstruction,
        createTokenAccountInstructions,
        createTokenAccount,
        createTokenAccounts
      }}
    >
      {children}
    </WalletBalanceContext.Provider>
  )
}

export default WalletBalanceProvider
const useWalletBalance = (): IWalletBalanceContext => useContext(WalletBalanceContext)

export { useWalletBalance }
