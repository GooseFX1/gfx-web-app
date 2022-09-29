import React, { useCallback, useState, useEffect, FC } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import { useNFTCollections } from '../../../context'
import { fetchAllSingleNFTs } from '../../../api/NFTs'
import { Header } from './Header'
import { NFTHomeSlider } from '../Slider/NFTHomeSlider'
import AnalyticsTabs from './Tab'
import NFTFooter from './NFTFooter'
import CollectionCarousel from './CollectionCarousel'
import OneOfOnesNFTs from './OneOfOnesNFTs'
import { COLLECTION_TYPES, NFTBaseCollection } from '../../../types/nft_collections.d'
import Loading from './Loading'
import { ModalSlide } from '../../../components/ModalSlide'
import { Banner } from '../../../components/Banner'
import { MODAL_TYPES } from '../../../constants'
import { checkMobile } from '../../../utils'

export const NFT_MENU = styled.div`
  ${tw`fixed h-[150px] w-[180px] right-[-20px] bottom-[-12px] cursor-pointer`}
  background: url('/img/assets/menuButton.svg');
  z-index: 100;
`

const BETA_BANNER = styled.div`
  ${tw`fixed left-[42px] bottom-[42px]`}
  z-index: 10;
`

const NFTLandingPage: FC = (): JSX.Element => {
  const { allCollections, fetchAllCollections, fetchAllCollectionDetails, setNFTMenuPopup, nftMenuPopup } =
    useNFTCollections()
  const [filteredCollections, setFilteredCollections] = useState([])
  const [oneOfOnes, setAllOneOfOnes] = useState([])
  const [isAllLoading, setIsAllLoading] = useState<boolean>(true)
  const [betaBanner, setBetaBanner] = useState<boolean>(true)
  const [search, setSearch] = useState<string>('')

  useEffect(() => {
    fetchAllCollections().then((collections: NFTBaseCollection[]) => {
      fetchAllCollectionDetails(collections).then(() => setIsAllLoading(false))
    })
    fetchAllSingleNFTs().then((res) => setAllOneOfOnes(res != null ? res.slice(0, 20) : []))
    return null
  }, [])

  const find = useCallback((col: string | string[], search: string) => col.includes(search), [])

  useEffect(() => {
    const filtered = allCollections.filter((i) => find(i.collection_name.toLowerCase(), search.toLowerCase()))
    setFilteredCollections(filtered.slice(0, 5))
  }, [search])

  const displayMenu = () => {
    if (nftMenuPopup) return <ModalSlide modalType={MODAL_TYPES.NFT_MENU} rewardToggle={setNFTMenuPopup} />
  }

  return (
    <>
      {displayMenu()}
      <Header setFilter={setSearch} filter={search} filteredCollections={filteredCollections} />
      <NFTHomeSlider />
      <br />
      <div>
        {isAllLoading && !checkMobile() && <Loading />}
        <AnalyticsTabs />
      </div>
      <br />
      <div>
        <CollectionCarousel
          collectionType={COLLECTION_TYPES.NFT_COLLECTION}
          title="Popular Collections"
          isLaunch
          isLoading={isAllLoading}
        />
        <OneOfOnesNFTs items={oneOfOnes} title={'1 of 1 Listings'} />
        <NFTFooter />
      </div>

      <NFT_MENU onClick={() => setNFTMenuPopup((prev) => !prev)} />

      {betaBanner && !checkMobile() && (
        <BETA_BANNER>
          <Banner
            title="Marketplace is currently in Beta"
            support={'Please be patient, settle your balances, and enjoy!'}
            iconFileName={'info-icon.svg'}
            handleDismiss={setBetaBanner}
          />
        </BETA_BANNER>
      )}
    </>
  )
}

export default NFTLandingPage
