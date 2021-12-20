import React, { FC } from 'react'
import styled from 'styled-components'
import { Connect } from './Connect'
import { GoFX } from './GoFX'
import { More } from './More'
import { Tabs } from './Tabs'
import { useDarkMode } from '../../context'
import { APP_LAYOUT_HEADER_HEIGHT, CenteredDiv } from '../../styles'

const BRAND = styled.a`
  position: absolute;
  top: ${({ theme }) => theme.margins['2x']};
  ${({ theme }) => theme.flexCenter}
  width: 62px;
  font-size: 40px;
  font-weight: bold;
  line-height: 20px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    position: relative;
    top: ${({ theme }) => theme.margins['1x']};
    height: 40px;
    margin-bottom: ${({ theme }) => theme.margins['3x']};
  `}

  ${({ theme }) => theme.mediaWidth.fromSmall`
    left: 58px;
    height: 50px;
  `}

  img {
    ${({ theme }) => theme.measurements('inherit')}
    object-fit: contain;
  }
`

const RefreshWrapper = styled.a``

const BUTTONS = styled(CenteredDiv)`
  position: absolute;

  > *:not(:last-child) {
    margin-right: ${({ theme }) => theme.margins['2x']};
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    position: relative;

    > *:not(:last-child) {
      margin-right: ${({ theme }) => theme.margins['1x']};
    }
  `}

  ${({ theme }) => theme.mediaWidth.fromSmall`
    right: 58px;
    height: 50px;
  `}
`

const WRAPPER = styled.nav`
  position: relative;
  width: 100%;
  ${({ theme }) => theme.headerRoundedBorders}
  background-color: ${({ theme }) => theme.bg3};
  ${({ theme }) => theme.smallShadow}
  z-index: 300;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    ${({ theme }) => theme.flexColumnNoWrap};
    height: auto;
    padding: ${({ theme }) => theme.margins['1x']};
  `}
  ${({ theme }) => theme.mediaWidth.fromSmall`
    ${({ theme }) => theme.flexCenter}
  `}
`

export const Header: FC = () => {
  const { mode } = useDarkMode()

  return (
    <WRAPPER id="menu">
      <BRAND href="/">
        <img
          id="logo"
          srcSet={`${process.env.PUBLIC_URL}/img/assets/gfx_logo_gradient_${mode}@3x.webp 232w,
               ${process.env.PUBLIC_URL}/img/assets/gfx_logo_gradient_${mode}@2x.webp 155w,
               ${process.env.PUBLIC_URL}/img/assets/gfx_logo_gradient_${mode}.webp 78w`}
          src={`${process.env.PUBLIC_URL}/img/assets/gfx_logo_gradient_${mode}.webp`}
          alt="GFX Logo"
        />
      </BRAND>
      <Tabs />
      <BUTTONS>
        <RefreshWrapper href="/">
          <img src={`${process.env.PUBLIC_URL}/img/assets/refresh.svg`} alt="" />
        </RefreshWrapper>
        <Connect />
        <More />
      </BUTTONS>
    </WRAPPER>
  )
}
