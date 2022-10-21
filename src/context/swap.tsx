import React, {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState
} from 'react'
import moment from 'moment'
import { useWallet } from '@solana/wallet-adapter-react'
import { useAccounts } from './accounts'
import { useConnectionConfig, useSlippageConfig } from './settings'
import { notify } from '../utils'
import { swap, preSwapAmount } from '../web3'
import JSBI from 'jsbi'
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
  name?: string
  logoURI?: string
}

interface ISwapConfig {
  fetching: boolean
  inTokenAmount: number
  loading: boolean
  outTokenAmount: number
  pool: IPool
  setFocused: Dispatch<SetStateAction<SwapInput>>
  setInTokenAmount: Dispatch<SetStateAction<number>>
  setOutTokenAmount: Dispatch<SetStateAction<number>>
  setPriceImpact: Dispatch<SetStateAction<number>>
  setPool: Dispatch<SetStateAction<IPool>>
  setTokenA: Dispatch<SetStateAction<ISwapToken | null>>
  setTokenB: Dispatch<SetStateAction<ISwapToken | null>>
  swapTokens: (a: any, b: any) => void
  switchTokens: () => void
  amountPool: () => Promise<void>
  tokenA: ISwapToken | null
  tokenB: ISwapToken | null
  connection?: any
  network?: any
  priceImpact?: number
  chosenRoutes: any[]
  setRoutes: (r: any) => void
  clickNo: number
  setClickNo: (r: number) => void
  gofxOutAmount: number
}

const SwapContext = createContext<ISwapConfig | null>(null)

