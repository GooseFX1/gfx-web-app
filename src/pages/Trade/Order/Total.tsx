import React, { BaseSyntheticEvent, FC, useMemo } from 'react'
import { Input } from 'antd'
import { FieldHeader } from './shared'
import { useMarket, useOrder } from '../../../context'

export const Total: FC = () => {
  const { getBidSymbolFromPair, selectedMarket } = useMarket()
  const { order, setOrder } = useOrder()

  const symbol = useMemo(() => getBidSymbolFromPair(selectedMarket.pair), [getBidSymbolFromPair, selectedMarket.pair])

  return (
    <div>
      <FieldHeader>Total</FieldHeader>
      <Input
        maxLength={15}
        onChange={(x: BaseSyntheticEvent) => {
          if (!isNaN(x.target.value)) {
            setOrder(prevState => ({ ...prevState, total: x.target.value }))
          }
        }}
        pattern="\d+(\.\d+)?"
        placeholder={`Amount to ${order.side}`}
        suffix={<span>{symbol}</span>}
        value={order.total}
      />
    </div>
  )
}
