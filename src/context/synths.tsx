import React, {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useConnectionConfig } from './settings'
import { ISwapToken } from './swap'
import { notify } from '../utils'
import { ADDRESSES, Mint, Pool, pool } from '../web3'

type Decimal = {
  flags: number
  hi: number
  mid: number
  lo: number
}

type SwapInput = undefined | 'from' | 'to'

interface ISynthsConfig {
  amount: number
  availableSynths: [string, Mint][]
  availablePools: [string, Pool][]
  burn: () => Promise<void>
  claim: () => Promise<void>
  deposit: () => Promise<void>
  loading: boolean
  mint: () => Promise<void>
  poolName: string
  setAmount: Dispatch<SetStateAction<number>>
  setFocused: Dispatch<SetStateAction<SwapInput>>
  setPoolName: Dispatch<SetStateAction<string>>
  setSynth: Dispatch<SetStateAction<string>>
  setSynthSwap: Dispatch<SetStateAction<ISynthSwap>>
  setUserAccount: Dispatch<SetStateAction<IUserAccount>>
  synth: string
  synthPrices: ISynthPrices
  synthSwap: ISynthSwap
  swap: () => Promise<void>
  userAccount: IUserAccount
  withdraw: () => Promise<void>
}

interface ISynthPrices {
  [x: string]: number
}

interface ISynthSwap {
  inToken?: ISwapToken
  inTokenAmount: number
  outToken?: ISwapToken
  outTokenAmount: number
}

interface IUserAccount {
  collateral: number
  debt: number
  fees: number
  value: number
}

const DEFAULT_USER_ACCOUNT = { collateral: 0, debt: 0, fees: 0, value: 0 }

const SynthsContext = createContext<ISynthsConfig | null>(null)

