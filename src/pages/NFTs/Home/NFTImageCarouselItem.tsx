import React, { FC } from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router'
import { COLLECTION_TYPES } from '../../../types/nft_collections.d'
import tw from 'twin.macro'

const CAROUSEL_ITEM = styled.div<{ $url: string }>`
  ${tw`sm:overflow-visible sm:min-w-[310px] sm:m-0 sm:mr-8`}
  width: 450px;
  height: 220px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  overflow: hidden;
  background: linear-gradient(rgb(0 0 0 / 2%), rgb(0 0 0 / 65%)), ${({ $url }) => `url(${$url})`}, center;
  background-size: auto 120%;
  margin: 0 ${({ theme }) => theme.margin(4)};
  cursor: pointer;

  &:hover {
    background: linear-gradient(rgb(0 0 0 / 2%), rgb(0 0 0 / 50%)), ${({ $url }) => `url(${$url})`}, center;
    background-size: auto 120%;
  }
`

const TITLE = styled.h3`
  color: white;
  font-style: normal;
  font-weight: 600;
  font-size: 42px;
  line-height: 51px;
  text-align: center;
`

const NFTImageCarouselItem: FC<{ item: any; type: string }> = ({ item, type }) => {
  const history = useHistory()

  const goToCollection = () => {
    switch (type) {
      case COLLECTION_TYPES.NFT_COLLECTION:
      case COLLECTION_TYPES.NFT_FEATURED_COLLECTION:
        history.push(`/NFTs/collection/${item.collection_name.replaceAll(' ', '_')}`)
        break
      case COLLECTION_TYPES.NFT_UPCOMING_COLLECTION:
        history.push(`/NFTs/collection/${item.collection_name.replaceAll(' ', '_')}`)
        break
      default:
        console.error('Error: NFT Collection type not correct')
    }
  }

  // TODO: return placeholder image for  default case and case of item.banner being an empty string
  const renderImage = () => {
    switch (type) {
      case COLLECTION_TYPES.NFT_COLLECTION:
        return item.banner_link.length > 0 ? item.banner_link : item.profile_pic_link
      case COLLECTION_TYPES.NFT_UPCOMING_COLLECTION:
        return item.upcoming_collection_banner_url
      case COLLECTION_TYPES.NFT_FEATURED_COLLECTION:
        return item.featured_collection_banner_url
      default:
        return ''
    }
  }

  return (
    <CAROUSEL_ITEM $url={renderImage()} onClick={goToCollection}>
      <TITLE>{item.collection_name}</TITLE>
    </CAROUSEL_ITEM>
  )
}

export default NFTImageCarouselItem
