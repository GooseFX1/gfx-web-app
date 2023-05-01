/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useState, FC, ReactElement, useRef, useCallback, useMemo } from 'react'
import { PriceWithToken } from '../../../components/common/PriceWithToken'
import {
  useNavCollapse,
  useNFTAggregator,
  useNFTAggregatorFilters,
  useNFTCollections,
  usePriceFeedFarm
} from '../../../context'
import { checkMobile } from '../../../utils'
import { Loader, LoaderForImg } from '../../Farm/Columns'
import { WRAPPER_TABLE } from './NFTAggregator.styles'
import { NFTColumnsTitleWeb } from './NFTTableColumns'
import { useHistory } from 'react-router-dom'
import { LAMPORTS_PER_SOL_NUMBER } from '../../../constants'
import { NFTCollection } from '../../../types/nft_collections'
import { Image } from 'antd'
import { minimizeTheString } from '../../../web3/nfts/utils'
import { Arrow } from '../../../components/common/Arrow'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { truncateBigNumber } from '../../TradeV3/perps/utils'

const STYLE = styled.div``

const volumeDict = {
  '24h': 'daily_volume',
  '7d': 'weekly_volume',
  '30d': 'monthly_volume',
  All: 'total_volume'
}

const NFTCollectionsTable: FC<{ showBanner: boolean }> = ({ showBanner }) => {
  const { isCollapsed } = useNavCollapse()
  const { fetchAllCollectionsByPages, allCollections, allCollectionLoading, setAllCollections } =
    useNFTCollections()
  const { refreshClicked, setRefreshClass } = useNFTAggregator()
  const { sortFilter, sortType, pageNumber, setPageNumber } = useNFTAggregatorFilters()
  const [allItems, setAllItems] = useState<NFTCollection[] | number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9])
  const paginationNumber = 20
  const [firstLoad, setFirstLoad] = useState<boolean>(true)
  const observer = useRef<any>()
  const lastRowElementRef = useCallback(
    (node) => {
      if (allCollectionLoading) return
      if (observer.current) observer?.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPageNumber((prev) => prev + 1)
        }
      })
      if (node) observer.current.observe(node)
    },
    [allCollectionLoading]
  )
  useEffect(() => {
    setFirstLoad(false)
  }, [])

  useEffect(() => {
    if (sortFilter && !firstLoad) {
      setTimeout(() => {
        setAllCollections([])
        fetchAllCollectionsByPages(0, paginationNumber, sortFilter, sortType)
      }, 1000)
    }
  }, [refreshClicked])

  useEffect(() => {
    if (sortFilter && !firstLoad) {
      fetchAllCollectionsByPages(pageNumber * paginationNumber, paginationNumber, sortFilter, sortType)
    }
  }, [sortFilter, sortType])

  useEffect(() => {
    ;(async () => {
      if (sortFilter)
        await fetchAllCollectionsByPages(pageNumber * paginationNumber, paginationNumber, sortFilter, sortType)
      else await fetchAllCollectionsByPages(pageNumber * paginationNumber, paginationNumber)
    })()
  }, [pageNumber])

  return (
    <WRAPPER_TABLE $navCollapsed={isCollapsed} showBanner={showBanner}>
      <table>
        {!checkMobile() && (
          <thead>
            <NFTColumnsTitleWeb />
          </thead>
        )}
        <tbody>
          {checkMobile() ? (
            <NFTTableRowMobile allItems={allCollections} lastRowElementRef={lastRowElementRef} />
          ) : (
            <NFTTableRow allItems={allCollections} lastRowElementRef={lastRowElementRef} />
          )}
        </tbody>
      </table>
    </WRAPPER_TABLE>
  )
}

const NFTTableRowMobile = ({ allItems, lastRowElementRef }: any): ReactElement => (
  <>
    {allItems.map((item, index) => (
      <NFTRowMobileItem
        item={item}
        key={index}
        index={index}
        lastRowElementRef={index + 1 === allItems.length ? lastRowElementRef : null}
      />
    ))}
  </>
)
const NFTRowMobileItem = ({ item, index, lastRowElementRef }: any) => {
  const { timelineDisplay } = useNFTAggregatorFilters()
  const { currencyView } = useNFTAggregator()
  const history = useHistory()
  const { prices } = usePriceFeedFarm()
  const solPrice = prices['SOL/USDC']?.current
  const { floorPrice, volume } = getDisplayPrice(currencyView, solPrice, item, timelineDisplay)

  return (
    <>
      <tr
        ref={lastRowElementRef}
        key={index}
        onClick={() => history.push(`/NFTs/collection/${item.collection_name.replaceAll(' ', '_')}`)}
      >
        <td className="index"> {index + 1}</td>
        <td className="nftNameColumn">
          {item?.collection_name !== undefined ? (
            <>
              <Image
                preview={false}
                className="nftNameImg"
                fallback={'/img/assets/Aggregator/Unknown.svg'}
                src={`${
                  item?.profile_pic_link.length === 0
                    ? '/img/assets/Aggregator/Unknown.svg'
                    : item.profile_pic_link
                }`}
                alt=""
              />
              <div className="nftCollectionName">
                <div tw="flex items-center">
                  {minimizeTheString(item?.collection_name)}
                  {item.is_verified && (
                    <img tw="w-[18px] h-[18px] ml-1" src="/img/assets/Aggregator/verifiedNFT.svg" />
                  )}
                </div>

                <div className="nftCollectionFloor">
                  <div className="grey">Floor: </div>
                  <div>
                    <PriceWithToken price={floorPrice} token={currencyView} cssStyle={tw`w-5 h-5`} />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div>
              <Loader />
            </div>
          )}
        </td>
        <td className="tdItem">
          {item?.daily_volume !== undefined ? (
            <div tw="flex flex-col items-center justify-center">
              <PriceWithToken price={volume} token={currencyView} cssStyle={tw`h-5 w-5`} />
              <div className="grey">{timelineDisplay} volume </div>
            </div>
          ) : (
            <Loader />
          )}
        </td>
      </tr>
    </>
  )
}

