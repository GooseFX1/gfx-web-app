import React, { useEffect, useState, FC, ReactElement, useRef, useCallback, useMemo } from 'react'
import { PriceWithToken } from '../../../components/common/PriceWithToken'
import { useNFTAggregator, useNFTAggregatorFilters, useNFTCollections, usePriceFeedFarm } from '../../../context'
import { checkMobile, formatSOLDisplay, LOADING_ARR } from '../../../utils'
import { Loader, LoaderForImg } from '../../../components/Farm/generic'
import { WRAPPER_TABLE } from './NFTAggregator.styles'
import { NFTColumnsTitleWeb } from './NFTTableColumns'
import { useHistory } from 'react-router-dom'
import { LAMPORTS_PER_SOL_NUMBER } from '../../../constants'
import { Image } from 'antd'
import { minimizeTheString } from '../../../web3/nfts/utils'
import { CircularArrow } from '../../../components/common/Arrow'
import tw from 'twin.macro'
import 'styled-components/macro'
import { truncateBigNumber } from '../../TradeV3/perps/utils'
import { fetchSingleNFT } from '../../../api/NFTs'
import { GFXApprisalPopup } from '../../../components/NFTAggWelcome'
import gfxImageService, { IMAGE_SIZES } from '../../../api/gfxImageService'

const stopPropagationClassList = [
  'subText',
  'ant-modal-wrap',
  'trackNFTImg',
  'mainText',
  'ant-modal-body',
  'slide'
]

