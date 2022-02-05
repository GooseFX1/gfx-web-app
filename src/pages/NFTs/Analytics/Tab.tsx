import styled from 'styled-components'
import { Tabs } from 'antd'
import { Categories } from '../../../components'
import { mockAnalyticsDrodown } from './mockData'
import { TabContent } from './TabContent'

const { TabPane } = Tabs

const ANALYTICS_TABS = styled.div`
  padding: ${({ theme }) => theme.margin(1.5)} ${({ theme }) => theme.margin(4)} 6px;
  position: relative;

  .ant-tabs-ink-bar {
    display: none;
  }

  .ant-tabs-top {
    overflow: initial;
    > .ant-tabs-nav {
      margin-bottom: 0;
      border-bottom: 1px solid #575757;
      padding-bottom: 6px;

      &::before {
        border: none;
      }

      .ant-tabs-nav-wrap {
        overflow: initial;
        display: block;

        .ant-tabs-nav-list {
          position: relative;
          display: flex;
          justify-content: space-around;
          transition: transform 0.3s;
          width: 55%;
          margin-left: auto;
          padding-right: 21px;
        }
      }
    }
  }

  .ant-tabs-tab {
    color: ${({ theme }) => theme.tabNameColor};
    font-size: 22px;
    font-family: Montserrat;

    &.ant-tabs-tab-active {
      .ant-tabs-tab-btn {
        color: ${({ theme }) => theme.text7};
        font-weight: 600;
        position: relative;
        &:before {
          position: absolute;
          content: '';
          height: 7px;
          width: 130%;
          bottom: -18px;
          left: 50%;
          background: rgba(88, 85, 255, 1);
          z-index: 6;
          display: inline-block;
          border-radius: 8px 8px 0 0;
          transform: translate(-50%, 0);
        }
      }
    }
  }
`

// ${({ theme }) => theme.mediaWidth.upToLarge`
//   justify-content: flex-end;
// `};
// ${({ theme }) => theme.mediaWidth.fromLarge`
// justify-content: center;
// `};
const ANALYTICS_DROPDOWN = styled.div`
  position: absolute;
  left: 32px;
  width: 355px;
  top: 20px;
  display: flex;
  align-items: center;
  z-index: 4;
  .title {
    font-size: 22px;
    font-weight: 600;
    color: ${({ theme }) => theme.text2};
    margin-bottom: 0;
    margin-right: ${({ theme }) => theme.margin(3)};
  }
  .analytics-dropwdown {
    width: 136px;
    height: 40px;
    span {
      font-size: 13px;
    }
  }
`

export const AnalyticsTabs = () => {
  return (
    <ANALYTICS_TABS>
      <ANALYTICS_DROPDOWN>
        <span className="title">Weekly Analytics</span>
        <Categories categories={mockAnalyticsDrodown} className="analytics-dropwdown" />
      </ANALYTICS_DROPDOWN>
      <Tabs defaultActiveKey="1" centered>
        <TabPane tab="Floor" key="1">
          <TabContent />
        </TabPane>
        <TabPane tab="Volume" key="2">
          <TabContent />
        </TabPane>
        <TabPane tab="Listed NFT’S" key="3">
          <TabContent />
        </TabPane>
      </Tabs>
    </ANALYTICS_TABS>
  )
}
