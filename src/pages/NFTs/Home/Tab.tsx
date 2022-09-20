import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Tabs } from 'antd'
import { useNFTCollections } from '../../../context'
import { NFTCollection } from '../../../types/nft_collections.d'
import { Categories } from '../../../components'
import TabContent from './TabContent'
import tw from 'twin.macro'
const { TabPane } = Tabs

//#region styles
const ANALYTICS_TABS = styled.div`
  padding: ${({ theme }) => theme.margin(1.5)} 0 6px;
  position: relative;

  .fade {
    position: absolute;
    bottom: 0;
    right: 0;
    height: calc(100% - 76px);
    width: 180px;
    background: linear-gradient(90deg, #fff0 0%, #131313 90%);
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
          ${tw`sm:pr-0 sm:mx-0 sm:mt-2.5 sm:w-full`}
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
    ${tw`sm:text-regular`}
    color: ${({ theme }) => theme.tabNameColor};
    font-size: 22px;
    font-family: Montserrat;

    &.ant-tabs-tab-active {
      .ant-tabs-tab-btn {
        ${tw`sm:text-regular`}
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

const ANALYTICS_DROPDOWN = styled.div`
  ${tw`sm:static sm:w-full sm:justify-around`}
  position: absolute;
  left: 32px;
  width: 355px;
  top: 20px;
  display: flex;
  align-items: center;
  z-index: 4;
  .title {
    ${tw`sm:text-regular sm:mr-0`}
    font-size: 22px;
    font-weight: 600;
    color: ${({ theme }) => theme.text2};
    margin-bottom: 0;
    margin-right: ${({ theme }) => theme.margin(3)};
  }
  .analytics-dropwdown {
    @media (max-width: 500px) {
      background: ${({ theme }) => theme.primary3};
      height: 40px;
    }
    width: 136px;
    height: 45px;
    span {
      font-size: 13px;
    }
  }
`
//#endregion

const AnalyticsTabs = () => {
  const { detailedCollections } = useNFTCollections()
  const [mainCollections, setMainCollections] = useState<NFTCollection[]>(detailedCollections)
  const [sort, setSort] = useState('high')

  useEffect(() => {
    setMainCollections(detailedCollections)
  }, [detailedCollections])

  const handleSort = (choice) => {
    const first = choice.split(' ')
    setSort(first[0].toLowerCase())
  }

  return (
    <ANALYTICS_TABS>
      <ANALYTICS_DROPDOWN>
        <span className="title">Weekly Analytics</span>
        <Categories
          categories={[
            { name: 'High to Low', icon: 'all' },
            { name: 'Low to High', icon: 'art' }
          ]}
          className="analytics-dropwdown"
          onChange={(e) => handleSort(e)}
        />
      </ANALYTICS_DROPDOWN>
      <Tabs defaultActiveKey="1" centered>
        <TabPane tab="Floor" key="1">
          <TabContent detailedCollections={mainCollections} sort={sort} collectionFilter={'floor'} />
        </TabPane>
        <TabPane tab="Volume" key="2">
          <TabContent detailedCollections={mainCollections} sort={sort} collectionFilter={'volume'} />
        </TabPane>
      </Tabs>

      {/* TODO: fade to be used when carousel is implemented <div className="fade"></div> */}
    </ANALYTICS_TABS>
  )
}

export default AnalyticsTabs
