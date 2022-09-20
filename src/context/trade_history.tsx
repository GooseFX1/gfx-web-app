import React, {
  FC,
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'
import { Order } from '@project-serum/serum/lib/market'
import { OpenOrders } from '@project-serum/serum'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { useCrypto } from './crypto'
import { useConnectionConfig } from './settings'
import { notify, useLocalStorageState } from '../utils'
import { crypto, serum } from '../web3'
import axios from 'axios'

export enum HistoryPanel {
  Orders = 'Open Orders',
  Trades = 'Recent Trade History',
  Balances = 'Balances'
}

export const PANELS_FIELDS: { [x in HistoryPanel]: string[] } = {
  [HistoryPanel.Orders]: ['Market', 'Side', 'Size', 'Price (USD)', 'Action'],
  [HistoryPanel.Trades]: ['Market', 'Side', 'Size', 'Price (USD)', 'Liquidity', 'Fees (USD)'],
  [HistoryPanel.Balances]: ['Coin', 'Orders', 'Unsettled']
}

interface IOrder {
  name: string
  order: Order
}

interface ITradeHistoryConfig {
  cancelOrder: (x: IOrder) => Promise<void>
  fetchOpenOrders: () => Promise<void>
  getPairFromMarketAddress: (x: PublicKey) => string
  loading: boolean
  orders: IOrder[]
  openOrders: OpenOrders[]
  panel: HistoryPanel
  setPanel: Dispatch<SetStateAction<HistoryPanel>>
  settleFunds: (
    x: OpenOrders,
    yA: number | undefined,
    zA: number | undefined,
    yB: string,
    zB: string
  ) => Promise<void>
  tradeHistory: any[]
}

const TradeHistoryContext = createContext<ITradeHistoryConfig | null>(null)
const historyUrl = 'https://api.raydium.io/v1/dex/trade/address?market='

export const TradeHistoryProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { connection } = useConnectionConfig()
  const { getAskSymbolFromPair, selectedCrypto } = useCrypto()
  const wallet = useWallet()
  const [loading, setLoading] = useState(false)
  const [openOrders, setOpenOrders] = useState<OpenOrders[]>([])
  const [orders, setOrders] = useState<IOrder[]>([])
  const [tradeHistory, setTradeHistory] = useState([])
  const [panel, setPanel] = useLocalStorageState('historyPanel', HistoryPanel.Orders)

  const getMarketTrades = useCallback(async () => {
    try {
      if (selectedCrypto.market && selectedCrypto.market.address) {
        const marketAddress = selectedCrypto.market.address.toBase58(),
          url = historyUrl + marketAddress
        const response = await axios.get(url)
        if (response.data.data) {
          const dataToSort = response.data.data
          dataToSort.sort((a, b) => b.time - a.time)
          setTradeHistory(dataToSort)
        }
      } else {
        setTradeHistory([])
      }
    } catch (e) {
      await notify({ type: 'error', message: `Error fetching market trades`, icon: 'error' }, e)
    }
  }, [selectedCrypto.market])

  const fetchBalances = useCallback(async () => {
    if (wallet.publicKey && selectedCrypto.market) {
      try {
        const openOrders = await serum.getOpenOrders(
          connection,
          selectedCrypto.market,
          wallet.publicKey as PublicKey
        )
        setOpenOrders(openOrders)
      } catch (e: any) {
        await notify({ type: 'error', message: `Error fetching balances from serum market`, icon: 'error' }, e)
      }
    }
  }, [connection, selectedCrypto.market, wallet.publicKey])

  const fetchOpenOrders = useCallback(async () => {
    if (wallet.publicKey && selectedCrypto.market) {
      try {
        const marketsOrders = await serum.getOrders(
          connection,
          selectedCrypto.market,
          wallet.publicKey as PublicKey
        )
        setOrders(marketsOrders.map((marketOrder) => ({ order: marketOrder, name: selectedCrypto.pair })))
      } catch (e: any) {
        await notify({ type: 'error', message: `Error fetching open orders from serum market`, icon: 'error' }, e)
      }
    }
  }, [connection, selectedCrypto.market, selectedCrypto.pair, wallet.publicKey])

  const getPairFromMarketAddress = (address: PublicKey) => serum.getMarketFromAddress(address)?.name

  const cancelOrder = async (order: IOrder) => {
    setLoading(true)

    if (selectedCrypto.market) {
      try {
        const signature = await crypto.cancelOrder(connection, selectedCrypto.market, order.order, wallet)
        const ask = getAskSymbolFromPair(selectedCrypto.pair)
        const { price, side, size } = order.order
        await notify({
          type: 'success',
          message: 'Cancelled order successfully',
          description: `Cancelled ${side} order of ${size} ${ask} at $${price} each`,
          icon: 'success',
          txid: signature
        })
        setTimeout(() => fetchOpenOrders(), 3000)
      } catch (e: any) {
        await notify({ type: 'error', message: `Error cancelling order`, icon: 'error', description: e.message })
      }
    }

    setLoading(false)
  }

  const settleFunds = async (
    openOrder: OpenOrders,
    baseAvailable: number | undefined,
    quoteAvailable: number | undefined,
    baseSymbol: string,
    quoteSymbol: string
  ) => {
    if (selectedCrypto.market) {
      setLoading(true)

      try {
        const signature = await crypto.settleFunds(connection, selectedCrypto.market, openOrder, wallet)
        const baseTokens = baseAvailable && `${baseAvailable} ${baseSymbol}`
        const quoteTokens = quoteAvailable && `${quoteAvailable} ${quoteSymbol}`
        await notify({
          type: 'success',
          message: 'Settled balances successfully',
          description: `Settled ${[baseTokens, quoteTokens].filter((x) => x).join(' and ')}`,
          icon: 'success',
          txid: signature
        })
        setTimeout(() => fetchBalances(), 3000)
      } catch (e: any) {
        await notify({ type: 'error', message: `Error settling funds`, icon: 'error', description: e.message })
      }
    }

    setLoading(false)
  }

  useEffect(() => {
    setOpenOrders([])
    setOrders([])
    setTradeHistory([])
  }, [selectedCrypto])

  useEffect(() => {
    getMarketTrades()
  }, [selectedCrypto.market])

  useEffect(() => {
    fetchBalances()
    fetchOpenOrders()
  }, [fetchBalances, fetchOpenOrders, selectedCrypto.pair])

  return (
    <TradeHistoryContext.Provider
      value={{
        cancelOrder,
        fetchOpenOrders,
        getPairFromMarketAddress,
        loading,
        openOrders,
        orders,
        panel,
        setPanel,
        settleFunds,
        tradeHistory
      }}
    >
      {children}
    </TradeHistoryContext.Provider>
  )
}

export const useTradeHistory = (): ITradeHistoryConfig => {
  const context = useContext(TradeHistoryContext)
  if (!context) {
    throw new Error('Missing trade history context')
  }

  return {
    cancelOrder: context.cancelOrder,
    fetchOpenOrders: context.fetchOpenOrders,
    loading: context.loading,
    getPairFromMarketAddress: context.getPairFromMarketAddress,
    openOrders: context.openOrders,
    orders: context.orders,
    panel: context.panel,
    setPanel: context.setPanel,
    settleFunds: context.settleFunds,
    tradeHistory: context.tradeHistory
  }
}
