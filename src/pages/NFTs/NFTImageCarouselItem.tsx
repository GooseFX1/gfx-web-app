import { Image, Progress } from 'antd'
import React from 'react'
import styled from 'styled-components'
import { useDarkMode } from '../../context'
import { MainText } from '../../styles'
import { colors } from '../../theme'
import { ButtonWrapper } from './NFTButton'

const CAROUSEL_IMAGE = styled(Image)`
  cursor: pointer;
  background-size: cover;
  height: 220px;
  width: auto;
  border-radius: 20px;
`

const CAROUSEL_LABEL = MainText(styled.div`
  font-size: 16px;
  font-weight: 600;
  text-align: left;
  color: ${({ theme }) => theme.text1};
  flex: 1;
`)

const CAROUSEL_SUB_TITLE = MainText(styled.div`
  font-size: 16px;
  font-weight: 500;
  text-align: left;
  color: ${({ theme }) => theme.text1};
  flex: 1;
  margin-top: 0.5rem;
`)

const CAROUSEL_ITEM = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 30;
  margin-right: 45px;
`

const UP_COMMING_FOOTER = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  ${({ theme }) => theme.margins['3.5x']};
`

const COUNT_DOWN_TEXT = MainText(styled.div`
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
`)

const LAUNCH_PAD_FOOTER = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: ${({ theme }) => theme.margins['3x']};
`

const PROGRESS_TEXT = MainText(styled.span`
  color: ${({ theme }) => theme.text2};
  font-size: 14px;
  margin-right: ${({ theme }) => theme.margins['1x']};
`)

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

const LaunchPadInfo = ({ item }: any) => {
  const { mode } = useDarkMode()
  return (
    <LAUNCH_PAD_FOOTER>
      <LEFT_INFO_LAUNCHPAD>
        <CAROUSEL_LABEL> {item.title}</CAROUSEL_LABEL>
        <PROGRESS_WRAPPER>
          <PROGRESS_TEXT>1120/1900</PROGRESS_TEXT>
          <Progress showInfo={false} percent={30} trailColor={colors(mode).searchbarBackground} strokeColor="#9625ae" />
        </PROGRESS_WRAPPER>
      </LEFT_INFO_LAUNCHPAD>
      <MINT_BUTTON>
        <span>Mint</span>
      </MINT_BUTTON>
    </LAUNCH_PAD_FOOTER>
  )
}

const UpCommingInfo = ({ item }: any) => {
  return (
    <UP_COMMING_FOOTER>
      <div>
        <CAROUSEL_LABEL> {item.title}</CAROUSEL_LABEL>
        <CAROUSEL_SUB_TITLE>{item.pieces} mint pieces</CAROUSEL_SUB_TITLE>
      </div>
      <COUNT_DOWN_TEXT>
        <span>Starts: 05d:10h:01min</span>
      </COUNT_DOWN_TEXT>
    </UP_COMMING_FOOTER>
  )
}

const NFTImageCarouselItem = ({ item }: any) => {
  return (
    <CAROUSEL_ITEM>
      <CAROUSEL_IMAGE
        preview={false}
        src="https://images.unsplash.com/photo-1634985492257-06c8ee26b770?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1932&q=80"
      />
      {/* <UpCommingInfo item={item} /> */}
      <LaunchPadInfo item={item} />
    </CAROUSEL_ITEM>
  )
}

export default NFTImageCarouselItem
