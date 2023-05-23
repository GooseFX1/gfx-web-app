import { ReactElement, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  useConnectionConfig,
  useNFTAggregator,
  useNFTAggregatorFilters,
  useNFTCollections,
  useNFTDetails
} from '../../../context'
import { BuyNFTModal } from './BuyNFTModal'
import { NFT_COLLECTIONS_GRID } from './CollectionV2.styles'
import DetailViewNFT from './DetailViewNFTDrawer'
import { BaseNFT } from '../../../types/nft_details'
import { SingleNFTCard } from './SingleNFTCard'
import { fetchFixedPriceByPages, fetchSearchNFTbyCollection } from '../../../api/NFTs'
import NFTLoading from '../Home/NFTLoading'
import { debounce } from '../../../utils'
import NoContent from '../Profile/NoContent'
import { LAMPORTS_PER_SOL_NUMBER } from '../../../constants'
import { SellNFTModal } from './SellNFTModal'
import CancelBidModal from './CancelBidModal'
import { BidNFTModal } from './AggModals/BidNFTModal'

export const FixedPriceNFTs = (): ReactElement => {
  const { general, nftMetadata, fetchGeneral } = useNFTDetails()
  const { connection } = useConnectionConfig()
  const urlSearchParams = new URLSearchParams(window.location.search)
  const params = Object.fromEntries(urlSearchParams.entries())
  const {
    buyNowClicked,
    bidNowClicked,
    setNftInBag,
    setSellNFT,
    sellNFTClicked,
    openJustModal,
    refreshClicked,
    cancelBidClicked,
    delistNFT,
    setDelistNFT
  } = useNFTAggregator()
  const { searchInsideCollection, setSearchInsideCollection } = useNFTAggregatorFilters()
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
  const [fixedPriceLoading, setFixedPriceLoading] = useState<boolean>(false)
  const [filteredFixedPrice, setFilteredFixPrice] = useState<BaseNFT[] | null>(null)
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
          debounce(handleScroll(), 100)
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
    setFixedPriceArr([])
    setPageNumber(0)
    setCollectionSort('DESC')
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
          sort
        )

        const baseNFTs: BaseNFT[] = fpData.data.nft_data
        if (baseNFTs.length < paginationNum) setStopCalling(true)

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
    [singleCollection, fixedPriceWithinCollection, setFixedPriceArr, pageNumber, refreshClicked]
  )

  useEffect(() => {
    // enables nft details drawer deeplink
    if (params.address && (general === null || nftMetadata === null)) {
      fetchGeneral(params.address, connection)
    }
  }, [params.address])

  useEffect(() => {
    setFixedPriceArr([])
    setPageNumber(0)
    setFilteredFixPrice(null)
    setStopCalling(false)
    setSearchInsideCollection(undefined)
    !firstLoad && fetchFixedPriceNFTs(0, collectionSort)
  }, [collectionSort])

  useEffect(() => {
    // TODO: Is there a way to filter and not call the Request URL: https://nest-api.goosefx.io/nft?mint_address=<val>

    const fetchData = async () => {
      if (!searchInsideCollection || searchInsideCollection.length === 0) {
        setFilteredFixPrice(fixedPriceArr)
      }
      if (searchInsideCollection && searchInsideCollection.length > 1) {
        // Your async code here
        try {
          const resultArr = await fetchSearchNFTbyCollection(collectionId, searchInsideCollection, true)
          const resArr = resultArr.listings ? resultArr.listings : []
          const arr = resArr.map((arr) => arr.nft)
          setFilteredFixPrice(arr)
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

  const addNftToBag = (e, nftItem, ask) => {
    setNftInBag((prev) => {
      const id = prev.filter((item) => item.uuid === nftItem.uuid)
      if (!id.length) return [...prev, { ...nftItem, ...ask }]
      return prev
    })
    e.stopPropagation()
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
  return (
    <NFT_COLLECTIONS_GRID gridType={gridType} id="border">
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
