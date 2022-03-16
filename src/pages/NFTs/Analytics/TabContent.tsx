import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import styled from 'styled-components'
import { Skeleton } from 'antd'
import { NFTBaseCollection, NFTCollection } from '../../../types/nft_collections.d'
import { NFT_API_ENDPOINTS, fetchSingleCollectionBySalesType } from '../../../api/NFTs'
import { nFormatter } from '../../../utils'
import { SkeletonCommon } from '../Skeleton/SkeletonCommon'

const TAB_CONTENT = styled.div`
  min-height: 300px;
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
    margin-right: ${({ theme }) => theme.margin(3)};
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
  baseCollections: NFTBaseCollection[]
  collectionFilter: 'floor' | 'volume' | 'listed'
  sort?: string | undefined
}

const TabContent = ({ baseCollections, collectionFilter, sort }: ITabContent) => {
  const [collectionExtras, setCollectionExtras] = useState<NFTCollection[]>()

  useEffect(() => {
    setCollectionSort(baseCollections)
  }, [baseCollections, sort, collectionFilter])

  const setCollectionSort = async (cols: NFTBaseCollection[]) => {
    const fullCollections = await Promise.all(
      cols.map(async (col: NFTBaseCollection) => await fetchDetails(col.collection_id))
    )

    if (collectionFilter === 'floor') {
      if (sort === 'high') {
        setCollectionExtras(fullCollections.sort((a, b) => b.collection_floor - a.collection_floor))
      } else if (sort === 'low') {
        setCollectionExtras(fullCollections.sort((a, b) => a.collection_floor - b.collection_floor))
      }
    } else if (collectionFilter === 'volume') {
      if (sort === 'high') {
        setCollectionExtras(fullCollections.sort((a, b) => b.collection_vol.weekly - a.collection_vol.weekly))
      } else if (sort === 'low') {
        setCollectionExtras(fullCollections.sort((a, b) => a.collection_vol.weekly - b.collection_vol.weekly))
      }
    }
  }

  const fetchDetails = async (id: number) => {
    try {
      const res = await fetchSingleCollectionBySalesType(NFT_API_ENDPOINTS.SINGLE_COLLECTION, `${id}`)
      return res.data
    } catch (error) {
      return null
    }
  }

  return (
    <TAB_CONTENT>
      {collectionExtras &&
        collectionExtras
          .slice(0, 8)
          .map((collection: NFTCollection, i) => (
            <AnalyticItem collection={collection} key={i} collectionFilter={collectionFilter} />
          ))}
    </TAB_CONTENT>
  )
}

export default React.memo(TabContent)

interface IAnalyticItem {
  collection: NFTCollection
  collectionFilter: 'floor' | 'volume' | 'listed'
}

const AnalyticItem = ({ collection, collectionFilter }: IAnalyticItem) => {
  const history = useHistory()
  const [isCollection, setIsCollection] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setIsCollection(true)
    }, 500)
  }, [])

  return (
    <ANALYTIC_ITEM onClick={() => history.push(`/NFTs/collection/${collection.collection_id}`)}>
      {!isCollection ? (
        <SkeletonCommon width="100px" height="100px" style={{ marginRight: '30px' }} />
      ) : (
        <img
          className="analytic-image"
          // @ts-ignorese
          src={
            collection.collection[0].profile_pic_link.length > 0
              ? collection.collection[0].profile_pic_link
              : `/img/assets/nft-preview.svg`
          }
          alt="analytic-img"
        />
      )}
      <div className="analytic-content">
        <div style={{ position: 'relative' }}>
          <h2 className="title">
            {/* @ts-ignore */}
            {!isCollection ? <SkeletonCommon width="149px" height="28px" /> : collection.collection[0].collection_name}
          </h2>
          {isCollection && collection && collection.collection[0].is_verified && (
            <img className="check-icon" src={`${process.env.PUBLIC_URL}/img/assets/check-icon.png`} alt="" />
          )}
        </div>
        <div className="value">
          <div>
            {!isCollection ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <SkeletonCommon width="89px" height="24px" style={{ marginRight: '10px' }} />
                <SkeletonCommon width="33px" height="33px" borderRadius="50%" />
              </div>
            ) : collectionFilter === 'floor' ? (
              <div>
                {collection.collection_floor ? nFormatter(collection.collection_floor / LAMPORTS_PER_SOL) : '0'}
                <img className="sol-icon" src={`${process.env.PUBLIC_URL}/img/assets/SOL-icon.svg`} alt="" />
              </div>
            ) : (
              collectionFilter === 'volume' &&
              (collection.collection_vol ? nFormatter(collection.collection_vol.weekly) : '0')
            )}
          </div>
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
