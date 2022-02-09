import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Tabs } from 'antd'
import { useNFTCollections } from '../../../context'
import { SearchBar } from '../../../components'
import { Sort } from './Sort'
import { CollectionTabContentV2 } from './CollectionTabContentV2'
import { OwnersTabContent } from './OwnersTabContent'

const { TabPane } = Tabs

//#region styles
const COLLECTION_TAB_V2 = styled.div`
  padding: ${({ theme }) => theme.margin(1.5)} ${({ theme }) => theme.margin(4)} 6px;
  position: relative;
  background: rgba(42, 42, 42, 1);
  border-radius: 20px 30px 0 0;
  margin-top: -${({ theme }) => theme.margin(1)};

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
          width: 65%;
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
          width: 92px;
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

const STYLED_SEARCH_BAR = styled.div`
  position: absolute;
  left: 32px;
  width: 515px;
  top: 20px;
  display: flex;
  align-items: center;
  z-index: 4;

  .collection-search-bar {
    height: 45px;
    width: 350px;
    margin-left: 0;
    margin-right: 30px;
    input {
      &::placeholder {
        color: rgba(114, 114, 114, 1);
      }
    }
  }

  button {
    height: 45px;
    width: 135px;
  }
`
//#endregion

export const CollectionTabV2 = () => {
  const { allCollections } = useNFTCollections()

  useEffect(() => {
    console.log('recieved collections')
  }, [allCollections])

  return allCollections ? (
    <COLLECTION_TAB_V2>
      <STYLED_SEARCH_BAR>
        <SearchBar className="collection-search-bar" placeholder="Search by nft or owner" />
        <Sort />
      </STYLED_SEARCH_BAR>
      <Tabs defaultActiveKey="1" centered>
        <TabPane tab="Live Auctions (187)" key="1">
          <CollectionTabContentV2 type="auction" />
        </TabPane>
        <TabPane tab="Fixed Price (234)" key="2">
          <CollectionTabContentV2 type="fixed" />
        </TabPane>
        <TabPane tab="Open Bids (199)" key="3">
          <CollectionTabContentV2 type="bid" />
        </TabPane>
        <TabPane tab="Owners (4.7k)" key="4">
          <OwnersTabContent />
        </TabPane>
      </Tabs>
    </COLLECTION_TAB_V2>
  ) : (
    <div>loading...</div>
  )
}
