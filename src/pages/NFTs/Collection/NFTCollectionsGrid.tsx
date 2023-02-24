/* eslint-disable @typescript-eslint/no-unused-vars */
import { ReactElement, useEffect, useRef, useState } from 'react'
import { ENDPOINTS, useNFTAggregator, useNFTCollections } from '../../../context'
import { BidNFTModal, BuyNFTModal } from './BuyNFTModal'
import { NFT_COLLECTIONS_GRID } from './CollectionV2.styles'
import DetailViewNFT from './DetailViewNFTDrawer'
import { ISingleNFT } from '../../../types/nft_details.d'
import { debounce } from 'lodash'
import { SingleNFTCard } from './SingleNFTCard'
import { fetchSingleCollectionBySalesType, NFT_API_ENDPOINTS } from '../../../api/NFTs'
import { useParams } from 'react-router-dom'
import { IAppParams } from '../../../types/app_params'

export const NFTCollectionsGrid = (): ReactElement => {
  const { nftCollections, buyNowClicked, bidNowClicked, setNftInBag } = useNFTAggregator()
  const { openBidWithinCollection, fetchAllCollectionsByPages } = useNFTCollections()
  const paginationNum = 20

  const [fileredLocalOpenBid, _setFilteredLocalOpenBid] = useState<Array<ISingleNFT>>(Array(21).fill(null))
  const [shortfilteredLocalOpenBid, _setShortFilteredLocalOpenBid] = useState<Array<ISingleNFT>>(
    Array(21).fill(null)
  )
  const [level, _setLevel] = useState<number>(0)
  const [loading, _setLoading] = useState<boolean>(false)
  const filter = ''
  // const params = useParams<IAppParams>()

  // define a ref
  const activePointRef = useRef(fileredLocalOpenBid)
  const activePointLevel = useRef(level)
  const activePointshortFilter = useRef(shortfilteredLocalOpenBid)
  const activePointLoader = useRef(loading)

  // in place of original `setActivePoint`
  const setFilteredLocalOpenBid = (x) => {
    activePointRef.current = x // keep updated
    _setFilteredLocalOpenBid(x)
  }

  const setLevel = (x) => {
    activePointLevel.current = x // keep updated
    _setLevel(x)
  }

  const setShortFilteredLocalOpenBid = (x) => {
    activePointshortFilter.current = x // keep updated
    _setShortFilteredLocalOpenBid(x)
  }

  const setLoading = (x) => {
    activePointLoader.current = x // keep updated
    _setLoading(x)
  }

  useEffect(() => {
    if (openBidWithinCollection) {
      if (filter.length > 0) {
        const filteredData = openBidWithinCollection.open_bid.filter((i) =>
          i.nft_name.toLowerCase().includes(filter.trim().toLowerCase())
        )

        setFilteredLocalOpenBid(filteredData)
        setShortFilteredLocalOpenBid(filteredData.slice(0, paginationNum))
      } else {
        setFilteredLocalOpenBid(openBidWithinCollection.open_bid)
        setShortFilteredLocalOpenBid(openBidWithinCollection.open_bid.slice(0, paginationNum))
      }

      setLevel(0)
    }
  }, [filter, openBidWithinCollection])

  useEffect(() => {
    window.addEventListener('scroll', scrolling, true)

    return () => window.removeEventListener('scroll', scrolling, true)
  }, [])

  const scrolling = debounce(() => {
    handleScroll()
  }, 100)

  const handleScroll = () => {
    const border = document.getElementById('border')
    if (border !== null) {
      const mainHeight = window.innerHeight
      const totalscroll = mainHeight + border.scrollTop + 100

      if (Math.ceil(totalscroll) < border.scrollHeight || activePointLoader.current) {
        setLoading(false)
      } else {
        addToList()
      }
    }
  }

  const addToList = async () => {
    // const curColNameParam = params.collectionName.replaceAll('_', ' ')
    // const total = activePointRef.current
    // const newLevel = activePointLevel.current + 1
    // if (total?.length > newLevel * paginationNum) {
    //   setLoading(true)
    //   const nextData = await fetchAllCollectionsByPages(newLevel * paginationNum, (newLevel + 1) * paginationNum)
    //   setShortFilteredLocalOpenBid([...activePointshortFilter.current, ...nextData])
    //   setLevel(newLevel)
    //   setLoading(false)
    // } working on it now
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
        {shortfilteredLocalOpenBid &&
          shortfilteredLocalOpenBid.map((item, index) => (
            <SingleNFTCard item={item} key={index} index={index} addNftToBag={addNftToBag} />
          ))}
      </div>
    </NFT_COLLECTIONS_GRID>
  )
}
