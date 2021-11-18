import styled from 'styled-components'
import { Tabs } from 'antd'
import { LiveAuctionsTabContent } from './LiveAuctionsTabContent'
import { FixedPriceTabContent } from './FixedPriceTabContent'
import { OpenBidsTabContent } from './OpenBidsTabContent'
import { OwnersTabContent } from './OwnersTabContent'

const { TabPane } = Tabs

const COLLECTION_TABS = styled.div`
  z-index: 3;
  margin-top: ${({ theme }) => `-${theme.margins['6x']}`};

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
      margin: 0 0 0 ${({ theme }) => `${theme.margins['7x']}`};
    }

    &.ant-tabs-tab-active {
      .ant-tabs-tab-btn {
        color: #fff;
      }
    }
  }
`

export const CollectionTabs = () => {
  return (
    <COLLECTION_TABS>
      <Tabs defaultActiveKey="1" centered>
        <TabPane tab="Live Auctions" key="1">
          <LiveAuctionsTabContent />
        </TabPane>
        <TabPane tab="Fixed Price" key="2">
          <FixedPriceTabContent />
        </TabPane>
        <TabPane tab="Open Bids" key="3">
          <OpenBidsTabContent />
        </TabPane>
        <TabPane tab="Owners" key="4">
          <OwnersTabContent />
        </TabPane>
      </Tabs>
    </COLLECTION_TABS>
  )
}
