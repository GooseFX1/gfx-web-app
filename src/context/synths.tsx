import React, {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useConnectionConfig } from './settings'
import { ISwapToken, SwapInput } from './swap'
import { notify } from '../utils'
import { ADDRESSES, Mint, Pool, pool } from '../web3'
import { usePrices } from './prices'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'

type Decimal = {
  flags: number
  hi: number
  mid: number
  lo: number
}

interface IPoolAccount {
  shareRate: number
  synthsDebt: {
    amount: number
    percentage: number
    synth: string
  }[]
  totalDebt: number
  totalShares: number
}

interface ISynthsConfig {
  amount: number
  availableSynths: [string, Mint][]
  availablePools: [string, Pool][]
  burn: () => Promise<void>
  claim: () => Promise<void>
  deposit: () => Promise<void>
  inToken?: ISwapToken
  inTokenAmount: number
  loading: boolean
  mint: () => Promise<void>
  outToken?: ISwapToken
  outTokenAmount: number
  poolAccount: IPoolAccount
  poolName: string
  setAmount: Dispatch<SetStateAction<number>>
  setFocused: Dispatch<SetStateAction<SwapInput>>
  setInToken: Dispatch<SetStateAction<ISwapToken | undefined>>
  setInTokenAmount: Dispatch<SetStateAction<number>>
  setOutToken: Dispatch<SetStateAction<ISwapToken | undefined>>
  setOutTokenAmount: Dispatch<SetStateAction<number>>
  setPoolName: Dispatch<SetStateAction<string>>
  setSynth: Dispatch<SetStateAction<string>>
  switchTokens: () => void
  synth: string
  swap: () => Promise<void>
  userAccount: IUserAccount
  userPortfolio: IUserPortfolio
  withdraw: () => Promise<void>
}

interface IUserAccount {
  claimableFee: number
  cAmount: number
  shareRate: number
  shares: number
}

interface IUserPortfolio {
  cRatio: number
  cValue: number
  debt: number
  pendingFees: number
}

const DEFAULT_POOL_ACCOUNT = { shareRate: 0, synthsDebt: [], totalDebt: 0, totalShares: 0 }
const DEFAULT_USER_ACCOUNT = { claimableFee: 0, cAmount: 0, debt: 0, shareRate: 0, shares: 0 }
const DEFAULT_USER_PORTFOLIO = { cRatio: 0, cValue: 0, debt: 0, pendingFees: 0 }
const REFRESH_TIMEOUT = 10000

const SynthsContext = createContext<ISynthsConfig | null>(null)

