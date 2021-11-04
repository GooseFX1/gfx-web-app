import React from 'react'
import { TabContent } from './TabContent'
import { NFTTab } from '../NFTTab'

const tabPanes = [
  {
    order: '1',
    name: 'Live Auctions',
    component: <TabContent type="live-auctions" />
  },
  {
    order: '2',
    name: 'Fixed Price',
    component: <TabContent type="fixed-price" />
  },
  {
    order: '3',
    name: 'Open Bids',
    component: <TabContent type="open-bids" />
  },
  {
    order: '4',
    name: 'Owners',
    component: <TabContent type="owners" />
  }
]

export const CollectionTabs = () => <NFTTab tabPanes={tabPanes} />
