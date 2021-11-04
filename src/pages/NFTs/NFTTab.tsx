import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { Tabs } from 'antd'

const { TabPane } = Tabs

const NFT_TAB = styled.div`
  z-index: 3;
  margin-top: -${({ theme }) => theme.margins['6x']};
  .ant-tabs-ink-bar {
    display: none;
  }
  .ant-tabs-top {
    > .ant-tabs-nav {
      margin-bottom: 0;
      &::before {
        border: none;
      }
    }
  }
  .ant-tabs-tab {
    color: #616161;
    font-size: 18px;
    + .ant-tabs-tab {
      margin: 0 0 0 ${({ theme }) => theme.margins['7x']};
    }
    &.ant-tabs-tab-active {
      .ant-tabs-tab-btn {
        color: #fff;
      }
    }
  }
`

type TabPanesType = {
  name: string
  order: string
  component: ReactNode
}

type Props = {
  defaultActiveKey?: string
  tabPanes: Array<TabPanesType>
}

export const NFTTab = ({ tabPanes, defaultActiveKey = '1' }: Props) => {
  return (
    <NFT_TAB>
      <Tabs defaultActiveKey={defaultActiveKey} centered>
        {tabPanes.map((tab) => (
          <TabPane tab={tab.name} key={tab.order}>
            {tab.component}
          </TabPane>
        ))}
      </Tabs>
    </NFT_TAB>
  )
}
