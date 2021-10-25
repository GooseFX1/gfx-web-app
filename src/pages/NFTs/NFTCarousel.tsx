import React, { FC } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import styled from 'styled-components'
import { ArrowClicker } from '../../components'
import { MainText } from '../../styles'
import { ButtonWrapper } from './NFTButton'
import NFTImageCarouselItem from './NFTImageCarouselItem'
import { useDarkMode } from '../../context'

const products = [
  { id: 1, title: 'Corrupt Catz', pieces: 441 },
  { id: 2, title: 'Corrupt Catz', pieces: 441 },
  { id: 3, title: 'Corrupt Catz', pieces: 441 },
  { id: 4, title: 'Corrupt Catz', pieces: 441 },
  { id: 5, title: 'Corrupt Catz', pieces: 441 }
]

const CarouselWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 45px;
`

const HeaderCarousel = styled.div`
  display: flex;
  margin: 34px 0;
  align-items: center;
`

const TopArrow = styled(ArrowClicker)`
  width: 21px;
  flex: 1;
  align-self: center;
`

const LeftArrow = styled(ArrowClicker)`
  width: 14px;
  transform: rotateZ(90deg);
  margin-right: 16px;
`

const RightArrow = styled(ArrowClicker)`
  width: 14px;
  transform: rotateZ(270deg);
`

const TitleCarousel = MainText(styled.span`
  font-size: 18px;
  font-weight: bold;
  text-align: left;
  color: ${({ theme }) => theme.text1};
  flex: 1;
`)

const HeaderEndCarousel = styled.div`
  flex: 1;
  flex-direction: row;
  justify-content: flex-end;
  display: flex;
  align-items: center;
  padding-right: 16px;
`

const LaunchButton = styled(ButtonWrapper)`
  height: 40px;
  background-color: ${({ theme }) => theme.primary2};
  margin-right: 16px;
`

const SortButton = styled(ButtonWrapper)`
  height: 40px;
  background-color: ${({ theme }) => theme.secondary2};
  margin-right: 16px;
  justify-content: space-between;
`

const settings = {
  infinite: false,
  speed: 500,
  slidesToScroll: 2,
  snapCenter: true,
  initialSlide: 0,
  arrows: false,
  variableWidth: true
}

const NFTCarousel: FC<{ isLaunch?: boolean; showTopArrow?: boolean }> = ({ isLaunch, showTopArrow }) => {
  const slickRef = React.useRef<any>()
  const { mode } = useDarkMode()

  const slickNext = () => slickRef?.current?.slickNext()
  const slickPrev = () => slickRef?.current?.slickPrev()

  return (
    <CarouselWrapper>
      <HeaderCarousel>
        <TitleCarousel>Popular Collection</TitleCarousel>
        {showTopArrow && <TopArrow mode={mode} arrowRotation />}
        <HeaderEndCarousel>
          {isLaunch ? (
            <LaunchButton>
              <span>Launch your collection</span>
            </LaunchButton>
          ) : (
            <SortButton>
              <span>Sort by</span>
              <ArrowClicker />
            </SortButton>
          )}

          <LeftArrow mode={mode} onClick={slickPrev} />
          <RightArrow mode={mode} onClick={slickNext} />
        </HeaderEndCarousel>
      </HeaderCarousel>
      <Slider ref={slickRef} {...settings}>
        {products.map((item) => {
          return <NFTImageCarouselItem key={item.id} item={item} />
        })}
      </Slider>
    </CarouselWrapper>
  )
}

export default NFTCarousel
