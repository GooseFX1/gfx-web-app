import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import styled from 'styled-components'
import { Skeleton } from 'antd'
import { NFTBaseCollection, NFTCollection } from '../../../types/nft_collections.d'
import { NFT_API_ENDPOINTS, fetchSingleCollectionBySalesType } from '../../../api/NFTs'
import { nFormatter } from '../../../utils'

const TAB_CONTENT = styled.div`
  padding: ${({ theme }) => `${theme.margin(4)}`} 32px 0;
  display: flex;
  flex-wrap: wrap;
`
const ANALYTIC_ITEM = styled.div`
  display: flex;
  width: 25%;
  padding: ${({ theme }) => theme.margin(2)} ${({ theme }) => theme.margin(3)};
  border: 1px solid transparent;
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.bg1};
    border: 1px solid ${({ theme }) => theme.bg5};
  }

  * {
    cursor: pointer;
  }

  .analytic-image {
    width: 100px;
    height: 100px;
    border-radius: 10px;
    margin-right: ${({ theme }) => theme.margin(2)};
  }

  .analytic-content {
    text-align: left;
    overflow: hidden;
    width: calc(100% - 100px);
  }

  .title {
    margin: 0;
    color: ${({ theme }) => theme.text2};
    font-size: 23px;
    font-weight: 500;
    line-height: 1.3;
    width: 87%;
    ${({ theme }) => theme.ellipse};
  }
  .check-icon {
    position: absolute;
    top: 0;
    right: 0;
    width: 20px;
    height: 20px;
    margin-left: ${({ theme }) => theme.margin(1)};
  }

  .value {
    display: flex;
    align-items: center;
    font-size: 20px;
    margin-top: 11px;
    font-weight: 600;
    color: ${({ theme }) => theme.text2};

    img {
      width: 33px;
      height: 33px;
      margin-left: ${({ theme }) => theme.margin(1)};
    }
  }

  .progress {
    display: flex;
    align-items: center;
    margin-top: ${({ theme }) => theme.margin(1)};
    color: ${({ theme }) => theme.text2};

    img {
      width: 22px;
      height: 13px;
      margin-right: ${({ theme }) => theme.margin(1)};
    }
    .percent {
      font-size: 15px;
      font-weight: 500;
    }
  }
`

interface ITabContent {
  collections: NFTBaseCollection[]
  collectionFilter: 'floor' | 'volume' | 'listed'
}

const TabContent = ({ collections, collectionFilter }: ITabContent) => {
  return (
    <TAB_CONTENT>
      {collections &&
        collections.map((collection: NFTBaseCollection, i) => (
          <AnalyticItem collection={collection} key={i} collectionFilter={collectionFilter} />
        ))}
    </TAB_CONTENT>
  )
}

export default React.memo(TabContent)

interface IAnalyticItem {
  collection: NFTBaseCollection
  collectionFilter: 'floor' | 'volume' | 'listed'
}

const AnalyticItem = ({ collection, collectionFilter }: IAnalyticItem) => {
  const history = useHistory()
  const [analyticData, setAnalyticData] = useState<NFTCollection>()

  useEffect(() => {
    fetchDetails()

    return () => setAnalyticData(undefined)
  }, [collection])

  const fetchDetails = async () => {
    try {
      const res = await fetchSingleCollectionBySalesType(
        NFT_API_ENDPOINTS.SINGLE_COLLECTION,
        `${collection.collection_id}`
      )
      setAnalyticData(res.data)
    } catch (error) {
      console.error(`Error fetching collection details: ${collection.collection_name}`)
    }
  }

  return (
    <ANALYTIC_ITEM onClick={() => history.push(`/NFTs/collection/${collection.collection_id}`)}>
      <img
        className="analytic-image"
        // @ts-ignore
        src={collection.profile_pic_link.length > 0 ? collection.profile_pic_link : `/img/assets/nft-preview.svg`}
        alt="analytic-img"
      />
      <div className="analytic-content">
        <div style={{ position: 'relative' }}>
          <h2 className="title">
            {/* @ts-ignore */}
            {collection.collection_name}
          </h2>
          {collection.is_verified && (
            <img className="check-icon" src={`${process.env.PUBLIC_URL}/img/assets/check-icon.png`} alt="" />
          )}
        </div>
        <div className="value">
          {analyticData ? (
            <div>
              {collectionFilter === 'floor' && (
                <div>
                  {analyticData.collection_floor ? nFormatter(analyticData.collection_floor / LAMPORTS_PER_SOL) : '0'}
                  <img className="sol-icon" src={`${process.env.PUBLIC_URL}/img/assets/SOL-icon.svg`} alt="" />
                </div>
              )}

              {collectionFilter === 'volume' &&
                (analyticData.collection_vol ? nFormatter(analyticData.collection_vol.weekly) : '0')}
            </div>
          ) : (
            <Skeleton.Button active size="small" style={{ display: 'flex', height: '20px', width: '64px' }} />
          )}
        </div>
        {/* <div className="progress">
          {analyticData ? (
            <span>
              <img className="progress-icon" src={`${process.env.PUBLIC_URL}/img/assets/increase-icon.svg`} alt="" />
              <span className="percent">+ 1.15 %</span>
            </span>
          ) : (
            <Skeleton.Button active size="small" style={{ display: 'flex', height: '20px' }} />
          )}
        </div> */}
      </div>
    </ANALYTIC_ITEM>
  )
}
