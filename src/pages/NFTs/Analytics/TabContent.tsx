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
  collections: NFTBaseCollection[]
  collectionFilter: 'floor' | 'volume' | 'listed'
  sort?: string | undefined
}

const TabContent = ({ collections, collectionFilter, sort }: ITabContent) => {
  const [collectionExtras, setCollectionExtras] = useState([])
  const fetchDetails = async (collection) => {
    try {
      const res = await fetchSingleCollectionBySalesType(
        NFT_API_ENDPOINTS.SINGLE_COLLECTION,
        `${collection.collection_id}`
      )
      return res.data
    } catch (error) {
      return null
    }
  }

  useEffect(() => {
    async function dyor() {
      let col = await Promise.all(collections.map(async (i: any) => ({ ...i, ...(await fetchDetails(i)) })))
      let cols = collections

      if (collectionFilter === 'floor') {
        if (sort === 'high') {
          cols = collections.sort(
            (a, b) =>
              col.find((d) => a.collection_id === d.collection_id).collection_floor -
              col.find((d) => b.collection_id === d.collection_id).collection_floor
          )
        } else if (sort === 'low') {
          cols = collections.sort(
            (a, b) =>
              col.find((d) => b.collection_id === d.collection_id).collection_floor -
              col.find((d) => a.collection_id === d.collection_id).collection_floor
          )
        }
      } else if (collectionFilter === 'volume') {
        if (sort === 'high') {
          cols = collections.sort(
            (a, b) =>
              col.find((d) => a.collection_id === d.collection_id).collection_vol.weekly -
              col.find((d) => b.collection_id === d.collection_id).collection_vol.weekly
          )
        } else if (sort === 'low') {
          cols = collections.sort(
            (a, b) =>
              col.find((d) => b.collection_id === d.collection_id).collection_vol.weekly -
              col.find((d) => a.collection_id === d.collection_id).collection_vol.weekly
          )
        }
      }

      setCollectionExtras(cols)
    }

    dyor()
  }, [collections, sort, collectionFilter])

  return (
    <TAB_CONTENT>
      {collectionExtras &&
        collectionExtras.map((collection: NFTBaseCollection, i) => (
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

  const [isCollection, setIsCollection] = useState(false)
  useEffect(() => {
    setTimeout(() => {
      setIsCollection(true)
    }, 1000)
  }, [])

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
      {!analyticData ? (
        <SkeletonCommon width="100px" height="100px" style={{ marginRight: '30px' }} />
      ) : (
        <img
          className="analytic-image"
          // @ts-ignorese
          src={collection.profile_pic_link.length > 0 ? collection.profile_pic_link : `/img/assets/nft-preview.svg`}
          alt="analytic-img"
        />
      )}
      <div className="analytic-content">
        <div style={{ position: 'relative' }}>
          <h2 className="title">
            {/* @ts-ignore */}
            {!analyticData ? <SkeletonCommon width="149px" height="28px" /> : collection.collection_name}
          </h2>
          {analyticData && collection.is_verified && (
            <img className="check-icon" src={`${process.env.PUBLIC_URL}/img/assets/check-icon.png`} alt="" />
          )}
        </div>
        <div className="value">
          <div>
            {!analyticData ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <SkeletonCommon width="89px" height="24px" style={{ marginRight: '10px' }} />
                <SkeletonCommon width="33px" height="33px" borderRadius="50%" />
              </div>
            ) : collectionFilter === 'floor' ? (
              <div>
                {analyticData.collection_floor ? nFormatter(analyticData.collection_floor / LAMPORTS_PER_SOL) : '0'}
                <img className="sol-icon" src={`${process.env.PUBLIC_URL}/img/assets/SOL-icon.svg`} alt="" />
              </div>
            ) : (
              collectionFilter === 'volume' &&
              (analyticData.collection_vol ? nFormatter(analyticData.collection_vol.weekly) : '0')
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
