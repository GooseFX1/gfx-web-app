/* eslint-disable @typescript-eslint/no-unused-vars */
import { Tabs, TabsContent, TabsList, TabsTrigger, cn } from 'gfx-component-lib'
import React, { Dispatch, FC, ReactElement, SetStateAction } from 'react'
import { TitleLabel } from '../perps/components/PerpsGenericComp'
import { OrderBook } from '../OrderBook'
import { RecentTrades } from '../RecentTrades'
import PlaceOrderMobiV2 from './PlaceOrderMobiV2'
import { CollateralPanel } from '../perps/components/CollateralPanel'
import OpenOrdersAndPositions from './OpenOrdersAndPositions'

const OrderAccountPositions: FC<{
  tabs: string[]
  selectedTab: string
  setSelectedTab: Dispatch<SetStateAction<string>>
}> = ({ tabs, selectedTab, setSelectedTab }): ReactElement => (
  <div>
    <div>
      <Tabs className="p-[0px] sm:max-h-[450px] mb-24 sm:mb-4" defaultValue="1">
        <TabsList className="sm:dark:!bg-black-1 sm:bg-grey-5 sm:py-[15px]">
          <TabsTrigger
            className={cn('w-[33%]')}
            size="xl"
            value="1"
            onClick={() => setSelectedTab(tabs[0])}
            variant="primary"
          >
            <TitleLabel whiteText={selectedTab === tabs[0]}>{tabs[0]}</TitleLabel>
          </TabsTrigger>
          <TabsTrigger
            className={cn('w-[33%]')}
            size="xl"
            value="2"
            onClick={() => setSelectedTab(tabs[1])}
            variant="primary"
          >
            <TitleLabel whiteText={selectedTab === tabs[1]}>{tabs[1]}</TitleLabel>
          </TabsTrigger>
          <TabsTrigger
            className={cn('w-[33%]')}
            size="xl"
            value="3"
            onClick={() => setSelectedTab(tabs[2])}
            variant="primary"
          >
            <TitleLabel whiteText={selectedTab === tabs[2]}>{tabs[2]}</TitleLabel>
          </TabsTrigger>
        </TabsList>
        <TabsContent className={cn('h-[90%] sm:h-[65%] sm:rounded-[10px]')} value="1">
          <PlaceOrderMobiV2 />
        </TabsContent>
        <TabsContent className={cn('h-[90%] sm:h-[65%] sm:rounded-[10px]')} value="2">
          <CollateralPanel />
        </TabsContent>
        <TabsContent className={cn('h-[90%] sm:h-[65%] sm:rounded-[10px]')} value="3">
          <div className={cn('w-full h-full')}>
            <OpenOrdersAndPositions />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </div>
)

export default OrderAccountPositions
