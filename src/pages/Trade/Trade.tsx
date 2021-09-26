import React, { FC } from 'react'
import styled from 'styled-components'
import { History } from './History'
import { Order } from './Order'
import { OrderBook } from './OrderBook'
import { Pairs } from './Pairs'
import { TVChartContainer } from './TradingView'
import { MarketProvider, useMarket } from '../../context'

const WRAPPER = styled.div`
  display: flex;
  height: 100%;
  width: 100vw;
  color: ${({ theme }) => theme.text1};

  > div:first-child {
    width: calc(100% - 250px - 2 * ${({ theme }) => theme.margins['3x']});
  }

  > div:last-child {
    min-width: 250px;
    margin: 0 ${({ theme }) => theme.margins['3x']};
  }
`

const TradeContent: FC = () => {
  const { selectedMarket } = useMarket()

  return (
    <WRAPPER>
      <div>
        <Pairs />
        <TVChartContainer interval={'D'} symbol={selectedMarket} />
        <History />
      </div>
      <div>
        <Order />
        <OrderBook />
      </div>
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
