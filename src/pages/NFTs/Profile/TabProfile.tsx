import React from 'react'
import { Tabs } from 'antd'
import { TabContent } from './TabContent'
import { StyledTabProfile } from './TableProfile.styled'

const { TabPane } = Tabs

export const TabProfile = () => {
  return (
    <StyledTabProfile>
      <Tabs defaultActiveKey="1" centered>
        <TabPane tab="Collected" key="1">
          <TabContent type="collected" data={[1, 2, 4, 5, 5, 6, 7, 8, 9, 10]} />
        </TabPane>
        <TabPane tab="Created" key="2">
          <TabContent type="created" data={[1, 2, 3, 4, 5]} />
        </TabPane>
        <TabPane tab="Favorited" key="3">
          <TabContent type="favorited" data={[1, 2, 4, 5, 5, 6, 7, 8, 9, 10]} />
        </TabPane>
        <TabPane tab="Activity" key="4">
          <TabContent type="activity" data={[1, 2, 4, 5, 5, 6, 7, 8, 9, 10]} />
        </TabPane>
      </Tabs>
    </StyledTabProfile>
  )
}
