import React, {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo
} from 'react'
import moment from 'moment'
import { useWallet } from '@solana/wallet-adapter-react'
import { useAccounts } from './accounts'
import { useConnectionConfig, useSlippageConfig } from './settings'
import { notify } from '../utils'
import { swap, preSwapAmount, getTransactionHistory, confirmTransaction } from '../web3'
import JSBI from 'jsbi'
import CoinGecko from 'coingecko-api'

const CoinGeckoClient = new CoinGecko()
import { CURRENT_SUPPORTED_TOKEN_LIST } from '../constants'
import { useTokenRegistry } from './token_registry'

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
  amountPool?: () => Promise<void>
  amountPoolGfx?: () => Promise<void>
  getTransactionsHistory?: () => Promise<any>
  tokenA: ISwapToken | null
  tokenB: ISwapToken | null
  priceImpact?: number
  chosenRoutes: any[]
  setRoutes: (r: any) => void
  clickNo: number
  setClickNo: (r: number) => void
  gofxOutAmount: number
  CoinGeckoClient: any
  coingeckoTokens: any[]
  coingeckoTokenMap: Map<string, IGeckoCoin>
  marketInfoFormat: (mkt: any) => any
  revertRoute: (route: any, toNumber?: boolean) => any
}
//TODO: properly type the above out -^
interface IGeckoCoin {
  id: string
  symbol: string
  name: string
}

const SwapContext = createContext<ISwapConfig | null>(null)

