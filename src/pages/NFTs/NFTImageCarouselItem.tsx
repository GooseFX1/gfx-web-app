import { Image, Progress } from 'antd'
import React, { FC } from 'react'
import styled from 'styled-components'
import { useDarkMode } from '../../context'
import { colors } from '../../theme'
import { ButtonWrapper } from './NFTButton'
import { useHistory } from 'react-router'
import { COLLECTION_TYPES } from '../../types/nft_collections.d'

const CAROUSEL_ITEM = styled.div<{ $url: string }>`
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
`

const TITLE = styled.h3`
  color: white;
  font-style: normal;
  font-weight: 600;
  font-size: 42px;
  line-height: 51px;
  text-align: center;
`

const CAROUSEL_LABEL = styled.span`
  font-size: 16px;
  font-weight: 600;
  text-align: left;
  color: ${({ theme }) => theme.text1};
  flex: 1;
`

const CAROUSEL_SUB_TITLE = styled.span`
  font-size: 16px;
  font-weight: 500;
  text-align: left;
  color: ${({ theme }) => theme.text1};
  flex: 1;
  margin-top: 0.5rem;
`

const UP_COMMING_FOOTER = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.margin(3.5)};
`
const GROUP_BLOCK_TEXTS = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`

const COUNT_DOWN_TEXT = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.text1};
  font-weight: 500;
  border-radius: 45px;
  background-color: #101010;
  padding: 6px 15px 6px 15px;
  justify-content: center;
  align-items: center;
  align-self: flex-start;
  span {
    color: white;
  }
`

const LAUNCH_PAD_FOOTER = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: ${({ theme }) => theme.margin(3)};
`

const PROGRESS_TEXT = styled.span`
  color: ${({ theme }) => theme.text2};
  font-size: 14px;
  margin-right: ${({ theme }) => theme.margin(1)};
`

const PROGRESS_WRAPPER = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  margin-top: ${({ theme }) => theme.margin(1)}; ;
`

const MINT_BUTTON = styled(ButtonWrapper)`
  width: 120px;
  height: 40px;
  background-color: ${({ theme }) => theme.primary2};
  justify-content: center;
  align-items: center;
  margin-left: ${({ theme }) => theme.margin(3)};
`

const LEFT_INFO_LAUNCHPAD = styled.div`
  flex: 1;
`
const POPULAR_FOOTER = styled.div`
  margin-top: ${({ theme }) => theme.margin(3)};
`

const LaunchPadInfo = ({ item }: any) => {
  const { mode } = useDarkMode()
  const history = useHistory()
  const goToMint = () => history.push('/NFTs/profile/mint-NFT')
  return (
    <LAUNCH_PAD_FOOTER>
      <LEFT_INFO_LAUNCHPAD>
        <CAROUSEL_LABEL> {item.title}</CAROUSEL_LABEL>
        <PROGRESS_WRAPPER>
          <PROGRESS_TEXT>1120/1900</PROGRESS_TEXT>
          <Progress showInfo={false} percent={30} trailColor={colors(mode).searchbarBackground} strokeColor="#9625ae" />
        </PROGRESS_WRAPPER>
      </LEFT_INFO_LAUNCHPAD>
      <MINT_BUTTON onClick={goToMint}>
        <span>Mint</span>
      </MINT_BUTTON>
    </LAUNCH_PAD_FOOTER>
  )
}

const UpCommingInfo = ({ item }: any) => {
  return (
    <UP_COMMING_FOOTER>
      <GROUP_BLOCK_TEXTS>
        <CAROUSEL_LABEL> {item.title}</CAROUSEL_LABEL>
        <CAROUSEL_SUB_TITLE>{item.pieces} mint pieces</CAROUSEL_SUB_TITLE>
      </GROUP_BLOCK_TEXTS>
      <COUNT_DOWN_TEXT>
        <span>Starts: 05d:10h:01min</span>
      </COUNT_DOWN_TEXT>
    </UP_COMMING_FOOTER>
  )
}

const PopularInfo = ({ item }: any) => {
  return (
    <POPULAR_FOOTER>
      <GROUP_BLOCK_TEXTS>
        <CAROUSEL_LABEL> {item.featured_collection_name}</CAROUSEL_LABEL>
        <CAROUSEL_SUB_TITLE>{item.pieces} mint pieces</CAROUSEL_SUB_TITLE>
      </GROUP_BLOCK_TEXTS>
    </POPULAR_FOOTER>
  )
}

const NFTImageCarouselItem: FC<{ item: any; type: string }> = ({ item, type }) => {
  const history = useHistory()

  const goToCollection = () => {
    switch (type) {
      case COLLECTION_TYPES.NFT_COLLECTION:
      case COLLECTION_TYPES.NFT_FEATURED_COLLECTION:
        history.push(`/NFTs/collection/${item.collection_id}`)
        break
      case COLLECTION_TYPES.NFT_UPCOMING_COLLECTION:
        history.push(`/NFTs/collection/${item.upcoming_id}`)
        break
      default:
        console.error('Error: NFT Collection type not correct')
    }
  }

  const renderItemFooter = () => {
    switch (type) {
      case COLLECTION_TYPES.NFT_COLLECTION:
        return <LaunchPadInfo item={item} />
      case COLLECTION_TYPES.NFT_UPCOMING_COLLECTION:
        return <UpCommingInfo item={item} />
      case COLLECTION_TYPES.NFT_FEATURED_COLLECTION:
        return <PopularInfo item={item} />
      default:
        return <LaunchPadInfo item={item} />
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
      {/* <CAROUSEL_IMAGE preview={false} src={renderImage()} onClick={goToCollection} /> */}
      {/* {renderItemFooter()} */}
    </CAROUSEL_ITEM>
  )
}

export default NFTImageCarouselItem
