/* eslint-disable */
import { FC, useEffect, useRef, useState } from 'react'
import { useConnectionConfig, useDarkMode } from '../../context'
import { OrderbookTabs } from './OrderbookTabs'
import { TVChartContainer } from '../Crypto/TradingView/TradingView'
import { Responsive, WidthProvider } from 'react-grid-layout'
import { map, range } from 'lodash'
import { InfoBanner } from './InfoBanner'
import { PlaceOrder } from './PlaceOrder'
import { CollateralPanel } from './perps/components/CollateralPanel'
import { HistoryPanel } from '../TradeV3/HistoryPanel'
import useWindowSize from '../../utils/useWindowSize'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import { checkMobileDex } from '../../utils'
import { DexhomeMobi } from './mobile/DexhomeMobi'

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
const UnlockedOverlay:FC<{geoblocked?:boolean}> = ({geoblocked})=>
  <div className={`
  h-[calc(100%_-_10px)] w-[calc(100%_-_10px)] border-[1px] border-solid dark:border-white 
  border-border-primaryGradient-primary bg-gradient-110deg from-brand-secondaryGradient-primary/50
  to-brand-primaryGradient-secondary/30 absolute top-0 cursor-pointer text-center rounded-[3px] flex flex-col justify-center
  items-center
  `}>
  {
    geoblocked?
      <button className={`
      w-[142px] h-10 rounded-[40px] font-semibold text-[15px] text-white bg-[#3c3c3c] outline-none border-none
      `}>
        Georestricted
      </button>
      :
      <img src={`/img/assets/Reposition.svg`} alt="reposition"
           className={`relative h-6.5 w-6.5`}
      />
  }
</div>
const CryptoContent: FC = () => {
  const [isLocked, setIsLocked] = useState(true)
  const [layout, setLayout] = useState(getInitLayout())
  const { blacklisted } = useConnectionConfig()
  const { height, width } = useWindowSize()
  const { mode } = useDarkMode()
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

  const getRowHeight = (height: number) => (height < 800 ? 20 : height / 36.5)

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
    map(range(layout.lg.length), function (i) {
      if (i === 0)
        return (
          <div key={i} className="space-cont">
            {chartContainer}
            {!isLocked ? (
              <UnlockedOverlay/>
            ) : null}
          </div>
        )
      if (i === 1)
        return (
          <div key={i} className="space-cont">
            <>
              <OrderbookTabs />
              {!isLocked ? (
                <UnlockedOverlay/>
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
                <UnlockedOverlay/>
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
              <UnlockedOverlay/>
            ) : null}
          </div>
        )
      if (i === 4)
        return (
          <div key={i} className={`space-cont ${blacklisted ? ' filtering' : ''}`}>
            {<CollateralPanel />}
            {blacklisted ? (
              <UnlockedOverlay geoblocked={true}/>
            ) : !isLocked ? (
              <UnlockedOverlay/>
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
      <div className={'dex-container'} data-is-locked={isLocked}>
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
      </div>
    </>
  ) : (
    <DexhomeMobi />
  )
}

export default CryptoContent
