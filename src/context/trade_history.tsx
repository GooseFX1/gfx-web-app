import React, {
  FC,
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { Order } from '@project-serum/serum/lib/market'
import { useWallet } from '@solana/wallet-adapter-react'
import { AVAILABLE_MARKETS } from './order'
import { useConnectionConfig } from './settings'
import { notify, useLocalStorageState } from '../utils'
import { cancelCryptoOrder, serum, settleCryptoFunds } from '../web3'
import { Market, OpenOrders } from '@project-serum/serum'
import { PublicKey } from '@solana/web3.js'

export enum HistoryPanel {
  Orders = 'Open Orders',
  Trades = 'Recent Trade History',
  Balances = 'Balances'
}

export const PANELS_FIELDS: { [x in HistoryPanel]: string[] } = {
  [HistoryPanel.Orders]: ['Market', 'Side', 'Size', 'Price (USD)', 'Action'],
  [HistoryPanel.Trades]: ['Market', 'Side', 'Size', 'Price (USD)', 'Liquidity', 'Fees (USD)'],
  [HistoryPanel.Balances]: ['Coin', 'Orders', 'Unsettled', 'Action']
}

interface IOrder {
  name: string
  order: Order
}

interface ITradeHistoryConfig {
  cancelOrder: (x: IOrder) => Promise<void>
  getPairFromMarketAddress: (x: PublicKey) => string
  orders: IOrder[]
  openOrders: OpenOrders[]
  panel: HistoryPanel
  setPanel: Dispatch<SetStateAction<HistoryPanel>>
  settleFunds: (x: OpenOrders, y: string) => Promise<void>
  tradeHistory: number[]
}

const TradeHistoryContext = createContext<ITradeHistoryConfig | null>(null)

export const TradeHistoryProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { connection } = useConnectionConfig()
  const wallet = useWallet()
  const [openOrders, setOpenOrders] = useState<OpenOrders[]>([])
  const [markets, setMarkets] = useState<Market[]>([])
  const [orders, setOrders] = useState<IOrder[]>([])
  const [tradeHistory, setTradeHistory] = useState([])
  const [panel, setPanel] = useLocalStorageState('historyPanel', HistoryPanel.Orders)

  const fetchBalances = useCallback(async () => {
    if (wallet.publicKey) {
      try {
        const openOrders = await Promise.all(markets.map((market) =>
          serum.getOpenOrders(connection, market, wallet.publicKey as PublicKey))
        )
        setOpenOrders(openOrders.flat())
      } catch (e: any) {
        notify({ type: 'error', message: `Error fetching balances from serum market`, icon: 'error' }, e)
      }
    }
  }, [connection, markets, wallet.publicKey])

  const fetchOpenOrders = useCallback(async () => {
    if (wallet.publicKey) {
      try {
        const marketsOrders = await Promise.all(markets.map((market) =>
          serum.getOrders(connection, market, wallet.publicKey as PublicKey))
        )
        // const orders = marketsOrders.map((orders, index) => orders.map((order) => ({ name: AVAILABLE_MARKETS[index].name, order })))
        const orders = marketsOrders.map((orders) => orders.map((order) => ({ name: 'SOL/USDC', order })))
        setOrders(orders.flat())
      } catch (e: any) {
        notify({ type: 'error', message: `Error fetching open orders from serum market`, icon: 'error' }, e)
      }
    }
  }, [connection, markets, wallet.publicKey])

  const cancelOrder = async (order: IOrder) => {
    try {
      const market = await serum.getMarket(connection, order.name)
      const signature = await cancelCryptoOrder(connection, market, order.order, wallet)
      notify({ type: 'success', message: 'Order cancelled successfully', txid: signature })
      setTimeout(() => fetchOpenOrders(), 4500)
    } catch (e: any) {
      notify({ type: 'error', message: `Error cancelling order`, icon: 'error', description: e.message })
    }
  }

  const getPairFromMarketAddress = (address: PublicKey) => serum.getMarketFromAddress(address)!.name

  const settleFunds = async (openOrder: OpenOrders, pair: string) => {
    try {
      const market = await serum.getMarket(connection, pair)
      const signature = await settleCryptoFunds(connection, market, openOrder, wallet)
      notify({ type: 'success', message: 'Settled funds successfully', txid: signature })
      setTimeout(() => fetchBalances(), 4500)
    } catch (e: any) {
      notify({ type: 'error', message: `Error settling funds`, icon: 'error', description: e.message })
    }
  }

  useEffect(() => {
    (async () => {
      // setMarkets(await Promise.all(AVAILABLE_MARKETS.map(({ name }) => serum.getMarket(connection, name))))
      setMarkets(await Promise.all([{ name: 'SOL/USDC' }].map(({ name }) => serum.getMarket(connection, name))))
    })()
  }, [connection])

  useEffect(() => {
    switch (panel) {
      case HistoryPanel.Balances:
        (async () => fetchBalances())()
        return
      case HistoryPanel.Orders:
        (async () => fetchOpenOrders())()
        return
    }
  }, [fetchBalances, fetchOpenOrders, panel])

  return (
    <TradeHistoryContext.Provider
      value={{
        cancelOrder,
        getPairFromMarketAddress,
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
    getPairFromMarketAddress: context.getPairFromMarketAddress,
    openOrders: context.openOrders,
    orders: context.orders,
    panel: context.panel,
    setPanel: context.setPanel,
    settleFunds: context.settleFunds,
    tradeHistory: context.tradeHistory
  }
}
