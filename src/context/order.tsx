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
import { usePriceFeed } from './price_feed'
import { useConnectionConfig } from './settings'
import { useTradeHistory } from './trade_history'
import { SUPPORTED_TOKEN_LIST } from '../constants'
import { capitalizeFirstLetter, floorValue, notify, removeFloatingPointError } from '../utils'
import { crypto } from '../web3'
import { useAccounts } from './accounts'
import { PublicKey } from '@solana/web3.js'

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

export const AVAILABLE_MARKETS = (() => {
  const markets = MARKETS.filter(({ deprecated, name }) => {
    const ask = (name: string) => name.slice(0, name.indexOf('/'))
    const isWrappedStableCoin = name[name.indexOf('/') + 1] === 'W'
    return !deprecated && !isWrappedStableCoin && SUPPORTED_TOKEN_LIST.find((token) => ask(name) === token)
  })
  markets.push({
    name: 'GOFX/USDC',
    programId: new PublicKey('9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin'),
    deprecated: false,
    address: new PublicKey('2wgi2FabNsSDdb8dke9mHFB67QtMYjYa318HpSqyJLDD')
  })
  markets.sort((a, b) => a.name.localeCompare(b.name))
  return markets
})()

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
  loading: boolean
  order: IOrder
  placeOrder: () => void
  setFocused: Dispatch<SetStateAction<OrderInput>>
  setOrder: Dispatch<SetStateAction<IOrder>>
}

const OrderContext = createContext<IOrderConfig | null>(null)

export const OrderProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { fetchAccounts } = useAccounts()
  const { connection } = useConnectionConfig()
  const { getAskSymbolFromPair, selectedCrypto } = useCrypto()
  const { prices } = usePriceFeed()
  const { fetchOpenOrders } = useTradeHistory()
  const wallet = useWallet()
  const [focused, setFocused] = useState<OrderInput>(undefined)
  const [loading, setLoading] = useState(false)
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

  const marketPrice = useMemo(() => prices[selectedCrypto.pair]?.current, [prices, selectedCrypto.pair])
  useEffect(() => {
    !order.price && marketPrice && setOrder((prevState) => ({ ...prevState, price: marketPrice }))
  }, [marketPrice, order.price])

  const placeOrder = useCallback(async () => {
    setLoading(true)

    try {
      if (!selectedCrypto.market) {
        throw new Error(`Market not selected`)
      }

      await crypto.placeOrder(connection, selectedCrypto.market as Market, order, wallet)
      const ask = getAskSymbolFromPair(selectedCrypto.pair)
      const price = floorValue(order.price, selectedCrypto.market?.tickSize)
      const size = floorValue(order.size, selectedCrypto.market?.minOrderSize)
      await notify({
        type: 'success',
        message: `${capitalizeFirstLetter(order.display)} order placed successfully!`,
        description: `${capitalizeFirstLetter(order.side)}ing ${size} ${ask} at $${price} each`,
        icon: 'trade_success'
      })
      setTimeout(() => {
        fetchAccounts()
        fetchOpenOrders()
      }, 3000)
    } catch (e: any) {
      await notify(
        {
          type: 'error',
          message: `${capitalizeFirstLetter(order.display)} order failed`,
          icon: 'trade_error'
        },
        e
      )
    }

    setLoading(false)
  }, [
    connection,
    fetchAccounts,
    fetchOpenOrders,
    getAskSymbolFromPair,
    order,
    selectedCrypto.market,
    selectedCrypto.pair,
    wallet
  ])

  return (
    <OrderContext.Provider
      value={{
        loading,
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

  const { loading, order, placeOrder, setFocused, setOrder } = context
  return { loading, order, placeOrder, setFocused, setOrder }
}
