import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { ISingleNFT } from '../../types/nft_details.d'
import { Image } from 'antd'
import { NFT_API_ENDPOINTS, fetchSingleCollectionBySalesType } from '../../api/NFTs'

const FOOTER_LIST_CARD = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.margin(6)};
  padding: 0 ${({ theme }) => theme.margin(11)};
`

const FOOTER_IMAGE = styled(Image)`
  width: 110px;
  aspect-ratio: 1;
  border-radius: 10px;
  margin: 0 ${({ theme }) => theme.margin(3)};
`

const FooterCarousel = () => {
  const [nfts, setNfts] = useState<Array<ISingleNFT>>()
  const [err, setErr] = useState(false)

  useEffect(() => {
    fetchSingleCollectionBySalesType(NFT_API_ENDPOINTS.OPEN_BID, '2').then((res) => {
      if ((res.response && res.response.status !== 200) || res.isAxiosError) {
        setErr(true)
      } else {
        setNfts(res.data.open_bid.slice(0, 10))
      }
    })

    return () => {}
  }, [])

  return (
    <FOOTER_LIST_CARD>
      {nfts === undefined ? (
        Array.apply('null', Array(10)).map((i) => (
          <div key={i}>
            <FOOTER_IMAGE preview={false} src={`${window.origin}/img/assets/nft-preview.svg`} />
          </div>
        ))
      ) : err ? (
        <div>error loading random nfts</div>
      ) : (
        nfts.map((item: ISingleNFT) => (
          <div key={item.non_fungible_id}>
            <FOOTER_IMAGE preview={false} src={item.image_url} />
          </div>
        ))
      )}
    </FOOTER_LIST_CARD>
  )
}

export default FooterCarousel
