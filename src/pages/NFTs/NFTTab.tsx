import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { Tabs } from 'antd'

const { TabPane } = Tabs

const NFT_TAB = styled.div`
  min-height: 60vh;
  z-index: 3;
  margin-top: -${({ theme }) => theme.margin(6)};

  .profile-tab-container,
  .profile-tab-pane,
  .ant-tabs-content {
    background: ${({ theme }) => theme.profileTabContainerBg};
    height: 100%;
    border-radius: 20px 20px 0 0;
    overflow-x: hidden;
    overflow-y: scroll;

    .ant-tabs-nav-wrap {
      width: 50%;
    }
  }

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
    .ant-tabs-tab-btn {
      font-weight: 500;
      font-family: Montserrat;
      font-size: 17px;
    }
    + .ant-tabs-tab {
      margin: 0 ${({ theme }) => theme.margin(2)};
    }
    &.ant-tabs-tab-active {
      .ant-tabs-tab-btn {
        color: ${({ theme }) => theme.text7};
        font-weight: 600;
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
  isExplore?: boolean
}

export const NFTTab = ({ tabPanes, defaultActiveKey = '1' }: Props) => (
  <NFT_TAB>
    <Tabs defaultActiveKey={defaultActiveKey} centered className="profile-tab-container">
      {tabPanes.map((tab) => (
        <TabPane tab={tab.name} key={tab.order} className="profile-tab-pane">
          {tab.component}
        </TabPane>
      ))}
    </Tabs>
  </NFT_TAB>
)
