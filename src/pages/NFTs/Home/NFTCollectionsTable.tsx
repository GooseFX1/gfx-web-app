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
import { Loader } from '../../Farm/Columns'
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

const STYLE = styled.div``

const NFTCollectionsTable: FC<{ showBanner: boolean }> = ({ showBanner }) => {
  const { isCollapsed } = useNavCollapse()
  const { fetchAllCollectionsByPages, allCollections, allCollectionLoading, setAllCollections } =
    useNFTCollections()
  const { sortFilter, sortType, pageNumber, setPageNumber } = useNFTAggregatorFilters()
  const [allItems, setAllItems] = useState<NFTCollection[] | number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9])
  const paginationNumber = 20
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
    if (sortFilter) {
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

const NFTTableRowMobile = ({ allItems, lastRowElementRef }: any): ReactElement => {
  const history = useHistory()
  return (
    <>
      {allItems.map((item, index) => (
        <tr
          ref={index + 1 === allItems.length ? lastRowElementRef : null}
          key={index}
          onClick={() => history.push(`/NFTs/collection/${item.collection.collection_name.replaceAll(' ', '_')}`)}
        >
          <td className="index"> {index + 1}</td>
          <td className="nftNameColumn">
            {item?.collection_name ? (
              <>
                <Image
                  className="nftNameImg"
                  fallback={'/img/assets/Aggregator/Unknown.svg'}
                  src={`${
                    item.collection.profile_pic_link.length === 0
                      ? '/img/assets/Aggregator/Unknown.svg'
                      : item.collection.profile_pic_link
                  }`}
                  alt=""
                />
                <div className="nftCollectionName">
                  {minimizeTheString(item?.collection_name)}
                  <div className="nftCollectionFloor">
                    <div className="grey">Floor: </div>
                    <div>
                      <PriceWithToken
                        price={item?.floor_price / LAMPORTS_PER_SOL_NUMBER}
                        token="SOL"
                        cssStyle={tw`w-5 h-5`}
                      />
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
                <PriceWithToken price={item?.daily_volume} token="SOL" cssStyle={tw`h-5 w-5`} />
                <div className="grey">24h volume </div>
              </div>
            ) : (
              <Loader />
            )}
          </td>
        </tr>
      ))}
    </>
  )
}

const NFTRowItem = ({ item, index, lastRowElementRef }: any) => {
  const { currencyView } = useNFTAggregator()
  const history = useHistory()
  const { prices } = usePriceFeedFarm()
  const solPrice = prices['SOL/USDC']?.current
  const price = item?.floor_price / LAMPORTS_PER_SOL_NUMBER
  let floorPrice = currencyView === 'USDC' ? solPrice * (price > 0 ? price : 0) : price
  floorPrice = floorPrice ? parseFloat(floorPrice.toFixed(2)) : 0

  let volume = currencyView === 'USDC' ? item?.daily_volume * solPrice : item?.daily_volume
  volume = volume ? parseFloat(volume.toFixed(2)) : 0

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
        {item ? (
          <>
            <Image
              className="nftNameImg"
              fallback={'/img/assets/Aggregator/Unknown.svg'}
              src={`${
                item?.profile_pic_link === undefined ? '/img/assets/Aggregator/Unknown.svg' : item.profile_pic_link
              }`}
              alt="collection-icon"
            />
            <div className="nftCollectionName">
              {item?.collection_name ? item?.collection_name.replaceAll('"', '') : ''}
            </div>
          </>
        ) : (
          <div className="nftCollectionName">
            <Loader />
          </div>
        )}
      </td>
      <td className="tdItem">
        {item?.floor_price !== null ? (
          <PriceWithToken price={floorPrice} token={currencyView} cssStyle={tw`h-5 w-5`} />
        ) : item?.floor_price === null ? (
          <PriceWithToken price={0} token={currencyView} cssStyle={tw`h-5 w-5`} />
        ) : (
          <Loader />
        )}
      </td>
      <td className="tdItem">
        {item ? (
          <PriceWithToken
            price={item?.gfx_appraisal_supported ? 50 : 0}
            token={currencyView}
            cssStyle={tw`h-5 w-5`}
          />
        ) : (
          <Loader />
        )}
      </td>
      <td className="tdItem">{item ? <div tw="text-grey-2">Coming soon</div> : <Loader />}</td>
      <td className="tdItem">{item ? <div tw="text-grey-2">Coming soon</div> : <Loader />}</td>
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