export const SwapProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { fetchAccounts } = useAccounts()
  const { connection, network } = useConnectionConfig()
  const { slippage } = useSlippageConfig()
  const wallet = useWallet()
  const [fetching] = useState(false)
  const [inTokenAmount, setInTokenAmount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [outTokenAmount, setOutTokenAmount] = useState(0)
  const [gofxOutAmount, setGofxOutAmount] = useState(0)
  const [priceImpact, setPriceImpact] = useState(0)
  const [, setFocused] = useState<SwapInput>(undefined)
  const [chosenRoutes, setRoutes] = useState([])
  const [clickNo, setClickNo] = useState(0)
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

  const amountPool = async () => {
    if (tokenA && tokenB) {
      let outTokenAmount = 0
      if (
        inTokenAmount &&
        inTokenAmount != 0 &&
        chosenRoutes[clickNo] &&
        !chosenRoutes[clickNo]?.marketInfos?.[0].amm.label.toLowerCase().includes('goosefx')
      ) {
        const { priceImpactPct: impact, outAmount } = chosenRoutes[clickNo]
        const outedAmount = +(outAmount / 10 ** tokenB.decimals).toFixed(7)

        if (outedAmount) {
          outTokenAmount = Number(outedAmount)
          setPriceImpact(impact)
        } else {
          notify({ type: 'error', message: 'Fetch Pre-swap Amount Failed', icon: 'error' })
        }
      } else if (
        inTokenAmount &&
        inTokenAmount != 0 &&
        chosenRoutes[clickNo]?.marketInfos?.[0].amm.label.toLowerCase().includes('goosefx')
      ) {
        const { impact, preSwapResult } = await getGofxPool()
        if (preSwapResult) {
          outTokenAmount = Number(preSwapResult)
          setPriceImpact(impact)
        } else {
          notify({ type: 'error', message: 'Fetch Pre-swap Amount Failed', icon: 'error' })
        }
      }
      setOutTokenAmount(outTokenAmount)
    } else {
      setOutTokenAmount(0)
    }
  }

  const getGofxPool = async () => {
    if (
      tokenA &&
      tokenB &&
      inTokenAmount &&
      inTokenAmount != 0 &&
      chosenRoutes[clickNo]?.marketInfos?.[0].amm.label.toLowerCase().includes('goosefx')
    ) {
      const { gofxAmount, impact, preSwapResult } = await preSwapAmount(
        tokenA,
        tokenB,
        inTokenAmount,
        wallet,
        connection,
        network,
        chosenRoutes[0]
      )
      if (gofxAmount) {
        setGofxOutAmount(Number(gofxAmount))
      }

      return { impact, preSwapResult }
    }
  }

  const amountPoolGoose = async () => {
    const index = chosenRoutes.findIndex((route) =>
      route.marketInfos?.[0].amm.label.toLowerCase().includes('goosefx')
    )

    if (index < 0 || clickNo !== index) return //allow only to refresh if chosen route is gofx route

    const { gofxAmount, impact, preSwapResult } = await preSwapAmount(
      tokenA,
      tokenB,
      inTokenAmount,
      wallet,
      connection,
      network,
      chosenRoutes[index]
    )
    if (gofxAmount) {
      setGofxOutAmount(Number(gofxAmount))
    }

    if (preSwapResult) {
      setOutTokenAmount(Number(preSwapResult))
      setPriceImpact(impact)
    }
  }

  useEffect(() => {
    if (chosenRoutes.length < 1 && inTokenAmount > 0 && tokenA && tokenB) {
      setLoading(true)
    } else {
      setLoading(false)
    }
  }, [chosenRoutes, inTokenAmount, tokenA, tokenB])

  useEffect(() => {
    amountPool()
  }, [inTokenAmount, slippage, tokenA, tokenB, clickNo])

  useEffect(() => {
    const interval = setInterval(() => {
      amountPoolGoose()
    }, 5000)
    return () => clearInterval(interval)
  }, [amountPoolGoose])

  const swapTokens = async (route: any, exchange: any) => {
    if (!tokenA || !tokenB) return

    setLoading(true)
    const inTokens = `${inTokenAmount} ${tokenA.symbol}`
    const outTokens = `${outTokenAmount * (1 - slippage)} ${tokenB.symbol}`
    notify({ message: `Trying to swap ${inTokens} for at least ${outTokens}...` })

    try {
      const signature = await callPathExchange(route, exchange)
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

  function marketInfoFormat(mkt: any) {
    return {
      ...mkt,
      inAmount: JSBI.BigInt(mkt.inAmount),
      outAmount: JSBI.BigInt(mkt.outAmount),
      lpFee: {
        ...mkt.lpFee,
        amount: JSBI.BigInt(mkt.lpFee.amount)
      },
      platformFee: {
        ...mkt.platformFee,
        amount: JSBI.BigInt(mkt.platformFee.amount)
      }
    }
  }

  function revertRoute(route: any) {
    return {
      ...route,
      inAmount: JSBI.BigInt(route.inAmount),
      outAmount: JSBI.BigInt(route.outAmount),
      amount: JSBI.BigInt(route.amount),
      outAmountWithSlippage: JSBI.BigInt(route.otherAmountThreshold),
      marketInfos: route.marketInfos.map((mkt) => marketInfoFormat(mkt))
    }
  }

  async function callPathExchange(route: any, exchange: any) {
    if (route.marketInfos[0].amm.label === 'GooseFX') {
      return await swap(tokenA, tokenB, inTokenAmount, outTokenAmount, slippage, wallet, connection, network)
    } else {
      const swapResult = await exchange({
        wallet: {
          sendTransaction: wallet.sendTransaction,
          publicKey: wallet.publicKey,
          signAllTransactions: wallet.signAllTransactions,
          signTransaction: wallet.signTransaction
        },
        routeInfo: revertRoute(route),
        onTransaction: async (txid: any) => {
          const result = await connection.confirmTransaction(txid)
          if (!result.value.err) {
            return await connection.getTransaction(txid, {
              commitment: 'confirmed'
            })
          }
          return null
        }
      })
      return swapResult.txid
    }
  }

  return (
    <SwapContext.Provider
      value={{
        fetching,
        inTokenAmount,
        loading,
        outTokenAmount,
        pool,
        setFocused,
        setInTokenAmount,
        setOutTokenAmount,
        amountPool,
        setPool,
        setTokenA,
        setTokenB,
        swapTokens,
        switchTokens,
        tokenA,
        tokenB,
        connection,
        priceImpact,
        setPriceImpact,
        chosenRoutes,
        setRoutes,
        setClickNo,
        clickNo,
        network,
        gofxOutAmount
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
    setFocused: context.setFocused,
    setInTokenAmount: context.setInTokenAmount,
    setOutTokenAmount: context.setOutTokenAmount,
    setPool: context.setPool,
    setTokenA: context.setTokenA,
    setTokenB: context.setTokenB,
    swapTokens: context.swapTokens,
    switchTokens: context.switchTokens,
    tokenA: context.tokenA,
    tokenB: context.tokenB,
    connection: context.connection,
    setPriceImpact: context.setPriceImpact,
    priceImpact: context.priceImpact,
    chosenRoutes: context.chosenRoutes,
    setRoutes: context.setRoutes,
    setClickNo: context.setClickNo,
    clickNo: context.clickNo,
    network: context.network,
    gofxOutAmount: context.gofxOutAmount,
    amountPool: context.amountPool
  }
}
