import React, { useState } from 'react'
/* eslint-disable @typescript-eslint/no-unused-vars */
import styled, { css } from 'styled-components'
import tw from 'twin.macro'
import { SearchBar } from '../../../components'
import { useNavCollapse } from '../../../context'
import { STYLED_BUTTON } from '../../Farm/FarmFilterHeader'
import NFTBanners from './NFTBanners'
import NFTCollectionsTable from './NFTCollectionsTable'

const WRAPPER = styled.div<{ $navCollapsed }>`
  padding-top: ${({ $navCollapsed }) => ($navCollapsed ? '0px' : '80px')};
  transition: 0.5s ease;
  font-family: 'Montserrat';
  font-style: normal;
  .search-bar {
    transition: 0.5s ease;
  }
`
const BannerContainer = styled.div<{ showBanner: boolean }>`
  ${({ showBanner }) => css`
    height: ${showBanner ? '260px' : '80px'};
    transition: 0.5s ease;
  `}
`

const EYE_CONTAINER = styled.div`
  ${tw`absolute right-[2%] text-[15px] font-semibold top-[100px] duration-500	 `}
  img {
    ${tw` mr-2 right-[120%] duration-500	 `}
  }
`

const FILTERS_CONTAINER = styled.div`
  ${tw`mt-2 flex mt-8`}
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

const NFTLandingPageV2 = () => {
  const { isCollapsed } = useNavCollapse()
  const [showBanner, setShowBanner] = useState<boolean>(true)

  return (
    <WRAPPER $navCollapsed={isCollapsed}>
      <BannerContainer showBanner={showBanner}>
        <ShowBannerEye showBanner={showBanner} setShowBanner={setShowBanner} />
        {<NFTBanners showBanner={showBanner} />}
        <FiltersContainer />
      </BannerContainer>
      <NFTCollectionsTable showBanner={showBanner} />
    </WRAPPER>
  )
}

const FiltersContainer = () => {
  const [poolIndex, setPoolIndex] = useState<number>(0)
  const [poolFilter, setPoolFilter] = useState<string>('Popular')

  const handleClick = (poolName, index) => {
    setPoolIndex(index)
    setPoolFilter(poolName)
  }
  return (
    <FILTERS_CONTAINER>
      <SearchBar className="search-bar" placeholder="Search by collections or markets" />
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

export default NFTLandingPageV2
