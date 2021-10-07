import React, { BaseSyntheticEvent, FC, useEffect, useMemo, useState } from 'react'
import { Input, Slider } from 'antd'
import { css } from 'styled-components'
import { FieldHeader, Picker } from './shared'
import { useDarkMode, useCrypto, useOrder, useTokenRegistry, useAccounts } from '../../../context'

export const Total: FC = () => {
  const { getUIAmount } = useAccounts()
  const { mode } = useDarkMode()
  const { getBidSymbolFromPair, getSymbolFromPair, selectedCrypto } = useCrypto()
  const { order, setOrder } = useOrder()
  const { getTokenInfoFromSymbol } = useTokenRegistry()
  const [isFocused, setIsFocused] = useState(false)

  const bid = useMemo(() => getBidSymbolFromPair(selectedCrypto.pair), [getBidSymbolFromPair, selectedCrypto.pair])
  const tokenInfo = useMemo(
    () => getTokenInfoFromSymbol(getSymbolFromPair(selectedCrypto.pair, order.side)),
    [getSymbolFromPair, getTokenInfoFromSymbol, order.side, selectedCrypto.pair]
  )
  const userBalance = useMemo(() => (tokenInfo ? getUIAmount(tokenInfo.address) : 0), [tokenInfo, getUIAmount])

  const localCSS = css`
    .order-total .ant-input-affix-wrapper {
      background-color: ${mode === 'dark' ? '#191919' : '#bdbdbd'};
    }

    .order-total .ant-slider {
      flex: 1;
      margin: 8px;
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
        suffix={<span>{bid}</span>}
        value={isFocused ? order.total : (Math.floor(order.total * 100) / 100).toFixed(2)}
      />
      {order.side === 'buy' && (
        <Picker>
          <Slider
            max={userBalance}
            min={0}
            onChange={(total) => setOrder((prevState) => ({ ...prevState, total }))}
            step={selectedCrypto.market && String(selectedCrypto.market.tickSize).length - 2}
            value={order.total}
          />
          <span onClick={() => setOrder((prevState) => ({ ...prevState, total: userBalance }))}>Use Max</span>
        </Picker>
      )}
    </div>
  )
}
