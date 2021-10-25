import { Image } from 'antd'
import React from 'react'
import styled from 'styled-components'
import { MainText } from '../../styles'

const CarouselImage = styled(Image)`
  cursor: pointer;
  background-size: cover;
  height: 220px;
  width: auto;
  border-radius: 20px;
  margin-right: 45px;
`

const CarouselLabel = MainText(styled.div`
  font-size: 16px;
  font-weight: 600;
  text-align: left;
  color: ${({ theme }) => theme.text1};
  flex: 1;
  margin-top: 27px;
`)

const CarouselSubTitle = MainText(styled.div`
  font-size: 16px;
  font-weight: 500;
  text-align: left;
  color: ${({ theme }) => theme.text1};
  flex: 1;
  margin-top: 0.5rem;
`)

const CarouselItem = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 30;
`

const NFTImageCarouselItem = ({ item }: any) => {
  return (
    <CarouselItem>
      <CarouselImage
        preview={false}
        src="https://images.unsplash.com/photo-1634985492257-06c8ee26b770?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1932&q=80"
      />
      <CarouselLabel> {item.title}</CarouselLabel>
      <CarouselSubTitle>{item.pieces} pieces</CarouselSubTitle>
    </CarouselItem>
  )
}

export default NFTImageCarouselItem
