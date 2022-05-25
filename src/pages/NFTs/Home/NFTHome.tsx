import React, { useCallback, useState, useEffect, FC } from 'react'
import styled from 'styled-components'
import { useNFTCollections } from '../../../context'
import { fetchAllSingleNFTs } from '../../../api/NFTs'
import { Header } from './Header'
import { NFTHomeSlider } from '../Slider/NFTHomeSlider'
import AnalyticsTabs from './Tab'
import NFTFooter from './NFTFooter'
import CollectionCarousel from './CollectionCarousel'
import SingleItemListings from './SingleItemListings'
import { COLLECTION_TYPES } from '../../../types/nft_collections.d'
import Loading from './Loading'
import { SVGDynamicReverseMode } from '../../../styles'

const BETA_BANNER = styled.div`
  position: fixed;
  right: 24px;
  bottom: 72px;
  background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
  border-radius: 10px;
  padding: 1px;
  z-index: 10;

  .inner {
    padding: 12px 24px;
    border-radius: 10px;
    background: ${({ theme }) => theme.bg9};
  }

  h6 {
    color: ${({ theme }) => theme.text1};
    font-weight: 600;
    font-size: 14px;
    line-height: 17px;
  }

  p {
    color: ${({ theme }) => theme.text6};
    font-weight: 500;
    font-size: 12px;
    line-height: 15px;
    margin: 0;
  }

  .info-icon {
    float: left;
    margin-right: 12px;
  }

  .close-button {
    position: absolute;
    top: 4px;
    right: 8px;
    background: transparent;
    border: none;

    .close-icon {
      height: 8px;
    }
  }
`

const NFTLandingPage: FC = (): JSX.Element => {
  const { allCollections, fetchAllCollections } = useNFTCollections()
  const [filteredCollections, setFilteredCollections] = useState([])
  const [singleItems, setAllSingleItems] = useState([])
  const [isAllLoading, setIsAllLoading] = useState<boolean>(true)
  const [betaBanner, setBetaBanner] = useState<boolean>(true)
  const [search, setSearch] = useState<string>('')

  useEffect(() => {
    fetchAllCollections().then((res) => setIsAllLoading(false))
    fetchAllSingleNFTs().then((res) => setAllSingleItems(res))
    return () => {}
  }, [])

  const find = useCallback((col: string | string[], search: string) => col.includes(search), [])

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
        <SingleItemListings items={singleItems} title={'Single Item Listings'} />
        <NFTFooter />
      </div>

      {betaBanner && (
        <BETA_BANNER>
          <div className={'inner'}>
            <div>
              <SVGDynamicReverseMode className="info-icon" src={`/img/assets/info-icon.svg`} alt="info" />
              <h6>Marketplace is currently in Beta</h6>
            </div>
            <p>Please be patient, settle your balances, and enjoy!</p>
            <button className={'close-button'} onClick={(e) => setBetaBanner(false)}>
              <SVGDynamicReverseMode className="close-icon" src={`/img/assets/close-white-icon.svg`} alt="close" />
            </button>
          </div>
        </BETA_BANNER>
      )}
    </>
  )
}

export default NFTLandingPage
