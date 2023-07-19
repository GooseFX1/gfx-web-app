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
import { MARKETS } from 'openbook-ts/serum'
import { useCrypto } from './crypto'
import { usePriceFeed } from './price_feed'
import { removeFloatingPointError } from '../utils'
import { PublicKey } from '@solana/web3.js'

export type OrderInput = undefined | 'price' | 'size' | 'total'
export type OrderDisplayType = 'market' | 'limit'
export type OrderSide = 'buy' | 'sell'
export type OrderType = 'limit' | 'ioc' | 'postOnly'

export interface IOrder {
  display: OrderDisplayType
  isHidden: boolean
  price: number | string
  side: OrderSide
  size: number | string
  total: number | string
  type: OrderType
}

interface IOrderDisplay {
  display: OrderDisplayType
  side: OrderSide
  text: string
  tooltip: string
}

export const AVAILABLE_MARKETS = (
  supportedTokenList: Set<string>
): Array<{
  name: string
  programId: PublicKey
  deprecated: boolean
  address: PublicKey
}> => {
  const markets = MARKETS.filter(({ deprecated, name }) => {
    const ask = (name: string) => name.slice(0, name.indexOf('/'))
    const isWrappedStableCoin = name[name.indexOf('/') + 1] === 'W'
    return !deprecated && !isWrappedStableCoin && supportedTokenList.has(ask(name))
  })
  markets.push({
    name: 'GOFX/USDC',
    programId: new PublicKey('9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin'),
    deprecated: false,
    address: new PublicKey('2wgi2FabNsSDdb8dke9mHFB67QtMYjYa318HpSqyJLDD')
  })
  markets.sort((a, b) => a.name.localeCompare(b.name))
  return markets
}

export const AVAILABLE_ORDERS: IOrderDisplay[] = [
  {
    display: 'market',
    side: 'buy',
    text: 'Market',
    tooltip: 'Market order is executed immediately at the best price available in the market.'
  },
  {
    display: 'limit',
    side: 'buy',
    text: 'Limit',
    tooltip: 'Limit order is executed only when the market reaches the price you specify.'
  },
  {
    display: 'market',
    side: 'sell',
    text: 'Market',
    tooltip: 'Market order is executed immediately at the best price available in the market.'
  },
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
  focused: string
  setFocused: Dispatch<SetStateAction<OrderInput>>
  setOrder: Dispatch<SetStateAction<IOrder>>
}

const OrderContext = createContext<IOrderConfig | null>(null)

export const OrderProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { selectedCrypto, isSpot } = useCrypto()
  const { prices } = usePriceFeed()
  const [focused, setFocused] = useState<OrderInput>(undefined)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  useEffect(
    () => setOrder((prevState) => ({ ...prevState, price: undefined, size: undefined, total: undefined })),
    [selectedCrypto]
  )

  useEffect(() => {
    switch (focused) {
      case 'price':
      case 'size':
        return setOrder((prevState) => ({
          ...prevState,
          total: removeFloatingPointError((+order.price || 1) * +order.size)
        }))
      case 'total':
        return setOrder((prevState) => ({
          ...prevState,
          size: removeFloatingPointError(+order.total / (+order.price || 1))
        }))
    }
  }, [focused, order.price, order.size, order.total, selectedCrypto.market])

  const throttleDelay = 300
  const sizeThrottle: MutableRefObject<NodeJS.Timeout | undefined> = useRef()
  const floorSize = useCallback(async () => {
    sizeThrottle.current && clearTimeout(sizeThrottle.current)
    sizeThrottle.current = setTimeout(async () => {
      setOrder((prevState) => ({
        ...prevState
        //size: floorValue(+order.size, selectedCrypto.market?.minOrderSize)
      }))
    }, throttleDelay)
  }, [order.size, selectedCrypto.market?.minOrderSize])
  useEffect(() => {
    ;(async () => await floorSize())()
  }, [floorSize, order.size])

  const priceThrottle: MutableRefObject<NodeJS.Timeout | undefined> = useRef()
  const floorPrice = useCallback(async () => {
    priceThrottle.current && clearTimeout(priceThrottle.current)
    priceThrottle.current = setTimeout(async () => {
      //setOrder((prevState) => ({ ...prevState, price: floorValue(+order.price, selectedCrypto.market?.tickSize) }))
    }, throttleDelay)
  }, [order.price, selectedCrypto.market?.tickSize])
  useEffect(() => {
    ;(async () => await floorPrice())()
  }, [floorPrice, order.price])

  const marketPrice = useMemo(() => prices[selectedCrypto.pair]?.current, [prices, selectedCrypto.pair])
  useEffect(() => {
    !order.price && marketPrice && setOrder((prevState) => ({ ...prevState, price: marketPrice }))
  }, [marketPrice, order.price, isSpot])

  return (
    <OrderContext.Provider
      value={{
        loading,
        order,
        focused,
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

  const { loading, order, focused, setFocused, setOrder } = context
  return { loading, order, focused, setFocused, setOrder }
}
