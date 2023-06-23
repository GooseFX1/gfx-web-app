/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable */
import React, { FC, useEffect, useMemo, useRef, useState } from 'react'
import { useCrypto, useDarkMode } from '../../context'
import { OrderbookTabs } from './OrderbookTabs'
import { TVChartContainer } from '../Crypto/TradingView/TradingView'
import { Responsive, WidthProvider } from 'react-grid-layout'
import _ from 'lodash'
import tw, { styled } from 'twin.macro'
import { InfoBanner } from './InfoBanner'
import { PlaceOrder } from './PlaceOrder'
import { CollateralPanel } from './perps/components/CollateralPanel'
import { useWallet } from '@solana/wallet-adapter-react'
import { Connect } from '../../layouts/Connect'
import { HistoryPanel } from '../TradeV3/HistoryPanel'
import useBlacklisted from '../../utils/useBlacklisted'
import useWindowSize from '../../utils/useWindowSize'
import { logData } from '../../api/analytics'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import { checkMobile } from '../../utils'
import { DexhomeMobi } from './mobile/DexhomeMobi'

const ReactGridLayout = WidthProvider(Responsive)

const componentDimensionsLg = [
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

const componentDimensionsMd = [
  {
    x: 0,
    y: 0,
    i: '0',
    h: 17.5,
    w: 2,
    autoSize: true
  },
  {
    x: 0,
    y: 2,
    i: '1',
    h: 17.5,
    w: 2,
    autoSize: true
  },
  {
    x: 2,
    y: 20,
    i: '2',
    h: 17.5,
    w: 2,
    autoSize: true
  },
  {
    x: 2,
    y: 20,
    i: '4',
    h: 17.5,
    w: 2,
    autoSize: true
  },
  {
    x: 0,
    y: 40,
    i: '3',
    h: 11.5,
    w: 4,
    autoSize: true
  }
]

// const componentDimensionsSM = [
//   {
//     x: 0,
//     y: 0,
//     i: '0',
//     h: 17.5,
//     w: 4,
//     autoSize: true
//   },
//   {
//     x: 4,
//     y: 0,
//     i: '1',
//     h: 17.5,
//     w: 2,
//     autoSize: true
//   },
//   {
//     x: 6,
//     y: 0,
//     i: '2',
//     h: 17.5,
//     w: 2,
//     autoSize: true
//   },
//   {
//     x: 0,
//     y: 20,
//     i: '3',
//     h: 11.5,
//     w: 6,
//     autoSize: true
//   },
//   {
//     x: 6,
//     y: 20,
//     i: '4',
//     h: 11.5,
//     w: 2,
//     autoSize: true
//   }
// ]

const DEX_CONTAINER = styled.div<{ $isLocked: boolean; $mode: string }>`
  ${tw`relative flex w-full h-full flex-col pt-[24px] overflow-y-scroll overflow-x-hidden`}

  * {
    font-family: Montserrat;
  }
  .layout {
    ${tw`w-[99%] mt-5 mx-auto mb-0 relative`}
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
        filter: blur(3px) !important;
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
    ${tw`border-solid border-2 !p-0`}
    border-color: #ff8c00;
    z-index: 100;
  }
  .space-cont {
    ${tw`p-[2.5px]`}
  }
  #tv_chart_container {
    border: 1px solid ${({ theme }) => theme.tokenBorder};
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
  .georestricted {
    width: 142px;
    height: 40px;
    border-radius: 40px;
    font-weight: 600;
    font-size: 15px;
    background: #3c3c3c;
    color: white;
    outline: none;
    border: none;
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
    margin-top: 20px;
    span {
      ${tw`text-regular font-semibold text-white`}
    }
  }
  .overlay-text {
    ${tw`text-regular font-semibold dark:text-grey-5 text-black-4`}
  }
`
const PERPS_INFO = styled.div<{ $wallet: boolean; $isLocked: boolean }>`
  ${tw`h-full w-full flex flex-col text-center justify-center items-center`}
  filter: blur(${({ $wallet, $isLocked }) => (!$isLocked ? 3 : $wallet ? 0 : 3)}px) !important;
  border: ${({ theme }) => '1px solid ' + theme.tokenBorder};

  > div {
    ${tw`font-medium text-regular dark:text-grey-2 text-grey-1 text-center mt-8`}
    line-height: 18px;
  }
`

function getInitLayout() {
  const lg = localStorage.getItem('lg')
  const md = localStorage.getItem('md')
  if (lg && md) {
    return {
      lg: JSON.parse(lg),
      md: JSON.parse(md)
    }
  }
  return { lg: componentDimensionsLg, md: componentDimensionsMd }
}

export const CryptoContent: FC = () => {
  const [isLocked, setIsLocked] = useState(true)
  const [layout, setLayout] = useState(getInitLayout())
  const isGeoBlocked = useBlacklisted()
  const { height, width } = useWindowSize()
  const { mode } = useDarkMode()
  const { selectedCrypto, isSpot } = useCrypto()
  const { wallet } = useWallet()
  const [chartContainer, setChartContainer] = useState<any>()

  useEffect(() => {
    logData('trade_page')
  }, [])

  useEffect(() => {
    setChartContainer(<TVChartContainer symbol={selectedCrypto.pair} visible={true} />)
    setTimeout(() => {
      setChartContainer(<></>)
      setChartContainer(<TVChartContainer symbol={selectedCrypto.pair} visible={true} />)
    }, 300)
  }, [isSpot, selectedCrypto, mode])

  useEffect(() => {
    resetLayout()
  }, [width])

  const getRowHeight = (height: number) => (height < 800 ? 20 : height / 38)

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
          <div key={i} className="space-cont">
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
          <div key={i} className="space-cont">
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
          <div key={i} className="space-cont">
            <>
              <PlaceOrder />
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
      }
      if (i === 3)
        return (
          <div key={i} className="space-cont">
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
          <div key={i} className={`space-cont ${isGeoBlocked ? ' filtering' : ''}`}>
            {selectedCrypto.type === 'perps' ? (
              <CollateralPanel />
            ) : (
              <PERPS_INFO $wallet={wallet} $isLocked={isLocked}>
                <img src="/img/assets/perpsInfo.svg" alt="perps-info" />
                <div>
                  See your account details <br /> exclusively on Perps.
                </div>
              </PERPS_INFO>
            )}
            {isGeoBlocked ? (
              <UNLOCKED_OVERLAY $isGeoBlocked={isGeoBlocked}>
                <button className="georestricted">Georestricted</button>
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
                <Connect />
              </UNLOCKED_OVERLAY>
            ) : null}
          </div>
        )
      return <div key={i}>{/* <span className="text">{i}</span> */}</div>
    })

  const onLayoutChange = (layout) => {
    localStorage.setItem('lg', JSON.stringify(layout))
    localStorage.setItem('md', JSON.stringify(layout))
    setLayout({ lg: layout, md: layout })
  }

  const resetLayout = () => {
    setLayout({ lg: componentDimensionsLg, md: componentDimensionsMd })
  }
  return !checkMobile() ? (
    <DEX_CONTAINER $isLocked={isLocked} $mode={mode}>
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
  ) : (
    <DexhomeMobi />
  )
}
