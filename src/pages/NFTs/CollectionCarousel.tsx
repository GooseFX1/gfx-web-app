import React, { FC } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import styled from 'styled-components'
import { ArrowClicker, Loader } from '../../components'
import { ButtonWrapper } from './NFTButton'
import NFTImageCarouselItem from './NFTImageCarouselItem'
import { NFTBaseCollection, NFTFeaturedCollection, NFTUpcomingCollection } from '../../types/nft_collections.d'
import { SkeletonCommon } from './Skeleton/SkeletonCommon'
import isEmpty from 'lodash/isEmpty'

const CAROUSEL_WRAPPER = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px 0 16px 32px;
`

const HEADER_CAROUSEL = styled.div`
  display: flex;
  margin: ${({ theme }) => theme.margin(4)} 0;
  align-items: center;
`

const LEFT_ARROW = styled(ArrowClicker)`
  width: 21px;
  transform: rotateZ(90deg);
  margin-right: ${({ theme }) => theme.margin(2)};
`

const RIGHT_ARROW = styled(ArrowClicker)`
  width: 21px;
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
  padding-right: ${({ theme }) => theme.margin(2)};
`

const LAUNCH_BUTTON = styled(ButtonWrapper)`
  height: 40px;
  background-color: ${({ theme }) => theme.primary2};
  margin-right: ${({ theme }) => theme.margin(2)};
`

const SORT_BUTTON = styled(ButtonWrapper)`
  height: 40px;
  background-color: ${({ theme }) => theme.secondary2};
  margin-right: ${({ theme }) => theme.margin(2)};
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
const SKELETON_SLIDER = styled.div`
  display: flex;
  .wrap {
    margin: 0 ${({ theme }) => theme.margin(4)};
  }
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

export interface ICollectionCarousel {
  collections: Array<NFTBaseCollection | NFTFeaturedCollection | NFTUpcomingCollection>
  collectionType: string
  isLoading: boolean
  isLaunch?: boolean
  title?: string
}

const CollectionCarousel: FC<ICollectionCarousel> = ({ isLaunch, title, collections, collectionType, isLoading }) => {
  const slickRef = React.useRef<any>()

  const slickNext = () => slickRef?.current?.slickNext()
  const slickPrev = () => slickRef?.current?.slickPrev()

  const isCollectionsEmpty = isEmpty(collections)

  return (
    <CAROUSEL_WRAPPER>
      <HEADER_CAROUSEL>
        <TITLE_CAROUSEL>{title}</TITLE_CAROUSEL>
        <HEADER_END_CAROUSEL>
          {!isCollectionsEmpty && (
            <>
              <LEFT_ARROW onClick={slickPrev} />
              <RIGHT_ARROW onClick={slickNext} />
            </>
          )}
        </HEADER_END_CAROUSEL>
      </HEADER_CAROUSEL>
      {isCollectionsEmpty ? (
        <SKELETON_SLIDER>
          {[0, 1, 2].map((item, index) => (
            <div key={index} className="wrap">
              <SkeletonCommon width="450px" height="220px" borderRadius="20px" />
            </div>
          ))}
        </SKELETON_SLIDER>
      ) : collections.length > 0 ? (
        <Slider ref={slickRef} {...settings}>
          {collections.map((item: NFTBaseCollection | NFTFeaturedCollection | NFTUpcomingCollection, i: number) => (
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
