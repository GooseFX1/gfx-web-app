import React, { FC, useState } from 'react'
import styled from 'styled-components'
import { History } from './History'
import { Order } from './Order'
import { OrderBook } from './OrderBook'
import { Pairs } from './Pairs'
import { TVChartContainer } from './TradingView'
import { CryptoProvider, OrderProvider, TradeHistoryProvider, useCrypto } from '../../context'
import { TRADE_ORDER_WIDTH } from '../../styles'

const WRAPPER = styled.div`
  display: flex;
  height: 100%;
  width: 100vw;
  margin: ${({ theme }) => theme.margins['3x']} 0;

  > div:first-child {
    width: calc(100% - ${TRADE_ORDER_WIDTH} - 2 * ${({ theme }) => theme.margins['3x']});
  }

  > div:last-child {
    ${({ theme }) => theme.flexColumnNoWrap}
    width: ${TRADE_ORDER_WIDTH};
    margin: 0 ${({ theme }) => theme.margins['3x']};
  }
`

const CryptoContent: FC = () => {
  const { selectedCrypto } = useCrypto()
  const [chartsVisible, setChartsVisible] = useState(true)

  return (
    <WRAPPER>
      <TradeHistoryProvider>
        <div>
          <Pairs />
          <TVChartContainer symbol={selectedCrypto.pair} visible={chartsVisible} />
          <History chartsVisible={chartsVisible} setChartsVisible={setChartsVisible} />
        </div>
        <div>
          <OrderProvider>
            <Order />
            <OrderBook />
          </OrderProvider>
        </div>
      </TradeHistoryProvider>
    </WRAPPER>
  )
}

export const Crypto: FC = () => {
  return (
    <CryptoProvider>
      <CryptoContent />
    </CryptoProvider>
  )
}
