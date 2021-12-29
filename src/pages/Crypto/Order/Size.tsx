import React, { BaseSyntheticEvent, FC, useMemo } from 'react'
import { Input, Slider } from 'antd'
import { css } from 'styled-components'
import { FieldHeader, Picker } from './shared'
import { useAccounts, useDarkMode, useCrypto, useOrder, useTokenRegistry } from '../../../context'
import { floorValue } from '../../../utils'

export const Size: FC = () => {
  const { getUIAmount } = useAccounts()
  const { mode } = useDarkMode()
  const { getAskSymbolFromPair, getSymbolFromPair, selectedCrypto } = useCrypto()
  const { order, setFocused, setOrder } = useOrder()
  const { getTokenInfoFromSymbol } = useTokenRegistry()

  const ask = useMemo(() => getAskSymbolFromPair(selectedCrypto.pair), [getAskSymbolFromPair, selectedCrypto.pair])
  const tokenInfo = useMemo(
    () => getTokenInfoFromSymbol(getSymbolFromPair(selectedCrypto.pair, order.side)),
    [getSymbolFromPair, getTokenInfoFromSymbol, order.side, selectedCrypto.pair]
  )
  const userBalance = useMemo(() => (tokenInfo ? getUIAmount(tokenInfo.address) : 0), [tokenInfo, getUIAmount])

  const localCSS = css`
    .order-size {
      padding: 0 2px;
    }

    .order-size .ant-input-affix-wrapper {
      background-color: ${mode === 'dark' ? '#191919' : '#525252'};
    }

    .order-size .ant-slider {
      flex: 1;
      margin: 8px;
    }
  `

  return (
    <div className="order-size">
      <style>{localCSS}</style>
      <FieldHeader>Size</FieldHeader>
      <Input
        id="size-input"
        maxLength={15}
        onBlur={() => setFocused(undefined)}
        onChange={(x: BaseSyntheticEvent) => {
          !isNaN(x.target.value) && setOrder((prevState) => ({ ...prevState, size: x.target.value }))
        }}
        onFocus={() => setFocused('size')}
        pattern="\d+(\.\d+)?"
        placeholder={`Amount to ${order.side}`}
        suffix={<span>{ask}</span>}
        value={order.size || undefined}
      />
      {order.side === 'sell' && (
        <Picker>
          <Slider
            id="size-input"
            max={userBalance}
            min={0}
            onChange={(size) => setOrder((prevState) => ({ ...prevState, size }))}
            step={selectedCrypto.market?.minOrderSize}
            value={order.size}
          />
          <span
            onClick={() => {
              setFocused('size')
              setOrder((prevState) => ({
                ...prevState,
                size: floorValue(userBalance, selectedCrypto.market?.minOrderSize)
              }))
            }}
          >
            Use Max
          </span>
        </Picker>
      )}
    </div>
  )
}
