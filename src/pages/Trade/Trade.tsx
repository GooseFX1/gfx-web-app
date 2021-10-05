import React, { FC, useState } from 'react'
import styled from 'styled-components'
import { History } from './History'
import { Order } from './Order'
import { OrderBook } from './OrderBook'
import { Pairs } from './Pairs'
import { TVChartContainer } from './TradingView'
import { MarketProvider, OrderProvider, TradeHistoryProvider, useMarket } from '../../context'

const WRAPPER = styled.div`
  display: flex;
  height: 100%;
  width: 100vw;

  > div:first-child {
    width: calc(100% - 265px - 2 * ${({ theme }) => theme.margins['3x']});
  }

  > div:last-child {
    display: flex;
    flex-direction: column;
    min-width: 265px;
    margin: 0 ${({ theme }) => theme.margins['3x']};
  }
`

const TradeContent: FC = () => {
  const { selectedMarket } = useMarket()
  const [chartsVisible, setChartsVisible] = useState(true)
  const [orderTypeSelectorArrow, setOrderTypeSelectorArrow] = useState(false)
  const [orderTypeSelectorDropdown, setOrderTypeSelectorDropdown] = useState(false)

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
          <Order
            arrowRotation={orderTypeSelectorArrow}
            dropdownVisible={orderTypeSelectorDropdown}
            setArrowRotation={setOrderTypeSelectorArrow}
            setDropdownVisible={setOrderTypeSelectorDropdown}
          />
          <OrderBook
            dropdownVisible={orderTypeSelectorDropdown}
            setArrowRotation={setOrderTypeSelectorArrow}
            setDropdownVisible={setOrderTypeSelectorDropdown}
          />
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
