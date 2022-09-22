import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Image } from 'antd'
import { useNFTCollections } from '../../../context'
import { NFTBaseCollection } from '../../../types/nft_collections.d'
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
  const { allCollections } = useNFTCollections()
  const [nfts, setNfts] = useState<NFTBaseCollection[]>([])

  useEffect(() => {
    setNfts(allCollections)
  }, [allCollections])

  return (
    <FOOTER_LIST_CARD>
      {nfts.length === 0
        ? Array.apply('null', Array(12)).map((num, i) => (
            <div key={i} style={{ margin: '0 24px' }}>
              <SkeletonCommon width="110px" height="110px" borderRadius="10px" />
            </div>
          ))
        : nfts.map((collection: NFTBaseCollection) => (
            <div key={collection.uuid}>
              <FOOTER_IMAGE preview={false} src={collection.profile_pic_link} />
            </div>
          ))}
    </FOOTER_LIST_CARD>
  )
}

export default FooterCarousel
