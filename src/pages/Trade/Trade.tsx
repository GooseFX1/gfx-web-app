import React, { FC, useState } from 'react'
import styled from 'styled-components'
import { History } from './History'
import { Order } from './Order'
import { OrderBook } from './OrderBook'
import { Pairs } from './Pairs'
import { TVChartContainer } from './TradingView'
import { MarketProvider, OrderProvider, TradeHistoryProvider, useMarket } from '../../context'
import { TRADE_ORDER_WIDTH } from '../../styles'

const WRAPPER = styled.div`
  display: flex;
  height: 100%;
  width: 100vw;

  > div:first-child {
    width: calc(100% - ${TRADE_ORDER_WIDTH} - 2 * ${({ theme }) => theme.margins['3x']});
  }

  > div:last-child {
    display: flex;
    flex-direction: column;
    width: ${TRADE_ORDER_WIDTH};
    margin: 0 ${({ theme }) => theme.margins['3x']};
  }
`

const TradeContent: FC = () => {
  const { selectedMarket } = useMarket()
  const [chartsVisible, setChartsVisible] = useState(true)

  return (
    <WRAPPER>
      <div>
        <Pairs />
        <TVChartContainer interval={'D'} symbol={selectedMarket.pair} visible={chartsVisible} />
        <TradeHistoryProvider>
          <History chartsVisible={chartsVisible} setChartsVisible={setChartsVisible} />
        </TradeHistoryProvider>
      </div>
      <div>
        <OrderProvider>
          <Order />
          <OrderBook />
        </OrderProvider>
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