export const SynthsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { connection, network } = useConnectionConfig()
  const { prices, setPrices } = usePrices()
  const wallet = useWallet()

  const availableSynths = useMemo(
    () => Object.entries(ADDRESSES[network].mints).filter(([synth, _]) => synth !== 'GOFX'),
    [network]
  )
  const availablePools = useMemo(
    () => Object.entries(ADDRESSES[network].pools).filter(([_, { type }]) => type === 'synth'),
    [network]
  )

  const [amount, setAmount] = useState(0)
  const [focused, setFocused] = useState<SwapInput>(undefined)
  const [inToken, setInToken] = useState<ISwapToken | undefined>()
  const [inTokenAmount, setInTokenAmount] = useState(0)
  const [outToken, setOutToken] = useState<ISwapToken | undefined>()
  const [outTokenAmount, setOutTokenAmount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [poolName, setPoolName] = useState(availablePools[0][0])
  const [poolAccount, setPoolAccount] = useState<IPoolAccount>(DEFAULT_POOL_ACCOUNT)
  const [synth, setSynth] = useState(availableSynths[0][0])
  const [userAccount, setUserAccount] = useState<IUserAccount>(DEFAULT_USER_ACCOUNT)
  const [userPortfolio, setUserPortfolio] = useState<IUserPortfolio>(DEFAULT_USER_PORTFOLIO)

  const switchTokens = () => {
    setInToken(outToken)
    setOutToken(inToken)
  }

  const burn = async () => {
    setLoading(true)

    try {
      const signature = await pool.burn(amount, poolName, synth, wallet, connection, network)
      await notify({
        type: 'success',
        message: 'Burn successful!',
        description: `Burned ${amount} ${synth}`,
        icon: 'success',
        txid: signature
      })
    } catch (e: any) {
      await notify({ type: 'error', message: `Error burning`, icon: 'error' }, e)
    }

    setLoading(false)
  }

  const claim = async () => {
    if (wallet.publicKey && wallet.signTransaction) {
      setLoading(true)

      try {
        const signature = await pool.claim(poolName, wallet, connection, network)
        await notify({
          type: 'success',
          message: 'Claim successful!',
          description: `Claimed ${userAccount.claimableFee + userPortfolio.pendingFees} gUSD`,
          icon: 'success',
          txid: signature
        })
      } catch (e: any) {
        await notify({ type: 'error', message: `Error claiming`, icon: 'error' }, e)
      }

      setLoading(false)
    }
  }

  const deposit = async () => {
    setLoading(true)

    try {
      const signature = await pool.deposit(amount, poolName, wallet, connection, network)
      await notify({
        type: 'success',
        message: 'Deposit successful!',
        description: `Deposited ${amount} GOFX`,
        icon: 'success',
        txid: signature
      })
    } catch (e: any) {
      await notify({ type: 'error', message: `Error depositing`, icon: 'error' }, e)
    }

    setLoading(false)
  }

  const mint = async () => {
    setLoading(true)

    try {
      const signature = await pool.mint(amount, poolName, synth, wallet, connection, network)
      await notify({
        type: 'success',
        message: 'Mint successful!',
        description: `Minted ${amount} ${synth}`,
        icon: 'success',
        txid: signature
      })
    } catch (e: any) {
      await notify({ type: 'error', message: `Error minting`, icon: 'error' }, e)
    }

    setLoading(false)
  }

  const swap = async () => {
    if (inToken && outToken) {
      setLoading(true)
      const inTokens = `${inTokenAmount} ${inToken.symbol}`
      const outTokens = `${outTokenAmount} ${outToken.symbol}`
      await notify({ message: `Trying to swap ${inTokens} for ${outTokens}...` })
      try {
        const signature = await pool.swap(
          poolName,
          inTokenAmount * 10 ** inToken.decimals,
          inToken.symbol,
          outToken.symbol,
          wallet,
          connection,
          network
        )
        await notify({
          type: 'success',
          message: 'Swap successful!',
          description: `Swap ${inTokens} for ${outTokens}`,
          icon: 'success',
          txid: signature
        })
      } catch (e: any) {
        await notify({ type: 'error', message: `Error swapping`, icon: 'error' }, e)
      }

      setLoading(false)
    }
  }

  const withdraw = async () => {
    setLoading(true)

    try {
      const signature = await pool.withdraw(amount, poolName, wallet, connection, network)
      await notify({
        type: 'success',
        message: 'Withdrawal successful!',
        description: `Withdrew ${amount} ${synth}`,
        icon: 'success',
        txid: signature
      })
    } catch (e: any) {
      await notify({ type: 'error', message: `Error withdrawing`, icon: 'error' }, e)
    }

    setLoading(false)
  }

  const fieldToNumber = async (x: Decimal) => {
    const { decimal2number } = await import('gfx_stocks_pool')
    return decimal2number(x.flags, x.hi, x.lo, x.mid)
  }

  const updatePrices = useCallback(async () => {
    try {
      const { buffer, mintIndex } = (await pool.priceAggregatorAccount(poolName, wallet, connection, network)).prices
      const { address: GOFX } = ADDRESSES[network].mints.GOFX
      setPrices((prevState) => ({ ...prevState, gUSD: { change24H: 0, current: 1 } }))
      for (const { key, index } of mintIndex) {
        const current = await fieldToNumber(buffer[index].price)
        if (key.equals(GOFX)) {
          setPrices((prevState) => ({ ...prevState, GOFX: { current } }))
        } else {
          const synth = availableSynths.find(([_, { address }]) => address.equals(key))
          synth && setPrices((prevState) => ({ ...prevState, [synth[0]]: { current } }))
        }
      }
    } catch (e: any) {
      await notify({ type: 'error', message: `Error updating pool account`, icon: 'error' }, e)
    }
  }, [availableSynths, connection, network, poolName, setPrices, wallet])

  const updateUserAccount = useCallback(async () => {
    try {
      const userAccount = await pool.userAccount(poolName, wallet, connection, network)
      if (userAccount) {
        const [cAmount, claimableFee, shareRate, shares] = await Promise.all([
          fieldToNumber(userAccount.collateralAmount),
          fieldToNumber(userAccount.claimableFee),
          fieldToNumber(userAccount.shareRate),
          fieldToNumber(userAccount.shares)
        ])

        setUserAccount({ cAmount, claimableFee, shareRate, shares })
      }
    } catch (e: any) {
      await notify({ type: 'error', message: `Error updating user account`, icon: 'error' }, e)
    }
  }, [connection, network, poolName, wallet])

  useEffect(() => {
    if (wallet.publicKey && network === WalletAdapterNetwork.Devnet) {
      updatePrices().then(() => setInterval(() => updatePrices(), REFRESH_TIMEOUT))
      updateUserAccount().then(() => setInterval(() => updateUserAccount(), REFRESH_TIMEOUT))
    }
  }, [network, updatePrices, updateUserAccount, wallet.publicKey])

  const updatePoolAccount = useCallback(async () => {
    try {
      const [listingAccount, poolAccount] = await Promise.all([
        pool.listingAccount(poolName, wallet, connection, network),
        pool.poolAccount(poolName, wallet, connection, network)
      ])

      const debt: { [x: string]: number } = { gUSD: await fieldToNumber(listingAccount.usd.debt) }
      for (const { debt: synthDebt, mint } of listingAccount.synths) {
        const synth = availableSynths.find(([_, { address }]) => mint.equals(address))
        if (synth) {
          debt[synth[0]] = await fieldToNumber(synthDebt)
        }
      }
      const totalDebt = Object.entries(debt).reduce((acc, [synth, debt]) => {
        return acc + debt * prices[synth]?.current
      }, 0)

      setPoolAccount({
        shareRate: await fieldToNumber(poolAccount.shareRate),
        synthsDebt: Object.entries(debt)
          .sort(([a], [b, _]) => a.localeCompare(b))
          .map(([synth, amount]) => ({
            amount,
            percentage: (amount * prices[synth]?.current) / totalDebt,
            synth
          })),
        totalDebt,
        totalShares: await fieldToNumber(poolAccount.totalShares)
      })
    } catch (e) {}
  }, [availableSynths, connection, network, poolName, prices, wallet])

  useEffect(() => {
    if (wallet.publicKey && network === WalletAdapterNetwork.Devnet) {
      updatePoolAccount().then(() => setInterval(() => updatePoolAccount(), REFRESH_TIMEOUT))
    }
  }, [network, updatePoolAccount, wallet.publicKey])

  useEffect(() => {
    const cValue = userAccount.cAmount * prices.GOFX?.current || 0
    const debt = (poolAccount.totalDebt * userAccount.shares) / poolAccount.totalShares || 0
    const cRatio = (100 * cValue) / debt || 0
    const pendingFees = debt * (poolAccount.shareRate - userAccount.shareRate)
    setUserPortfolio({ cRatio, cValue, debt, pendingFees })
  }, [
    poolAccount.shareRate,
    poolAccount.totalDebt,
    poolAccount.totalShares,
    prices.GOFX,
    userAccount.cAmount,
    userAccount.shareRate,
    userAccount.shares
  ])

  useEffect(() => {
    if (inToken && outToken) {
      const inTokenPrice = prices[inToken.symbol]?.current
      const outTokenPrice = prices[outToken.symbol]?.current
      if (focused === 'from') {
        setOutTokenAmount(((inTokenAmount * inTokenPrice) / outTokenPrice) * 0.995)
      } else {
        setInTokenAmount(((outTokenAmount * outTokenPrice) / inTokenPrice) * 1.005)
      }
    }
  }, [focused, inToken, inTokenAmount, outToken, outTokenAmount, prices])

  return (
    <SynthsContext.Provider
      value={{
        amount,
        availableSynths,
        availablePools,
        burn,
        claim,
        deposit,
        inToken,
        inTokenAmount,
        loading,
        mint,
        outToken,
        outTokenAmount,
        poolAccount,
        poolName,
        setAmount,
        setFocused,
        setInToken,
        setInTokenAmount,
        setOutToken,
        setOutTokenAmount,
        setPoolName,
        setSynth,
        swap,
        switchTokens,
        synth,
        userAccount,
        userPortfolio,
        withdraw
      }}
    >
      {children}
    </SynthsContext.Provider>
  )
}

