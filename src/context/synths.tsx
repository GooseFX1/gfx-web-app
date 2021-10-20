import React, {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState, useCallback
} from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useConnectionConfig } from './settings'
import { ISwapToken } from './swap'
import { notify } from '../utils'
import { ADDRESSES, Mint, Pool, pool } from '../web3'
import { usePrices } from './prices'

type Decimal = {
  flags: number
  hi: number
  mid: number
  lo: number
}

interface IPoolAccount {
  debt: { percentage: number, synth: string }[]
  shareRate: number
  synths: string[]
}

interface ISynthsConfig {
  amount: number
  availableSynths: [string, Mint][]
  availablePools: [string, Pool][]
  burn: () => Promise<void>
  claim: () => Promise<void>
  deposit: () => Promise<void>
  loading: boolean
  mint: () => Promise<void>
  poolAccount: IPoolAccount
  poolName: string
  setAmount: Dispatch<SetStateAction<number>>
  setPoolName: Dispatch<SetStateAction<string>>
  setSynth: Dispatch<SetStateAction<string>>
  setSynthSwap: Dispatch<SetStateAction<ISynthSwap>>
  switchTokens: () => void
  synth: string
  synthSwap: ISynthSwap
  swap: () => Promise<void>
  userAccount: IUserAccount
  userPortfolio: IUserPortfolio
  withdraw: () => Promise<void>
}

interface ISynthSwap {
  inToken?: ISwapToken
  inTokenAmount: number
  outToken?: ISwapToken
  outTokenAmount: number
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
  pendingFees: number
}

const DEFAULT_POOL_ACCOUNT = { debt: [], shareRate: 0, synths: [] }
const DEFAULT_USER_ACCOUNT = { claimableFee: 0, cAmount: 0, debt: 0, shareRate: 0, shares: 0 }
const DEFAULT_USER_PORTFOLIO = { cRatio: 0, cValue: 0, pendingFees: 0 }

const SynthsContext = createContext<ISynthsConfig | null>(null)

export const SynthsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { connection, network } = useConnectionConfig()
  const { prices, setPrices } = usePrices()
  const wallet = useWallet()

  const availableSynths = useMemo(() => Object.entries(ADDRESSES[network].mints), [network])
  const availablePools = useMemo(() => Object.entries(ADDRESSES[network].pools).filter(([_, { type }]) => type === 'synth'), [network])

  const [amount, setAmount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [poolName, setPoolName] = useState(availablePools[0][0])
  const [poolAccount, setPoolAccount] = useState<IPoolAccount>(DEFAULT_POOL_ACCOUNT)
  const [synth, setSynth] = useState(availableSynths[0][0])
  const [synthSwap, setSynthSwap] = useState<ISynthSwap>({ inTokenAmount: 0, outTokenAmount: 0 })
  const [userAccount, setUserAccount] = useState<IUserAccount>(DEFAULT_USER_ACCOUNT)
  const [userPortfolio, setUserPortfolio] = useState<IUserPortfolio>(DEFAULT_USER_PORTFOLIO)

  const switchTokens = () => {
    setSynthSwap((prevState) => ({ ...prevState, inToken: prevState.outToken, outToken: prevState.inToken }))
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
    const { inToken, inTokenAmount, outToken, outTokenAmount } = synthSwap

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
    const subscriptions: number[] = []

    if (wallet.publicKey) {
      updatePrices().then(async () => {
        subscriptions.push(connection.onAccountChange(ADDRESSES[network].pools[poolName].address, updatePrices))
      })
      updateUserAccount().then(async () => {
        const userAccountAta = await pool.getUserAccountPublicKey(poolName, wallet, network)
        subscriptions.push(connection.onAccountChange(userAccountAta, updateUserAccount))
      })
    }

    return () => {
      subscriptions.forEach((sub) => connection.removeAccountChangeListener(sub))
    }
  }, [availableSynths, connection, network, poolName, setPrices, updatePrices, updateUserAccount, wallet])

  const updatePoolAccount = useCallback(async () => {
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
    const synths = Object.keys(debt).sort((a, b) => a.localeCompare(b))
    const totalDebt = Object.entries(debt).reduce((acc, [synth, debt]) => {
      return acc + debt * prices[synth]?.current
    }, 0)

    setPoolAccount({
      debt: Object.entries(debt)
        .sort(([a], [b, _]) => a.localeCompare(b))
        .map(([synth, debt]) => ({ percentage: (debt * prices[synth]?.current) / totalDebt, synth })),
      shareRate: await fieldToNumber(poolAccount.shareRate),
      synths
    })
  }, [availableSynths, connection, network, poolName, prices, wallet])

  useEffect(() => {
    const subscriptions: number[] = []

    if (wallet.publicKey) {
      updatePoolAccount().then(async () => {
        subscriptions.push(connection.onAccountChange(ADDRESSES[network].pools[poolName].address, updatePoolAccount))
      })
    }

    return () => {
      subscriptions.forEach((sub) => connection.removeAccountChangeListener(sub))
    }
  }, [availableSynths, connection, network, poolName, prices, updatePoolAccount, wallet])

  useEffect(() => {
    const cValue = userAccount.cAmount * prices.GOFX?.current
    setUserPortfolio({
      cRatio: (cValue / userAccount.shares) * 100,
      cValue,
      pendingFees: userAccount.shares * (poolAccount.shareRate - userAccount.shareRate)
    })
  }, [poolAccount.shareRate, prices.GOFX, userAccount.cAmount, userAccount.shareRate, userAccount.shares])

  useEffect(() => {
    if (synthSwap.inToken && synthSwap.outToken) {
      const inTokenPrice = prices[synthSwap.inToken.symbol].current
      const outTokenPrice = prices[synthSwap.outToken.symbol].current
      setSynthSwap((prevState) => ({
        ...prevState,
        outTokenAmount: (synthSwap.inTokenAmount * inTokenPrice) / outTokenPrice
      }))
    }
  }, [prices, synthSwap.inToken, synthSwap.inTokenAmount, synthSwap.outToken])

  return (
    <SynthsContext.Provider
      value={{
        amount,
        availableSynths,
        availablePools,
        burn,
        claim,
        deposit,
        loading,
        mint,
        poolAccount,
        poolName,
        setAmount,
        setPoolName,
        setSynth,
        setSynthSwap,
        swap,
        switchTokens,
        synth,
        synthSwap,
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
    loading: context.loading,
    swap: context.swap,
    setSynthSwap: context.setSynthSwap,
    switchTokens: context.switchTokens,
    synthSwap: context.synthSwap
  }
}
