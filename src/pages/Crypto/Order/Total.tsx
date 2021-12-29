import React, { BaseSyntheticEvent, FC, useMemo } from 'react'
import { Input, Slider } from 'antd'
import { css } from 'styled-components'
import { FieldHeader, Picker } from './shared'
import { useDarkMode, useCrypto, useOrder, useTokenRegistry, useAccounts } from '../../../context'

export const Total: FC = () => {
  const { getUIAmount } = useAccounts()
  const { mode } = useDarkMode()
  const { getBidSymbolFromPair, getSymbolFromPair, selectedCrypto } = useCrypto()
  const { order, setFocused, setOrder } = useOrder()
  const { getTokenInfoFromSymbol } = useTokenRegistry()

  const bid = useMemo(() => getBidSymbolFromPair(selectedCrypto.pair), [getBidSymbolFromPair, selectedCrypto.pair])
  const tokenInfo = useMemo(
    () => getTokenInfoFromSymbol(getSymbolFromPair(selectedCrypto.pair, order.side)),
    [getSymbolFromPair, getTokenInfoFromSymbol, order.side, selectedCrypto.pair]
  )
  const userBalance = useMemo(() => (tokenInfo ? getUIAmount(tokenInfo.address) : 0), [tokenInfo, getUIAmount])

  const localCSS = css`
    .order-total {
      padding: 0 2px;
    }
    .order-total .ant-input-affix-wrapper {
      background-color: ${mode === 'dark' ? '#191919' : '#bdbdbd'};
    }

    .order-total .ant-slider {
      flex: 1;
      margin: 8px;
    }
  `

  return (
    <div className="order-total">
      <style>{localCSS}</style>
      <FieldHeader>Total</FieldHeader>
      <Input
        id="total-input"
        maxLength={15}
        onBlur={() => setFocused(undefined)}
        onChange={(x: BaseSyntheticEvent) => {
          if (!isNaN(x.target.value)) {
            setOrder((prevState) => ({ ...prevState, total: x.target.value }))
          }
        }}
        onFocus={() => setFocused('total')}
        pattern="\d+(\.\d+)?"
        placeholder={`Amount to ${order.side}`}
        suffix={<span>{bid}</span>}
        value={order.total}
      />
      {order.side === 'buy' && (
        <Picker>
          <Slider
            max={userBalance}
            min={0}
            onChange={(total) => setOrder((prevState) => ({ ...prevState, total }))}
            step={selectedCrypto.market?.tickSize}
            value={order.total}
          />
          <span
            onClick={() => {
              setFocused('total')
              setOrder((prevState) => ({ ...prevState, total: userBalance }))
            }}
          >
            Use Max
          </span>
        </Picker>
      )}
    </div>
  )
}
