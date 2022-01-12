import React, { FC } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import styled from 'styled-components'
import { ArrowClicker, Loader } from '../../components'
import { ButtonWrapper } from './NFTButton'
import NFTImageCarouselItem from './NFTImageCarouselItem'

const CAROUSEL_WRAPPER = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.margins['2x']} ${({ theme }) => theme.margins['6x']};
`

const HEADER_CAROUSEL = styled.div`
  display: flex;
  margin: ${({ theme }) => theme.margins['4x']} 0;
  align-items: center;
`

const TOP_ARROW = styled(ArrowClicker)`
  width: 21px;
  flex: 1;
  align-self: center;
`

const LEFT_ARROW = styled(ArrowClicker)`
  width: 14px;
  transform: rotateZ(90deg);
  margin-right: ${({ theme }) => theme.margins['2x']};
`

const RIGHT_ARROW = styled(ArrowClicker)`
  width: 14px;
  transform: rotateZ(270deg);
`

const TITLE_CAROUSEL = styled.span`
  font-size: 18px;
  font-weight: bold;
  text-align: left;
  color: ${({ theme }) => theme.text1};
  flex: 1;
`

const HEADER_END_CAROUSEL = styled.div`
  flex: 1;
  flex-direction: row;
  justify-content: flex-end;
  display: flex;
  align-items: center;
  padding-right: ${({ theme }) => theme.margins['2x']};
`

const LAUNCH_BUTTON = styled(ButtonWrapper)`
  height: 40px;
  background-color: ${({ theme }) => theme.primary2};
  margin-right: ${({ theme }) => theme.margins['2x']};
`

const SORT_BUTTON = styled(ButtonWrapper)`
  height: 40px;
  background-color: ${({ theme }) => theme.secondary2};
  margin-right: ${({ theme }) => theme.margins['2x']};
  justify-content: space-between;
`

const EMPTY_CAROUSEL = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 132px;
  background-color: ${({ theme }) => theme.bg8};
`

const WRAPPED_LOADER = styled.div`
  position: relative;
  height: 48px;
`

const settings = {
  infinite: false,
  speed: 500,
  swipeToSlide: true,
  slidesToScroll: 2,
  snapCenter: true,
  initialSlide: 0,
  arrows: false,
  variableWidth: true
}

export enum COLLECTION_TYPES {
  NFT_COLLECTION = 'NFTCollection',
  NFT_FEATURED_COLLECTION = 'NFTFeaturedCollection',
  NFT_UPCOMING_COLLECTION = 'NFTUpcomingCollection'
}

export type NFTCollection = {
  collection_id: number
  collection_name: string
  collection_description: string
  profile_pic_link: string
  banner_link: string | null
  banner_2_link: string | null
  banner_3_link: string | null
  title: string
  tagline: string
  size: number
  category_tags: string
  is_verified: boolean
}

export type NFTFeaturedCollection = {
  collection_id: number
  featured_collection_name: string
  featured_collection_banner_url: string
  featured_collection_description: string
}

export type NFTUpcomingCollection = {
  upcoming_id: number | null
  upcoming_collection_droptime: string
  upcoming_collection_name: string
  upcoming_collection_banner_url: string
  upcoming_collection_description: string
}

export interface ICollectionCarousel {
  collections: Array<NFTCollection | NFTFeaturedCollection | NFTUpcomingCollection>
  collectionType: string
  isLoading: boolean
  isLaunch?: boolean
  showTopArrow?: boolean
  title?: string
}

const CollectionCarousel: FC<ICollectionCarousel> = ({
  isLaunch,
  showTopArrow,
  title,
  collections,
  collectionType,
  isLoading
}) => {
  const slickRef = React.useRef<any>()

  const slickNext = () => slickRef?.current?.slickNext()
  const slickPrev = () => slickRef?.current?.slickPrev()

  return (
    <CAROUSEL_WRAPPER>
      <HEADER_CAROUSEL>
        <TITLE_CAROUSEL>{title}</TITLE_CAROUSEL>
        {showTopArrow && <TOP_ARROW arrowRotation />}
        <HEADER_END_CAROUSEL>
          {isLaunch ? (
            <LAUNCH_BUTTON>
              <span>Launch your collection</span>
            </LAUNCH_BUTTON>
          ) : (
            <SORT_BUTTON>
              <span>Sort by</span>
              <ArrowClicker />
            </SORT_BUTTON>
          )}

          <LEFT_ARROW onClick={slickPrev} />
          <RIGHT_ARROW onClick={slickNext} />
        </HEADER_END_CAROUSEL>
      </HEADER_CAROUSEL>
      {collections.length > 0 ? (
        <Slider ref={slickRef} {...settings}>
          {collections.map((item: NFTCollection | NFTFeaturedCollection | NFTUpcomingCollection, i: number) => (
            <NFTImageCarouselItem key={i} item={item} type={collectionType} />
          ))}
        </Slider>
      ) : (
        <EMPTY_CAROUSEL>
          {isLoading ? (
            <WRAPPED_LOADER>
              <Loader />
            </WRAPPED_LOADER>
          ) : (
            'No Collections Listed'
          )}
        </EMPTY_CAROUSEL>
      )}
    </CAROUSEL_WRAPPER>
  )
}

export default CollectionCarousel
