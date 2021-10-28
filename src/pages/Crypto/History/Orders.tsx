import React, { FC, useCallback, useMemo } from 'react'
import { Entry } from './shared'
import { MainButton } from '../../../components'
import { HistoryPanel, PANELS_FIELDS, useCrypto, useTradeHistory } from '../../../context'

export const Orders: FC = () => {
  const { formatPair, selectedCrypto, setSelectedCrypto } = useCrypto()
  const { cancelOrder, loading, orders } = useTradeHistory()

  const handleClick = useCallback(
    (pair: string) => {
      if (selectedCrypto.pair !== pair) {
        setSelectedCrypto({ decimals: 3, pair, type: 'crypto' })
      }
    },
    [selectedCrypto.pair, setSelectedCrypto]
  )

  const content = useMemo(
    () =>
      orders.map((order, index) => (
        <Entry key={index} $entriesLength={PANELS_FIELDS[HistoryPanel.Orders].length}>
          <div>
            <span onClick={() => handleClick(order.name)}>{formatPair(order.name)}</span>
          </div>
          <span>{order.order.side}</span>
          <span>{order.order.size}</span>
          <span>{order.order.price}</span>
          <div>
            <MainButton
              height="30px"
              loading={loading}
              onClick={() => cancelOrder(order)}
              status="action"
              width="150px"
            >
              <span>Cancel order</span>
            </MainButton>
          </div>
        </Entry>
      )),
    [cancelOrder, formatPair, handleClick, loading, orders]
  )

  return <>{!orders.length ? <span>No open orders</span> : content}</>
}
