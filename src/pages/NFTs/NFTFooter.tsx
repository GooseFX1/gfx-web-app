import React from 'react'
import styled from 'styled-components'
import { ArrowClicker } from '../../components'
import { useDarkMode } from '../../context'
import FooterCarousel from './FooterCarousel'
import { ButtonWrapper } from './NFTButton'

const TOP_ARROW = styled(ArrowClicker)`
  width: 21px;
  flex: 1;
  align-self: center;
  margin-bottom: 30px;
`

const SUBSCRIBE_NEW_LETTER = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60px 0 30px 0;
`

const FOOTER_WRAPPER = styled.div`
  display: flex;
  flex-direction: column;
`

const SUBSCRIBE_TEXT = styled.span`
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  color: ${({ theme }) => theme.text1};
`

const BOTTOM_FOOTER = styled.div<{ mode?: string }>`
  display: flex;
  flex-direction: column;
  flex-grow: 0;
  padding: 40px 0;
  border-radius: 20px;
  background-image: ${({ mode }) =>
    mode === 'dark'
      ? 'linear-gradient(to bottom, #000, rgba(0, 0, 0, 0))'
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
  margin-top: 43px;
`

const FOLLOW_US_BUTTON = styled(ButtonWrapper)`
  background-color: ${({ theme }) => theme.secondary2};
  height: 60px;
  padding: 0 55px;
  margin-left: 30px;
`

const NFTFooter = () => {
  const { mode } = useDarkMode()
  return (
    <FOOTER_WRAPPER>
      <SUBSCRIBE_NEW_LETTER>
        <TOP_ARROW mode={mode} arrowRotation />
        <SUBSCRIBE_TEXT>Subscrbie to our newsletter.</SUBSCRIBE_TEXT>
      </SUBSCRIBE_NEW_LETTER>
      <BOTTOM_FOOTER mode={mode}>
        <FooterCarousel />
        <FOOTER_TEXT size={18}>Never miss any drop again!</FOOTER_TEXT>
        <FOLLOW_US_WRAPPER>
          <FOOTER_TEXT size={20}>Follow us in twitter! @gosefx1</FOOTER_TEXT>
          <FOLLOW_US_BUTTON>
            <span>Follow Us</span>
          </FOLLOW_US_BUTTON>
        </FOLLOW_US_WRAPPER>
      </BOTTOM_FOOTER>
    </FOOTER_WRAPPER>
  )
}

export default NFTFooter
