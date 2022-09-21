import React from 'react'
import styled from 'styled-components'
import { Tabs } from 'antd'
import { useNFTCollections } from '../../../context'
import { SearchBar } from '../../../components'
import { FixedPriceTabContent } from './FixedPriceTabContent'
import { OpenBidsTabContent } from './OpenBidsTabContent'
import { SkeletonCommon } from '../Skeleton/SkeletonCommon'
import { OwnersTabContent } from './OwnersTabContent'

const { TabPane } = Tabs

//#region styles
const COLLECTION_TABS = styled.div<{ $height: string }>`
  position: relative;
  height: ${({ $height }) => `calc(${$height}`}% + 28px);
  margin-top: -${({ theme }) => theme.margin(3.5)};
  overflow-x: hidden;
  overflow-y: scroll;
  scroll-behavior: smooth;
  ${({ theme }) => theme.customScrollBar('4px')}
  z-index: 10;

  .card-list {
    grid-gap: ${({ theme }) => theme.margin(3)};
  }

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
          width: 52%;
          margin-left: auto;
          padding-right: 21px;
        }
      }
    }
  }

  .ant-tabs-nav {
    padding: 0 !important;
    background-color: ${({ theme }) => theme.bg3};
    border-bottom: 1px solid ${({ theme }) => theme.tabDivider} !important;
    border-radius: 20px 30px 0 0;
  }

  .ant-tabs-content {
    background-color: ${({ theme }) => theme.bg3};
    min-height: calc(70vh - 156px);
  }

  .ant-tabs-nav-list {
    height: 85px;
  }

  .ant-tabs-tab {
    color: ${({ theme }) => theme.tabNameColor};
    font-size: 18px;
    font-family: Montserrat;
    padding: 0;
    margin: 0;

    &.ant-tabs-tab-active {
      .ant-tabs-tab-btn {
        color: ${({ theme }) => theme.text7};
        font-weight: 600;
        position: relative;

        &:before {
          position: absolute;
          content: '';
          height: 7px;
          width: 92px;
          bottom: -28px;
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

const STYLED_SEARCH_BAR = styled.div`
  position: absolute;
  left: 32px;
  width: 515px;
  top: 20px;
  display: flex;
  align-items: center;
  z-index: 4;
  color: ${({ theme }) => theme.text2};

  .collection-search-bar {
    height: 45px;
    width: 350px;
    margin-left: 0;
    margin-right: 30px;
    background-color: ${({ theme }) => theme.searchbarSmallBackground};
    input {
      background-color: ${({ theme }) => theme.searchbarSmallBackground};
      &::placeholder {
        color: ${({ theme }) => theme.text8};
      }
    }
  }

  button {
    height: 45px;
  }
`
//#endregion

export const CollectionTabs = ({
  filter,
  setFilter,
  collapse,
  setCollapse
}: {
  filter: string
  setFilter: (s: string) => void
  collapse: boolean
  setCollapse: (b: boolean) => void
}) => {
  const { singleCollection } = useNFTCollections()

  return (
    <COLLECTION_TABS id="border" $height={collapse ? '67' : '50'}>
      <STYLED_SEARCH_BAR>
        <SearchBar
          className="collection-search-bar"
          placeholder="Search by nft name"
          setFilter={setFilter}
          filter={filter}
        />
      </STYLED_SEARCH_BAR>
      {singleCollection ? (
        <Tabs className={'collection-tabs'} defaultActiveKey="1" centered>
          <TabPane tab="Fixed Price" key="1">
            <FixedPriceTabContent filter={filter} setCollapse={setCollapse} />
          </TabPane>
          <TabPane tab="Open Bids" key="2">
            <OpenBidsTabContent filter={filter} setCollapse={setCollapse} />
          </TabPane>
          <TabPane tab="Owners" key="3">
            <OwnersTabContent filter={filter} setCollapse={setCollapse} />
          </TabPane>
        </Tabs>
      ) : (
        <SkeletonCommon height="61vh" width="100%" />
      )}
    </COLLECTION_TABS>
  )
}
