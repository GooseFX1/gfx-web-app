/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, FC } from 'react'
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

const FooterCarousel: FC = () => {
  const { allCollections } = useNFTCollections()
  const [nfts, setNfts] = useState<NFTBaseCollection[]>([])

  useEffect(() => {
    setNfts(allCollections)
  }, [allCollections])

  return <FOOTER_LIST_CARD></FOOTER_LIST_CARD>
}

export default FooterCarousel
