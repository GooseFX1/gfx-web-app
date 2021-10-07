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
import { Market, MARKETS } from '@project-serum/serum'
import { useWallet } from '@solana/wallet-adapter-react'
import { useCrypto } from './crypto'
import { useConnectionConfig } from './settings'
import { SUPPORTED_TOKEN_LIST } from '../constants'
import { capitalizeFirstLetter, notify } from '../utils'
import { placeCryptoOrder } from '../web3'
import { useTradeHistory } from './trade_history'

export type OrderDisplayType = 'market' | 'limit'
export type OrderSide = 'buy' | 'sell'
export type OrderType = 'limit' | 'ioc' | 'postOnly'

export interface IOrder {
  display: OrderDisplayType
  isHidden: boolean
  price: number
  side: OrderSide
  size: number
  total: number
  type: OrderType
}

interface IOrderDisplay {
  display: OrderDisplayType
  side: OrderSide
  text: string
  tooltip: string
}

export const AVAILABLE_MARKETS = MARKETS.filter(({ deprecated, name }) => {
  const ask = (name: string) => name.slice(0, name.indexOf('/'))
  const isWrappedStableCoin = name[name.indexOf('/') + 1] === 'W'
  return !deprecated && !isWrappedStableCoin && SUPPORTED_TOKEN_LIST.find((token) => ask(name) === token)
}).sort((a, b) => a.name.localeCompare(b.name))

export const AVAILABLE_ORDERS: IOrderDisplay[] = [
  /* {
    display: 'market',
    side: 'buy',
    text: 'Market',
    tooltip: 'Market order is executed immediately at the best price available in the market.'
  }, */
  {
    display: 'limit',
    side: 'buy',
    text: 'Limit',
    tooltip: 'Limit order is executed only when the market reaches the price you specify.'
  },
  /* {
    display: 'market',
    side: 'sell',
    text: 'Market',
    tooltip: 'Market order is executed immediately at the best price available in the market.'
  }, */
  {
    display: 'limit',
    side: 'sell',
    text: 'Limit',
    tooltip: 'Limit order is executed only when the market reaches the price you specify.'
  }
]

interface IOrderConfig {
  order: IOrder
  placeOrder: () => void
  setOrder: Dispatch<SetStateAction<IOrder>>
}

const OrderContext = createContext<IOrderConfig | null>(null)

export const OrderProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { connection } = useConnectionConfig()
  const { getAskSymbolFromPair, selectedCrypto } = useCrypto()
  const { fetchOpenOrders } = useTradeHistory()
  const wallet = useWallet()
  const [order, setOrder] = useState<IOrder>({
    display: 'limit',
    isHidden: true,
    price: 0,
    side: 'buy',
    size: 0,
    total: 0,
    type: 'limit'
  })

  let tickSizeTimeout: MutableRefObject<NodeJS.Timeout | undefined> = useRef()
  const timeoutDelay = 500
  const roundSizeToTickSize = useCallback(() => {
    if (tickSizeTimeout.current) {
      clearTimeout(tickSizeTimeout.current)
    }

    tickSizeTimeout.current = setTimeout(async () => {
      if (selectedCrypto.market) {
        const { tickSize } = selectedCrypto.market
        setOrder((prevState) => ({ ...prevState, size: Math.floor(order.size / tickSize) * tickSize }))
      }
    }, timeoutDelay)
  }, [order.size, selectedCrypto.market])

  useEffect(() => roundSizeToTickSize(), [order.size, roundSizeToTickSize])

  useEffect(
    () => setOrder((prevState) => ({ ...prevState, total: order.price * order.size })),
    [order.price, order.size]
  )

  useEffect(() => {
    if (order.price > 0) {
      setOrder((prevState) => ({ ...prevState, size: order.total / order.price }))
    }

    /* eslint-disable-next-line react-hooks/exhaustive-deps */ // <- IMPORTANT
  }, [order.total])

  const placeOrder = useCallback(async () => {
    try {
      await placeCryptoOrder(connection, selectedCrypto.market as Market, order, wallet)
      const ask = getAskSymbolFromPair(selectedCrypto.pair)
      notify({
        type: 'success',
        message: `${capitalizeFirstLetter(order.display)} order placed successfully!`,
        description: `${capitalizeFirstLetter(order.side)}ing ${order.size} ${ask} at ${order.price}$ each`,
        icon: 'trade_success'
      })
      setTimeout(() => fetchOpenOrders(), 4500)
    } catch (e: any) {
      notify({ type: 'error', message: `${capitalizeFirstLetter(order.display)} failed`, icon: 'trade_error' }, e)
    }
  }, [connection, fetchOpenOrders, getAskSymbolFromPair, order, selectedCrypto.market, selectedCrypto.pair, wallet])

  return (
    <OrderContext.Provider
      value={{
        order,
        placeOrder,
        setOrder
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}

export const useOrder = (): IOrderConfig => {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error('Missing order context')
  }

  const { order, placeOrder, setOrder } = context
  return { order, placeOrder, setOrder }
}
