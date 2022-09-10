import React from 'react'
import styled from 'styled-components'
import { useDarkMode } from '../../../context'
import FooterCarousel from './FooterCarousel'
import { SOCIAL_MEDIAS } from '../../../constants'
import { checkMobile } from '../../../utils'
import tw from 'twin.macro'

const FOOTER_WRAPPER = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: ${({ theme }) => theme.margin(10)};
`

const BOTTOM_FOOTER = styled.div<{ mode?: string }>`
  ${tw`sm:pt-[51px] sm:pb-[27px]`}
  display: flex;
  flex-direction: column;
  flex-grow: 0;
  padding: 40px 0;
  border-radius: 20px 20px 0 0;
  background-image: ${({ mode }) =>
    mode === 'dark'
      ? 'linear-gradient(180deg, #444444 0%, rgba(0, 0, 0, 0) 100%)'
      : 'linear-gradient(to bottom, #e0e0e0, #fff 20%)'};
  justify-content: center;
  align-items: center;
`
const FOOTER_TEXT = styled.span<{ size: number }>`
  ${tw`sm:font-semibold`}
  font-size: ${({ size }) => `${size}px`};
  font-weight: 500;
  text-align: center;
  color: ${({ theme }) => theme.text1};
`

const FOLLOW_US_WRAPPER = styled.div`
  justify-content: center;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: ${({ theme }) => theme.margin(3.5)};
`

const FOLLOW_US_BUTTON = styled.a`
  ${tw`sm:h-[45px] sm:w-[156px] sm:p-0`}
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  height: 60px;
  padding: 0 55px;
  color: white;
  background: linear-gradient(to left, rgb(88, 85, 255), rgb(220, 31, 255));
  ${({ theme }) => theme.roundedBorders};
  box-shadow: 0 0 0 0 transparent;
  :hover {
    color: white;
    box-shadow: 0 3px 6px 1px #00000045;
  }
  > span {
    ${tw`sm:font-semibold sm:text-tiny`}
  }
`

const NFTFooter = () => {
  const { mode } = useDarkMode()
  return (
    <FOOTER_WRAPPER>
      <BOTTOM_FOOTER mode={mode}>
        <FooterCarousel />
        <FOOTER_TEXT size={checkMobile() ? 20 : 18}>Never miss any drop again!</FOOTER_TEXT>
        <FOLLOW_US_WRAPPER>
          <FOLLOW_US_BUTTON href={SOCIAL_MEDIAS.twitter} target={'_blank'}>
            <span>Follow Us</span>
          </FOLLOW_US_BUTTON>
        </FOLLOW_US_WRAPPER>
      </BOTTOM_FOOTER>
    </FOOTER_WRAPPER>
  )
}

export default NFTFooter
