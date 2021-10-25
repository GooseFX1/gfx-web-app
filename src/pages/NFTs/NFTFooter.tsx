import React from 'react'
import styled from 'styled-components'
import { ArrowClicker } from '../../components'
import { useDarkMode } from '../../context'
import { MainText } from '../../styles'
import FooterCarousel from './FooterCarousel'
import { ButtonWrapper } from './NFTButton'

const TopArrow = styled(ArrowClicker)`
  width: 21px;
  flex: 1;
  align-self: center;
  margin-bottom: 30px;
`

const SubscribeNewLetter = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60px 0 30px 0;
`

const FooterWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const SubscribeText = MainText(styled.span`
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  color: ${({ theme }) => theme.text1};
`)

const BottomFooter = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 0;
  padding: 40px 0;
  border-radius: 20px;
  background-image: linear-gradient(to bottom, #000, rgba(0, 0, 0, 0));
  justify-content: center;
  align-items: center;
`
const FooterText = MainText(styled.div<{ size: number }>`
  font-size: ${({ size }) => `${size}px`};
  font-weight: 500;
  text-align: center;
  color: ${({ theme }) => theme.text1};
`)

const FollowUsWrapper = styled.div`
  justify-content: center;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 43px;
`

const FollowUsButton = styled(ButtonWrapper)`
  background-color: ${({ theme }) => theme.secondary2};
  height: 60px;
  padding: 0 55px;
  margin-left: 30px;
`

const NFTFooter = () => {
  const { mode } = useDarkMode()
  return (
    <FooterWrapper>
      <SubscribeNewLetter>
        <TopArrow mode={mode} arrowRotation />
        <SubscribeText>Subscrbie to our newsletter.</SubscribeText>
      </SubscribeNewLetter>
      <BottomFooter>
        <FooterCarousel />
        <FooterText size={18}>Never miss any drop again!</FooterText>
        <FollowUsWrapper>
          <FooterText size={20}>Follow us in twitter! @gosefx1</FooterText>
          <FollowUsButton>
            <span>Follow Us</span>
          </FollowUsButton>
        </FollowUsWrapper>
      </BottomFooter>
    </FooterWrapper>
  )
}

export default NFTFooter
