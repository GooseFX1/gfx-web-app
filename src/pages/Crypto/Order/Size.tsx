import React, { BaseSyntheticEvent, FC, useMemo } from 'react'
import { Input, Slider } from 'antd'
import styled, { css } from 'styled-components'
import { FieldHeader } from './shared'
import { useAccounts, useDarkMode, useCrypto, useOrder, useTokenRegistry } from '../../../context'

const PICKER = styled.div`
  display: flex;
  align-items: center;

  span {
    margin-left: ${({ theme }) => theme.margins['1.5x']};
    font-size: 10px;
    font-weight: bold;
    whitespace: no-wrap;
    cursor: pointer;
    color: ${({ theme }) => theme.text1h};
    transition: color ${({ theme }) => theme.hapticTransitionTime} ease-in-out;

    &:hover {
      color: ${({ theme }) => theme.text1};
    }
  }
`

export const Size: FC = () => {
  const { getUIAmount } = useAccounts()
  const { mode } = useDarkMode()
  const { getAskSymbolFromPair, getSymbolFromPair, selectedCrypto } = useCrypto()
  const { order, setOrder } = useOrder()
  const { getTokenInfoFromSymbol } = useTokenRegistry()

  const ask = useMemo(() => getAskSymbolFromPair(selectedCrypto.pair), [getAskSymbolFromPair, selectedCrypto.pair])
  const tokenInfo = useMemo(
    () => getTokenInfoFromSymbol(getSymbolFromPair(selectedCrypto.pair, order.side)),
    [getSymbolFromPair, getTokenInfoFromSymbol, order.side, selectedCrypto.pair]
  )
  const userBalance = useMemo(() => (tokenInfo ? getUIAmount(tokenInfo.address) : 0), [tokenInfo, getUIAmount])

  const localCSS = css`
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
        maxLength={15}
        onChange={(x: BaseSyntheticEvent) => {
          if (!isNaN(x.target.value)) {
            setOrder((prevState) => ({ ...prevState, size: x.target.value }))
          }
        }}
        pattern="\d+(\.\d+)?"
        placeholder={`Amount to ${order.side}`}
        suffix={<span>{ask}</span>}
        value={order.size || undefined}
      />
      <PICKER>
        <Slider
          max={userBalance}
          min={0}
          onChange={(size) => setOrder((prevState) => ({ ...prevState, size }))}
          step={selectedCrypto.market && String(selectedCrypto.market.tickSize).length - 2}
          value={order.size}
        />
        <span onClick={() => setOrder((prevState) => ({ ...prevState, size: userBalance }))}>Use Max</span>
      </PICKER>
    </div>
  )
}
