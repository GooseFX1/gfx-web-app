/* eslint-disable @typescript-eslint/no-unused-vars */
import { ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import { useNFTAggregator, useNFTCollections } from '../../../context'
import { BidNFTModal, BuyNFTModal } from './BuyNFTModal'
import { NFT_COLLECTIONS_GRID } from './CollectionV2.styles'
import DetailViewNFT from './DetailViewNFTDrawer'
import { BaseNFT, ISingleNFT } from '../../../types/nft_details'
import { SingleNFTCard } from './SingleNFTCard'
import { fetchFixedPriceByPages, fetchOpenBidByPages } from '../../../api/NFTs'
import NFTLoading from '../Home/NFTLoading'
import { debounce } from '../../../utils'

export const FixedPriceNFTs = (): ReactElement => {
  const { buyNowClicked, bidNowClicked, setNftInBag } = useNFTAggregator()
  const { singleCollection, fixedPriceWithinCollection, setFixedPriceWithinCollection } = useNFTCollections()
  const [fixedPriceArr, setFixedPriceArr] = useState<BaseNFT[]>([])
  const paginationNum = 30
  const [pageNumber, setPageNumber] = useState<number>(0)
  const [stopCalling, setStopCalling] = useState<boolean>(false)
  const [fixedPriceLoading, setFixedPriceLoading] = useState<boolean>(false)
  const observer = useRef<any>()

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
    const UUID = singleCollection ? singleCollection?.collection[0].uuid : undefined
    if (UUID) {
      ;(async () => {
        setFixedPriceLoading(true)
        const fpData = await fetchFixedPriceByPages(
          UUID,
          pageNumber * paginationNum,
          (pageNumber + 1) * paginationNum
        )
        setFixedPriceWithinCollection(fpData.data)
        setFixedPriceLoading(false)
        if (fpData.data.nft_data.length < paginationNum) setStopCalling(true)
        setFixedPriceArr((prev) => [...prev, ...fpData.data.nft_data])
      })()
    }
  }, [pageNumber, singleCollection])

  useEffect(() => {
    const UUID = singleCollection ? singleCollection?.collection[0].uuid : undefined
    if (UUID) {
      fetchFixedPriceNFTs()
    }
  }, [pageNumber, singleCollection])

  const fetchFixedPriceNFTs = async () => {
    setFixedPriceLoading(true)

    try {
      const fpData = await fetchFixedPriceByPages(
        UUID,
        pageNumber * paginationNum,
        (pageNumber + 1) * paginationNum
      )
      setFixedPriceWithinCollection(fpData.data)
      if (fpData.data.nft_data.length < paginationNum) setStopCalling(true)
      setFixedPriceArr((prev) => [...prev, ...fpData.data.nft_data])
    } catch (error) {
      console.error(error)
    } finally {
      setFixedPriceLoading(false)
    }
  }

  const addNftToBag = (e, nftItem) => {
    setNftInBag((prev) => {
      const id = prev.filter((item) => item.uid === nftItem.uid)
      if (!id.length) return [...prev, nftItem]
      return prev
    })
    e.stopPropagation()
  }

  return (
    <NFT_COLLECTIONS_GRID id="border">
      {<DetailViewNFT />}
      {buyNowClicked && <BuyNFTModal />}
      {bidNowClicked && <BidNFTModal />}
      <div className="gridContainer">
        {fixedPriceArr.length ? (
          fixedPriceArr.map((item, index) => (
            <SingleNFTCard
              item={item}
              key={index}
              lastCardRef={index + 1 === fixedPriceArr.length ? lastCardRef : null}
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
