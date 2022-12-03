import React, { BaseSyntheticEvent, FC, useMemo } from 'react'
import { Input, Slider } from 'antd'
import { css } from 'styled-components'
import { FieldHeader, Picker } from './shared'
import { useDarkMode, useCrypto, useOrder, useTokenRegistry, useAccounts } from '../../../context'
import { removeFloatingPointError } from '../../../utils'

export const Total: FC = () => {
  const { getUIAmount } = useAccounts()
  const { mode } = useDarkMode()
  const { getBidSymbolFromPair, getSymbolFromPair, selectedCrypto } = useCrypto()
  const { order, setFocused, setOrder } = useOrder()
  const { getTokenInfoFromSymbol } = useTokenRegistry()

  const bid = useMemo(() => getBidSymbolFromPair(selectedCrypto.pair), [getBidSymbolFromPair, selectedCrypto.pair])
  const assetIcon = useMemo(
    () => `/img/${selectedCrypto.type}/${selectedCrypto.type === 'synth' ? `g${bid}` : bid}.svg`,
    [bid, selectedCrypto.type]
  )
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
    .order-total .ant-slider .ant-slider-rail {
      height: 10px;
    }

    .order-total .ant-slider:hover .ant-slider-track {
      background-color: #9625ae !important;
    }
    .order-total .ant-slider:hover .ant-slider-handle:not(.ant-tooltip-open) {
      background-color: #9625ae;
    }
    .order-total .ant-slider-track {
      background-color: #9625ae;
    }
    .order-total .symbol-name {
      font-size: 15px;
      line-height: 50px;
    }
    .symbol-name .asset-icon {
      margin-bottom: 3px;
    }
  `

  const handleSliderChange = (total: number) =>
    setOrder((prevState) => ({
      ...prevState,
      size: removeFloatingPointError(total / (+order.price || 1)),
      total
    }))

  return (
    <div className="order-total">
      <style>{localCSS}</style>
      <FieldHeader>Amount</FieldHeader>
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
        suffix={
          <span className="symbol-name">
            <img className="asset-icon" src={assetIcon} alt="" />
            {bid}
          </span>
        }
        value={order.total}
      />
      {order.side === 'buy' && (
        <Picker>
          <Slider
            max={userBalance}
            min={0}
            onChange={handleSliderChange}
            step={selectedCrypto.market?.tickSize}
            value={+order.total}
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
