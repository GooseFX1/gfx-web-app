import { Tabs, TabsContent, TabsList, TabsTrigger, cn } from 'gfx-component-lib'
import React, { ReactElement } from 'react'
import { TitleLabel } from '../perps/components/PerpsGenericComp'
import { OrderBook } from '../OrderBook'
import { RecentTrades } from '../RecentTrades'

const TabOrderbookRecentTrades = (): ReactElement => {
  const [selectedTab, setSelectedTab] = React.useState('chart')
  return (
    <div>
      <Tabs className="p-[0px] mb-2 sm:max-h-[300px]" defaultValue="1">
        <TabsList>
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
        <TabsContent className={cn('h-[90%]')} value="1">
          <OrderBook />
        </TabsContent>
        <TabsContent className={cn('h-[90%]')} value="2">
          <OrderBook />
        </TabsContent>
        <TabsContent className={cn('h-[90%] border border-solid')} value="3">
          <div className={cn('w-full h-full')}>
            <RecentTrades />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default TabOrderbookRecentTrades
