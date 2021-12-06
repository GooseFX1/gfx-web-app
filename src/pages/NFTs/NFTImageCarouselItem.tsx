import { Image, Progress } from 'antd'
import React, { FC } from 'react'
import styled from 'styled-components'
import { useDarkMode } from '../../context'
import { colors } from '../../theme'
import { ButtonWrapper } from './NFTButton'
import { NFTCarouselType } from './NFTCarousel'
import { useHistory } from 'react-router'

const CAROUSEL_IMAGE = styled(Image)`
  cursor: pointer;
  background-size: cover;
  height: 220px;
  width: auto;
  border-radius: 20px;
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

const CAROUSEL_ITEM = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: ${({ theme }) => theme.margins['4x']}; ;
`

const UP_COMMING_FOOTER = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.margins['3.5x']};
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
  margin-top: ${({ theme }) => theme.margins['3x']};
`

const PROGRESS_TEXT = styled.span`
  color: ${({ theme }) => theme.text2};
  font-size: 14px;
  margin-right: ${({ theme }) => theme.margins['1x']};
`

const PROGRESS_WRAPPER = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  margin-top: ${({ theme }) => theme.margins['1x']}; ;
`

const MINT_BUTTON = styled(ButtonWrapper)`
  width: 120px;
  height: 40px;
  background-color: ${({ theme }) => theme.primary2};
  justify-content: center;
  align-items: center;
  margin-left: ${({ theme }) => theme.margins['3x']};
`

const LEFT_INFO_LAUNCHPAD = styled.div`
  flex: 1;
`
const POPULAR_FOOTER = styled.div`
  margin-top: ${({ theme }) => theme.margins['3x']};
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
        <CAROUSEL_LABEL> {item.title}</CAROUSEL_LABEL>
        <CAROUSEL_SUB_TITLE>{item.pieces} mint pieces</CAROUSEL_SUB_TITLE>
      </GROUP_BLOCK_TEXTS>
    </POPULAR_FOOTER>
  )
}

const NFTImageCarouselItem: FC<{ item: any; type?: NFTCarouselType }> = ({ item, type }) => {
  const history = useHistory()
  const goToCollection = () => history.push('/NFTs/collection')
  const renderItemFooter = () => {
    switch (type) {
      case NFTCarouselType.launchPad:
        return <LaunchPadInfo item={item} />
      case NFTCarouselType.upcomming:
        return <UpCommingInfo item={item} />
      case NFTCarouselType.popular:
        return <PopularInfo item={item} />
      default:
        return <LaunchPadInfo item={item} />
    }
  }
  return (
    <CAROUSEL_ITEM>
      <CAROUSEL_IMAGE
        preview={false}
        src="https://images.unsplash.com/photo-1634985492257-06c8ee26b770?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1932&q=80"
        onClick={goToCollection}
      />
      {renderItemFooter()}
    </CAROUSEL_ITEM>
  )
}

export default NFTImageCarouselItem
