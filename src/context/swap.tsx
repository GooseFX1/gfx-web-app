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
import { computePoolsPDAs, serum, swap, preSwapAmount } from '../web3'

export type SwapInput = undefined | 'from' | 'to'

interface IPool {
  inAmount: number
  inValue: number
  outAmount: number
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
  loading: boolean
  outTokenAmount: number
  pool: IPool
  refreshRates: () => void
  setFocused: Dispatch<SetStateAction<SwapInput>>
  setInTokenAmount: Dispatch<SetStateAction<number>>
  setOutTokenAmount: Dispatch<SetStateAction<number>>
  setPool: Dispatch<SetStateAction<IPool>>
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
  const [loading, setLoading] = useState(false)
  const [outTokenAmount, setOutTokenAmount] = useState(0)
  const [_, setFocused] = useState<SwapInput>(undefined)
  const [pool, setPool] = useState<IPool>({
    inAmount: 0,
    inValue: 0,
    outAmount: 0,
    outValue: 0,
    outValuePerIn: 0,
    time: moment().format('MMMM DD, h:mm a')
  })
  const [tokenA, setTokenA] = useState<ISwapToken | null>(null)
  const [tokenB, setTokenB] = useState<ISwapToken | null>(null)

  let refreshTimeout: MutableRefObject<NodeJS.Timeout | undefined> = useRef()
  const timeoutDelay = 200
  const refreshRates = useCallback(async () => {
    refreshTimeout.current && clearTimeout(refreshTimeout.current)
    refreshTimeout.current = setTimeout(async () => {
      setFetching(true)
      const time = moment().format('MMMM DD, h:mm a')

      if (tokenA) {
        let inValue = 0

        try {
          inValue = await serum.getLatestBid(connection, `${tokenA.symbol}/USDC`)
        } catch (e) {}

        setPool(({ inAmount, outAmount, outValue, outValuePerIn }) => ({
          inAmount,
          inValue,
          outAmount,
          outValue,
          outValuePerIn,
          time
        }))
      }

      if (tokenB) {
        let outValue = 0

        try {
          outValue = await serum.getLatestBid(connection, `${tokenB.symbol}/USDC`)
        } catch (e) {}

        setPool(({ inAmount, inValue, outAmount, outValuePerIn }) => ({
          inAmount,
          inValue,
          outAmount,
          outValue,
          outValuePerIn,
          time
        }))
      }

      if (tokenA && tokenB) {
        let inAmount = 0
        let outAmount = 0
        let outValuePerIn = 0

        try {
          const { decimals } = tokenA
          const { pool } = await computePoolsPDAs(tokenA, tokenB, network)
          const [aAccount, bAccount] = await Promise.all([
            connection.getParsedTokenAccountsByOwner(pool, { mint: new PublicKey(tokenA.address) }),
            connection.getParsedTokenAccountsByOwner(pool, { mint: new PublicKey(tokenB.address) })
          ])

          inAmount = parseFloat(aAccount.value[0].account.data.parsed.info.tokenAmount.amount)
          outAmount = parseFloat(bAccount.value[0].account.data.parsed.info.tokenAmount.amount)
          outValuePerIn = (outAmount - (inAmount * outAmount) / (inAmount + 10 ** decimals)) / 10 ** decimals
          amountPool()
        } catch (e) {
          //setOutTokenAmount(0)
          console.log(e)
        }

        setPool(({ inValue, outValue }) => ({
          inAmount,
          inValue,
          outAmount,
          outValue,
          outValuePerIn,
          time
        }))
      }

      setFetching(false)
    }, timeoutDelay)
  }, [connection, network, setPool, tokenA, tokenB])

  const amountPool = useCallback(async () => {
    if (tokenA && tokenB) {
      let outTokenAmount = 0
      if (inTokenAmount) {
        const preSwapResult = await preSwapAmount(tokenA, tokenB, inTokenAmount, wallet, connection, network)
        if (preSwapResult) {
          outTokenAmount = Number(preSwapResult)
        } else {
          notify({ type: 'error', message: 'Fetch Pre-swap Amount Failed', icon: 'error' })
        }
        //outAmount - (inAmount * outAmount) / (inAmount + inTokenAmount * 10 ** tokenA.decimals)
      }
      setOutTokenAmount(outTokenAmount)
    } else {
      setOutTokenAmount(0)
    }
  }, [tokenA, tokenB, inTokenAmount])

  useEffect(() => {
    setTokenA(null)
    setTokenB(null)
  }, [connection])

  useEffect(() => {
    amountPool()
  }, [inTokenAmount, pool, slippage, tokenA, tokenB])

  // useEffect(() => {
  //   refreshRates().then()
  // }, [inTokenAmount, refreshRates, tokenA, tokenB])

  useEffect(() => {
    const interval = setInterval(() => amountPool(), 20000)
    return () => clearInterval(interval)
  }, [amountPool])

  const swapTokens = async () => {
    if (!tokenA || !tokenB) return

    setLoading(true)
    const inTokens = `${inTokenAmount} ${tokenA.symbol}`
    const outTokens = `${outTokenAmount * (1 - slippage)} ${tokenB.symbol}`
    notify({ message: `Trying to swap ${inTokens} for at least ${outTokens}...` })

    try {
      const signature = await swap(tokenA, tokenB, inTokenAmount, outTokenAmount, slippage, wallet, connection, network)
      if (!signature) throw new Error('Swap unsuccessful')
      notify({
        type: 'success',
        message: 'Swap successful!',
        description: `You traded ${inTokens} for at least ${outTokens}`,
        icon: 'success',
        txid: signature,
        network: network
      })
      setTimeout(() => wallet.publicKey && fetchAccounts(), 3000)
    } catch (e: any) {
      console.log(e)
      notify({ type: 'error', message: 'Swap failed', icon: 'error' }, e)
    }

    setLoading(false)
  }

  const switchTokens = () => {
    if (!tokenA || !tokenB) return

    setTokenA(tokenB)
    setTokenB(tokenA)
  }

  return (
    <SwapContext.Provider
      value={{
        fetching,
        inTokenAmount,
        loading,
        outTokenAmount,
        pool,
        refreshRates,
        setFocused,
        setInTokenAmount,
        setOutTokenAmount,
        setPool,
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
    loading: context.loading,
    outTokenAmount: context.outTokenAmount,
    pool: context.pool,
    refreshRates: context.refreshRates,
    setFocused: context.setFocused,
    setInTokenAmount: context.setInTokenAmount,
    setOutTokenAmount: context.setOutTokenAmount,
    setPool: context.setPool,
    setTokenA: context.setTokenA,
    setTokenB: context.setTokenB,
    swapTokens: context.swapTokens,
    switchTokens: context.switchTokens,
    tokenA: context.tokenA,
    tokenB: context.tokenB
  }
}
