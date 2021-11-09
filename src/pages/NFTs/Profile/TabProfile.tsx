import React from 'react'
import { TabContent } from './TabContent'
import { NFTTab } from '../NFTTab'

const tabPanes = [
  {
    order: '1',
    name: 'Collected',
    component: <TabContent type="collected" data={[1, 2, 4, 5, 5, 6, 7, 8, 9, 10]} />
  },
  {
    order: '2',
    name: 'Created',
    component: <TabContent type="created" data={[1, 2, 3, 4, 5]} />
  },
  {
    order: '3',
    name: 'Favorited',
    component: <TabContent type="favorited" data={[1, 2, 3, 4, 5]} />
  },
  {
    order: '4',
    name: 'Activity',
    component: <TabContent type="activity" data={[1, 2, 4, 5, 5, 6, 7, 8, 9, 10]} />
  }
]

export const TabProfile = () => <NFTTab tabPanes={tabPanes} />
