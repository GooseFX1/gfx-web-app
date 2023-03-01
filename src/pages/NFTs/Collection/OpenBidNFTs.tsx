/* eslint-disable @typescript-eslint/no-unused-vars */
import { ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import { useNFTAggregator, useNFTCollections } from '../../../context'
import { BidNFTModal, BuyNFTModal } from './BuyNFTModal'
import { NFT_COLLECTIONS_GRID } from './CollectionV2.styles'
import DetailViewNFT from './DetailViewNFTDrawer'
import { ISingleNFT } from '../../../types/nft_details'
import { SingleNFTCard } from './SingleNFTCard'
import { fetchOpenBidByPages } from '../../../api/NFTs'
import NFTLoading from '../Home/NFTLoading'
import { debounce } from '../../../utils'

export const OpenBidNFTs = (): ReactElement => {
  const { buyNowClicked, bidNowClicked, setNftInBag } = useNFTAggregator()
  const { openBidWithinCollection, setOpenBidWithinCollection, singleCollection } = useNFTCollections()
  const [openBidArr, setOpenBidArr] = useState<any[]>([])
  const paginationNum = 30
  const [pageNumber, setPageNumber] = useState<number>(0)
  const [stopCalling, setStopCalling] = useState<boolean>(false)
  const [openBidLoading, setOpenBidLoading] = useState<boolean>(false)
  const observer = useRef<any>()

  const lastCardRef = useCallback(
    (node) => {
      if (openBidLoading) return
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
    [openBidLoading]
  )

  useEffect(() => {
    const UUID = singleCollection ? singleCollection?.collection[0].uuid : undefined
    if (UUID) {
      ;(async () => {
        setOpenBidLoading(true)
        const obData = await fetchOpenBidByPages(
          UUID,
          pageNumber * paginationNum,
          (pageNumber + 1) * paginationNum
        )
        setOpenBidWithinCollection(obData.data)
        if (obData.data.open_bid.length < paginationNum) setStopCalling(true)
        setOpenBidLoading(false)
        setOpenBidArr((prev) => [...prev, ...obData.data.open_bid])
      })()
    }
  }, [pageNumber, singleCollection])

  const addNftToBag = (e, nftItem) => {
    setNftInBag((prev) => {
      const id = prev.filter((item) => item.uuid === nftItem.uuid)
      if (!id.length) return [...prev, nftItem]
      return prev
    })
    e.stopPropagation()
  }
  const gridType = openBidArr?.length > 10 ? '1fr' : '210px'
  return (
    <NFT_COLLECTIONS_GRID gridType={gridType} id="border">
      {<DetailViewNFT />}
      {buyNowClicked && <BuyNFTModal />}
      {bidNowClicked && <BidNFTModal />}
      <div className="gridContainer">
        {openBidArr.length ? (
          openBidArr.map((item, index) => (
            <SingleNFTCard
              item={item}
              key={index}
              lastCardRef={index + 1 === openBidArr.length ? lastCardRef : null}
              index={index}
              addNftToBag={addNftToBag}
            />
          ))
        ) : (
          <NFTLoading />
        )}
      </div>
    </NFT_COLLECTIONS_GRID>
  )
}