const volumeDict = {
  '24H': 'daily_volume',
  '7D': 'weekly_volume',
  '30d': 'monthly_volume',
  All: 'total_volume'
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
  const { currencyView, appraisalIsEnabled } = useNFTAggregator()
  const history = useHistory()
  const { prices } = usePriceFeedFarm()
  // TODO: move floorPrice volume marketcap to NFTCollectionProvider context
  const solPrice = useMemo(() => prices['SOL/USDC']?.current, [prices])
  const [appraisalPopup, setAppraisalPopup] = useState(null)

  const floorPrice = useMemo(() => {
    const price = item?.floor_price / LAMPORTS_PER_SOL_NUMBER
    const fp = currencyView === 'USDC' ? solPrice * (price > 0 ? price : 0) : price
    return truncateBigNumber(fp)
  }, [item, solPrice, currencyView])

  const volume = useMemo(() => {
    const v =
      currencyView === 'USDC' ? item[volumeDict[timelineDisplay]] * solPrice : item[volumeDict[timelineDisplay]]
    return truncateBigNumber(v)
  }, [item, solPrice, currencyView])

  // const marketcap = useMemo(() => {
  //   if (item.marketcap === null) return 0

  //   const marketcap = currencyView === 'USDC' ? item.marketcap * solPrice : item.marketcap

  //   return marketcap
  // }, [item, solPrice, currencyView])

  const handleRelocate = useCallback(
    (e: any) => {
      const stopProp = stopPropagationClassList.filter((className) => e.target.classList.contains(className))
      if (stopProp.length) return

      history.push(`/nfts/collection/${encodeURIComponent(item.collection_name).replaceAll('%20', '_')}`)
    },
    [item]
  )
  const handleGfxAppraisal = (e) => {
    e.stopPropagation()
    e.preventDefault()
    setAppraisalPopup(true)
  }

  const showAppraisalPopup = useMemo(() => {
    if (appraisalPopup) return <GFXApprisalPopup setShowTerms={setAppraisalPopup} showTerms={appraisalPopup} />
  }, [appraisalPopup])

  return (
    <>
      <tr ref={lastRowElementRef} key={index} onClick={(e) => handleRelocate(e)}>
        {showAppraisalPopup}
        <td className="nftNameColumn">
          {item?.collection_name !== undefined ? (
            <>
              <div className="index">{index + 1} </div>
              <div tw="relative">
                {appraisalIsEnabled && item?.gfx_appraisal_supported && (
                  <img
                    src="/img/assets/Aggregator/Tooltip.svg"
                    onClick={(e) => handleGfxAppraisal(e)}
                    className="gfxTooltip"
                  />
                )}
                `
                <Image
                  preview={false}
                  className="nftNameImg"
                  fallback={'/img/assets/Aggregator/Unknown.svg'}
                  src={gfxImageService(
                    IMAGE_SIZES.SM_SQUARE,
                    item.verified_collection_address
                      ? item.verified_collection_address
                      : item.first_verified_creator_address,
                    item.profile_pic_link
                  )}
                  alt=""
                />
              </div>

              <div className="nftCollectionName">
                <div tw="flex items-center">
                  {minimizeTheString(item?.collection_name)}
                  {item.is_verified && (
                    <img
                      tw="sm:h-[15px] sm:w-[15px] w-[18px] h-[18px] ml-1"
                      src="/img/assets/Aggregator/verifiedNFT.svg"
                    />
                  )}
                </div>

                <div className="nftCollectionFloor">
                  <div tw="text-grey-1 mr-1">Floor: </div>
                  <div>
                    <PriceWithToken
                      price={floorPrice}
                      token={currencyView}
                      cssStyle={tw`h-5 w-5 !ml-0 dark:text-grey-6 text-black-4`}
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
            <div tw="flex items-center">
              <div tw="flex flex-col items-center justify-center">
                <div tw="text-grey-1">{timelineDisplay} Volume: </div>
                <PriceWithToken
                  price={volume}
                  token={currencyView}
                  cssStyle={tw`h-5 w-5 dark:text-grey-6 text-black-4`}
                />
              </div>
              <div
                className="
              "
                tw="ml-3"
              >
                <CircularArrow cssStyle={tw`h-5 w-5`} invert={false} />
              </div>
            </div>
          ) : (
            <Loader />
          )}
        </td>
      </tr>
    </>
  )
}

const NFTRowItem = ({ item, index, lastRowElementRef }: any) => {
  if (typeof item === 'number' && !Number.isNaN(item)) return <></>
  const { currencyView, appraisalIsEnabled } = useNFTAggregator()
  const history = useHistory()
  const { timelineDisplay } = useNFTAggregatorFilters()
  const { prices } = usePriceFeedFarm()
  const [gfxAppraisal, setGfxAppraisal] = useState(null)
  const [appraisalPopup, setAppraisalPopup] = useState(null)

  const solPrice = useMemo(() => prices['SOL/USDC']?.current, [prices])
  // TODO: move floorPrice volume marketcap to NFTCollectionProvider context
  const floorPrice = useMemo(() => {
    const price = item?.floor_price / LAMPORTS_PER_SOL_NUMBER
    const fp = currencyView === 'USDC' ? solPrice * (price > 0 ? price : 0) : price
    return truncateBigNumber(fp)
  }, [item, solPrice, currencyView])

  useEffect(() => {
    const fetchData = async () => {
      let singleNFTDetails = null
      if (item.gfx_appraisal_supported && item.floor_mint) {
        singleNFTDetails = await fetchSingleNFT(item.floor_mint)
        const appraisalValue = parseFloat(singleNFTDetails?.data?.data[0]?.gfx_appraisal_value) || 0
        setGfxAppraisal(appraisalValue > 0 ? appraisalValue : 0)
      }
    }

    fetchData()
  }, [item.gfx_appraisal_supported])

  const gfxAppraisalDisplay = useMemo(() => {
    if (gfxAppraisal > 0 && currencyView === 'USDC') return truncateBigNumber(gfxAppraisal * solPrice)
    return truncateBigNumber(gfxAppraisal)
  }, [currencyView, gfxAppraisal])

  const volume = useMemo(() => {
    const v =
      currencyView === 'USDC' ? item[volumeDict[timelineDisplay]] * solPrice : item[volumeDict[timelineDisplay]]
    return truncateBigNumber(v)
  }, [item, solPrice, currencyView])

  const marketcap = useMemo(() => {
    if (!item.marketcap || item.marketcap === 0) return 0.0

    const marketcap = currencyView === 'USDC' ? item.marketcap * solPrice : item.marketcap

    return truncateBigNumber(marketcap)
  }, [item, solPrice, currencyView])

  const handleRelocate = useCallback(
    (e: any) => {
      const stopProp = stopPropagationClassList.filter((className) => e.target.classList.contains(className))
      if (stopProp.length) return
      history.push(`/nfts/collection/${encodeURIComponent(item.collection_name).replaceAll('%20', '_')}`)
    },
    [item]
  )

  const handleGfxAppraisal = useCallback((e) => {
    e.stopPropagation()
    setAppraisalPopup(true)
  }, [])

  const showAppraisalPopup = useMemo(() => {
    if (appraisalPopup) return <GFXApprisalPopup setShowTerms={setAppraisalPopup} showTerms={appraisalPopup} />
  }, [appraisalPopup])

  return (
    <tr ref={lastRowElementRef} className="tableRow" key={index} onClick={handleRelocate}>
      {showAppraisalPopup}
      <td className="nftNameColumn">
        <div tw="relative">
          {appraisalIsEnabled && item?.gfx_appraisal_supported && (
            <img
              src="/img/assets/Aggregator/Tooltip.svg"
              className="gfxTooltip"
              onClick={(e) => handleGfxAppraisal(e)}
            />
          )}
          {item ? (
            <Image
              preview={false}
              className="nftNameImg"
              fallback={'/img/assets/Aggregator/Unknown.svg'}
              src={gfxImageService(
                IMAGE_SIZES.SM_SQUARE,
                item.verified_collection_address
                  ? item.verified_collection_address
                  : item.first_verified_creator_address,
                item.profile_pic_link
              )}
              alt="collection-icon"
            />
          ) : (
            <div className="nftCollectionName">
              <div tw="flex items-center ">
                <LoaderForImg />
              </div>
            </div>
          )}
        </div>

        {item?.collection_name ? (
          <div className="nftCollectionName">{item?.collection_name.replaceAll('"', '')}</div>
        ) : (
          <Loader />
        )}
      </td>
      <td className="tdItem">
        {item?.floor_price >= 0 ? (
          <PriceWithToken price={floorPrice ? floorPrice : 0} token={currencyView} cssStyle={tw`h-5 w-5`} />
        ) : (
          <Loader />
        )}
      </td>
      {appraisalIsEnabled && (
        <td className="tdItem">
          {item?.floor_price >= 0 ? (
            // gfx appraisal
            gfxAppraisalDisplay ? (
              <PriceWithToken
                price={gfxAppraisalDisplay ? gfxAppraisalDisplay : 0}
                token={currencyView}
                cssStyle={tw`h-5 w-5`}
              />
            ) : (
              'NA'
            )
          ) : (
            <Loader />
          )}
        </td>
      )}
      <td className="tdItem">
        {item?.collection_name ? (
          <>
            {(item?.daily_change === null || item?.daily_change === 0) && (
              <div tw="dark:text-grey-5 text-grey-1"> {item?.daily_change ? item.daily_change : '0'} %</div>
            )}

            {item?.daily_change !== null && item?.daily_change > 0 && (
              <div tw="dark:text-green-2 text-green-3">
                + {item?.daily_change ? formatSOLDisplay(item.daily_change, true) : '0'} %
              </div>
            )}
            {item?.daily_change !== null && item?.daily_change < 0 && (
              <div tw="text-red-2"> {item?.daily_change ? formatSOLDisplay(item.daily_change, true) : '0'} %</div>
            )}
          </>
        ) : (
          <Loader />
        )}
      </td>

      <td className="tdItem">
        {item?.profile_pic_link !== undefined ? (
          <PriceWithToken price={volume ? volume : 0} token={currencyView} cssStyle={tw`h-5 w-5`} />
        ) : (
          <Loader />
        )}
      </td>
      <td className="tdItem">
        {item?.profile_pic_link !== undefined ? (
          <PriceWithToken price={marketcap} token={currencyView} cssStyle={tw`h-5 w-5`} />
        ) : (
          <Loader />
        )}
      </td>
      <td className="rotate270">
        <CircularArrow invert={false} cssStyle={tw`h-5 w-5`} />
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

const NFTCollectionsTable: FC<{ showBanner: boolean }> = ({ showBanner }) => {
  const { fetchAllCollectionsByPages, allCollections, allCollectionLoading, setAllCollections } =
    useNFTCollections()
  const { refreshClicked } = useNFTAggregator()
  const { sortFilter, sortType, pageNumber, setPageNumber, timelineDisplay } = useNFTAggregatorFilters()
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
        fetchAllCollectionsByPages(0, paginationNumber, sortFilter, sortType)
      }, 500)
    }
  }, [refreshClicked])

  useEffect(() => {
    if (sortFilter && !firstLoad) {
      setAllCollections(LOADING_ARR)
      fetchAllCollectionsByPages(pageNumber * paginationNumber, paginationNumber, sortFilter, sortType)
    }
  }, [sortFilter, sortType, timelineDisplay])

  useEffect(() => {
    ;(async () => {
      if (sortFilter)
        await fetchAllCollectionsByPages(pageNumber * paginationNumber, paginationNumber, sortFilter, sortType)
      else await fetchAllCollectionsByPages(pageNumber * paginationNumber, paginationNumber)
    })()
  }, [pageNumber])

  return (
    <WRAPPER_TABLE showBanner={showBanner}>
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
export default NFTCollectionsTable
