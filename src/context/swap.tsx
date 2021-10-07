import React, {
  createContext,
  Dispatch,
  FC,
  MutableRefObject,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import moment from 'moment'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { useAccounts } from './accounts'
import { useConnectionConfig, useSlippageConfig } from './settings'
import { notify } from '../utils'
import { computePoolsPDAs, serum, swap } from '../web3'

interface IRates {
  inValue: number
  outValue: number
  outValuePerIn: number
  time: string
}

export interface ISwapToken {
  address: string
  decimals: number
  symbol: string
}

interface ISwapConfig {
  fetching: boolean
  inTokenAmount: number
  outTokenAmount: number
  rates: IRates
  refreshRates: () => void
  setInTokenAmount: Dispatch<SetStateAction<number>>
  setOutTokenAmount: Dispatch<SetStateAction<number>>
  setRates: Dispatch<SetStateAction<IRates>>
  setTokenA: Dispatch<SetStateAction<ISwapToken | null>>
  setTokenB: Dispatch<SetStateAction<ISwapToken | null>>
  swapTokens: () => void
  switchTokens: () => void
  tokenA: ISwapToken | null
  tokenB: ISwapToken | null
}

const SwapContext = createContext<ISwapConfig | null>(null)

export const SwapProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { fetchAccounts } = useAccounts()
  const { connection, network } = useConnectionConfig()
  const { slippage } = useSlippageConfig()
  const wallet = useWallet()
  const [fetching, setFetching] = useState(false)
  const [inTokenAmount, setInTokenAmount] = useState(0)
  const [outTokenAmount, setOutTokenAmount] = useState(0)
  const [rates, setRates] = useState<IRates>({
    inValue: 0,
    outValue: 0,
    outValuePerIn: 0,
    time: moment().format('MMMM DD, h:mm a')
  })
  const [tokenA, setTokenA] = useState<ISwapToken | null>(null)
  const [tokenB, setTokenB] = useState<ISwapToken | null>(null)

  let refreshTimeout: MutableRefObject<NodeJS.Timeout | undefined> = useRef()
  const timeoutDelay = 200
  const refreshRates = useCallback(async () => {
    if (refreshTimeout.current) {
      clearTimeout(refreshTimeout.current)
    }

    refreshTimeout.current = setTimeout(async () => {
      setFetching(true)
      const time = moment().format('MMMM DD, h:mm a')

      if (tokenA) {
        try {
          const inValue = await serum.getLatestBid(connection, `${tokenA.symbol}/USDC`)
          setRates(({ outValue, outValuePerIn }) => ({ inValue, outValue, outValuePerIn, time }))
        } catch (e) {
          setRates(({ outValue, outValuePerIn }) => ({ inValue: 0, outValue, outValuePerIn, time }))
        }
      }

      if (tokenB) {
        try {
          const outValue = await serum.getLatestBid(connection, `${tokenB.symbol}/USDC`)
          setRates(({ inValue, outValuePerIn }) => ({ inValue, outValue, outValuePerIn, time }))
        } catch (e) {
          setRates(({ inValue, outValuePerIn }) => ({ inValue, outValue: 0, outValuePerIn, time }))
        }
      }

      if (tokenA && tokenB) {
        try {
          const { pool } = await computePoolsPDAs(tokenA.symbol, tokenB.symbol, network)
          const [aAccount, bAccount] = await Promise.all([
            connection.getParsedTokenAccountsByOwner(pool, { mint: new PublicKey(tokenA.address) }),
            connection.getParsedTokenAccountsByOwner(pool, { mint: new PublicKey(tokenB.address) })
          ])

          const a = parseFloat(aAccount.value[0].account.data.parsed.info.tokenAmount.amount)
          const b = parseFloat(bAccount.value[0].account.data.parsed.info.tokenAmount.amount)
          const outTokenAmount = inTokenAmount > 0 ? b - (a * b) / (a + inTokenAmount) : 0
          const outValuePerIn = b - (a * b) / (a + 10 ** tokenA.decimals)

          setOutTokenAmount(outTokenAmount)
          setRates(({ inValue, outValue }) => ({ inValue, outValue, outValuePerIn, time }))
        } catch (e) {
          setOutTokenAmount(0)
          setRates(({ inValue, outValue }) => ({ inValue, outValue, outValuePerIn: 0, time }))
        }
      }

      setFetching(false)
    }, timeoutDelay)
  }, [connection, inTokenAmount, network, setRates, tokenA, tokenB])

  const swapTokens = async () => {
    if (!tokenA || !tokenB) return

    const inTokens = `${inTokenAmount / 10 ** tokenA.decimals} ${tokenA.symbol}`
    const outTokens = `${outTokenAmount / 10 ** tokenB.decimals} ${tokenB.symbol}`
    notify({ message: `Trying to swap ${inTokens} for at least ${outTokens}...` })

    try {
      const signature = await swap(tokenA, tokenB, inTokenAmount, outTokenAmount, slippage, wallet, connection, network)
      notify({
        type: 'success',
        message: 'Swap successful!',
        description: `You traded ${inTokens} for at least ${outTokens}`,
        icon: 'success',
        txid: signature
      })
      setTimeout(() => wallet.publicKey && fetchAccounts(wallet.publicKey), 1000)
    } catch (e: any) {
      notify({ type: 'error', message: 'Swap failed', icon: 'error' }, e)
    }
  }

  const switchTokens = () => {
    if (!tokenA || !tokenB) return

    setTokenA(tokenB)
    setTokenB(tokenA)
  }

  useEffect(() => {
    setTokenA(null)
    setTokenB(null)
  }, [connection])

  useEffect(() => {
    refreshRates().then()
  }, [inTokenAmount, refreshRates, tokenA, tokenB])

  useEffect(() => {
    const interval = setInterval(() => refreshRates(), 10000)

    return () => clearInterval(interval)
  }, [refreshRates])

  return (
    <SwapContext.Provider
      value={{
        fetching,
        inTokenAmount,
        outTokenAmount,
        rates,
        refreshRates,
        setInTokenAmount,
        setOutTokenAmount,
        setRates,
        setTokenA,
        setTokenB,
        swapTokens,
        switchTokens,
        tokenA,
        tokenB
      }}
    >
      {children}
    </SwapContext.Provider>
  )
}

export const useSwap = (): ISwapConfig => {
  const context = useContext(SwapContext)
  if (!context) {
    throw new Error('Missing swap context')
  }

  return {
    fetching: context.fetching,
    inTokenAmount: context.inTokenAmount,
    outTokenAmount: context.outTokenAmount,
    rates: context.rates,
    refreshRates: context.refreshRates,
    setInTokenAmount: context.setInTokenAmount,
    setOutTokenAmount: context.setOutTokenAmount,
    setRates: context.setRates,
    setTokenA: context.setTokenA,
    setTokenB: context.setTokenB,
    swapTokens: context.swapTokens,
    switchTokens: context.switchTokens,
    tokenA: context.tokenA,
    tokenB: context.tokenB
  }
}
