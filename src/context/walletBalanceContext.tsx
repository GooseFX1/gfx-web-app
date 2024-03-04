import { createContext, useContext, useEffect, useState } from 'react'
import { GetProgramAccountsFilter, ParsedAccountData, PublicKey, TokenAmount } from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'
import { useConnectionConfig } from '@/context/settings'
import { useSolSubActivityMulti } from '@/hooks/useSolSubActivity'
import { SubType } from '@/hooks/useSolSub'
import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { Client, UtlConfig } from '@solflare-wallet/utl-sdk'
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
interface IWalletBalanceContext {
  balance: Balance
}

const WalletBalanceContext = createContext<IWalletBalanceContext>(null)

function WalletBalanceProvider({ children }: { children?: React.ReactNode }): JSX.Element {
  const { wallet } = useWallet()
  const publicKey = wallet?.adapter?.publicKey
  const { network, connection } = useConnectionConfig()
  const [balance, setBalance] = useState<Balance>({})
  const [tokenAccounts, setTokenAccounts] = useState<UserTokenAccounts[]>([])
  const config = new UtlConfig({ connection })
  const utl = new Client(config)

  useSolSubActivityMulti({
    subType: SubType.AccountChange,
    publicKeys: tokenAccounts.map((account) => ({
      publicKey: account.pda,
      callback: async () => {
        const t = await connection.getTokenAccountBalance(account.pda, 'confirmed')
        setBalanceBySymbol(account.symbol, t.value)
      }
    }))
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
    const mapped: Map<string, ParsedAccountData> = new Map()
    const mints: PublicKey[] = accounts.map((account) => {
      const data = account.account.data as ParsedAccountData

      mapped[data.parsed.info.mint] = data
      return new PublicKey(data.parsed.info.mint)
    })

    const [data, solData, solBalance] = await Promise.all([
      utl.fetchMints(mints),
      utl.fetchMint(NATIVE_MINT),
      connection.getBalance(publicKey)
    ])
    const newBalance: Balance = {}

    const combined = data.map((account) => {
      const dataStruct = {
        symbol: account.symbol,
        name: account.name,
        mint: new PublicKey(account.address),
        decimals: account.decimals,
        pda: findProgramAddressSync(
          [publicKey.toBuffer(), new PublicKey(account.address).toBuffer()],
          TOKEN_PROGRAM_ID
        )[0],
        tokenAmount: mapped[account.address].parsed.info.tokenAmount,
        logoURI: account.logoURI
      }
      newBalance[account.symbol] = dataStruct
      return dataStruct
    })

    const uiAmount = solBalance / 10 ** 9
    newBalance['SOL'] = {
      symbol: solData.symbol,
      name: solData.name,
      decimals: 9,
      mint: NATIVE_MINT,
      pda: publicKey,
      tokenAmount: {
        amount: solBalance.toString(),
        decimals: 9,
        uiAmountString: uiAmount.toFixed(2),
        uiAmount: uiAmount
      },
      logoURI: solData.logoURI
    }
    setTokenAccounts(combined)
    setBalance(newBalance)
  }
  const balanceProxyHandler = {
    get: function (target: Balance, prop: string) {
      if (prop in target) {
        return target[prop]
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
    <WalletBalanceContext.Provider value={{ balance: balanceProxy }}>{children}</WalletBalanceContext.Provider>
  )
}
export default WalletBalanceProvider
const useWalletBalance = (): IWalletBalanceContext => useContext(WalletBalanceContext)

export { useWalletBalance }
