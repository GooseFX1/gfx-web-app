import React, { FC } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import styled from 'styled-components'
import { ArrowClicker } from '../../components'
import { ButtonWrapper } from './NFTButton'
import NFTImageCarouselItem from './NFTImageCarouselItem'

const products = [
  { id: 1, title: 'Corrupt Catz', pieces: 441 },
  { id: 2, title: 'Corrupt Catz', pieces: 441 },
  { id: 3, title: 'Corrupt Catz', pieces: 441 },
  { id: 4, title: 'Corrupt Catz', pieces: 441 },
  { id: 5, title: 'Corrupt Catz', pieces: 441 }
]

const CAROUSEL_WRAPPER = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: ${({ theme }) => theme.margins['6x']};
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

export enum NFTCarouselType {
  launchPad,
  upcomming,
  popular
}

const NFTCarousel: FC<{ isLaunch?: boolean; showTopArrow?: boolean; title?: string; type?: NFTCarouselType }> = ({
  isLaunch,
  showTopArrow,
  title,
  type
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
      <Slider ref={slickRef} {...settings}>
        {products.map((item) => {
          return <NFTImageCarouselItem type={type} key={item.id} item={item} />
        })}
      </Slider>
    </CAROUSEL_WRAPPER>
  )
}

export default NFTCarousel
