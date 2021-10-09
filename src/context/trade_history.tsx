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
import { cancelCryptoOrder, serum, settleCryptoFunds } from '../web3'

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
  fetchOpenOrders: () => Promise<void>
  getPairFromMarketAddress: (x: PublicKey) => string
  orders: IOrder[]
  openOrders: OpenOrders[]
  panel: HistoryPanel
  setPanel: Dispatch<SetStateAction<HistoryPanel>>
  settleFunds: (x: OpenOrders, y: number, z: string) => Promise<void>
  tradeHistory: any[]
}

const TradeHistoryContext = createContext<ITradeHistoryConfig | null>(null)

export const TradeHistoryProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { connection } = useConnectionConfig()
  const { getAskSymbolFromPair, selectedCrypto } = useCrypto()
  const wallet = useWallet()
  const [openOrders, setOpenOrders] = useState<OpenOrders[]>([])
  const [orders, setOrders] = useState<IOrder[]>([])
  const [tradeHistory, setTradeHistory] = useState([])
  const [panel, setPanel] = useLocalStorageState('historyPanel', HistoryPanel.Orders)

  const fetchBalances = useCallback(async () => {
    if (wallet.publicKey && selectedCrypto.market) {
      try {
        const openOrders = await serum.getOpenOrders(connection, selectedCrypto.market, wallet.publicKey as PublicKey)
        setOpenOrders(openOrders)
      } catch (e: any) {
        notify({ type: 'error', message: `Error fetching balances from serum market`, icon: 'error' }, e)
      }
    }
  }, [connection, selectedCrypto.market, wallet.publicKey])

  const fetchOpenOrders = useCallback(async () => {
    if (wallet.publicKey && selectedCrypto.market) {
      try {
        const marketsOrders = await serum.getOrders(connection, selectedCrypto.market, wallet.publicKey as PublicKey)
        setOrders(marketsOrders.map((marketOrder) => ({ order: marketOrder, name: selectedCrypto.pair })))
      } catch (e: any) {
        notify({ type: 'error', message: `Error fetching open orders from serum market`, icon: 'error' }, e)
      }
    }
  }, [connection, selectedCrypto.market, selectedCrypto.pair, wallet.publicKey])

  const getPairFromMarketAddress = (address: PublicKey) => serum.getMarketFromAddress(address)!.name

  const cancelOrder = async (order: IOrder) => {
    if (selectedCrypto.market) {
      try {
        const signature = await cancelCryptoOrder(connection, selectedCrypto.market, order.order, wallet)
        const ask = getAskSymbolFromPair(selectedCrypto.pair)
        const { price, side, size } = order.order
        notify({
          type: 'success',
          message: 'Action successful',
          description: `Cancelled ${side} order of ${size} ${ask} at $${price} each`,
          icon: 'success',
          txid: signature
        })
        setTimeout(() => fetchOpenOrders(), 4500)
      } catch (e: any) {
        notify({ type: 'error', message: `Error cancelling order`, icon: 'error', description: e.message })
      }
    }
  }

  const settleFunds = async (openOrder: OpenOrders, balance: number, symbol: string) => {
    if (selectedCrypto.market) {
      try {
        const signature = await settleCryptoFunds(connection, selectedCrypto.market, openOrder, wallet)
        notify({
          type: 'success',
          message: 'Action successful',
          description: `Settled ${balance} ${symbol}`,
          icon: 'success',
          txid: signature
        })
        setTimeout(() => fetchBalances(), 4500)
      } catch (e: any) {
        notify({ type: 'error', message: `Error settling funds`, icon: 'error', description: e.message })
      }
    }
  }

  useEffect(() => {
    setOpenOrders([])
    setOrders([])
    setTradeHistory([])
  }, [selectedCrypto])

  useEffect(() => {
    panel === HistoryPanel.Balances && fetchBalances()
    panel === HistoryPanel.Orders && fetchOpenOrders()
  }, [fetchBalances, fetchOpenOrders, panel])

  return (
    <TradeHistoryContext.Provider
      value={{
        cancelOrder,
        fetchOpenOrders,
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
    fetchOpenOrders: context.fetchOpenOrders,
    getPairFromMarketAddress: context.getPairFromMarketAddress,
    openOrders: context.openOrders,
    orders: context.orders,
    panel: context.panel,
    setPanel: context.setPanel,
    settleFunds: context.settleFunds,
    tradeHistory: context.tradeHistory
  }
}
