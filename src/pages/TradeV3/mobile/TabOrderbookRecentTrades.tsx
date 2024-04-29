import { Tabs, TabsContent, TabsList, TabsTrigger, cn } from 'gfx-component-lib'
import React, { ReactElement, useEffect, useState } from 'react'
import { TitleLabel } from '../perps/components/PerpsGenericComp'
import { OrderBook } from '../OrderBook'
import { RecentTrades } from '../RecentTrades'
import { TVChartContainer } from '../../../pages/Crypto/TradingView/TradingView'

const TabOrderbookRecentTrades = (): ReactElement => {
  const [selectedTab, setSelectedTab] = useState('chart')
  const [chartContainer, setChartContainer] = useState<any>()
  useEffect(() => {
    setChartContainer(<TVChartContainer visible={true} />)
    // setTimeout(() => {
    //   setChartContainer(<></>)
    //   setChartContainer(<TVChartContainer symbol={selectedCrypto.pair} visible={true} />)
    // }, 300)
  }, [])
  return (
    <div>
      <Tabs className="p-[0px] mb-2 sm:max-h-[350px]" defaultValue="1">
        <TabsList className=" sm:!bg-black-1">
          <TabsTrigger
            className={cn('w-[33%]')}
            size="xl"
            value="1"
            onClick={() => setSelectedTab('chart')}
            variant="primary"
          >
            <TitleLabel whiteText={selectedTab === 'chart'}>Chart</TitleLabel>
          </TabsTrigger>
          <TabsTrigger
            className={cn('w-[33%]')}
            size="xl"
            value="2"
            onClick={() => setSelectedTab('orderbook')}
            variant="primary"
          >
            <TitleLabel whiteText={selectedTab === 'orderbook'}>Orderbook</TitleLabel>
          </TabsTrigger>
          <TabsTrigger
            className={cn('w-[33%]')}
            size="xl"
            value="3"
            onClick={() => setSelectedTab('trades')}
            variant="primary"
          >
            <TitleLabel whiteText={selectedTab === 'trades'}>Recent Trades</TitleLabel>
          </TabsTrigger>
        </TabsList>
        <TabsContent className={cn('h-[90%] sm:h-[280px] sm:max-h-[350px]')} value="1">
          {chartContainer}
        </TabsContent>
        <TabsContent className={cn('h-[90%] sm:h-[65%]')} value="2">
          <OrderBook />
        </TabsContent>
        <TabsContent className={cn('h-[90%] sm:h-[65%]')} value="3">
          <div className={cn('w-full h-full')}>
            <RecentTrades />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default TabOrderbookRecentTrades