const getDisplayPrice = (currencyView: string, solPrice: number, item: any, timelineDisplay: string) => {
  const price = item?.floor_price / LAMPORTS_PER_SOL_NUMBER
  let floorPrice =
    currencyView === 'USDC' ? truncateBigNumber(solPrice * (price > 0 ? price : 0)) : truncateBigNumber(price)
  floorPrice = floorPrice ? floorPrice : 0

  let volume =
    currencyView === 'USDC'
      ? truncateBigNumber(item[volumeDict[timelineDisplay]] * solPrice)
      : truncateBigNumber(item[volumeDict[timelineDisplay]])
  volume = volume ? volume : 0
  return { floorPrice, volume }
}
const NFTRowItem = ({ item, index, lastRowElementRef }: any) => {
  const { currencyView } = useNFTAggregator()
  const history = useHistory()
  const { timelineDisplay } = useNFTAggregatorFilters()
  const { prices } = usePriceFeedFarm()
  const solPrice = prices['SOL/USDC']?.current
  const { floorPrice, volume } = getDisplayPrice(currencyView, solPrice, item, timelineDisplay)

  return (
    <tr
      ref={lastRowElementRef}
      className="tableRow"
      key={index}
      onClick={() =>
        history.push(`/nfts/collection/${encodeURIComponent(item.collection_name).replaceAll('%20', '_')}`)
      }
    >
      <td className="nftNameColumn">
        {item.profile_pic_link ? (
          <Image
            preview={false}
            className="nftNameImg"
            fallback={'/img/assets/Aggregator/Unknown.svg'}
            src={`${
              item?.profile_pic_link === undefined ? '/img/assets/Aggregator/Unknown.svg' : item.profile_pic_link
            }`}
            alt="collection-icon"
          />
        ) : (
          <div className="nftCollectionName">
            <div tw="flex items-center ">
              <LoaderForImg />
            </div>
          </div>
        )}
        {item?.collection_name ? (
          <div className="nftCollectionName">{item?.collection_name.replaceAll('"', '')}</div>
        ) : (
          <Loader />
        )}
      </td>
      <td className="tdItem">
        {item?.floor_price >= 0 ? (
          <PriceWithToken price={floorPrice} token={currencyView} cssStyle={tw`h-5 w-5`} />
        ) : (
          <Loader />
        )}
      </td>
      <td className="tdItem">
        {item?.profile_pic_link ? (
          <PriceWithToken
            price={item?.gfx_appraisal_supported ? 50 : 0}
            token={currencyView}
            cssStyle={tw`h-5 w-5`}
          />
        ) : (
          <Loader />
        )}
      </td>
      <td className="tdItem">{item?.collection_name ? <div tw="text-grey-2">Coming soon</div> : <Loader />}</td>
      <td className="tdItem">{item?.collection_name ? <div tw="text-grey-2">Coming soon</div> : <Loader />}</td>
      <td className="tdItem">
        {item?.daily_volume !== undefined ? (
          <PriceWithToken price={volume} token={currencyView} cssStyle={tw`h-5 w-5`} />
        ) : (
          <Loader />
        )}
      </td>
      <td
        style={{
          width: '5%',
          justifyContent: 'center',
          display: 'flex',
          alignItems: 'center',
          rotate: '270deg'
        }}
      >
        <Arrow height="8px" width="16px" invert={false} />
      </td>
    </tr>
  )
}
const NFTTableRow = ({ allItems, lastRowElementRef }: any) => (
  <>
    {allItems.map((item, index) => (
      <NFTRowItem
        item={item}
        key={index}
        index={index}
        lastRowElementRef={index + 1 === allItems.length ? lastRowElementRef : null}
      />
    ))}
  </>
)

export default NFTCollectionsTable