export const SwapProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { fetchAccounts } = useAccounts()
  const { connection, network } = useConnectionConfig()
  const { slippage } = useSlippageConfig()
  const { tokenMap } = useTokenRegistry()
  const wal = useWallet()
  const { sendTransaction, signAllTransactions, signTransaction, wallet } = useWallet()
  const [inTokenAmount, setInTokenAmount] = useState<null | number>(null)
  const [loading, setLoading] = useState(true)
  const [outTokenAmount, setOutTokenAmount] = useState(0)
  const [gofxOutAmount, setGofxOutAmount] = useState(0)
  const [priceImpact, setPriceImpact] = useState(0)
  const [, setFocused] = useState<SwapInput>(undefined)
  const [chosenRoutes, setRoutes] = useState([])
  const [clickNo, setClickNo] = useState(0)
  const [coingeckoTokens, setCoingeckoTokens] = useState([])
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
  /**
   * Symbol - Uppercase
   * Name - Lowercase
   */
  const coingeckoTokenMap = useMemo(() => {
    const data: [string, IGeckoCoin][] = []
    for (const token of coingeckoTokens) {
      data.push([token.symbol.toUpperCase(), token])
      data.push([token.name.toLowerCase(), token])
    }
    return new Map(data)
  }, [coingeckoTokens])
  const amountPoolJup = useCallback(async () => {
    if (tokenA && tokenB && chosenRoutes.length > 0) {
      let outTokenAmount = 0
      setLoading(true)
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
        setOutTokenAmount(outTokenAmount)
      }
    } else {
      setOutTokenAmount(0)
    }
    setLoading(false)
  }, [tokenA, tokenB, inTokenAmount, clickNo, chosenRoutes])

  const getGofxPool = useCallback(async () => {
    if (tokenA && tokenB && inTokenAmount && inTokenAmount != 0) {
      const { gofxAmount, impact, preSwapResult } = await preSwapAmount(
        tokenA,
        tokenB,
        inTokenAmount,
        connection,
        network
      )
      if (gofxAmount) {
        setGofxOutAmount(Number(gofxAmount))
      }

      return { impact, preSwapResult }
    }
  }, [tokenA, tokenB, inTokenAmount, connection, network, preSwapAmount])

  const amountPoolGfx = useCallback(async () => {
    if (tokenA && tokenB) {
      let outTokenAmount = 0
      if (
        inTokenAmount &&
        inTokenAmount >= 0 &&
        CURRENT_SUPPORTED_TOKEN_LIST.has(tokenA?.symbol) &&
        CURRENT_SUPPORTED_TOKEN_LIST.has(tokenB?.symbol)
      ) {
        const gfxPool = await getGofxPool()
        if (gfxPool !== undefined) {
          outTokenAmount = Number(gfxPool.preSwapResult)
          setPriceImpact(gfxPool.impact)
          setOutTokenAmount(outTokenAmount)
        }
      }
    }
  }, [tokenA, tokenB, inTokenAmount, getGofxPool])

  const amountPoolGoose = useCallback(async () => {
    const index = chosenRoutes.findIndex((route) =>
      route.marketInfos?.[0].amm.label.toLowerCase().includes('goosefx')
    )

    if (index < 0 || clickNo !== index) return //allow only to refresh if chosen route is gofx route
    const { impact, preSwapResult } = await getGofxPool()

    if (preSwapResult) {
      setOutTokenAmount(Number(preSwapResult))
      setPriceImpact(impact)
    }
  }, [chosenRoutes, clickNo])

  const getTransactionsHistory = useCallback(async () => {
    //get past 5 transactions using jupiter stats api and get past 5 transactions using the txn history method.
    // why I added jup api is based on the node rpc?
    // getting the txn history directly is extremely unreliable for old txns beyond 24hrs

    if (wallet?.adapter?.publicKey) {
      const url = `https://stats.jup.ag/transactions?publicKey=${wallet.adapter.publicKey}`
      // TODO: test vs promise.all
      const response = await fetch(url)
      const externalTxns = await response.json()
      const gfxTxns = await getTransactionHistory(wallet.adapter.publicKey, connection, 5)
      const txns = []
      //creates map of token symbol to token object
      // merge gfxTxns and external txns in one array
      for (let i = 0; i < gfxTxns.length; i++) {
        const tokenA = tokenMap.get(gfxTxns[i].inMint)
        const tokenB = tokenMap.get(gfxTxns[i].outMint)
        txns.push({
          ...gfxTxns[i],
          inSymbol: gfxTxns[i].inSymbol || tokenA?.symbol,
          outSymbol: gfxTxns[i].outSymbol || tokenB?.symbol,
          inAmountInDecimal:
            Number(gfxTxns[i]?.inAmountInDecimal) || Number(gfxTxns[i].inAmount) / 10 ** tokenA?.decimals,
          outAmountInDecimal:
            Number(gfxTxns[i]?.outAmountInDecimal) || Number(gfxTxns[i].outAmount) / 10 ** tokenB?.decimals,
          logoUriA: tokenA?.logoURI,
          logoUriB: tokenB?.logoURI
        })
      }
      for (let i = 0; i < Math.max(0, Math.min(externalTxns.length, externalTxns.length - 10)); i++) {
        const tokenA = tokenMap.get(externalTxns[i].inMint)
        const tokenB = tokenMap.get(externalTxns[i].outMint)
        txns.push({
          ...externalTxns[i],
          inSymbol: externalTxns[i].inSymbol || tokenA?.symbol,
          outSymbol: externalTxns[i].outSymbol || tokenB?.symbol,
          inAmountInDecimal:
            Number(externalTxns[i]?.inAmountInDecimal) ||
            Number(externalTxns[i].inAmount) / 10 ** tokenA?.decimals,
          outAmountInDecimal:
            Number(externalTxns[i]?.outAmountInDecimal) ||
            Number(externalTxns[i].outAmount) / 10 ** tokenB?.decimals,
          logoUriA: tokenA?.logoURI,
          logoUriB: tokenB?.logoURI
        })
      }

      return txns.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    }
    return []
  }, [wallet, connection, tokenMap])

  useEffect(() => {
    if (chosenRoutes.length < 1 && inTokenAmount > 0 && tokenA && tokenB) {
      setLoading(true)
    } else {
      setLoading(false)
    }
  }, [chosenRoutes, inTokenAmount, tokenA, tokenB])

  useEffect(() => {
    amountPoolJup()
  }, [inTokenAmount, slippage, tokenA, tokenB, clickNo, chosenRoutes])

  useEffect(() => {
    amountPoolGfx()
  }, [inTokenAmount, slippage, tokenA, tokenB, clickNo])

  useEffect(() => {
    CoinGeckoClient.coins
      .list()
      .then((data) => {
        setCoingeckoTokens(data.data)
        //console.log('data', data.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  useEffect(() => {
    const interval = setInterval(async () => {
      //should prevent scenarios where response takes >= 5s and gets rexecuted
      await amountPoolGoose()
    }, 5000)
    return () => clearInterval(interval)
  }, [])
  const marketInfoFormat = useCallback((mkt: any, toNumber?: boolean) => {
    if (toNumber) {
      return {
        ...mkt,
        inAmount: JSBI.toNumber(mkt.inAmount),
        outAmount: JSBI.toNumber(mkt.outAmount),
        lpFee: {
          ...mkt.lpFee,
          amount: JSBI.toNumber(mkt.lpFee.amount)
        },
        platformFee: {
          ...mkt.platformFee,
          amount: JSBI.toNumber(mkt.platformFee.amount)
        }
      }
    }
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
  }, [])

  const revertRoute = useCallback((route: any, toNumber?: boolean) => {
    //toNumber for display - BigInt for calculations
    if (toNumber) {
      // propogate to marketInfoFormat call
      return {
        ...route,
        inAmount: JSBI.toNumber(route.inAmount),
        outAmount: JSBI.toNumber(route.outAmount),
        amount: JSBI.toNumber(route.amount),
        outAmountWithSlippage: JSBI.toNumber(route.otherAmountThreshold),
        marketInfos: route.marketInfos.map((mkt) => marketInfoFormat(mkt, true))
      }
    }
    return {
      ...route,
      inAmount: JSBI.BigInt(route.inAmount),
      outAmount: JSBI.BigInt(route.outAmount),
      amount: JSBI.BigInt(route.amount),
      outAmountWithSlippage: JSBI.BigInt(route.otherAmountThreshold),
      marketInfos: route.marketInfos.map((mkt) => marketInfoFormat(mkt))
    }
  }, [])
  //depends on a bunch of states - memoizing in case of child/parent rerender triggers
  const callPathExchange = useCallback(
    async (route: any, exchange: any) => {
      if (route.marketInfos[0].amm.label === 'GooseFX') {
        return await swap(tokenA, tokenB, inTokenAmount, outTokenAmount, slippage, wal, connection, network)
      } else {
        const swapResult = await exchange({
          onTransaction: async (txid: string) => await confirmTransaction(connection, txid, 'confirmed'),
          wallet: {
            sendTransaction,
            publicKey: wallet?.adapter?.publicKey,
            signAllTransactions,
            signTransaction
          },
          routeInfo: revertRoute(route)
        })

        return swapResult.txid
      }
    },
    [
      tokenA,
      tokenB,
      inTokenAmount,
      outTokenAmount,
      slippage,
      wal,
      connection,
      network,
      sendTransaction,
      wallet,
      signAllTransactions,
      signTransaction,
      revertRoute
    ]
  )
  const swapTokens = useCallback(
    async (route: any, exchange: any) => {
      if (!tokenA || !tokenB) return
      setLoading(true)
      const inTokens = `${inTokenAmount} ${tokenA.symbol}`
      const outTokens = `${outTokenAmount * (1 - slippage)} ${tokenB.symbol}`
      notify({ message: `Trying to swap ${inTokens} for at least ${outTokens}...` })

      try {
        const signature = await callPathExchange(route, exchange)
        if (!signature) throw new Error('Swap unsuccessful')

        const description =
          wallet.adapter.name !== 'SquadsX'
            ? `You traded ${inTokens} for at least ${outTokens}`
            : `You initialized a trade for ${inTokens} to at least ${outTokens}. 
            Execute it on Squads for the changes to take place`

        const message = wallet.adapter.name !== 'SquadsX' ? 'Swap successful!' : 'Swap initialized!'

        notify({
          type: 'success',
          message,
          description,
          icon: 'success',
          txid: signature,
          network: network
        })
        setTimeout(() => wallet?.adapter?.publicKey && fetchAccounts(), 3000)
      } catch (e: any) {
        console.log(e)
        notify({ type: 'error', message: 'Swap failed', icon: 'error' }, e)
      }

      setLoading(false)
    },
    [tokenA, tokenB, inTokenAmount, outTokenAmount, slippage, network, wallet, fetchAccounts, callPathExchange]
  )

  const switchTokens = useCallback(() => {
    if (!tokenA || !tokenB) return
    setTokenA(tokenB)
    setTokenB(tokenA)
  }, [tokenA, tokenB])

  //default - on switching tokens clear routes
  useEffect(() => {
    setRoutes([])
    setClickNo(0)
  }, [tokenA, tokenB, inTokenAmount])

  return (
    <SwapContext.Provider
      value={{
        inTokenAmount,
        loading,
        outTokenAmount,
        pool,
        setFocused,
        setInTokenAmount,
        setOutTokenAmount,
        amountPoolGfx,
        amountPool: amountPoolJup,
        setPool,
        setTokenA,
        setTokenB,
        swapTokens,
        switchTokens,
        tokenA,
        tokenB,
        priceImpact,
        setPriceImpact,
        chosenRoutes,
        setRoutes,
        setClickNo,
        clickNo,
        gofxOutAmount,
        getTransactionsHistory,
        CoinGeckoClient,
        coingeckoTokens,
        coingeckoTokenMap,
        marketInfoFormat,
        revertRoute
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
  return context
}
