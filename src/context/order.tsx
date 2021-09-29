import React, { FC, ReactNode, createContext, useContext, Dispatch, SetStateAction, useState } from 'react'

export type OrderSide = 'buy' | 'sell'
export type OrderType = 'limit' | 'limitStop' | 'market' | 'marketStop'

export interface IOrder {
  side: OrderSide
  text: string
  tooltip: string
  type: OrderType
}

export const AVAILABLE_ORDERS: IOrder[] = [
  {
    side: 'buy',
    text: 'Market',
    tooltip: 'Market order is executed immediately at the best price available in the market.',
    type: 'market'
  },
  {
    side: 'buy',
    text: 'Limit',
    tooltip: 'Limit order is executed only when the market reaches the price you specify.',
    type: 'limit'
  },
  {
    side: 'sell',
    text: 'Market',
    tooltip: 'Market order is executed immediately at the best price available in the market.',
    type: 'market'
  },
  {
    side: 'sell',
    text: 'Limit',
    tooltip: 'Limit order is executed only when the market reaches the price you specify.',
    type: 'limit'
  },
  {
    side: 'sell',
    text: 'Stop - loss',
    tooltip: 'The Stop - Loss order will be executed when the market price reaches the stop price you specify.',
    type: 'marketStop'
  },
  {
    side: 'sell',
    text: 'Stop - limit',
    tooltip: 'The Stop - Limit order will be executed when the market price reaches the limit price you specify.',
    type: 'limitStop'
  }
]

interface IOrderConfig {
  order: IOrder
  setOrder: Dispatch<SetStateAction<IOrder>>
}

const OrderContext = createContext<IOrderConfig | null>(null)

export const OrderProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [order, setOrder] = useState<IOrder>(AVAILABLE_ORDERS[0])

  return (
    <OrderContext.Provider value={{ order, setOrder }}>
      {children}
    </OrderContext.Provider>
  )
}

export const useOrder = (): IOrderConfig => {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error('Missing order context')
  }

  const { order, setOrder } = context
  return { order, setOrder }
}
