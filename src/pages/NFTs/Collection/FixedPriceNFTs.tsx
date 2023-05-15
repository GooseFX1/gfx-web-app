import { ReactElement, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  useConnectionConfig,
  useNFTAggregator,
  useNFTAggregatorFilters,
  useNFTCollections,
  useNFTDetails
} from '../../../context'
import { BidNFTModal, BuyNFTModal } from './BuyNFTModal'
import { NFT_COLLECTIONS_GRID } from './CollectionV2.styles'
import DetailViewNFT from './DetailViewNFTDrawer'
import { BaseNFT, ISingleNFT } from '../../../types/nft_details'
import { SingleNFTCard } from './SingleNFTCard'
import { fetchFixedPriceByPages } from '../../../api/NFTs'
import NFTLoading from '../Home/NFTLoading'
import { debounce } from '../../../utils'
import NoContent from '../Profile/NoContent'
import { LAMPORTS_PER_SOL_NUMBER } from '../../../constants'
import { SellNFTModal } from './SellNFTModal'
import CancelBidModal from './CancelBidModal'

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
    cancelBidClicked
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
  const [fixedPriceLoading, setFixedPriceLoading] = useState<boolean>(false)
  const [filteredFixedPrice, setFilteredFixPrice] = useState<BaseNFT[] | null>(null)
  const observer = useRef<any>()
  const paginationNum = 30

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
  }, [collectionSort])

  useEffect(() => {
    fetchFixedPriceNFTs(pageNumber, collectionSort)
  }, [pageNumber])

  const resetLocalState = useCallback(() => {
    setFixedPriceArr([])
    setPageNumber(0)
    setCollectionSort('DESC')
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

        if (fixedPriceWithinCollection === undefined) setFixedPriceWithinCollection(fpData.data)

        // adds price data property to basenft object
        const nftDataWithPrice = baseNFTs.map((nft: BaseNFT, i: number) => ({
          ...nft,
          nft_price: parseFloat(fpData.data.nft_prices[i]) / LAMPORTS_PER_SOL_NUMBER
        }))

        setFixedPriceArr((prev) => [...prev, ...nftDataWithPrice])
      } catch (error) {
        console.error(error)
      } finally {
        setFixedPriceLoading(false)
      }
    },
    [singleCollection, fixedPriceWithinCollection, setFixedPriceArr, pageNumber]
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
    setSearchInsideCollection(undefined)

    fetchFixedPriceNFTs(0, collectionSort)
  }, [collectionSort])

  useEffect(() => {
    // TODO: Is there a way to filter and not call the Request URL: https://nest-api.goosefx.io/nft?mint_address=<val>
    if (!searchInsideCollection || searchInsideCollection.length === 0) {
      setFilteredFixPrice(fixedPriceArr)
    }
    if (searchInsideCollection && searchInsideCollection.length > 0) {
      const filteredData = fixedPriceArr.filter((fixedPriceNFT: ISingleNFT) =>
        fixedPriceNFT.nft_name.toLowerCase().includes(searchInsideCollection.toLowerCase())
      )
      setFilteredFixPrice(filteredData)
    }
  }, [searchInsideCollection, fixedPriceArr])

  useEffect(() => refreshClicked && resetLocalState(), [refreshClicked])

  useEffect(() => {
    fetchFixedPriceNFTs(0, collectionSort)
    return resetLocalState()
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
  }, [nftMetadata, general, params.address])

  const handleModalClick = useCallback(() => {
    if (buyNowClicked) return <BuyNFTModal />
    if (bidNowClicked) return <BidNFTModal />
    if (cancelBidClicked) return <CancelBidModal />
    if (sellNFTClicked) return <SellNFTModal visible={sellNFTClicked} handleClose={() => setSellNFT(false)} />
  }, [buyNowClicked, bidNowClicked, sellNFTClicked, cancelBidClicked])

  const gridType = useMemo(() => (filteredFixedPrice?.length > 10 ? '1fr' : '210px'), [filteredFixedPrice])

  return (
    <NFT_COLLECTIONS_GRID gridType={gridType} id="border">
      {handleDrawerOpen()}
      {handleModalClick()}
      {fixedPriceWithinCollection === undefined && <NFTLoading />}
      {fixedPriceWithinCollection && fixedPriceWithinCollection.total_count === 0 ? (
        <NoContent type="collected" />
      ) : (
        <div className="gridContainer">
          {filteredFixedPrice !== null ? (
            filteredFixedPrice.map((item, index) => (
              <SingleNFTCard
                item={item}
                key={index}
                lastCardRef={index + 1 === filteredFixedPrice.length ? lastCardRef : null}
                index={index}
                addNftToBag={addNftToBag}
              />
            ))
          ) : (
            <NFTLoading />
          )}
        </div>
      )}
    </NFT_COLLECTIONS_GRID>
  )
}
