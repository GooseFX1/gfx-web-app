import React from 'react'
import { TabContent } from './TabContent'
import { NFTTab } from '../NFTTab'

const tabPanes = (isExplore: boolean) => [
  {
    order: '1',
    name: 'Collected',
    component: <TabContent type="collected" data={[1, 2, 4, 5, 5, 6, 7, 8, 9, 10]} isExplore={isExplore} />
  },
  {
    order: '2',
    name: 'Created',
    component: <TabContent type="created" data={[1, 2, 3, 4, 5]} isExplore={isExplore} />
  },
  {
    order: '3',
    name: 'Favorited',
    component: <TabContent type="favorited" data={[1, 2, 3, 4, 5]} isExplore={isExplore} />
  },
  {
    order: '4',
    name: 'Activity',
    component: <TabContent type="activity" data={[1, 2, 4, 5, 5, 6, 7, 8, 9, 10]} isExplore={isExplore} />
  }
]

type Props = {
  isExplore?: boolean
}
export const TabProfile = ({ isExplore }: Props) => <NFTTab tabPanes={tabPanes(isExplore)} />
