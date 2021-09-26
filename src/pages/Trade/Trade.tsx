import React, { FC } from 'react'
import styled from 'styled-components'
import { Pairs } from './Pairs'
import { TVChartContainer } from './TradingView'
import { MarketProvider } from '../../context'

const WRAPPER = styled.div`
  height: 100%;
  width: 100vw;
  color: ${({ theme }) => theme.text1};
`

const TradeContent: FC = () => {
  return (
    <WRAPPER>
      <Pairs />
      <TVChartContainer interval={'D'} symbol={'BTC/USD'} />
    </WRAPPER>
  )
}

export const Trade: FC = () => {
  return (
    <MarketProvider>
      <TradeContent />
    </MarketProvider>
  )
}
