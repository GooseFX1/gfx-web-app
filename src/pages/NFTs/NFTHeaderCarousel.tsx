import React, { FC } from 'react'
import styled from 'styled-components'
import Slider from 'react-slick'
import { ButtonWrapper } from './NFTButton'

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false
}

const dummyData = [
  {
    id: 1,
    text: (
      <span>
        Become <br /> a verified creator
      </span>
    )
  },
  {
    id: 2,
    text: (
      <span>
        Become <br /> a verified creator
      </span>
    )
  },
  {
    id: 3,
    text: (
      <span>
        Become <br /> a verified creator
      </span>
    )
  }
]

const dummySmallData = [
  {
    id: 1,
    text: <span>0xBanana</span>
  },
  {
    id: 2,
    text: <span>0xBanana</span>
  },
  {
    id: 3,
    text: <span>0xBanana</span>
  }
]

const HEADER_SLIDER = styled(Slider)`
  .slick-dots {
    bottom: 15px !important;
  }
  .slick-dots li.slick-active button:before {
    color: white !important;
    width: 10px;
  }

  .slick-dots li button:before {
    color: white !important;
    width: 10px;
  }

  .slick-dots li {
    color: white !important;
    width: 10px;
    margin: 0;
    padding: 0;
  }
`

const HEADER_BIG_SLIDER = styled(HEADER_SLIDER)<{ isBigVisible: boolean }>`
  visibility: ${(props) => (props.isBigVisible ? 'visible' : 'hidden')};
  transition: all 300ms;
  transform: ${(props) => (props.isBigVisible ? 'scale(1)' : 'scale(0)')};
  z-index: 2;
`

const HEADER_SMALL_SLIDER = styled(HEADER_SLIDER)<{ isBigVisible: boolean }>`
  visibility: ${(props) => (!props.isBigVisible ? 'visible' : 'hidden')};
  transition: all 300ms ${(props) => (!props.isBigVisible ? 'ease-in' : 'ease-out')};
  transform: ${(props) => (!props.isBigVisible ? 'scale(1)' : 'scale(0)')};
  height: ${(props) => (!props.isBigVisible ? '100px !important' : '0px !important')};
  margin-top: ${(props) => (!props.isBigVisible ? '-5px' : '0')};
`

const BIG_SLIDER_WRAPPER = styled.div<{ imgUrl: string }>`
  background-image: url(${({ imgUrl }) => imgUrl});
  height: 400px;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  border-radius: 0 0 20px 20px;
`
const SMALL_SLIDER_WRAPPER = styled.div<{ imgUrl: string; isBigVisible: boolean }>`
  background-image: url(${({ imgUrl }) => imgUrl});
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  justify-content: center !important;
  height: ${(props) => (!props.isBigVisible ? '100px !important' : '0px !important')};
  margin-top: ${(props) => (!props.isBigVisible ? '-5px' : '0')};
  position: relative;
`

const CENTER_SMALL_TEXT = styled.div`
  span {
    font-family: Montserrat;
    font-size: 20px;
    font-weight: 600;
  }
`

const CENTER_TEXT = styled.div`
  width: 350px;
  span {
    font-family: Montserrat;
    font-size: 40px;
    font-weight: 600;
  }
`

const BUTTON_APPLY = styled(ButtonWrapper)`
  background-color: ${({ theme }) => theme.primary2};
  padding: ${({ theme }) => `${theme.margin(1.5)}  ${theme.margin(7)}`};
  margin-top: ${({ theme }) => theme.margin(6)};
`

const BUTTON_EXPLORE = styled(ButtonWrapper)`
  background-color: ${({ theme }) => theme.primary2};
  padding: ${({ theme }) => `${theme.margin(1.5)}  ${theme.margin(2)}`};
  position: absolute;
  right: 70px;
`

const NFTHeaderCarousel: FC<{ isBig?: boolean; isBigVisible?: boolean }> = ({ isBig, isBigVisible }) => {
  return isBig ? (
    <HEADER_BIG_SLIDER isBigVisible={isBigVisible} {...settings}>
      {dummyData.map((dummy) => {
        return (
          <BIG_SLIDER_WRAPPER key={dummy.id} imgUrl={`/img/assets/image.png`}>
            <CENTER_TEXT>{dummy.text}</CENTER_TEXT>
            <BUTTON_APPLY>
              <span>Apply</span>
            </BUTTON_APPLY>
          </BIG_SLIDER_WRAPPER>
        )
      })}
    </HEADER_BIG_SLIDER>
  ) : (
    <HEADER_SMALL_SLIDER isBigVisible={isBigVisible} {...settings}>
      {dummySmallData.map((dummy) => {
        return (
          <SMALL_SLIDER_WRAPPER
            isBigVisible={isBigVisible}
            key={dummy.id}
            imgUrl={`/img/assets/image.png`}
            // imgUrl={`https://placeimg.com/1250/513`}
          >
            <CENTER_SMALL_TEXT>{dummy.text}</CENTER_SMALL_TEXT>
            <BUTTON_EXPLORE>
              <span>Explore Collection</span>
            </BUTTON_EXPLORE>
          </SMALL_SLIDER_WRAPPER>
        )
      })}
    </HEADER_SMALL_SLIDER>
  )
}

export default NFTHeaderCarousel
