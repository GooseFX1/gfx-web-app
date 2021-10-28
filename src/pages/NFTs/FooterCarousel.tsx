import React from 'react'
import Slider from 'react-slick'
import FooterCarouselItem from './FooterCarouselItem'
import styled from 'styled-components'

const products = [
  { id: 1, title: 'Corrupt Catz', pieces: 441 },
  { id: 2, title: 'Corrupt Catz', pieces: 441 },
  { id: 3, title: 'Corrupt Catz', pieces: 441 },
  { id: 4, title: 'Corrupt Catz', pieces: 441 },
  { id: 5, title: 'Corrupt Catz', pieces: 441 },
  { id: 6, title: 'Corrupt Catz', pieces: 441 },
  { id: 7, title: 'Corrupt Catz', pieces: 441 },
  { id: 8, title: 'Corrupt Catz', pieces: 441 },
  { id: 9, title: 'Corrupt Catz', pieces: 441 },
  { id: 10, title: 'Corrupt Catz', pieces: 441 },
  { id: 11, title: 'Corrupt Catz', pieces: 441 },
  { id: 12, title: 'Corrupt Catz', pieces: 441 },
  { id: 13, title: 'Corrupt Catz', pieces: 441 },
  { id: 14, title: 'Corrupt Catz', pieces: 441 },
  { id: 15, title: 'Corrupt Catz', pieces: 441 },
  { id: 16, title: 'Corrupt Catz', pieces: 441 }
]

const FOOTER_SLIDER = styled(Slider)`
  width: 100%;
  margin-bottom: 48px;
`

const settings = {
  variableWidth: true,
  infinite: false,
  slidesToScroll: 2
}

const FooterCarousel = () => {
  return (
    <FOOTER_SLIDER {...settings}>
      {products.map((item) => {
        return <FooterCarouselItem key={item.id} item={item} />
      })}
    </FOOTER_SLIDER>
  )
}

export default FooterCarousel
