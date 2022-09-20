import React, { FC } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import styled from 'styled-components'
import { ArrowClicker } from '../../../components'
import { Card } from '../Collection/Card'
import { checkMobile } from '../../../utils'
import tw from 'twin.macro'

const CAROUSEL_WRAPPER = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px 0 16px 32px;

  .card-image {
    ${tw`h-[300px]`}
  }
`

const HEADER_CAROUSEL = styled.div`
  display: flex;
  margin: ${({ theme }) => theme.margin(4)} 0;
  align-items: center;
`
const ROW = styled.div`
  ${tw`flex overflow-x-scroll`}

  ::-webkit-scrollbar {
    display: none;
  }
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

const CARD_WRAPPER = styled.div`
  .card {
    ${tw`sm:mx-0`}
    margin: 0 32px;
    width: 332px;
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

export interface IOneOfOnesNFTs {
  items: Array<any>
  title?: string
}

const OneOfOnesNFTs: FC<IOneOfOnesNFTs> = ({ items, title }) => {
  const slickRef = React.useRef<any>()

  const slickNext = () => slickRef?.current?.slickNext()
  const slickPrev = () => slickRef?.current?.slickPrev()

  const isEmpty = items.length === 0

  if (!isEmpty) {
    return (
      <CAROUSEL_WRAPPER>
        <HEADER_CAROUSEL>
          {title !== undefined && <TITLE_CAROUSEL>{title}</TITLE_CAROUSEL>}
          {!checkMobile() ? (
            <HEADER_END_CAROUSEL>
              <LEFT_ARROW onClick={slickPrev} />
              <RIGHT_ARROW onClick={slickNext} />
            </HEADER_END_CAROUSEL>
          ) : (
            <></>
          )}
        </HEADER_CAROUSEL>
        {!checkMobile() ? (
          <Slider ref={slickRef} {...settings}>
            {items.map((item: any) => (
              <CARD_WRAPPER key={item.uuid} style={{ minWidth: '300px', margin: '0 32px !important' }}>
                <Card singleNFT={item} />
              </CARD_WRAPPER>
            ))}
          </Slider>
        ) : (
          <ROW>
            {items.map((item: any) => (
              <CARD_WRAPPER key={item.uuid} style={{ marginRight: '10px' }}>
                <Card singleNFT={item} />
              </CARD_WRAPPER>
            ))}
          </ROW>
        )}
      </CAROUSEL_WRAPPER>
    )
  } else {
    return <></>
  }
}

export default OneOfOnesNFTs
