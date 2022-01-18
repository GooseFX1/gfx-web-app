import React from 'react'
import Slider from 'react-slick'
import styled from 'styled-components'
import { ISingleNFT } from '../../types/nft_details.d'
import { Image } from 'antd'
import { useHistory } from 'react-router-dom'

const products: Array<ISingleNFT> = [
  {
    non_fungible_id: 11,
    nft_name: 'Thugbirdz #1234',
    nft_description: 'A premint thugbird',
    mint_address: '4puafxtL1437aibBy4pCteADWjja9aQvygD9LhkwRMG5',
    metadata_url: 'RANDOM_URL',
    image_url: null,
    animation_url: null,
    collection_id: 14
  },
  {
    non_fungible_id: 11,
    nft_name: 'Thugbirdz #1234',
    nft_description: 'A premint thugbird',
    mint_address: '4puafxtL1437aibBy4pCteADWjja9aQvygD9LhkwRMG5',
    metadata_url: 'RANDOM_URL',
    image_url: null,
    animation_url: null,
    collection_id: 14
  },
  {
    non_fungible_id: 11,
    nft_name: 'Thugbirdz #1234',
    nft_description: 'A premint thugbird',
    mint_address: '4puafxtL1437aibBy4pCteADWjja9aQvygD9LhkwRMG5',
    metadata_url: 'RANDOM_URL',
    image_url: null,
    animation_url: null,
    collection_id: 14
  }
]

const FOOTER_SLIDER = styled(Slider)`
  width: 100%;
  margin-bottom: 48px;
`

const FOOTER_IMAGE = styled(Image)`
  width: 110px;
  aspect-ratio: 1;
  border-radius: 10px;
  margin-right: 50px;
`

const settings = {
  variableWidth: true,
  infinite: false,
  slidesToScroll: 2
}

const FooterCarousel = () => {
  const history = useHistory()

  const handleItemClick = (id: number) => {
    history.push('/NFTs/live-auction/11')
  }

  return (
    <FOOTER_SLIDER {...settings}>
      {products.map((item: ISingleNFT) => {
        return (
          <div key={item.non_fungible_id}>
            <FOOTER_IMAGE
              preview={false}
              src={`${process.env.PUBLIC_URL}/img/assets/footer-demo.png`}
              onClick={(e) => handleItemClick(item.non_fungible_id)}
            />
          </div>
        )
      })}
    </FOOTER_SLIDER>
  )
}

export default FooterCarousel
