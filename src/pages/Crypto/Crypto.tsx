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
  useNavCollapse,
  OrderProvider,
  OrderBookProvider,
  TradeHistoryProvider,
  useConnectionConfig,
  useCrypto
} from '../../context'
import { TRADE_ORDER_WIDTH } from '../../styles'
import { notify } from '../../utils'

const WRAPPER = styled.div<{ $navCollapsed: boolean }>`
  position: relative;
  display: flex;
  width: 100vw;

  padding-top: calc(112px - ${({ $navCollapsed }) => ($navCollapsed ? '80px' : '0px')});
  overflow-y: scroll;
  overflow-x: hidden;

  * {
    font-family: Montserrat;
  }

  > div:first-child {
    margin-left: ${({ theme }) => theme.margin(3)};
    width: calc(100% - ${TRADE_ORDER_WIDTH} - 2 * ${({ theme }) => theme.margin(3)});

    ${({ theme }) => theme.mediaWidth.upToSmall`
      width: 100%;
      margin: 0;
      padding: ${({ theme }) => theme.margin(1)};
    `}
  }

  > div:last-child {
    ${({ theme }) => theme.flexColumnNoWrap};
    width: ${TRADE_ORDER_WIDTH};
    margin: 0 ${({ theme }) => theme.margin(3)};

    ${({ theme }) => theme.mediaWidth.upToSmall`
      width: 100%;
      margin: 0;
      padding: ${({ theme }) => theme.margin(1)};
    `}
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    ${({ theme }) => theme.flexColumnReverse};
  `}

  ${({ theme }) => theme.customScrollBar('6px')};
`

const CryptoContent: FC = () => {
  const { isCollapsed } = useNavCollapse()
  // market subscription function is causing useCrypto to re-render this component too many times
  const { selectedCrypto } = useCrypto()
  const [chartsVisible, setChartsVisible] = useState(true)
  console.log('CryptoContent Render')

  return (
    <WRAPPER $navCollapsed={isCollapsed}>
      <TradeHistoryProvider>
        <div>
          <Pairs />
          {/* <TVChartContainer symbol={selectedCrypto.pair} visible={chartsVisible} /> */}
          <History chartsVisible={chartsVisible} setChartsVisible={setChartsVisible} />
          <br />
          <br />
          <br />
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
