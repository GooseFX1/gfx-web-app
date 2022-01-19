import React from 'react'
import { TabContent } from './TabContent'
import { NFTTab } from '../NFTTab'

const tabPanes = (isExplore: boolean) => [
  {
    order: '1',
    name: 'Collected',
    component: <TabContent type="collected" />
  },
  {
    order: '2',
    name: 'Created',
    component: <TabContent type="created" />
  },
  {
    order: '3',
    name: 'Favorited',
    component: <TabContent type="favorited" />
  },
  {
    order: '4',
    name: 'Activity',
    component: <TabContent type="activity" />
  }
]

type Props = {
  isExplore?: boolean
}
export const TabProfile = ({ isExplore }: Props) => <NFTTab tabPanes={tabPanes(isExplore)} />
