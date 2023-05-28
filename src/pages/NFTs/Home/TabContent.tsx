/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import styled from 'styled-components'
import { NFTCollection } from '../../../types/nft_collections.d'
import { nFormatter } from '../../../utils'
import { useNFTProfile, usePriceFeed, useDarkMode } from '../../../context'
import { SkeletonCommon } from '../Skeleton/SkeletonCommon'
import { Image } from 'antd'
import { checkMobile } from '../../../utils'
import tw from 'twin.macro'

const TAB_CONTENT = styled.div`
  min-height: 300px;
  padding: ${({ theme }) => `${theme.margin(4)}`} 32px 0;
  display: flex;
  flex-wrap: wrap;
`

const ROW = styled.div`
  ${tw`flex flex-row overflow-x-scroll py-0 px-3.5 mt-3`}

  ::-webkit-scrollbar {
    display: none;
  }
`

const ANALYTIC_ITEM = styled.div`
  ${tw`sm:w-3/4`}
  display: flex;
  width: 25%;
  padding: ${({ theme }) => theme.margin(2)} ${({ theme }) => theme.margin(3)};
  border: 1px solid transparent;
  border-radius: 10px;
  cursor: pointer;
  height: 134px;

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
    background-color: ${({ theme }) => theme.black};
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

    .currency-icon {
      width: 22px;
      height: 22px;
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
  detailedCollections: NFTCollection[]
  collectionFilter: 'floor' | 'volume' | 'listed'
  sort?: string | undefined
}

const TabContent = ({ detailedCollections, collectionFilter, sort }: ITabContent) => {
  const [collectionExtras, setCollectionExtras] = useState<NFTCollection[]>()

  useEffect(() => {
    setCollectionSort(detailedCollections)
  }, [detailedCollections, sort, collectionFilter])

  const setCollectionSort = async (collections: NFTCollection[]) => {
    if (collectionFilter === 'floor') {
      if (sort === 'high') {
        setCollectionExtras(collections.sort((a, b) => b.floor_price - a.floor_price))
      } else if (sort === 'low') {
        setCollectionExtras(collections.sort((a, b) => a.floor_price - b.floor_price))
      }
    } else if (collectionFilter === 'volume') {
      if (sort === 'high') {
        setCollectionExtras(collections.sort((a, b) => b.weekly_volume - a.weekly_volume))
      } else if (sort === 'low') {
        setCollectionExtras(collections.sort((a, b) => a.weekly_volume - b.weekly_volume))
      }
    }
  }

  return !checkMobile() ? (
    <TAB_CONTENT>
      {collectionExtras &&
        collectionExtras
          .slice(0, 8)
          .map((collection: NFTCollection, i) => (
            <AnalyticItem collection={collection} key={i} collectionFilter={collectionFilter} />
          ))}
    </TAB_CONTENT>
  ) : collectionExtras && collectionExtras.length > 0 ? (
    <>
      <ROW>
        {collectionExtras.slice(0, 4).map((collection: NFTCollection, i) => (
          <AnalyticItem collection={collection} key={i} collectionFilter={collectionFilter} />
        ))}
      </ROW>
      <ROW>
        {collectionExtras.slice(4, 8).map((collection: NFTCollection, i) => (
          <AnalyticItem collection={collection} key={i} collectionFilter={collectionFilter} />
        ))}
      </ROW>
    </>
  ) : (
    <>
      {[1, 2].map(() => (
        <SkeletonCommon height="100px" width="90%" style={{ margin: '28px auto 0', display: 'block' }} />
      ))}
    </>
  )
}

export default React.memo(TabContent)

interface IAnalyticItem {
  collection: NFTCollection
  collectionFilter: 'floor' | 'volume' | 'listed'
}

const AnalyticItem = ({ collection, collectionFilter }: IAnalyticItem) => {
  const { mode } = useDarkMode()
  const history = useHistory()
  const { prices } = usePriceFeed()
  const { userCurrency } = useNFTProfile()
  const [isCollection, setIsCollection] = useState(false)

  useEffect(() => {
    setIsCollection(collection !== undefined)
    return () => setIsCollection(false)
  }, [])

  const dynamicPriceValue = (currency: string, priceFeed: any, value: number) => {
    const val = currency === 'USD' ? value * priceFeed['SOL/USDC']?.current : value
    return nFormatter(val, 2)
  }

  return (
    <ANALYTIC_ITEM
      onClick={() =>
        isCollection
          ? history.push(`/NFTs/collection/${collection.collection_name.replaceAll(' ', '_')}`)
          : console.log('Error: Analytics No collection')
      }
    >
      {!isCollection ? (
        <SkeletonCommon width="100px" height="100px" style={{ marginRight: '30px' }} />
      ) : (
        <Image
          className="analytic-image"
          src={
            collection.profile_pic_link.length > 0
              ? collection.profile_pic_link
              : `/img/assets/nft-preview-${mode}.svg`
          }
          fallback={`/img/assets/nft-preview-${mode}.svg`}
          preview={false}
          alt="analytic-img"
        />
      )}
      <div className="analytic-content">
        <div style={{ position: 'relative' }}>
          <h2 className="title">
            {!isCollection ? <SkeletonCommon width="149px" height="28px" /> : collection.collection_name}
          </h2>
          {isCollection && collection && collection.is_verified && (
            <img className="check-icon" src={`${process.env.PUBLIC_URL}/img/assets/check-icon.svg`} alt="" />
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
                {collection.floor_price
                  ? dynamicPriceValue(userCurrency, prices, collection.floor_price / LAMPORTS_PER_SOL)
                  : '0'}
                <img
                  className="currency-icon"
                  src={`${process.env.PUBLIC_URL}/img/crypto/${userCurrency}.svg`}
                  alt=""
                />
              </div>
            ) : (
              collectionFilter === 'volume' &&
              (collection.weekly_volume ? dynamicPriceValue(userCurrency, prices, collection.weekly_volume) : '0')
            )}
          </div>
        </div>
      </div>
    </ANALYTIC_ITEM>
  )
}
