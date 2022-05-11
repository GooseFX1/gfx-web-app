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
  const assetIcon = useMemo(
    () => `/img/${selectedCrypto.type}/${selectedCrypto.type === 'synth' ? `g${ask}` : ask}.svg`,
    [ask, selectedCrypto.type]
  )
  const tokenInfo = useMemo(
    () => getTokenInfoFromSymbol(getSymbolFromPair(selectedCrypto.pair, order.side)),
    [getSymbolFromPair, getTokenInfoFromSymbol, order.side, selectedCrypto.pair]
  )
  const userBalance = useMemo(() => (tokenInfo ? getUIAmount(tokenInfo.address) : 0), [tokenInfo, getUIAmount])

  const localCSS = css`
    .order-size {
      padding: 0 2px;
      margin-bottom: 10px;
    }
    .order-size .symbol-name {
      font-size: 15px;
      line-height: 50px;
    }
    .symbol-name .asset-icon {
      height: 25px;
      width: 25px;
      margin-right: 5px;
      margin-bottom: 3px;
    }

    .order-size .ant-input-affix-wrapper {
      background-color: ${mode === 'dark' ? '#191919' : '#525252'};
    }

    .order-size .ant-slider {
      flex: 1;
      margin: 8px;
    }

    .order-size .ant-slider .ant-slider-rail {
      height: 10px;
    }

    .order-size .ant-slider:hover .ant-slider-track {
      background-color: #9625ae !important;
    }
    .order-size .ant-slider:hover .ant-slider-handle:not(.ant-tooltip-open) {
      background-color: #9625ae;
    }
    .order-size .ant-slider-track {
      background-color: #9625ae;
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
        suffix={
          <span className="symbol-name">
            <img className="asset-icon" src={assetIcon} alt="" />
            {ask}
          </span>
        }
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
            trackStyle={{
              height: '10px'
            }}
            handleStyle={{
              height: '20px',
              width: '20px',
              background: 'linear-gradient(55.89deg, #8D26AE 21.49%, #D4D3FF 88.89%)',
              border: '2px solid #FFFFFF'
            }}
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
