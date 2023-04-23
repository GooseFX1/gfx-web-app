/* eslint-disable @typescript-eslint/no-unused-vars */
import { ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import { useNFTAggregator, useNFTCollections, useNFTDetails } from '../../../context'
import { BidNFTModal, BuyNFTModal } from './BuyNFTModal'
import { NFT_COLLECTIONS_GRID } from './CollectionV2.styles'
import DetailViewNFT from './DetailViewNFTDrawer'
import { BaseNFT, ISingleNFT } from '../../../types/nft_details'
import { SingleNFTCard } from './SingleNFTCard'
import { fetchFixedPriceByPages, fetchOpenBidByPages } from '../../../api/NFTs'
import NFTLoading from '../Home/NFTLoading'
import { debounce } from '../../../utils'
import NoContent from '../Profile/NoContent'

export const FixedPriceNFTs = (): ReactElement => {
  const { buyNowClicked, bidNowClicked, setNftInBag } = useNFTAggregator()
  const { singleCollection, fixedPriceWithinCollection, setFixedPriceWithinCollection } = useNFTCollections()
  const [fixedPriceArr, setFixedPriceArr] = useState<BaseNFT[]>([])
  const paginationNum = 30
  const { refreshClicked } = useNFTAggregator()
  const [pageNumber, setPageNumber] = useState<number>(0)
  const [stopCalling, setStopCalling] = useState<boolean>(false)
  const [fixedPriceLoading, setFixedPriceLoading] = useState<boolean>(false)
  const observer = useRef<any>()
  const { general, nftMetadata } = useNFTDetails()

  useEffect(() => {
    setFixedPriceArr([])
  }, [refreshClicked])

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
      setFixedPriceArr((prev) => [...prev, ...fpData.data.nft_data])
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

  const gridType = fixedPriceArr?.length > 10 ? '1fr' : '210px'

  return (
    <NFT_COLLECTIONS_GRID gridType={gridType} id="border">
      {handleModalClick()}
      {fixedPriceWithinCollection && fixedPriceWithinCollection.total_count === 0 ? (
        <NoContent type="collected" />
      ) : (
        <div className="gridContainer">
          {fixedPriceArr.length > 0 ? (
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
      )}
    </NFT_COLLECTIONS_GRID>
  )
}
