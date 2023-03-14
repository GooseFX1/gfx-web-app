/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, FC, ReactElement, useRef, useCallback } from 'react'
import { PriceWithToken } from '../../../components/common/PriceWithToken'
import { useNavCollapse, useNFTCollections } from '../../../context'
import { checkMobile } from '../../../utils'
import { Loader } from '../../Farm/Columns'
import { WRAPPER_TABLE } from './NFTAggregator.styles'
import { NFTColumnsTitleWeb } from './NFTTableColumns'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { useHistory } from 'react-router-dom'
import { LAMPORTS_PER_SOL_NUMBER } from '../../../constants'
import { NFTBaseCollection } from '../../../types/nft_collections'
import { Image } from 'antd'
import { minimizeTheString } from '../../../web3/nfts/utils'

const STYLE = styled.div``

const NFTCollectionsTable: FC<{ showBanner: boolean }> = ({ showBanner }) => {
  const { isCollapsed } = useNavCollapse()
  const { fetchAllCollections, fetchAllCollectionsByPages, allCollections, allCollectionLoading } =
    useNFTCollections()

  const [allItems, setAllItems] = useState<NFTBaseCollection[] | number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9])
  const [pageNumber, setPageNumber] = useState<number>(0)
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
    ;(async () => {
      await fetchAllCollectionsByPages(pageNumber * paginationNumber, paginationNumber)
    })()
  }, [pageNumber])

  return (
    <WRAPPER_TABLE $navCollapsed={isCollapsed} showBanner={showBanner}>
      <table>
        {!checkMobile() && (
          <thead className="tableHeader">
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
          className="tableRow"
          key={index}
          onClick={() => history.push(`/NFTs/collection/${item.collection.collection_name.replaceAll(' ', '_')}`)}
        >
          <td className="index"> {index + 1}</td>
          <td className="nftNameColumn">
            {item?.collection?.collection_name ? (
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
                  {minimizeTheString(item?.collection?.collection_name)}
                  <div className="nftCollectionFloor">
                    <div className="grey">Floor: </div>
                    <div>
                      {' '}
                      <PriceWithToken
                        price={item?.collection_floor / LAMPORTS_PER_SOL_NUMBER}
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
            {item?.collection_vol?.daily !== undefined ? (
              <div tw="flex flex-col items-center justify-center">
                <PriceWithToken price={item?.collection_vol?.daily} token="SOL" cssStyle={tw`h-5 w-5`} />
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

const NFTTableRow = ({ allItems, lastRowElementRef }: any) => {
  const history = useHistory()
  return (
    <>
      {allItems.map((item, index) => (
        <tr
          ref={index + 1 === allItems.length ? lastRowElementRef : null}
          className="tableRow"
          key={index}
          onClick={() => history.push(`/nfts/collection/${item.collection.collection_name.replaceAll(' ', '_')}`)}
        >
          <td className="nftNameColumn">
            {item?.collection?.collection_name ? (
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
                <div className="nftCollectionName">{item?.collection?.collection_name}</div>
              </>
            ) : (
              <div className="nftCollectionName">
                <Loader />
              </div>
            )}
          </td>
          <td className="tdItem">
            {item?.collection_floor !== null ? (
              <PriceWithToken
                price={item?.collection_floor / LAMPORTS_PER_SOL_NUMBER}
                token={'SOL'}
                cssStyle={tw`h-5 w-5`}
              />
            ) : item?.collection_floor === null ? (
              <PriceWithToken price={0} token={'SOL'} cssStyle={tw`h-5 w-5`} />
            ) : (
              <Loader />
            )}
          </td>
          <td className="tdItem">
            {item?.collection?.collection_name ? (
              <PriceWithToken price={109} token={'SOL'} cssStyle={tw`h-5 w-5`} />
            ) : (
              <Loader />
            )}
          </td>
          <td className="tdItem">
            {item?.collection?.collection_name ? <div className="comingSoon">Coming soon</div> : <Loader />}
          </td>
          <td className="tdItem">
            {item?.collection?.collection_name ? <div className="comingSoon">Coming soon</div> : <Loader />}
          </td>
          <td className="tdItem">
            {item?.collection_vol !== undefined ? (
              <PriceWithToken price={item?.collection_vol?.daily} token={'SOL'} cssStyle={tw`h-5 w-5`} />
            ) : (
              <Loader />
            )}
          </td>
        </tr>
      ))}
    </>
  )
}

export default NFTCollectionsTable
