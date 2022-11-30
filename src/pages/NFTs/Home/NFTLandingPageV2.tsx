import React, { ReactElement, useMemo, useState } from 'react'
import styled, { css } from 'styled-components'
import tw from 'twin.macro'
import { SearchBar } from '../../../components'
import { ModalSlide } from '../../../components/ModalSlide'
import { MODAL_TYPES } from '../../../constants'
import { useNavCollapse, useNFTCollections } from '../../../context'
import { STYLED_BUTTON } from '../../Farm/FarmFilterHeader'
import { NFT_STATS_CONTAINER, SEARCH_RESULT_CONTAINER, STATS_BTN } from './NFTAggregator.styles'
import NFTBanners from './NFTBanners'
import NFTCollectionsTable from './NFTCollectionsTable'

const WRAPPER = styled.div<{ $navCollapsed }>`
  /* padding-top: ${({ $navCollapsed }) => ($navCollapsed ? '0px' : '80px')}; */
  transition: 0.5s ease;
  font-family: 'Montserrat';
  font-style: normal;
  .search-bar {
    transition: 0.5s ease;
  }
`
const BannerContainer = styled.div<{ showBanner: boolean }>`
  ${({ showBanner }) => css`
    height: ${showBanner ? '290px' : '80px'};
    transition: 0.5s ease;
  `}
`

const EYE_CONTAINER = styled.div`
  width: fit-content;
  right: 2%;
  ${tw`text-[15px] font-semibold absolute duration-500 cursor-pointer mt-1`}
  img {
    ${tw`mr-2 duration-500`}
  }
`
const FILTERS_CONTAINER = styled.div`
  ${tw`flex mt-4`}
`
export const ButtonContainer = styled.div<{ $poolIndex: number }>`
  ${tw`relative z-0 `}
  font-size: 20px !important;
  .slider-animation {
    ${tw`absolute w-1/4 h-[44px] rounded-[36px] z-[-1]`}
    left: ${({ $poolIndex }) => $poolIndex * 50 + 4.5}%;
    background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
    transition: left 500ms ease-in-out;
  }
  .slider-animation-web {
    ${tw`absolute w-[40%] h-[44px] rounded-[36px] z-[-1]`}
    left: ${({ $poolIndex }) => $poolIndex * 50 + 4.5}%;
    background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
    transition: left 500ms ease-in-out;
  }
  .selectedBackground {
    ${tw`text-white`}
    transition: 500ms ease-in-out;
    @media (max-width: 500px) {
      background: none;
    }
  }
`

const poolTypes = [{ name: 'Popular' }, { name: 'Trending' }]

const NFTLandingPageV2 = (): ReactElement => {
  const { isCollapsed } = useNavCollapse()
  const [showBanner, setShowBanner] = useState<boolean>(true)
  const [showPopup, setShowPopup] = useState<boolean>(false)

  return (
    <WRAPPER $navCollapsed={isCollapsed}>
      {showPopup && (
        <ModalSlide modalType={MODAL_TYPES.NFT_AGG_WELCOME} rewardToggle={setShowPopup} rewardModal={showBanner} />
      )}
      <BannerContainer showBanner={showBanner}>
        <StatsContainer showBanner={showBanner} setShowBanner={setShowBanner} />

        <NFTBanners showBanner={showBanner} />
        <FiltersContainer />
      </BannerContainer>
      <NFTCollectionsTable showBanner={showBanner} />
    </WRAPPER>
  )
}

const FiltersContainer = () => {
  const [poolIndex, setPoolIndex] = useState<number>(0)
  const [poolFilter, setPoolFilter] = useState<string>('Popular')
  const [searchFilter, setSearchFilter] = useState<string>(undefined)

  const handleClick = (poolName, index) => {
    setPoolIndex(index)
    setPoolFilter(poolName)
  }
  return (
    <FILTERS_CONTAINER>
      <SearchBar
        className="search-bar"
        setSearchFilter={setSearchFilter}
        placeholder="Search by collections or markets"
      />
      <ButtonContainer $poolIndex={poolIndex}>
        <div className="slider-animation-web"></div>
        {poolTypes.map((pool, index) => (
          <STYLED_BUTTON
            key={pool.name}
            onClick={() => handleClick(pool.name, index)}
            className={pool.name === poolFilter ? 'selectedBackground' : ''}
          >
            {pool.name}
          </STYLED_BUTTON>
        ))}
      </ButtonContainer>
      {searchFilter && <SearchResultContainer searchFilter={searchFilter} />}
    </FILTERS_CONTAINER>
  )
}
const ShowBannerEye = ({ showBanner, setShowBanner }: any) => {
  const eyeImg = `/img/assets/${showBanner ? 'show' : 'hide'}Eye.svg`
  return (
    <EYE_CONTAINER onClick={() => setShowBanner((prev) => !prev)}>
      <div>
        <img src={eyeImg} alt="" />
        {showBanner ? 'Show' : 'Hide'}
      </div>
    </EYE_CONTAINER>
  )
}

const SearchResultContainer = ({ searchFilter }: any) => {
  const { allCollections } = useNFTCollections()
  const searchResultArr = useMemo(() => {
    if (!searchFilter) return allCollections
    const searchFiltered = allCollections.filter((result) => {
      const collectionName = result.collection_name.toLowerCase()
      if (collectionName.includes(searchFilter.toLowerCase())) return true
    })
    return searchFiltered
  }, [searchFilter])

  return (
    <SEARCH_RESULT_CONTAINER>
      {searchResultArr.map((data, index) => (
        <div className="searchResultRow" key={index}>
          <img src={data.profile_pic_link} alt="" />
          <div className="searchText">{data.collection_name}</div>
        </div>
      ))}
    </SEARCH_RESULT_CONTAINER>
  )
}

const StatsContainer = ({ showBanner, setShowBanner }: any) => (
  <NFT_STATS_CONTAINER>
    <StatsButton data={'Total volume traded: 2332'} />
    <StatsButton data={'Total volume traded: 2332'} />
    <StatsButton data={'Total Volume: 2010'} />
    <ShowBannerEye showBanner={showBanner} setShowBanner={setShowBanner} />
  </NFT_STATS_CONTAINER>
)

const StatsButton = ({ data }: any) => (
  <STATS_BTN>
    <span className="innerCover">{data}</span>
  </STATS_BTN>
)

export default NFTLandingPageV2