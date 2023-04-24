/* eslint-disable @typescript-eslint/no-unused-vars */
import { ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import { useNFTAggregator, useNFTAggregatorFilters, useNFTCollections, useNFTDetails } from '../../../context'
import { BidNFTModal, BuyNFTModal } from './BuyNFTModal'
import { NFT_COLLECTIONS_GRID } from './CollectionV2.styles'
import DetailViewNFT from './DetailViewNFTDrawer'
import { BaseNFT, ISingleNFT } from '../../../types/nft_details'
import { SingleNFTCard } from './SingleNFTCard'
import { fetchFixedPriceByPages, fetchOpenBidByPages } from '../../../api/NFTs'
import NFTLoading from '../Home/NFTLoading'
import { debounce } from '../../../utils'
import NoContent from '../Profile/NoContent'
import { LAMPORTS_PER_SOL_NUMBER } from '../../../constants'

export const FixedPriceNFTs = (): ReactElement => {
  const { buyNowClicked, bidNowClicked, setNftInBag, sortingAsc, refreshClass } = useNFTAggregator()
  const { singleCollection, fixedPriceWithinCollection, setFixedPriceWithinCollection, setSingleCollection } =
    useNFTCollections()
  const [fixedPriceArr, setFixedPriceArr] = useState<BaseNFT[]>([])
  const paginationNum = 30
  const { searchInsideCollection, setSearchInsideCollection } = useNFTAggregatorFilters()
  const { refreshClicked } = useNFTAggregator()
  const [pageNumber, setPageNumber] = useState<number>(0)
  const [stopCalling, setStopCalling] = useState<boolean>(false)
  const [fixedPriceLoading, setFixedPriceLoading] = useState<boolean>(false)
  const [filteredFixedPrice, setFilteredFixPriced] = useState<BaseNFT[] | undefined>(null)
  const observer = useRef<any>()
  const { general, nftMetadata } = useNFTDetails()

  useEffect(() => {
    setFixedPriceArr([])
  }, [refreshClicked])

  const sortAndUpdateState = (sortArr: BaseNFT[]) => {
    let sortedArray
    if (sortingAsc) {
      sortedArray = sortArr.sort((a, b) => a?.nft_price - b?.nft_price)
    }
    if (!sortingAsc) {
      sortedArray = sortArr.sort((a, b) => b?.nft_price - a?.nft_price)
    }
    return sortedArray
  }

  useEffect(() => {
    setFilteredFixPriced(sortAndUpdateState([...fixedPriceArr]))
  }, [sortingAsc])

  useEffect(() => {
    if (!searchInsideCollection || !searchInsideCollection.length || searchInsideCollection === '') {
      setFilteredFixPriced(sortAndUpdateState(fixedPriceArr))
    }
    if (searchInsideCollection && searchInsideCollection.length) {
      const filteredData = fixedPriceArr.filter((fixedPriceNFT: ISingleNFT) =>
        fixedPriceNFT.nft_name.includes(searchInsideCollection)
      )
      setFilteredFixPriced(sortAndUpdateState(filteredData))
    }
  }, [searchInsideCollection, fixedPriceArr])

  useEffect(
    () => () => {
      setFixedPriceArr([])
      setSearchInsideCollection(undefined)
      setPageNumber(0)
    },
    []
  )

  const lastCardRef = useCallback(
    (node) => {
      if (fixedPriceLoading) return
      if (observer.current) observer?.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !stopCalling) {
          debounce(
            setPageNumber((prev) => prev + 1),
            100
          )
        }
      })
      if (node) observer.current.observe(node)
    },
    [fixedPriceLoading]
  )

  useEffect(() => {
    const UUID = singleCollection ? singleCollection[0].uuid : undefined
    if (UUID) {
      fetchFixedPriceNFTs(UUID)
    }
  }, [pageNumber, singleCollection])

  const fetchFixedPriceNFTs = async (UUID) => {
    setFixedPriceLoading(true)
    try {
      const fpData = await fetchFixedPriceByPages(
        UUID,
        pageNumber * paginationNum,
        (pageNumber + 1) * paginationNum
      )
      if (fpData.data.nft_data.length < paginationNum) setStopCalling(true)
      await setFixedPriceWithinCollection(fpData.data)
      const nftDataWithPrice = []
      for (let i = 0; i < fpData.data.nft_data.length; i++) {
        nftDataWithPrice.push({
          ...fpData.data.nft_data[i],
          nft_price: parseFloat(fpData.data.nft_prices[i]) / LAMPORTS_PER_SOL_NUMBER
        })
      }

      setFixedPriceArr((prev) => [...prev, ...nftDataWithPrice])
    } catch (error) {
      console.error(error)
    } finally {
      setFixedPriceLoading(false)
    }
  }

  const addNftToBag = (e, nftItem, ask) => {
    setNftInBag((prev) => {
      const id = prev.filter((item) => item.uuid === nftItem.uuid)
      if (!id.length) return [...prev, { ...nftItem, ...ask }]
      return prev
    })
    e.stopPropagation()
  }

  const handleModalClick = useCallback(() => {
    if (buyNowClicked) return <BuyNFTModal />
    if (bidNowClicked) return <BidNFTModal />
    if (general !== null && nftMetadata !== null) return <DetailViewNFT />
  }, [buyNowClicked, bidNowClicked, general, nftMetadata])

  const gridType = filteredFixedPrice?.length > 10 ? '1fr' : '210px'

  return (
    <NFT_COLLECTIONS_GRID gridType={gridType} id="border">
      {handleModalClick()}
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
