import React, { FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import { History } from './History'
import { Order } from './Order'
import { OrderBook } from './OrderBook'
import { Pairs } from './Pairs'
import { TVChartContainer } from './TradingView'
import {
  ENDPOINTS,
  CryptoProvider,
  OrderProvider,
  OrderBookProvider,
  TradeHistoryProvider,
  useConnectionConfig,
  useCrypto
} from '../../context'
import { TRADE_ORDER_WIDTH } from '../../styles'
import { notify } from '../../utils'

const WRAPPER = styled.div`
  display: flex;
  height: 100%;
  width: 100vw;
  margin: ${({ theme }) => theme.margins['3x']} 0;

  > div:first-child {
    margin-left: ${({ theme }) => theme.margins['3x']};
    width: calc(100% - ${TRADE_ORDER_WIDTH} - 2 * ${({ theme }) => theme.margins['3x']});

    ${({ theme }) => theme.mediaWidth.upToSmall`
      width: 100%;
      margin: 0;
      padding: ${({ theme }) => theme.margins['1x']};
    `}
  }

  > div:last-child {
    ${({ theme }) => theme.flexColumnNoWrap};
    width: ${TRADE_ORDER_WIDTH};
    margin: 0 ${({ theme }) => theme.margins['3x']};

    ${({ theme }) => theme.mediaWidth.upToSmall`
      width: 100%;
      margin: 0;
      padding: ${({ theme }) => theme.margins['1x']};
    `}
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    ${({ theme }) => theme.flexColumnReverse};
  `}
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
            <OrderBookProvider>
              <OrderBook />
            </OrderBookProvider>
          </OrderProvider>
        </div>
      </TradeHistoryProvider>
    </WRAPPER>
  )
}

export const Crypto: FC = () => {
  const { endpoint, setEndpoint } = useConnectionConfig()

  useEffect(() => {
    if (endpoint !== ENDPOINTS[0].endpoint) {
      notify({ message: 'Switched to mainnet' })
      setEndpoint(ENDPOINTS[0].endpoint)
    }
  }, [endpoint, setEndpoint])

  return (
    <CryptoProvider>
      <CryptoContent />
    </CryptoProvider>
  )
}
