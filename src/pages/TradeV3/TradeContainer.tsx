/* eslint-disable */
import React, { FC, useEffect, useMemo, useState } from 'react'
import { useNavCollapse, useCrypto, useDarkMode } from '../../context'
import { OrderbookTabs } from './OrderbookTabs'
import { TVChartContainer } from '../Crypto/TradingView'
import { Responsive, WidthProvider } from 'react-grid-layout'
import _ from 'lodash'
import tw, { styled } from 'twin.macro'
import { InfoBanner } from './InfoBanner'
import { PlaceOrder } from './PlaceOrder'
import { CollateralPanel } from './perps/components/CollateralPanel'
import { useWallet } from '@solana/wallet-adapter-react'
//import { Connect } from '../../layouts/Connect'
import { HistoryPanel } from '../TradeV3/HistoryPanel'
import useBlacklisted from '../../utils/useBlacklisted'
import useWindowSize from '../../utils/useWindowSize'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

const ReactGridLayout = WidthProvider(Responsive)

const componentDimensions = [
  {
    x: 0,
    y: 0,
    i: '0',
    h: 17.5,
    w: 4,
    autoSize: true
  },
  {
    x: 4,
    y: 0,
    i: '1',
    h: 17.5,
    w: 2,
    autoSize: true
  },
  {
    x: 6,
    y: 0,
    i: '2',
    h: 17.5,
    w: 2,
    autoSize: true
  },
  {
    x: 0,
    y: 20,
    i: '3',
    h: 11.5,
    w: 6,
    autoSize: true
  },
  {
    x: 6,
    y: 20,
    i: '4',
    h: 11.5,
    w: 2,
    autoSize: true
  }
]

const DEX_CONTAINER = styled.div<{ $navCollapsed: boolean; $isLocked: boolean; $mode: string }>`
  ${tw`relative flex w-screen h-screen flex-col overflow-y-scroll overflow-x-hidden`}
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
    .filtering {
      div:first-child {
        filter: blur(3px);
      }
    }
    .react-resizable-handle-se {
      background: ${({ $mode }) =>
        $mode === 'dark'
          ? 'url(/img/assets/resizeArrow_dark.svg) center no-repeat #eeeeee'
          : 'url(/img/assets/resizeArrow_lite.svg) center no-repeat, linear-gradient(92deg, #f7931a 0%, #ac1cc7 100%)'};
      height: 20px;
      width: 20px;
      display: ${({ $isLocked }) => ($isLocked ? 'none' : 'block')};

      border-top-left-radius: 8px;
    }
    .react-grid-item > .react-resizable-handle::after {
      border: none;
    }
  }
  .react-draggable-dragging {
    ${tw`border-solid border-2 p-0 rounded-[10px]`}
    border-color: #ff8c00;
    z-index: 100;
  }
`

