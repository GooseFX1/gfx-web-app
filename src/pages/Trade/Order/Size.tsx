import React, { BaseSyntheticEvent, FC, MouseEventHandler, useCallback, useMemo } from 'react'
import { Input, Slider } from 'antd'
import styled, { css } from 'styled-components'
import { FieldHeader, InputCSS } from './shared'
import { useAccounts, useMarket, useOrder, useTokenRegistry } from '../../../context'

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
  const { getAskSymbolFromPair, getBidSymbolFromPair, selectedMarket } = useMarket()
  const { order, setOrder } = useOrder()
  const { getTokenInfoFromSymbol } = useTokenRegistry()

  const ask = useMemo(() => getAskSymbolFromPair(selectedMarket.pair), [getAskSymbolFromPair, selectedMarket.pair])
  const bid = useMemo(() => getBidSymbolFromPair(selectedMarket.pair), [getBidSymbolFromPair, selectedMarket.pair])
  const tokenInfo = useMemo(
    () => getTokenInfoFromSymbol(order.side === 'buy' ? bid : ask),
    [ask, bid, getTokenInfoFromSymbol, order.side]
  )
  const step = useMemo(() => (tokenInfo ? 1 / 10 ** Math.min(6, tokenInfo.decimals) : 1), [tokenInfo])
  const userBalance = useMemo(() => (tokenInfo ? getUIAmount(tokenInfo.address) : 0), [tokenInfo, getUIAmount])

  const localCSS = css`
    .ant-slider {
      flex: 1;
      margin: 8px;
    }
  `

  return (
    <div>
      <style>{InputCSS}</style>
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
          step={step}
          value={order.size}
        />
        <span onClick={() => setOrder((prevState) => ({ ...prevState, size: userBalance }))}>Use Max</span>
      </PICKER>
    </div>
  )
}
