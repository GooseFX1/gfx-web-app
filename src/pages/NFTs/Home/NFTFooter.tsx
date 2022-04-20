import React from 'react'
import styled from 'styled-components'
import { useDarkMode } from '../../../context'
import FooterCarousel from './FooterCarousel'
import { SOCIAL_MEDIAS } from '../../../constants'
const FOOTER_WRAPPER = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: ${({ theme }) => theme.margin(10)};
`

const BOTTOM_FOOTER = styled.div<{ mode?: string }>`
  display: flex;
  flex-direction: column;
  flex-grow: 0;
  padding: 40px 0;
  border-radius: 20px;
  background-image: ${({ mode }) =>
    mode === 'dark'
      ? 'linear-gradient(180deg, #444444 0%, rgba(0, 0, 0, 0) 100%)'
      : 'linear-gradient(to bottom, #e0e0e0, #fff 20%)'};
  justify-content: center;
  align-items: center;
`
const FOOTER_TEXT = styled.span<{ size: number }>`
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
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  height: 60px;
  padding: 0 55px;
  color: white;
  background-color: ${({ theme }) => theme.secondary2};
  transition: all ${({ theme }) => theme.mainTransitionTime} ease-in-out;
  ${({ theme }) => theme.roundedBorders};
  box-shadow: 0 0 0 0 transparent;
  :hover {
    color: white;
    box-shadow: 0 3px 6px 1px #00000045;
  }
`

const NFTFooter = () => {
  const { mode } = useDarkMode()
  return (
    <FOOTER_WRAPPER>
      <BOTTOM_FOOTER mode={mode}>
        <FooterCarousel />
        <FOOTER_TEXT size={18}>Never miss any drop again!</FOOTER_TEXT>
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
