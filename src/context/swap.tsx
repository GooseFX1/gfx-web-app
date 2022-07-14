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
import { useAccounts } from './accounts'
import { useConnectionConfig, useSlippageConfig } from './settings'
import { notify } from '../utils'
import { serum, swap, preSwapAmount } from '../web3'
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
  setPriceImpact: Dispatch<SetStateAction<number>>
  setPool: Dispatch<SetStateAction<IPool>>
  setTokenA: Dispatch<SetStateAction<ISwapToken | null>>
  setTokenB: Dispatch<SetStateAction<ISwapToken | null>>
  swapTokens: (a: any, b: any) => void
  switchTokens: () => void
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
  const [fetching, setFetching] = useState(false)
  const [inTokenAmount, setInTokenAmount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [outTokenAmount, setOutTokenAmount] = useState(0)
  const [gofxOutAmount, setGofxOutAmount] = useState(0)
  const [priceImpact, setPriceImpact] = useState(0)
  const [_, setFocused] = useState<SwapInput>(undefined)
  const [chosenRoutes, setRoutes] = useState([])
  const [clickNo, setClickNo] = useState(1)
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
  //const swap = new Swap(connection)

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
          //const { decimals } = tokenA
          // const { pool } = await computePoolsPDAs(tokenA, tokenB, network)
          // const [aAccount, bAccount] = await Promise.all([
          //   connection.getParsedTokenAccountsByOwner(pool, { mint: new PublicKey(tokenA.address) }),
          //   connection.getParsedTokenAccountsByOwner(pool, { mint: new PublicKey(tokenB.address) })
          // ])

          // inAmount = parseFloat(aAccount.value[0].account.data.parsed.info.tokenAmount.amount)
          // outAmount = parseFloat(bAccount.value[0].account.data.parsed.info.tokenAmount.amount)
          // outValuePerIn = (outAmount - (inAmount * outAmount) / (inAmount + 10 ** decimals)) / 10 ** decimals
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
      if (inTokenAmount && inTokenAmount != 0) {
        // needed weak comaprison because of '0.00'=='0'
        const { preSwapResult, impact, gofxAmount } = await preSwapAmount(
          tokenA,
          tokenB,
          inTokenAmount,
          wallet,
          connection,
          network,
          chosenRoutes[clickNo],
          clickNo
        )
        if (preSwapResult) {
          outTokenAmount = Number(preSwapResult)
          setPriceImpact(impact)
          setGofxOutAmount(Number(gofxAmount))
        } else {
          notify({ type: 'error', message: 'Fetch Pre-swap Amount Failed', icon: 'error' })
        }
        //outAmount - (inAmount * outAmount) / (inAmount + inTokenAmount * 10 ** tokenA.decimals)
      }
      setOutTokenAmount(outTokenAmount)
    } else {
      setOutTokenAmount(0)
    }
  }, [tokenA, tokenB, inTokenAmount, chosenRoutes, clickNo])

  // useEffect(() => {
  //   setTokenA(null)
  //   setTokenB(null)
  // }, [connection])

  useEffect(() => {
    if (chosenRoutes.length < 1 && inTokenAmount > 0 && tokenA && tokenB) {
      setLoading(true)
    } else {
      setLoading(false)
    }
  }, [chosenRoutes, inTokenAmount, tokenA, tokenB])

  useEffect(() => {
    amountPool()
  }, [inTokenAmount, pool, slippage, tokenA, tokenB, chosenRoutes, clickNo])

  // useEffect(() => {
  //   refreshRates().then()
  // }, [inTokenAmount, refreshRates, tokenA, tokenB])

  useEffect(() => {
    const interval = setInterval(() => amountPool(), 20000)
    return () => clearInterval(interval)
  }, [amountPool])

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
          //console.log('sending transaction')
          let result = await connection.confirmTransaction(txid)
          //console.log('confirmed transaction')
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
    tokenB: context.tokenB,
    connection: context.connection,
    setPriceImpact: context.setPriceImpact,
    priceImpact: context.priceImpact,
    chosenRoutes: context.chosenRoutes,
    setRoutes: context.setRoutes,
    setClickNo: context.setClickNo,
    clickNo: context.clickNo,
    network: context.network,
    gofxOutAmount: context.gofxOutAmount
  }
}
