import React, { BaseSyntheticEvent, FC, useEffect, useMemo, useState } from 'react'
import { Input } from 'antd'
import { css } from 'styled-components'
import { FieldHeader } from './shared'
import { useDarkMode, useCrypto, useOrder } from '../../../context'

export const Total: FC = () => {
  const { mode } = useDarkMode()
  const { getBidSymbolFromPair, selectedCrypto } = useCrypto()
  const { order, setOrder } = useOrder()
  const [isFocused, setIsFocused] = useState(false)

  const symbol = useMemo(() => getBidSymbolFromPair(selectedCrypto.pair), [getBidSymbolFromPair, selectedCrypto.pair])

  const localCSS = css`
    .order-total .ant-input-affix-wrapper {
      background-color: ${mode === 'dark' ? '#191919' : '#bdbdbd'};
    }
  `

  useEffect(() => {
    const focusinChange = (x: any) => setIsFocused(x.target === document.getElementById('total-input'))
    document.addEventListener('focusin', focusinChange)

    return () => document.removeEventListener('focusin', focusinChange)
  }, [])

  return (
    <div className="order-total">
      <style>{localCSS}</style>
      <FieldHeader>Total</FieldHeader>
      <Input
        id="total-input"
        maxLength={15}
        onChange={(x: BaseSyntheticEvent) => {
          if (!isNaN(x.target.value)) {
            setOrder((prevState) => ({ ...prevState, total: x.target.value }))
          }
        }}
        pattern="\d+(\.\d+)?"
        placeholder={`Amount to ${order.side}`}
        suffix={<span>{symbol}</span>}
        value={isFocused ? order.total : (Math.floor(order.total * 100) / 100).toFixed(2)}
      />
    </div>
  )
}
