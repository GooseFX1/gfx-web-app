import React from 'react'
import styled from 'styled-components'
import { Tabs } from 'antd'
import TabContent from './TabContent'

const { TabPane } = Tabs

const TAB_PROFILE = styled.div`
  z-index: 3;
  margin-top: -52px;
  .ant-tabs-ink-bar {
    display: none;
  }
  .ant-tabs-top {
    > .ant-tabs-nav {
      &::before {
        border: none;
      }
    }
  }

  .ant-tabs-tab {
    color: #616161;
    font-size: 18px;
    + .ant-tabs-tab {
      margin: 0 0 0 55px;
    }
    &.ant-tabs-tab-active {
      .ant-tabs-tab-btn {
        color: #fff;
      }
    }
  }
`

const TabProfile = () => {
  return (
    <TAB_PROFILE>
      <Tabs defaultActiveKey="1" centered>
        <TabPane tab="Collected" key="1">
          <TabContent type="collected" data={[1, 2, 4, 5, 5, 6, 7, 8, 9, 10]} />
        </TabPane>
        <TabPane tab="Created" key="2">
          <TabContent type="created" data={[1, 2, 4, 5, 5, 6, 7, 8, 9, 10]} />
        </TabPane>
        <TabPane tab="Favorited" key="3">
          Content of Tab Favorited
        </TabPane>
        <TabPane tab="Activity" key="4">
          Content of Tab Activity
        </TabPane>
      </Tabs>
    </TAB_PROFILE>
  )
}

export default TabProfile
