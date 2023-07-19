import { FC, ReactElement, RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
/* eslint-disable @typescript-eslint/no-unused-vars */
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import {
  initialFilters,
  useConnectionConfig,
  useDarkMode,
  useNFTAggregator,
  useNFTAggregatorFilters,
  useNFTCollections,
  useNFTDetails,
  usePriceFeedFarm
} from '../../../context'
import { BuyNFTModal } from './BuyNFTModal'
import { NFT_COLLECTIONS_GRID } from './CollectionV2.styles'
import DetailViewNFT from './DetailViewNFTDrawer'
import { BaseNFT } from '../../../types/nft_details'
import { SingleNFTCard } from './SingleNFTCard'
import { fetchFixedPriceByPages, fetchSearchNFTbyCollection } from '../../../api/NFTs'
import NFTLoading from '../Home/NFTLoading'
import { debounce as debounce2, formatSOLDisplay } from '../../../utils'
import NoContent from '../Profile/NoContent'
import { LAMPORTS_PER_SOL_NUMBER } from '../../../constants'
import { SellNFTModal } from './SellNFTModal'
import CancelBidModal from './CancelBidModal'
import { BidNFTModal } from './AggModals/BidNFTModal'
import debounce from 'lodash.debounce'
import { PILL_SECONDARY } from '../NFTDetails/AttributesTabContent'
import { Button } from '../../../components'

const WRAPPER = styled.div`
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }
`
export const FixedPriceNFTs: FC<{ firstCardRef: RefObject<HTMLElement | null> }> = ({
  firstCardRef
}): ReactElement => {
  const { general, nftMetadata, fetchGeneral } = useNFTDetails()
  const { connection } = useConnectionConfig()
  const urlSearchParams = new URLSearchParams(window.location.search)
  const params = Object.fromEntries(urlSearchParams.entries())
  const {
    buyNowClicked,
    bidNowClicked,
    setNftInBag,
    setSellNFT,
    nftInBag,
    sellNFTClicked,
    openJustModal,
    refreshClicked,
    cancelBidClicked,
    delistNFT,
    setDelistNFT
  } = useNFTAggregator()
  const { searchInsideCollection, setSearchInsideCollection, additionalFilters } = useNFTAggregatorFilters()
  const {
    singleCollection,
    fixedPriceWithinCollection,
    setFixedPriceWithinCollection,
    collectionSort,
    setCollectionSort
  } = useNFTCollections()
  const [fixedPriceArr, setFixedPriceArr] = useState<BaseNFT[]>([])
  const [pageNumber, setPageNumber] = useState<number>(0)
  const [stopCalling, setStopCalling] = useState<boolean>(false)
  const [firstLoad, setFirstLoad] = useState<boolean>(true)
  const [fixedPriceLoading, setFixedPriceLoading] = useState<boolean>(true)
  const [filteredFixedPrice, setFilteredFixPrice] = useState<BaseNFT[] | null>(null)
  const { currencyView } = useNFTAggregator()
  const { setAdditionalFilters } = useNFTAggregatorFilters()
  const { solPrice } = usePriceFeedFarm()
  const observer = useRef<any>()
  const paginationNum = 30
  const collectionId = useMemo(
    () => (singleCollection ? singleCollection[0].collection_id : null),
    [singleCollection]
  )

  const lastCardRef = useCallback(
    (node) => {
      if (fixedPriceLoading) return
      if (observer.current) observer?.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !stopCalling && !searchInsideCollection) {
          debounce2(handleScroll(), 100)
          // TODO Look at this in detail later
        }
      })
      if (node) observer.current.observe(node)
    },
    [fixedPriceLoading]
  )

  const handleScroll = useCallback(() => {
    setPageNumber((prev) => prev + 1)
  }, [])

  useEffect(() => {
    if (pageNumber !== 0) fetchFixedPriceNFTs(pageNumber, collectionSort)
  }, [pageNumber])

  const resetLocalState = useCallback(() => {
    setFixedPriceLoading(true)
    setFixedPriceArr([])
    setPageNumber(0)
    setCollectionSort('ASC')
    setFirstLoad(true)
    setSearchInsideCollection(undefined)
  }, [])

  const fetchFixedPriceNFTs = useCallback(
    async (curPage: number, sort: 'ASC' | 'DESC'): Promise<void> => {
      // needs single collection for uuid else it exits
      if (singleCollection === undefined) return
      setFixedPriceLoading(true)

      try {
        const fpData = await fetchFixedPriceByPages(
          singleCollection[0].uuid,
          curPage * paginationNum,
          (curPage + 1) * paginationNum,
          sort,
          additionalFilters,
          currencyView,
          solPrice
        )

        const baseNFTs: BaseNFT[] = fpData?.data?.nft_data
        if (baseNFTs?.length < paginationNum) setStopCalling(true)

        //  if (fixedPriceWithinCollection === undefined)
        setFixedPriceWithinCollection(fpData.data)

        // adds price data property to basenft object
        const nftDataWithPrice = baseNFTs.map((nft: BaseNFT, i: number) => ({
          ...nft,
          nft_price: parseFloat(fpData.data.nft_prices[i]) / LAMPORTS_PER_SOL_NUMBER
        }))

        setFixedPriceArr((prev) => [...prev, ...nftDataWithPrice])
        setFirstLoad(false)
      } catch (error) {
        console.error(error)
      } finally {
        setFixedPriceLoading(false)
      }
    },
    [singleCollection, fixedPriceWithinCollection, setFixedPriceArr, pageNumber, refreshClicked, additionalFilters]
  )

  useEffect(() => {
    // enables nft details drawer deeplink
    if (params.address && (general === null || nftMetadata === null)) {
      fetchGeneral(params.address, connection)
    }
  }, [params.address])

  useEffect(() => {
    // on change the sort type
    setFixedPriceArr([])
    setPageNumber(0)
    setFilteredFixPrice(null)
    setStopCalling(false)
    setSearchInsideCollection(undefined)
    !firstLoad && fetchFixedPriceNFTs(0, collectionSort)
  }, [collectionSort])

  useEffect(() => {
    // handle filters change
    if (
      (additionalFilters.minValueFilter < additionalFilters.maxValueFilter &&
        (additionalFilters.maxValueFilter > 0 || additionalFilters.minValueFilter > 0)) ||
      additionalFilters.marketsFilter !== null ||
      additionalFilters.marketsFilter?.length !== 0
    ) {
      setFixedPriceArr([])
      setPageNumber(0)
      setFilteredFixPrice(null)
      setStopCalling(false)
      setSearchInsideCollection(undefined)
      !firstLoad && fetchFixedPriceNFTs(0, collectionSort)
    }
  }, [additionalFilters])

  const debouncer = useCallback(
    debounce((searchQuery, collectionId) => {
      globalSearchCall(searchQuery, collectionId)
    }, 500),
    []
  )

  const handleSearch = useCallback(
    (searchQuery) => debouncer(searchQuery, collectionId),
    [debouncer, collectionId]
  )

  const globalSearchCall = async (searchQuery, collectionId) => {
    const resultArr = await fetchSearchNFTbyCollection(collectionId, searchQuery, true)
    const resArr = resultArr.listings ? resultArr.listings : []
    const arr = resArr.map((arr) => arr.nft)
    setFilteredFixPrice(arr)
  }

  useEffect(() => {
    // TODO: Is there a way to filter and not call the Request URL: https://nest-api.goosefx.io/nft?mint_address=<val>

    const fetchData = async () => {
      if (!searchInsideCollection || searchInsideCollection.length === 0) {
        setFilteredFixPrice(fixedPriceArr)
      }
      if (searchInsideCollection && searchInsideCollection.length > 1) {
        // Your async code here
        try {
          handleSearch(searchInsideCollection)
        } catch (err) {
          console.log(err)
        }
      }
    }

    fetchData()
  }, [searchInsideCollection, fixedPriceArr])

  useEffect(() => refreshClicked && resetLocalState(), [refreshClicked])

  useEffect(() => {
    firstLoad && fetchFixedPriceNFTs(0, collectionSort)
    return () => resetLocalState()
  }, [singleCollection])

  const addNftToBag = async (e, item, ask) => {
    e.stopPropagation()
    await setNftInBag((prev) => ({
      ...prev,
      [item.mint_address]: {
        ...ask,
        ...item
      }
    }))
  }

  const handleDrawerOpen = useCallback(() => {
    if (general !== null && nftMetadata !== null && params.address && !openJustModal) return <DetailViewNFT />
  }, [nftMetadata, general, params.address, openJustModal])

  const handleModalClick = useCallback(() => {
    if (buyNowClicked) return <BuyNFTModal />
    if (bidNowClicked) return <BidNFTModal />
    if (cancelBidClicked) return <CancelBidModal />
    if (delistNFT)
      return <SellNFTModal visible={delistNFT} handleClose={() => setDelistNFT(false)} delistNFT={true} />
    if (sellNFTClicked) return <SellNFTModal visible={sellNFTClicked} handleClose={() => setSellNFT(false)} />
  }, [buyNowClicked, bidNowClicked, sellNFTClicked, cancelBidClicked, delistNFT])

  const gridType = useMemo(() => (filteredFixedPrice?.length > 10 ? '1fr' : '210px'), [filteredFixedPrice])

  const showFilterTags = useMemo(() => <FilterTags />, [])
  return (
    <NFT_COLLECTIONS_GRID gridType={gridType} id="border">
      {showFilterTags}
      {handleDrawerOpen()}
      {handleModalClick()}
      {fixedPriceLoading && pageNumber === 0 && <NFTLoading />}
      {fixedPriceWithinCollection && filteredFixedPrice?.length === 0 && !searchInsideCollection ? (
        <NoContent type="collected" />
      ) : (
        <div className="gridContainer">
          {filteredFixedPrice !== null ? (
            <>
              {filteredFixedPrice.map((item: any, index) => (
                <SingleNFTCard
                  item={item}
                  key={index}
                  lastCardRef={index + 1 === filteredFixedPrice.length ? lastCardRef : null}
                  index={index}
                  addNftToBag={addNftToBag}
                  firstCardRef={index === 0 ? firstCardRef : null}
                />
              ))}
              {/* TODO add a Loading Div here <div>Loading div comming</div> */}
            </>
          ) : (
            <NFTLoading />
          )}
        </div>
      )}
    </NFT_COLLECTIONS_GRID>
  )
}