export const SynthsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { connection, network } = useConnectionConfig()
  const wallet = useWallet()
  const { mints, pools } = ADDRESSES[network]

  const availableSynths = useMemo(() => Object.entries(mints).filter(([_, { type }]) => type === 'synth'), [mints])
  const availablePools = useMemo(() => Object.entries(pools).filter(([_, { type }]) => type === 'synth'), [pools])

  const [amount, setAmount] = useState(0)
  const [focused, setFocused] = useState<SwapInput>(undefined)
  const [loading, setLoading] = useState(false)
  const [poolName, setPoolName] = useState(availablePools[0][0])
  const [synth, setSynth] = useState(availableSynths[0][0])
  const [synthPrices, setSynthPrices] = useState<ISynthPrices>({})
  const [synthSwap, setSynthSwap] = useState<ISynthSwap>({ inTokenAmount: 0, outTokenAmount: 0 })
  const [userAccount, setUserAccount] = useState<IUserAccount>(DEFAULT_USER_ACCOUNT)

  const burn = async () => {
    setLoading(true)

    try {
      const signature = await pool.burn(amount, poolName, synth, wallet, connection, network)
      notify({
        type: 'success',
        message: 'Burn successful!',
        description: `Burnt ${amount} ${synth}`,
        icon: 'success',
        txid: signature
      })
    } catch (e: any) {
      notify({ type: 'error', message: `Error burning`, icon: 'error' }, e)
    }

    setLoading(false)
  }

  const claim = async () => {
    if (wallet.publicKey && wallet.signTransaction) {
      setLoading(true)

      try {
        const [signature, amount] = await pool.claim(poolName, wallet, connection, network)
        notify({
          type: 'success',
          message: 'Claim successful!',
          description: `Claimed ${amount} gUSD`,
          icon: 'success',
          txid: signature
        })
      } catch (e: any) {
        notify({ type: 'error', message: `Error claiming`, icon: 'error' }, e)
      }

      setLoading(false)
    }
  }

  const deposit = async () => {
    setLoading(true)

    try {
      const signature = await pool.deposit(amount, poolName, wallet, connection, network)
      notify({
        type: 'success',
        message: 'Deposit successful!',
        description: `Deposited ${amount} GOFX`,
        icon: 'success',
        txid: signature
      })
    } catch (e: any) {
      notify({ type: 'error', message: `Error depositing`, icon: 'error' }, e)
    }

    setLoading(false)
  }

  const mint = async () => {
    setLoading(true)

    try {
      const signature = await pool.mint(amount, poolName, synth, wallet, connection, network)
      notify({
        type: 'success',
        message: 'Mint successful!',
        description: `Minted ${amount} ${synth}`,
        icon: 'success',
        txid: signature
      })
    } catch (e: any) {
      notify({ type: 'error', message: `Error minting`, icon: 'error' }, e)
    }

    setLoading(false)
  }

  const swap = async () => {
    const { inToken, inTokenAmount, outToken, outTokenAmount } = synthSwap

    if (inToken && outToken) {
      setLoading(true)
      const inTokens = `${inTokenAmount} ${inToken.symbol}`
      const outTokens = `${outTokenAmount} ${outToken.symbol}`
      notify({ message: `Trying to swap ${inTokens} for at least ${outTokens}...` })
      try {
        const signature = await pool.swap(
          amount,
          poolName,
          inTokenAmount,
          outTokenAmount,
          inToken.symbol,
          outToken.symbol,
          wallet,
          connection,
          network
        )
        notify({
          type: 'success',
          message: 'Swap successful!',
          description: `Swap ${inTokens} for ${outTokens}`,
          icon: 'success',
          txid: signature
        })
      } catch (e: any) {
        notify({ type: 'error', message: `Error swapping`, icon: 'error' }, e)
      }

      setLoading(false)
    }
  }

  const withdraw = async () => {
    setLoading(true)

    try {
      const signature = await pool.withdraw(amount, poolName, wallet, connection, network)
      notify({
        type: 'success',
        message: 'Withdrawal successful!',
        description: `Withdrew ${amount} ${synth}`,
        icon: 'success',
        txid: signature
      })
    } catch (e: any) {
      notify({ type: 'error', message: `Error withdrawing`, icon: 'error' }, e)
    }

    setLoading(false)
  }

  useEffect(() => {
    const subscriptions: number[] = []

    const updateUserAccount = async () => {
      const { decimal2number } = await import('gfx_stocks_pool')
      const userAccountFieldToNumber = (x: Decimal) => decimal2number(x.flags, x.hi, x.lo, x.mid)

      const userAccount = await pool.userAccount(poolName, wallet, connection, network)
      if (userAccount) {
        setUserAccount({
          collateral: userAccountFieldToNumber(userAccount.collateralAmount),
          debt: 1,
          fees: userAccountFieldToNumber(userAccount.claimableFee),
          value: userAccountFieldToNumber(userAccount.shares)
        })
      }
    }

    wallet.publicKey &&
      updateUserAccount().then(async () => {
        const userAccountAta = await pool.getUserAccountPublicKey(poolName, wallet, network)
        subscriptions.push(connection.onAccountChange(userAccountAta, updateUserAccount))
      })

    return () => {
      setUserAccount(DEFAULT_USER_ACCOUNT)
      subscriptions.forEach((sub) => connection.removeAccountChangeListener(sub))
    }
  }, [connection, network, poolName, wallet])

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
        poolName,
        setAmount,
        setFocused,
        setPoolName,
        setSynth,
        setSynthSwap,
        setUserAccount,
        swap,
        synth,
        synthPrices,
        synthSwap,
        userAccount,
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
    poolName: context.poolName,
    setAmount: context.setAmount,
    setPoolName: context.setPoolName,
    setSynth: context.setSynth,
    setUserAccount: context.setUserAccount,
    synth: context.synth,
    synthPrices: context.synthPrices,
    userAccount: context.userAccount,
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
    setFocused: context.setFocused,
    swap: context.swap,
    setSynthSwap: context.setSynthSwap,
    synthSwap: context.synthSwap
  }
}
