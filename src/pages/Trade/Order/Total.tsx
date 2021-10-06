import React, { BaseSyntheticEvent, FC, useMemo } from 'react'
import { Input } from 'antd'
import { css } from 'styled-components'
import { FieldHeader } from './shared'
import { useDarkMode, useMarket, useOrder } from '../../../context'

export const Total: FC = () => {
  const { mode } = useDarkMode()
  const { getBidSymbolFromPair, selectedMarket } = useMarket()
  const { order, setOrder } = useOrder()

  const symbol = useMemo(() => getBidSymbolFromPair(selectedMarket.pair), [getBidSymbolFromPair, selectedMarket.pair])

  const localCSS = css`
    .order-total .ant-input-affix-wrapper {
      background-color: ${mode === 'dark' ? '#191919' : '#bdbdbd'};
    }
  `

  return (
    <div className="order-total">
      <style>{localCSS}</style>
      <FieldHeader>Total</FieldHeader>
      <Input
        maxLength={15}
        onChange={(x: BaseSyntheticEvent) => {
          if (!isNaN(x.target.value)) {
            setOrder((prevState) => ({ ...prevState, total: x.target.value }))
          }
        }}
        pattern="\d+(\.\d+)?"
        placeholder={`Amount to ${order.side}`}
        suffix={<span>{symbol}</span>}
        value={(Math.floor(order.total * 100) / 100).toFixed(2)}
      />
    </div>
  )
}
