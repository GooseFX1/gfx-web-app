import React, { useEffect, useState } from 'react'
import Slider from 'react-slick'
import styled from 'styled-components'
import { ISingleNFT } from '../../types/nft_details.d'
import { Image } from 'antd'
import { useHistory } from 'react-router-dom'
import { NFT_API_ENDPOINTS, fetchSingleCollectionTabContent } from '../../api/NFTs'

const FOOTER_SLIDER = styled(Slider)`
  width: 100%;
  margin-bottom: ${({ theme }) => theme.margins['6x']};
  padding: 0 ${({ theme }) => theme.margins['11x']};
  .slick-arrow {
    width: 40px;
    height: 40px;
    z-index: 10;
    &:before {
      font-size: 40px;
    }
  }
  .slick-prev {
    left: 20px;
  }
  .slick-next {
    right: 35px;
  }
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
  const [nfts, setNfts] = useState<Array<ISingleNFT>>()
  const [err, setErr] = useState(false)

  useEffect(() => {
    fetchSingleCollectionTabContent(NFT_API_ENDPOINTS.OPEN_BID, `2`).then((res) => {
      if (res.response && res.response.status !== 200) {
        setErr(true)
      }
      setNfts((res.data || []).slice(0, 25))
    })

    return () => {}
  }, [])

  const handleItemClick = (id: number) => {
    history.push(`/NFTs/fixed-price/${id}`)
  }

  return (
    <FOOTER_SLIDER {...settings}>
      {nfts === undefined ? (
        <div>...loading</div>
      ) : err ? (
        <div>error loading random nfts</div>
      ) : (
        nfts.map((item: ISingleNFT) => (
          <div key={item.non_fungible_id}>
            <FOOTER_IMAGE preview={false} src={item.image_url} onClick={(e) => handleItemClick(item.non_fungible_id)} />
          </div>
        ))
      )}
    </FOOTER_SLIDER>
  )
}

export default FooterCarousel
