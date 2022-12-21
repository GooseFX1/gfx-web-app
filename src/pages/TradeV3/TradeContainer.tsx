/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useEffect, useMemo, useState } from 'react'
import { useNavCollapse, useCrypto, useDarkMode } from '../../context'
import styled from 'styled-components'
import { Order } from '../Crypto/Order'
import { OrderbookTabs } from './OrderbookTabs'
import { TVChartContainer } from '../Crypto/TradingView'
import { Responsive, WidthProvider } from 'react-grid-layout'
import _ from 'lodash'
import tw from 'twin.macro'
import { InfoBanner } from './InfoBanner'
import { PlaceOrder } from './PlaceOrder'
import { CollateralPanel } from './perps/components/CollateralPanel'
import { useWallet } from '@solana/wallet-adapter-react'
//import { Connect } from '../../layouts/Connect'
import { HistoryPanel } from '../TradeV3/HistoryPanel'

const ReactGridLayout = WidthProvider(Responsive)

const componentDimensions = [
  {
    x: 0,
    y: 0,
    i: '0',
    h: 17.5,
    w: 2
  },
  {
    x: 2,
    y: 0,
    i: '1',
    h: 17.5,
    w: 1
  },
  {
    x: 3,
    y: 0,
    i: '2',
    h: 17.5,
    w: 1
  },
  {
    x: 0,
    y: 20,
    i: '3',
    h: 11.5,
    w: 3
  },
  {
    x: 3,
    y: 20,
    i: '4',
    h: 11.5,
    w: 1
  }
]

const DEX_CONTAINER = styled.div<{ $navCollapsed: boolean; $isLocked: boolean }>`
  ${tw`relative flex w-screen flex-col overflow-y-scroll overflow-x-hidden`}
  padding-top: calc(112px - ${({ $navCollapsed }) => ($navCollapsed ? '80px' : '0px')});

  * {
    font-family: Montserrat;
  }
  .layout {
    ${tw`w-[99%] mt-5 mr-auto mb-0 relative`}
    .react-grid-item.react-draggable:nth-child(4) {
      //max-width: 350px;
    }
    .react-grid-item {
      div:first-child {
        filter: blur(${({ $isLocked }) => ($isLocked ? 0 : 3)}px);
      }
    }
  }
  .react-draggable-dragging {
    ${tw`border-solid border-2 p-0 rounded-[10px]`}
    border-color: #ff8c00;
    z-index: 100;
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
  border-radius: 10px;
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
  button {
    height: 40px;
    width: 165px;
    margin-top: 40px;
    span {
      font-size: 15px;
      font-weight: 600;
    }
  }
`

export const CryptoContent: FC = () => {
  const { isCollapsed } = useNavCollapse()
  const [isLocked, setIsLocked] = useState(true)
  const [layout, setLayout] = useState({ lg: componentDimensions })

  const mode = useDarkMode()
  const { selectedCrypto } = useCrypto()
  const { wallet } = useWallet()

  useEffect(() => {
    if (selectedCrypto.type === 'perps') setLayout({ lg: componentDimensions })
    else {
      setLayout({ lg: componentDimensions.slice(0, 4) })
    }
  }, [selectedCrypto])

  const chartContainer = useMemo(
    () => <TVChartContainer symbol={selectedCrypto.pair} visible={true} />,
    [selectedCrypto.pair]
  )

  const defaultProps = {
    className: 'layout',
    items: 3,
    rowHeight: 20, //DELETE: change height to fix scroll
    cols: { lg: 4, md: 4, sm: 2, xs: 2, xxs: 2 },
    isResizable: true,
    isBounded: false,
    isDraggable: !isLocked,
    margin: [0, 0]
  }
  const generateDOM = () =>
    _.map(_.range(layout.lg.length), function (i) {
      if (i === 0)
        return (
          <div key={i}>
            {chartContainer}
            {!isLocked ? (
              <UNLOCKED_OVERLAY>
                <img
                  src={
                    mode.mode === 'dark' ? `/img/assets/repositionWhite.svg` : `/img/assets/repositionBlack.svg`
                  }
                  alt="reposition"
                />
                <span>Drag to Reposition</span>
              </UNLOCKED_OVERLAY>
            ) : null}
          </div>
        )
      if (i === 1)
        return (
          <div key={i}>
            <>
              <OrderbookTabs />
              {!isLocked ? (
                <UNLOCKED_OVERLAY>
                  <img
                    src={
                      mode.mode === 'dark' ? `/img/assets/repositionWhite.svg` : `/img/assets/repositionBlack.svg`
                    }
                    alt="reposition"
                  />
                  <span>Drag to Reposition</span>
                </UNLOCKED_OVERLAY>
              ) : null}
            </>
          </div>
        )
      if (i === 2) {
        return (
          <div key={i}>
            <>
              <PlaceOrder />
              {!isLocked ? (
                <UNLOCKED_OVERLAY>
                  <img
                    src={
                      mode.mode === 'dark' ? `/img/assets/repositionWhite.svg` : `/img/assets/repositionBlack.svg`
                    }
                    alt="reposition"
                  />
                  <span>Drag to Reposition</span>
                </UNLOCKED_OVERLAY>
              ) : null}
            </>
          </div>
        )
      }
      if (i === 3)
        return (
          <div key={i}>
            <HistoryPanel />
            {!isLocked ? (
              <UNLOCKED_OVERLAY>
                <img
                  src={
                    mode.mode === 'dark' ? `/img/assets/repositionWhite.svg` : `/img/assets/repositionBlack.svg`
                  }
                  alt="reposition"
                />
                <span>Drag to Reposition</span>
              </UNLOCKED_OVERLAY>
            ) : null}
          </div>
        )
      if (i === 4)
        return (
          <div key={i}>
            <CollateralPanel />
            {!wallet && isLocked && (
              <UNLOCKED_OVERLAY>
                <div className="overlay-text">
                  See all our <br /> amazing features!
                </div>
                {/* <Connect /> */}
              </UNLOCKED_OVERLAY>
            )}
            {!isLocked ? (
              <UNLOCKED_OVERLAY>
                <img
                  src={
                    mode.mode === 'dark' ? `/img/assets/repositionWhite.svg` : `/img/assets/repositionBlack.svg`
                  }
                  alt="reposition"
                />
                <span>Drag to Reposition</span>
              </UNLOCKED_OVERLAY>
            ) : null}
          </div>
        )
      return <div key={i}>{/* <span className="text">{i}</span> */}</div>
    })

  const onLayoutChange = (layout) => {
    setLayout({ lg: layout })
  }

  const resetLayout = () => {
    setLayout({ lg: componentDimensions })
  }
  return (
    <DEX_CONTAINER $navCollapsed={isCollapsed} $isLocked={isLocked}>
      <InfoBanner isLocked={isLocked} setIsLocked={setIsLocked} resetLayout={resetLayout} />
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
