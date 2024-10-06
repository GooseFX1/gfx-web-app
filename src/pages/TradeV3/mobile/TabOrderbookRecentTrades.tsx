import { Tabs, TabsContent, TabsList, TabsTrigger, cn } from 'gfx-component-lib'
import React, { ReactElement, useState } from 'react'
import { TitleLabel } from '../perps/components/PerpsGenericComp'
import { OrderBook } from '../OrderBook'
import { RecentTrades } from '../RecentTrades'

const TabOrderbookRecentTrades = (): ReactElement => {
  const [selectedTab, setSelectedTab] = useState('chart')

  return (
    <div>
      <Tabs className="p-0 max-sm:max-h-[300px]" defaultValue="1">
        <TabsList className="max-sm:dark:!bg-black-1 max-sm:bg-grey-5 max-sm:pb-[15px] max-sm:pt-3">
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
        <TabsContent className={cn('h-[90%] max-sm:h-[65%]')} value="2">
          <OrderBook />
        </TabsContent>
        <TabsContent className={cn('h-[90%] max-sm:h-[65%]')} value="3">
          <div className={cn('w-full h-full')}>
            <RecentTrades />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default TabOrderbookRecentTrades
