import React, { useRef, useState, useEffect, FC } from 'react'
import styled from 'styled-components'
import { Header } from '../Header'
import { NFTHomeSlider } from '../Slider/NFTHomeSlider'
import { AnalyticsTabs } from '../Analytics/Tab'
import NFTFooter from '../NFTFooter'
import CollectionCarousel from '../CollectionCarousel'
import { useNFTCollections } from '../../../context'
import { COLLECTION_TYPES } from '../../../types/nft_collections.d'

const BODY_NFT_HOME = styled.div`
  width: 100%;
  box-shadow: 0 7px 15px 9px rgba(13, 13, 13, 0.25);
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #333;
`

const SCROLLING_CONTENT = styled.div`
  overflow-y: overlay;
  width: 100%;
  overflow-x: hidden;
  position: relative;
`

const SCROLLING_CONTENT_100 = styled.div`
  overflow-y: overlay;
  width: 100%;
  overflow-x: hidden;
  position: relative;
`

const NFTLandingPage: FC = (): JSX.Element => {
  const {
    allCollections,
    featuredCollections,
    upcomingCollections,
    fetchAllCollections,
    fetchFeaturedCollections,
    fetchUpcomingCollections
  } = useNFTCollections()
  const prevScrollY = useRef(0)
  const [goingUp, setGoingUp] = useState<boolean>(false)
  const [isAllLoading, setIsAllLoading] = useState<boolean>(false)
  const [isFeaturedLoading, setIsFeaturedLoading] = useState<boolean>(false)
  const [isUpcomingLoading, setIsUpcomingLoading] = useState<boolean>(false)
  const [search, setSearch] = useState<string>('')

  useEffect(() => {
    setIsAllLoading(true)
    fetchAllCollections().then((res) => setIsAllLoading(false))

    setIsFeaturedLoading(true)
    fetchFeaturedCollections().then((res) => setIsFeaturedLoading(false))

    setIsUpcomingLoading(true)
    fetchUpcomingCollections().then((res) => setIsUpcomingLoading(false))
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
  }

  return (
    <>
      <Header setFilter={setSearch} filter={search} />
      <NFTHomeSlider />
      <AnalyticsTabs />
      <SCROLLING_CONTENT_100 onScroll={onScroll}>
        <CollectionCarousel
          collections={allCollections}
          collectionType={COLLECTION_TYPES.NFT_COLLECTION}
          title="Populare Collections"
          showTopArrow
          isLaunch
          isLoading={isAllLoading}
        />
        {/* <CollectionCarousel
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
        /> */}
        <NFTFooter />
      </SCROLLING_CONTENT_100>
    </>
  )
}

export default NFTLandingPage
