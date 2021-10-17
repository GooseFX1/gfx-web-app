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
  useMemo,
  useRef,
  useState
} from 'react'
import { Market, MARKETS } from '@project-serum/serum'
import { useWallet } from '@solana/wallet-adapter-react'
import { useCrypto } from './crypto'
import { useConnectionConfig } from './settings'
import { useTradeHistory } from './trade_history'
import { SUPPORTED_TOKEN_LIST } from '../constants'
import { capitalizeFirstLetter, decimalModulo, floorValue, notify, removeFloatingPointError } from '../utils'
import { crypto } from '../web3'

type OrderInput = undefined | 'price' | 'size' | 'total'
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
  setFocused: Dispatch<SetStateAction<OrderInput>>
  setOrder: Dispatch<SetStateAction<IOrder>>
}

const OrderContext = createContext<IOrderConfig | null>(null)

export const OrderProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { connection } = useConnectionConfig()
  const { getAskSymbolFromPair, marketsData, selectedCrypto } = useCrypto()
  const { fetchOpenOrders } = useTradeHistory()
  const wallet = useWallet()
  const [focused, setFocused] = useState<OrderInput>(undefined)
  const [order, setOrder] = useState<IOrder>({
    display: 'limit',
    isHidden: false,
    price: 0,
    side: 'buy',
    size: 0,
    total: 0,
    type: 'limit'
  })

  useEffect(() => setOrder((prevState) => ({ ...prevState, price: 0, size: 0, total: 0 })), [selectedCrypto])

  useEffect(() => {
    switch (focused) {
      case 'price':
      case 'size':
        return setOrder((prevState) => ({
          ...prevState,
          total: removeFloatingPointError((order.price || 1) * order.size)
        }))
      case 'total':
        return setOrder((prevState) => ({
          ...prevState,
          size: removeFloatingPointError(order.total / (order.price || 1))
        }))
    }
  }, [focused, order.price, order.size, order.total, selectedCrypto.market])

  const throttleDelay = 300
  let sizeThrottle: MutableRefObject<NodeJS.Timeout | undefined> = useRef()
  const floorSize = useCallback(async () => {
    sizeThrottle.current && clearTimeout(sizeThrottle.current)
    sizeThrottle.current = setTimeout(async () => {
      setOrder((prevState) => ({ ...prevState, size: floorValue(order.size, selectedCrypto.market?.minOrderSize) }))
    }, throttleDelay)
  }, [order.size, selectedCrypto.market?.minOrderSize])
  useEffect(() => {
    ;(async () => await floorSize())()
  }, [floorSize, order.size])

  let priceThrottle: MutableRefObject<NodeJS.Timeout | undefined> = useRef()
  const floorPrice = useCallback(async () => {
    priceThrottle.current && clearTimeout(priceThrottle.current)
    priceThrottle.current = setTimeout(async () => {
      setOrder((prevState) => ({ ...prevState, price: floorValue(order.price, selectedCrypto.market?.tickSize) }))
    }, throttleDelay)
  }, [order.price, selectedCrypto.market?.tickSize])
  useEffect(() => {
    ;(async () => await floorPrice())()
  }, [floorPrice, order.price])

  const marketPrice = useMemo(() => marketsData[selectedCrypto.pair]?.current, [marketsData, selectedCrypto.pair])
  useEffect(() => {
    !order.price && marketPrice && setOrder((prevState) => ({ ...prevState, price: marketPrice }))
  }, [marketPrice, order.price])

  const placeOrder = useCallback(async () => {
    try {
      if (!selectedCrypto.market) {
        throw new Error(`Market not selected`)
      }
      /* if (decimalModulo(order.price, selectedCrypto.market.tickSize)) {
        throw new Error(`Price must be a multiple of ${selectedCrypto.market.tickSize}`)
      }
      if (decimalModulo(order.size, selectedCrypto.market.minOrderSize)) {
        throw new Error(`Size must be a multiple of ${selectedCrypto.market.minOrderSize}`)
      } */ // TODO FIX
      await crypto.placeOrder(connection, selectedCrypto.market as Market, order, wallet)
      const ask = getAskSymbolFromPair(selectedCrypto.pair)
      const price = floorValue(order.price, selectedCrypto.market?.tickSize)
      const size = floorValue(order.size, selectedCrypto.market?.minOrderSize)
      notify({
        type: 'success',
        message: `${capitalizeFirstLetter(order.display)} order placed successfully!`,
        description: `${capitalizeFirstLetter(order.side)}ing ${size} ${ask} at $${price} each`,
        icon: 'trade_success'
      })
      setTimeout(() => fetchOpenOrders(), 4500)
    } catch (e: any) {
      notify({ type: 'error', message: `${capitalizeFirstLetter(order.display)} order failed`, icon: 'trade_error' }, e)
    }
  }, [connection, fetchOpenOrders, getAskSymbolFromPair, order, selectedCrypto.market, selectedCrypto.pair, wallet])

  return (
    <OrderContext.Provider
      value={{
        order,
        placeOrder,
        setFocused,
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

  const { order, placeOrder, setFocused, setOrder } = context
  return { order, placeOrder, setFocused, setOrder }
}