export const useSynths = () => {
  const context = useContext(SynthsContext)
  if (!context) {
    throw new Error('Missing synths context')
  }

  return {
    amount: context.amount,
    availableSynths: context.availableSynths,
    availablePools: context.availablePools,
    burn: context.burn,
    claim: context.claim,
    deposit: context.deposit,
    loading: context.loading,
    mint: context.mint,
    poolAccount: context.poolAccount,
    poolName: context.poolName,
    setAmount: context.setAmount,
    setPoolName: context.setPoolName,
    setSynth: context.setSynth,
    synth: context.synth,
    userAccount: context.userAccount,
    userPortfolio: context.userPortfolio,
    withdraw: context.withdraw
  }
}

export const useSynthSwap = () => {
  const context = useContext(SynthsContext)
  if (!context) {
    throw new Error('Missing synths context')
  }

  return {
    availableSynths: context.availableSynths,
    inToken: context.inToken,
    inTokenAmount: context.inTokenAmount,
    loading: context.loading,
    outToken: context.outToken,
    outTokenAmount: context.outTokenAmount,
    setFocused: context.setFocused,
    setInToken: context.setInToken,
    setInTokenAmount: context.setInTokenAmount,
    setOutToken: context.setOutToken,
    setOutTokenAmount: context.setOutTokenAmount,
    swap: context.swap,
    switchTokens: context.switchTokens
  }
}
