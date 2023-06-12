/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, ReactElement, RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNFTAggregator, useNFTAggregatorFilters, useNFTCollections, useNFTDetails } from '../../../context'
import { BuyNFTModal } from './BuyNFTModal'
import { NFT_COLLECTIONS_GRID } from './CollectionV2.styles'
import DetailViewNFT from './DetailViewNFTDrawer'
import { BaseNFT, ISingleNFT } from '../../../types/nft_details'
import { SingleNFTCard } from './SingleNFTCard'
import { fetchOpenBidByPages, fetchSearchNFTbyCollection } from '../../../api/NFTs'
import NFTLoading from '../Home/NFTLoading'
import { debounce } from '../../../utils'
import { SellNFTModal } from './SellNFTModal'
import CancelBidModal from './CancelBidModal'
import { BidNFTModal } from './AggModals/BidNFTModal'

export const OpenBidNFTs: FC<{ firstCardRef: RefObject<HTMLElement | null> }> = ({
  firstCardRef
}): ReactElement => {
  const { buyNowClicked, bidNowClicked, setNftInBag, sellNFTClicked, setSellNFT, openJustModal } =
    useNFTAggregator()
  const { openBidWithinCollection, setOpenBidWithinCollection, singleCollection } = useNFTCollections()
  const [openBidArr, setOpenBidArr] = useState<any[]>([])
  const { refreshClicked, cancelBidClicked } = useNFTAggregator()
  const paginationNum = 30
  const { general, nftMetadata } = useNFTDetails()
  const { searchInsideCollection, setSearchInsideCollection } = useNFTAggregatorFilters()
  const [filteredOpenBid, setFilteredOpenBid] = useState<BaseNFT[]>(null)
  const collectionId = useMemo(
    () => (singleCollection ? singleCollection[0].collection_id : null),
    [singleCollection]
  )

  const [pageNumber, setPageNumber] = useState<number>(0)
  const [stopCalling, setStopCalling] = useState<boolean>(false)
  const [openBidLoading, setOpenBidLoading] = useState<boolean>(false)
  const observer = useRef<any>()

  useEffect(() => {
    const fetchFilteredOpenBid = async () => {
      if (!searchInsideCollection || !searchInsideCollection.length || searchInsideCollection === '') {
        setFilteredOpenBid(openBidArr)
      }

      if (searchInsideCollection && searchInsideCollection.length > 1) {
        try {
          const resultArr = await fetchSearchNFTbyCollection(collectionId, searchInsideCollection)
          setFilteredOpenBid(resultArr.nfts)
        } catch (err) {
          console.log(err)
        }
      }
    }

    fetchFilteredOpenBid()
  }, [searchInsideCollection, openBidArr])

  const lastCardRef = useCallback(
    (node) => {
      if (openBidLoading) return
      if (observer.current) observer?.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !stopCalling && !searchInsideCollection) {
          debounce(
            setPageNumber((prev) => prev + 1),
            100
          )
        }
      })
      if (node) observer.current.observe(node)
    },
    [openBidLoading]
  )

  useEffect(() => {
    const UUID = singleCollection ? singleCollection[0].uuid : undefined
    if (UUID) {
      ;(async () => {
        setOpenBidLoading(true)
        const obData = await fetchOpenBidByPages(
          UUID,
          pageNumber * paginationNum,
          (pageNumber + 1) * paginationNum
        )
        setOpenBidWithinCollection(obData.data)
        if (obData.data.open_bid && obData.data.open_bid.length < paginationNum) setStopCalling(true)
        setOpenBidLoading(false)
        setOpenBidArr((prev) => [...prev, ...obData.data.open_bid])
      })()
    }
  }, [pageNumber, singleCollection])

  useEffect(() => {
    setOpenBidArr([])
  }, [refreshClicked, window.location])

  const addNftToBag = (e, nftItem) => {
    setNftInBag((prev) => {
      const id = prev.filter((item) => item.uuid === nftItem.uuid)
      if (!id.length) return [...prev, nftItem]
      return prev
    })
    e.stopPropagation()
  }

  const handleDrawerOpen = useCallback(() => {
    if (general !== null && nftMetadata !== null && !openJustModal) return <DetailViewNFT />
  }, [nftMetadata, general, openJustModal])

  const handleModalClick = useCallback(() => {
    if (buyNowClicked) return <BuyNFTModal />
    if (bidNowClicked) return <BidNFTModal />
    if (cancelBidClicked) return <CancelBidModal />
    if (sellNFTClicked) return <SellNFTModal visible={sellNFTClicked} handleClose={() => setSellNFT(false)} />
  }, [buyNowClicked, bidNowClicked, general, nftMetadata, sellNFTClicked, cancelBidClicked])

  const gridType = useMemo(() => (filteredOpenBid?.length > 10 ? '1fr' : '210px'), [filteredOpenBid])

  return (
    <NFT_COLLECTIONS_GRID gridType={gridType} id="border">
      {handleDrawerOpen()}
      {handleModalClick()}
      <div className="gridContainer">
        {filteredOpenBid ? (
          filteredOpenBid.map((item, index) => (
            <SingleNFTCard
              item={item}
              key={index}
              lastCardRef={index + 1 === filteredOpenBid.length ? lastCardRef : null}
              index={index}
              addNftToBag={addNftToBag}
              firstCardRef={index === 0 ? firstCardRef : null}
            />
          ))
        ) : (
          <NFTLoading />
        )}
      </div>
    </NFT_COLLECTIONS_GRID>
  )
}
