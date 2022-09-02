import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { ISingleNFT } from '../../../types/nft_details.d'
import { Image } from 'antd'
import { NFT_API_ENDPOINTS, fetchSingleCollectionBySalesType } from '../../../api/NFTs'
import { SkeletonCommon } from '../Skeleton/SkeletonCommon'

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
  const [nfts, setNfts] = useState<Array<ISingleNFT>>([])
  const [err, setErr] = useState(false)

  useEffect(() => {
    // the numbers are collection ids for the nfts rendered in the footer
    const nfts = Promise.all(
      ['1', '4', '7'].map((id) => fetchSingleCollectionBySalesType(NFT_API_ENDPOINTS.OPEN_BID, id))
    )

    nfts.then((res) => {
      try {
        const nfts = res.map((collection) => collection.data.open_bid.slice(0, 4))
        setNfts(nfts.flat())
      } catch (error) {
        console.error(error)
        setErr(true)
      }
    })

    return () => {}
  }, [])

  return (
    <FOOTER_LIST_CARD>
      {nfts.length === 0 ? (
        Array.apply('null', Array(12)).map((num, i) => (
          <div key={i} style={{ margin: '0 24px' }}>
            <SkeletonCommon width="110px" height="110px" borderRadius="10px" />
          </div>
        ))
      ) : err ? (
        <div>error loading nfts</div>
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
