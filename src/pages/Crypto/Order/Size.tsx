import React, { BaseSyntheticEvent, FC, useMemo } from 'react'
import { Input } from 'antd'
import { css } from 'styled-components'
import { FieldHeader } from './shared'
import { useDarkMode, useCrypto, useOrder } from '../../../context'

export const Size: FC = () => {
  const { mode } = useDarkMode()
  const { getAskSymbolFromPair, selectedCrypto } = useCrypto()
  const { order, setFocused, setOrder } = useOrder()

  const ask = useMemo(() => getAskSymbolFromPair(selectedCrypto.pair), [getAskSymbolFromPair, selectedCrypto.pair])
  const assetIcon = useMemo(
    () => `/img/${selectedCrypto.type}/${selectedCrypto.type === 'synth' ? `g${ask}` : ask}.svg`,
    [ask, selectedCrypto.type]
  )

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
    </div>
  )
}
