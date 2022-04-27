import React, { FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import { logEvent } from 'firebase/analytics'
import analytics from '../../analytics'
import { History } from '../Crypto/History'
import { Order } from '../Crypto/Order'
import { OrderBook } from '../Crypto/OrderBook'
import { Pairs } from '../Crypto/Pairs'
import { TVChartContainer } from '../Crypto/TradingView'
import {
  ENDPOINTS,
  CryptoProvider,
  useNavCollapse,
  OrderProvider,
  PriceFeedProvider,
  OrderBookProvider,
  TradeHistoryProvider,
  useConnectionConfig,
  useCrypto
} from '../../context'
import { TRADE_ORDER_WIDTH } from '../../styles'
import { notify } from '../../utils'
import { Responsive, WidthProvider, RGL } from 'react-grid-layout'
import _ from 'lodash'
import { Row } from 'antd'
import { InfoBanner } from './InfoBanner'
const ReactGridLayout = WidthProvider(Responsive)

const DEX_CONTAINER = styled.div<{ $navCollapsed: boolean }>`
  position: relative;
  display: flex;
  width: 100vw;
  flex-direction: column;
  padding-top: calc(112px - ${({ $navCollapsed }) => ($navCollapsed ? '80px' : '0px')});
  overflow-y: scroll;
  overflow-x: hidden;

  * {
    font-family: Montserrat;
  }
  .layout {
    margin-top: 20px;
    padding-left: 20px;
    width: 99%;
    position: relative;
    .react-grid-item.react-draggable:nth-child(4) {
      //max-width: 350px;
    }
  }
`

const componentDimensions = [
  {
    x: 0,
    y: 0,
    i: '0',
    h: 20,
    w: 2
  },
  {
    x: 2,
    y: 0,
    i: '1',
    h: 10,
    w: 1
  },
  {
    x: 2,
    y: 10,
    i: '2',
    h: 10,
    w: 1
  },
  {
    x: 3,
    y: 0,
    i: '3',
    h: 20,
    w: 1
  },
  {
    x: 0,
    y: 20,
    i: '4',
    h: 15,
    w: 3
  },
  {
    x: 3,
    y: 20,
    i: '5',
    h: 15,
    w: 1
  }
]

export const CryptoContent: FC = () => {
  const { isCollapsed } = useNavCollapse()
  const { selectedCrypto } = useCrypto()
  const [isLocked, setIsLocked] = useState(true)

  let defaultProps = {
    className: 'layout',
    items: 3,
    rowHeight: 20,
    onLayoutChange: function () {},
    cols: { lg: 4, md: 4, sm: 2, xs: 2, xxs: 2 },
    isResizable: false,
    isBounded: true,
    isDraggable: !isLocked
  }
  const generateDOM = () => {
    return _.map(_.range(componentDimensions.length), function (i) {
      if (i === 0) return <div key={i}>{<TVChartContainer symbol={selectedCrypto.pair} visible={true} />}</div>
      if (i === 3)
        return (
          <div key={i}>
            <TradeHistoryProvider>
              <OrderProvider>
                <Order />
              </OrderProvider>
            </TradeHistoryProvider>
          </div>
        )
      return (
        <div key={i}>
          <span className="text">{i}</span>
        </div>
      )
    })
  }

  const [layout, setLayout] = useState({ lg: componentDimensions })

  const onLayoutChange = (layout) => {
    console.log(layout)
  }
  //

  return (
    <DEX_CONTAINER $navCollapsed={isCollapsed}>
      <InfoBanner isLocked={isLocked} setIsLocked={setIsLocked} />
      <ReactGridLayout
        compactType="vertical"
        measureBeforeMount={false}
        layouts={layout}
        onLayoutChange={onLayoutChange}
        {...defaultProps}
      >
        {generateDOM()}
      </ReactGridLayout>
    </DEX_CONTAINER>
  )
}
