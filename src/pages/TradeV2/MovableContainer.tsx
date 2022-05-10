import React, { FC, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Order } from '../Crypto/Order'
import { OrderBook } from '../Crypto/OrderBook'
import { TVChartContainer } from '../Crypto/TradingView'
import { useNavCollapse, OrderBookProvider, useCrypto, useDarkMode } from '../../context'
import { Responsive, WidthProvider } from 'react-grid-layout'
import _ from 'lodash'
import { ModalSlide } from '../../components/ModalSlide'
import { InfoBanner } from './InfoBanner'
import { OrderHistory } from './OrderHistory'
import { HistoryPanel } from './HistoryPanel'
import { MODAL_TYPES } from '../../constants'

const ReactGridLayout = WidthProvider(Responsive)

const DEX_CONTAINER = styled.div<{ $navCollapsed: boolean; $isLocked: boolean }>`
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
    .react-grid-item {
      div:first-child {
        filter: blur(${({ $isLocked }) => ($isLocked ? 0 : 1)}px);
      }
    }
  }
`

const UNLOCKED_OVERLAY = styled.div`
  height: 100%;
  width: 100%;
  background: linear-gradient(101.33deg, rgba(247, 147, 26, 0.5) 7.41%, rgba(220, 31, 255, 0.3) 87.43%);
  position: absolute;
  top: 0;
  cursor: pointer;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  img {
    position: relative;
    height: 45px;
    width: 45px;
    margin-bottom: 10px;
  }
  span {
    position: relative;
    font-size: 16px;
    color: ${({ theme }) => theme.text1};
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
    h: 11,
    w: 1
  },
  {
    x: 2,
    y: 11,
    i: '2',
    h: 9,
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
    h: 10,
    w: 3
  }
]

export const CryptoContent: FC = () => {
  const { isCollapsed } = useNavCollapse()
  const [feesPopup, setFeesPopup] = useState<boolean>(false)
  const { selectedCrypto } = useCrypto()
  const [isLocked, setIsLocked] = useState(true)
  const [layout, setLayout] = useState({ lg: componentDimensions })
  const mode = useDarkMode()
  let chartContainer = useMemo(
    () => <TVChartContainer symbol={selectedCrypto.pair} visible={true} />,
    [selectedCrypto.pair]
  )

  let defaultProps = {
    className: 'layout',
    items: 3,
    rowHeight: 20,
    cols: { lg: 4, md: 4, sm: 2, xs: 2, xxs: 2 },
    isResizable: false,
    isBounded: true,
    isDraggable: !isLocked
  }
  const generateDOM = () => {
    return _.map(_.range(layout.lg.length), function (i) {
      if (i === 0)
        return (
          <div key={i}>
            {chartContainer}
            {!isLocked ? (
              <UNLOCKED_OVERLAY>
                <img
                  src={mode.mode === 'dark' ? `/img/assets/repositionWhite.svg` : `/img/assets/repositionBlack.svg`}
                  alt="reposition"
                />
                <span>Drag to Reposition</span>
              </UNLOCKED_OVERLAY>
            ) : null}
          </div>
        )
      if (i === 3) {
        return (
          <div key={i}>
            <>
              <Order />
              {!isLocked ? (
                <UNLOCKED_OVERLAY>
                  <img
                    src={mode.mode === 'dark' ? `/img/assets/repositionWhite.svg` : `/img/assets/repositionBlack.svg`}
                    alt="reposition"
                  />
                  <span>Drag to Reposition</span>
                </UNLOCKED_OVERLAY>
              ) : null}
            </>
          </div>
        )
      }
      if (i === 2) {
        return (
          <div key={i}>
            <OrderHistory />
            {!isLocked ? (
              <UNLOCKED_OVERLAY>
                <img
                  src={mode.mode === 'dark' ? `/img/assets/repositionWhite.svg` : `/img/assets/repositionBlack.svg`}
                  alt="reposition"
                />
                <span>Drag to Reposition</span>
              </UNLOCKED_OVERLAY>
            ) : null}
          </div>
        )
      }
      if (i === 1)
        return (
          <div key={i}>
            <>
              <OrderBookProvider>
                <OrderBook />
                {!isLocked ? (
                  <UNLOCKED_OVERLAY>
                    <img
                      src={mode.mode === 'dark' ? `/img/assets/repositionWhite.svg` : `/img/assets/repositionBlack.svg`}
                      alt="reposition"
                    />
                    <span>Drag to Reposition</span>
                  </UNLOCKED_OVERLAY>
                ) : null}
              </OrderBookProvider>
            </>
          </div>
        )
      if (i === 4)
        return (
          <div key={i}>
            {/*<History chartsVisible={true} setChartsVisible={null} />*/}
            <HistoryPanel />
            {!isLocked ? (
              <UNLOCKED_OVERLAY>
                <img
                  src={mode.mode === 'dark' ? `/img/assets/repositionWhite.svg` : `/img/assets/repositionBlack.svg`}
                  alt="reposition"
                />
                <span>Drag to Reposition</span>
              </UNLOCKED_OVERLAY>
            ) : null}
          </div>
        )
      return (
        <div key={i}>
          <span className="text">{i}</span>
        </div>
      )
    })
  }

  const onLayoutChange = (layout) => {
    setLayout({ lg: layout })
  }

  const resetLayout = () => {
    setLayout({ lg: componentDimensions })
  }

  return (
    <DEX_CONTAINER $navCollapsed={isCollapsed} $isLocked={isLocked}>
      <InfoBanner isLocked={isLocked} setIsLocked={setIsLocked} resetLayout={resetLayout} setFeesPopup={setFeesPopup} />
      {feesPopup && <ModalSlide rewardModal={feesPopup} rewardToggle={setFeesPopup} modalType={MODAL_TYPES.FEES} />}
      <ReactGridLayout
        compactType="vertical"
        measureBeforeMount={false}
        layouts={layout}
        onLayoutChange={onLayoutChange}
        useCSSTransforms={true}
        {...defaultProps}
      >
        {generateDOM()}
      </ReactGridLayout>
    </DEX_CONTAINER>
  )
}