const UNLOCKED_OVERLAY = styled.div<{ $isGeoBlocked?: boolean }>`
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
  .reposition {
    position: relative;
    height: 45px;
    width: 45px;
    margin-bottom: 10px;
  }
  .geoblocked {
    position: relative;
    height: 100px;
    width: 140px;
    margin-bottom: 10px;
  }
  .geo-msg {
    font-weight: 600;
    font-size: 7px;
    color: ${({ theme }) => theme.text28};
    text-align: center;
    position: absolute;
    bottom: 20px;
  }
  .unavailable-msg {
    font-weight: 600;
    font-size: 15px;
    color: ${({ theme }) => theme.text28};
  }
  .header-text {
    font-weight: 600;
    font-size: 30px;
    color: ${({ theme }) => theme.text28};
    margin: 20px 0;
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
  const isGeoBlocked = useBlacklisted()
  const { height } = useWindowSize()
  const { mode } = useDarkMode()
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

  const getRowHeight = (height: number) => {
    return height < 800 ? 20 : height / 38
  }

  const defaultProps = {
    className: 'layout',
    items: 3,
    rowHeight: getRowHeight(height),
    cols: { lg: 8, md: 4, sm: 2, xs: 2, xxs: 2 },
    isBounded: false,
    isDraggable: !isGeoBlocked && !isLocked,
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
                  src={mode === 'dark' ? `/img/assets/repositionWhite.svg` : `/img/assets/repositionBlack.svg`}
                  alt="reposition"
                  className="reposition"
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
                    src={mode === 'dark' ? `/img/assets/repositionWhite.svg` : `/img/assets/repositionBlack.svg`}
                    alt="reposition"
                    className="reposition"
                  />
                  <span>Drag to Reposition</span>
                </UNLOCKED_OVERLAY>
              ) : null}
            </>
          </div>
        )
      if (i === 2) {
        return (
          <div key={i} className={isGeoBlocked ? 'filtering' : ''}>
            <>
              <PlaceOrder />
              {isGeoBlocked ? (
                <UNLOCKED_OVERLAY $isGeoBlocked={isGeoBlocked}>
                  <img
                    src={
                      mode === 'dark' ? `/img/assets/georestricted_dark.png` : `/img/assets/georestricted_lite.png`
                    }
                    alt="reposition"
                    className="geoblocked"
                  />
                  <span className="header-text">We’re sorry.</span>
                  <span className="unavailable-msg">
                    GooseFX DEX is unavailable <br /> in your location.
                  </span>
                </UNLOCKED_OVERLAY>
              ) : !isLocked ? (
                <UNLOCKED_OVERLAY>
                  <img
                    src={mode === 'dark' ? `/img/assets/repositionWhite.svg` : `/img/assets/repositionBlack.svg`}
                    alt="reposition"
                    className="reposition"
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
                  src={mode === 'dark' ? `/img/assets/repositionWhite.svg` : `/img/assets/repositionBlack.svg`}
                  alt="reposition"
                  className="reposition"
                />
                <span>Drag to Reposition</span>
              </UNLOCKED_OVERLAY>
            ) : null}
          </div>
        )
      if (i === 4)
        return (
          <div key={i} className={isGeoBlocked ? 'filtering' : ''}>
            <CollateralPanel />
            {isGeoBlocked ? (
              <UNLOCKED_OVERLAY $isGeoBlocked={isGeoBlocked}>
                <span className="geo-msg">
                  Access is prohibited for Belarus, Central African Republic, Democratic Republic of Congo,
                  Democratic People’s Republic of Korea, Crimea, Cuba, Iran, Libya, Somalia, Sudan, South Sudan,
                  Syria, Thailand, UK, US, Yemen, Zimbabwe and any other jurisdiction in which accessing or using
                  this website is prohibited.
                </span>
              </UNLOCKED_OVERLAY>
            ) : !isLocked ? (
              <UNLOCKED_OVERLAY>
                <img
                  src={mode === 'dark' ? `/img/assets/repositionWhite.svg` : `/img/assets/repositionBlack.svg`}
                  alt="reposition"
                  className="reposition"
                />
                <span>Drag to Reposition</span>
              </UNLOCKED_OVERLAY>
            ) : !wallet && isLocked ? (
              <UNLOCKED_OVERLAY>
                <div className="overlay-text">
                  See all our <br /> amazing features!
                </div>
                {/* <Connect /> */}
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
    <DEX_CONTAINER $navCollapsed={isCollapsed} $isLocked={isLocked} $mode={mode}>
      <InfoBanner isLocked={isLocked} setIsLocked={setIsLocked} resetLayout={resetLayout} />
      <ReactGridLayout
        compactType="vertical"
        measureBeforeMount={true}
        layouts={layout}
        onLayoutChange={onLayoutChange}
        useCSSTransforms={true}
        resizeHandles={['se']}
        {...defaultProps}
      >
        {generateDOM()}
      </ReactGridLayout>
    </DEX_CONTAINER>
  )
}
