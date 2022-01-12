import React, { useRef, useState, useEffect } from 'react'
import styled from 'styled-components'
import { Header } from '../Header'
import NFTHeaderCarousel from '../NFTHeaderCarousel'
import NFTFooter from '../NFTFooter'
import CollectionCarousel, { COLLECTION_TYPES } from '../CollectionCarousel'
import apiClient from '../../../api'
import { NFT_API_BASE, NFT_API_ENDPOINTS } from '../../../api/NFTs'
// import { allCollections, featuredCollections, upcomingCollections } from './mockData'

const SCROLLING_CONTENT = styled.div`
  overflow-y: overlay;
  width: 101%;
  overflow-x: hidden;
  position: relative;
`

const NFTHome = () => {
  const prevScrollY = useRef(0)
  const [goingUp, setGoingUp] = useState<boolean>(false)
  const [isBigCarouselVisible, setBisCarouselVisible] = useState<boolean>(true)
  const [allCollections, setAllCollections] = useState<Array<any>>([])
  const [featuredCollections, setFeaturedCollections] = useState<Array<any>>([])
  const [upcomingCollections, setUpcomingCollections] = useState<Array<any>>([])
  const [isAllLoading, setIsAllLoading] = useState<boolean>(false)
  const [isUpcomingLoading, setIsUpcomingLoading] = useState<boolean>(false)
  const [isFeaturedLoading, setIsFeaturedLoading] = useState<boolean>(false)

  // TODO: move to a custom context provider
  const getAllCollections = async () => {
    try {
      const res = await apiClient(NFT_API_BASE).get(NFT_API_ENDPOINTS.ALL_COLLECTIONS)
      setAllCollections(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setIsFeaturedLoading(false)
    }
  }

  const getFeaturedCollections = async () => {
    try {
      const res = await apiClient(NFT_API_BASE).get(NFT_API_ENDPOINTS.FEATURED_COLLECTIONS)
      setFeaturedCollections(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setIsFeaturedLoading(false)
    }
  }

  const getUpcomingCollections = async () => {
    try {
      const res = await apiClient(NFT_API_BASE).get(NFT_API_ENDPOINTS.UPCOMING_COLLECTIONS)
      setUpcomingCollections(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setIsUpcomingLoading(false)
    }
  }

  useEffect(() => {
    setIsAllLoading(true)
    getAllCollections()

    setIsFeaturedLoading(true)
    getFeaturedCollections()

    setIsUpcomingLoading(true)
    getUpcomingCollections()
    return () => {}
  }, [])

  const onScroll = (e) => {
    const currentScrollY = e.target.scrollTop
    if (prevScrollY.current < currentScrollY && goingUp) {
      setGoingUp(false)
    }
    if (prevScrollY.current > currentScrollY && !goingUp) {
      setGoingUp(true)
    }
    prevScrollY.current = currentScrollY
    console.log('currentScrollY', currentScrollY)
    if (currentScrollY >= 402.5) {
      setBisCarouselVisible(false)
    } else {
      setBisCarouselVisible(true)
    }
  }

  return (
    <>
      <Header />
      <NFTHeaderCarousel isBig={false} isBigVisible={isBigCarouselVisible} />
      <SCROLLING_CONTENT onScroll={onScroll}>
        <NFTHeaderCarousel isBig isBigVisible={isBigCarouselVisible} />
        <CollectionCarousel
          collections={allCollections}
          collectionType={COLLECTION_TYPES.NFT_COLLECTION}
          title="Launchpad"
          showTopArrow
          isLaunch
          isLoading={isAllLoading}
        />
        <CollectionCarousel
          collections={upcomingCollections}
          collectionType={COLLECTION_TYPES.NFT_UPCOMING_COLLECTION}
          title="Upcoming Collections"
          isLoading={isUpcomingLoading}
        />
        <CollectionCarousel
          collections={featuredCollections}
          collectionType={COLLECTION_TYPES.NFT_FEATURED_COLLECTION}
          title="Popular Collections"
          isLoading={isFeaturedLoading}
        />
        <NFTFooter />
      </SCROLLING_CONTENT>
    </>
  )
}

export default NFTHome
