/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable */
import React, { FC, useEffect, useRef, useState } from 'react'
import { useCrypto, useDarkMode, useConnectionConfig } from '../../context'
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
import useWindowSize from '../../utils/useWindowSize'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import { checkMobile, checkMobileDex } from '../../utils'
import { DexhomeMobi } from './mobile/DexhomeMobi'
import { InfoLabel } from './perps/components/PerpsGenericComp'
import { openLinkInNewTab } from '@/web3'

const ReactGridLayout = WidthProvider(Responsive)

const componentDimensionsLg = [
  {
    x: 0,
    y: 0,
    i: '0',
    h: 18.5,
    w: 4,
    autoSize: true
  },
  {
    x: 4,
    y: 0,
    i: '1',
    h: 18.5,
    w: 2,
    autoSize: true
  },
  {
    x: 6,
    y: 0,
    i: '2',
    h: 18.5,
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
    h: 18,
    w: 2,
    autoSize: true
  },
  {
    x: 0,
    y: 2,
    i: '1',
    h: 18,
    w: 2,
    autoSize: true
  },
  {
    x: 2,
    y: 20,
    i: '2',
    h: 18,
    w: 2,
    autoSize: true
  },
  {
    x: 2,
    y: 20,
    i: '4',
    h: 18,
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
  ${tw`relative flex w-full h-[calc(100vh - 85px)] flex-col overflow-y-scroll overflow-x-hidden`}

  .layout {
    ${tw`w-[99%] mt-2 mx-auto mb-0 relative !h-full`}
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
          ? 'url(/img/assets/resizeArrow_dark.svg) center no-repeat'
          : 'url(/img/assets/resizeArrow_lite.svg) center no-repeat'};
      height: 26px;
      width: -1px;
      margin-left: 10px;
      position: absolute;
      bottom: -1px !important;
      right: -3px !important;
      padding-left: 10px;
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
    ${tw`p-[5px]`}
  }
  #tv_chart_container {
    /* border: 1px solid ${({ theme }) => theme.tokenBorder}; */
  }

  &::-webkit-scrollbar {
    display: none;
  }
  /* Hide scrollbar for IE, Edge and Firefox */
  & {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
`

const UNLOCKED_OVERLAY = styled.div<{ $blacklisted?: boolean }>`
  height: calc(100% - 10px);
  width: calc(100% - 10px);
  border: 1px solid ${({ theme }) => theme.tokenBorder};
  background: linear-gradient(106deg, rgba(247, 147, 26, 0.5) 11.1%, rgba(220, 31, 255, 0.3) 89.17%);
  /* background: linear-gradient(106deg, rgba(247, 147, 26, 0.5), 11.1%, rgba(220, 31, 255, 0.3) 89.17%), */
  position: absolute;
  top: 0;
  cursor: pointer;
  text-align: center;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .reposition {
    position: relative;
    height: 30px;
    width: 30px;
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

const CryptoContent: FC = () => {
  const [isLocked, setIsLocked] = useState(true)
  const [layout, setLayout] = useState(getInitLayout())
  const { blacklisted } = useConnectionConfig()
  const { height, width } = useWindowSize()
  const { mode } = useDarkMode()
  const { wallet } = useWallet()
  const [chartContainer, setChartContainer] = useState<any>()
  const isInitialRender = useRef(true)

  useEffect(() => {
    setChartContainer(<TVChartContainer visible={true} />)
    setTimeout(() => {
      setChartContainer(<></>)
      setChartContainer(<TVChartContainer visible={true} />)
    }, 300)
  }, [mode])

  useEffect(() => {
    if (!isInitialRender.current) {
      resetLayout()
    } else if (width !== undefined) {
      isInitialRender.current = false
    }
  }, [width])

  const getRowHeight = (height: number) => (height < 800 ? 20 : height / 38)

  const defaultProps = {
    className: 'layout',
    items: 3,
    rowHeight: getRowHeight(height),
    cols: { lg: 8, md: 4, sm: 2, xs: 2, xxs: 2 },
    isBounded: false,
    isDraggable: !blacklisted && !isLocked,
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
                <img src={`/img/assets/Reposition.svg`} alt="reposition" className="reposition" />
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
                  <img src={`/img/assets/Reposition.svg`} alt="reposition" className="reposition" />
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
                  <img src={`/img/assets/Reposition.svg`} alt="reposition" className="reposition" />
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
                <img src={`/img/assets/Reposition.svg`} alt="reposition" className="reposition" />
              </UNLOCKED_OVERLAY>
            ) : null}
          </div>
        )
      if (i === 4)
        return (
          <div key={i} className={`space-cont ${blacklisted ? ' filtering' : ''}`}>
            {<CollateralPanel />}
            {blacklisted ? (
              <UNLOCKED_OVERLAY $blacklisted={blacklisted}>
                <button className="georestricted">Georestricted</button>
              </UNLOCKED_OVERLAY>
            ) : !isLocked ? (
              <UNLOCKED_OVERLAY>
                <img src={`/img/assets/Reposition.svg`} alt="reposition" className="reposition" />
              </UNLOCKED_OVERLAY>
            ) : null}
          </div>
        )
      return <div key={i}>{/* <span className="text">{i}</span> */}</div>
    })

  const onLayoutChange = (newLayout) => {
    if (JSON.stringify(layout) === JSON.stringify(newLayout)) return
    localStorage.setItem('lg', JSON.stringify(newLayout))
    localStorage.setItem('md', JSON.stringify(newLayout))
    setLayout({ lg: newLayout, md: newLayout })
  }

  const resetLayout = () => {
    setLayout({ lg: componentDimensionsLg, md: componentDimensionsMd })
  }
  // useSuspense(isPageLoaded)
  return !checkMobileDex() ? (
    <>
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
        <TermsOfService />
      </DEX_CONTAINER>
    </>
  ) : (
    <DexhomeMobi />
  )
}

export const TermsOfService = () => {
  return (
    <div className="flex items-center sm:items-start sm:flex-col justify-between px-2 sm:px-0 sm:h-[70px] h-0 sm:mb-10 border-grey-4 dark:border-black-4 border-t-1">
      <div>
        {checkMobile() && (
          <div className="">
            <div className="flex sm:gap-2 px-1">
              <p className="text-[10px] text-white items-center flex ml-1 mt-2">Risk & Disclaimers</p>
              <p className="text-[10px] text-white items-center flex ml-1 mt-2">Terms of Service</p>
            </div>
            <p>
              <p className="text-[10px] items-center flex text-grey-1 px-2">
                Copyright 2024 GOOSEFX, security audits by
                <span className="text-white ml-1" onClick={() => openLinkInNewTab('https://osec.io/')}>
                  OtterSec.
                </span>
              </p>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
export default CryptoContent