export const FilterTags = (): ReactElement => {
  const { mode } = useDarkMode()
  const { additionalFilters, setAdditionalFilters } = useNFTAggregatorFilters()
  const { currencyView } = useNFTAggregator()
  const { solPrice } = usePriceFeedFarm()
  const multiplier = useMemo(() => (currencyView === 'USDC' ? solPrice : 1), [currencyView])
  const clearPriceFilters = useCallback(() => {
    setAdditionalFilters((prev) => ({
      ...prev,
      minValueFilter: null,
      maxValueFilter: null
    }))
  }, [])

  const clearSpecificAttribute = useCallback((appliedAttr) => {
    setAdditionalFilters((prev) => {
      const attributes = prev.attributes ? [...prev.attributes] : []
      const updateAttributes = attributes.filter(
        (attr) => attr.value !== appliedAttr.value || attr.trait_type !== appliedAttr.trait_type
      )
      return {
        ...prev,
        attributes: updateAttributes
      }
    })
  }, [])

  const removeMarketplace = useCallback((market) => {
    setAdditionalFilters((prev) => ({
      ...prev,
      marketsFilter: prev.marketsFilter.filter((mr) => mr !== market)
    }))
  }, [])

  const clearAllFilters = useCallback(() => {
    setAdditionalFilters(initialFilters)
  }, [])

  const displayMarketplaceName = useCallback(
    (market: string) => market[0].toUpperCase() + market.slice(1).replaceAll('_', ' ').toLowerCase(),
    []
  )

  return (
    <WRAPPER tw="flex overflow-x-auto">
      {additionalFilters.maxValueFilter && additionalFilters.minValueFilter && (
        <PILL_SECONDARY $mode={mode} tw="!w-[fit] mt-2 mx-2">
          <div className="layer" tw="!w-[fit] flex p-1">
            <div tw="flex items-center">
              <div>
                <div>Price Range</div>
                <div>
                  {formatSOLDisplay(additionalFilters.minValueFilter * multiplier, true, 1)} -
                  {formatSOLDisplay(additionalFilters.maxValueFilter * multiplier, true, 1)} {currencyView}
                </div>
              </div>

              <div>
                <img
                  src={`/img/assets/Aggregator/closeFilter${mode}.svg`}
                  tw="h-5 w-5 ml-1 cursor-pointer"
                  onClick={clearPriceFilters}
                />
              </div>
            </div>
          </div>
        </PILL_SECONDARY>
      )}
      {additionalFilters?.marketsFilter &&
        additionalFilters.marketsFilter?.length > 0 &&
        additionalFilters.marketsFilter?.map((market, index) => (
          <PILL_SECONDARY $mode={mode} tw="!w-[fit] mt-2 mx-2" key={index}>
            <div className="layer" tw="!w-[fit] flex p-1">
              <div tw="flex items-center">
                <div>
                  <div>Marketplace</div>
                  <div tw="whitespace-nowrap">{displayMarketplaceName(market)}</div>
                </div>

                <div>
                  <img
                    src={`/img/assets/Aggregator/closeFilter${mode}.svg`}
                    onClick={() => removeMarketplace(market)}
                    tw="h-5 w-5 ml-1 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </PILL_SECONDARY>
        ))}

      {additionalFilters.attributes?.length > 0 &&
        additionalFilters.attributes?.map((appliedAttr, index) => (
          <PILL_SECONDARY $mode={mode} tw="!w-[fit] mt-2 mx-2" key={index}>
            <div className="layer" tw="!w-[fit] flex p-1">
              <div tw="flex items-center">
                <div>
                  <div tw="text-grey-1 dark:text-grey-2"> {appliedAttr.trait_type}</div>
                  <div tw="whitespace-nowrap text-black-4 dark:text-grey-5">{appliedAttr.value}</div>
                </div>

                <div>
                  <img
                    src={`/img/assets/Aggregator/closeFilter${mode}.svg`}
                    tw="h-5 w-5 ml-1 cursor-pointer"
                    onClick={() => clearSpecificAttribute(appliedAttr)}
                  />
                </div>
              </div>
            </div>
          </PILL_SECONDARY>
        ))}
      {(additionalFilters.marketsFilter?.length ||
        additionalFilters.minValueFilter ||
        additionalFilters.attributes?.length > 0) && (
        <Button
          onClick={clearAllFilters}
          height="30px"
          width="94px"
          cssStyle={tw`dark:bg-black-2 bg-white font-semibold text-grey-1 dark:text-grey-5 mt-4`}
        >
          Clear All
        </Button>
      )}
    </WRAPPER>
  )
}
