import React, { useRef, useState, useEffect, FC } from 'react'
import styled from 'styled-components'
import { Header } from '../Header'
import { NFTHomeSlider } from '../Slider/NFTHomeSlider'
import AnalyticsTabs from '../Analytics/Tab'
import Loading from '../Analytics/Loading'
import NFTFooter from '../NFTFooter'
import CollectionCarousel from '../CollectionCarousel'
import { useNFTCollections } from '../../../context'
import { COLLECTION_TYPES } from '../../../types/nft_collections.d'

const NFTLandingPage: FC = (): JSX.Element => {
  const { allCollections, fetchAllCollections } = useNFTCollections()
  const [filteredCollections, setFilteredCollections] = useState([])
  const [isAllLoading, setIsAllLoading] = useState<boolean>(true)
  const [search, setSearch] = useState<string>('')

  useEffect(() => {
    fetchAllCollections().then((res) => setTimeout(() => setIsAllLoading(false), 900))
    return () => {}
  }, [])

  const find = (col: string | string[], search: string) => {
    return col.includes(search)
  }

  useEffect(() => {
    const filtered = allCollections.filter((i) => find(i.collection_name.toLowerCase(), search.toLowerCase()))
    setFilteredCollections(filtered.slice(0, 5))
  }, [search])

  return (
    <>
      <Header
        setFilter={setSearch}
        totalCollections={allCollections}
        filter={search}
        filteredCollections={filteredCollections}
        setTotalCollections={setFilteredCollections}
      />
      <NFTHomeSlider />
      <br />
      <div>
        {isAllLoading && <Loading />}
        <AnalyticsTabs allCollections={allCollections} />
      </div>
      <br />
      <div>
        <CollectionCarousel
          collections={allCollections}
          collectionType={COLLECTION_TYPES.NFT_COLLECTION}
          title="Popular Collections"
          isLaunch
          isLoading={isAllLoading}
        />
        <NFTFooter />
      </div>
    </>
  )
}

export default NFTLandingPage
