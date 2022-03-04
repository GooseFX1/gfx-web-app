import React, { useRef, useState, useEffect, FC } from 'react'
import styled from 'styled-components'
import { Header } from '../Header'
import { NFTHomeSlider } from '../Slider/NFTHomeSlider'
import AnalyticsTabs from '../Analytics/Tab'
import NFTFooter from '../NFTFooter'
import CollectionCarousel from '../CollectionCarousel'
import { useNFTCollections } from '../../../context'
import { COLLECTION_TYPES } from '../../../types/nft_collections.d'
//import { allCollections } from './mockData'

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
  const [filteredCollections, setFilteredCollections] = useState([])
  const [isAllLoading, setIsAllLoading] = useState<boolean>(false)
  const [totalCollections, setTotalCollections] = useState(allCollections)
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

  useEffect(() => {
    setTotalCollections(allCollections)
    return () => {}
  }, [allCollections])

  const find = (col: string | string[], search: string) => {
    return col.includes(search)
  }

  useEffect(() => {
    let filtered = totalCollections.filter(
      (i) =>
        find(i.collection_name.toLowerCase(), search.toLowerCase()) ||
        find(
          i.category_tags.split(' ').map((i) => i.toLowerCase()),
          search.toLowerCase()
        )
    )
    setFilteredCollections(filtered.slice(0, 5))
  }, [search])

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
      <Header
        setFilter={setSearch}
        totalCollections={allCollections}
        filter={search}
        filteredCollections={filteredCollections}
        setTotalCollections={setTotalCollections}
      />
      <NFTHomeSlider />
      <AnalyticsTabs allCollections={totalCollections} />
      <SCROLLING_CONTENT_100 onScroll={onScroll}>
        <CollectionCarousel
          collections={totalCollections}
          collectionType={COLLECTION_TYPES.NFT_COLLECTION}
          title="Popular Collections"
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
