import React, { FC } from 'react'
import styled from 'styled-components'
import { Connect } from './Connect'
import { More } from './More'
import { Tabs } from './Tabs'
import { useDarkMode } from '../../context'
import { APP_LAYOUT_HEADER_HEIGHT, CenteredDiv } from '../../styles'

const BRAND = styled.a`
  position: absolute;
  top: ${({ theme }) => theme.margins['5x']};
  ${({ theme }) => theme.flexCenter}
  width: auto;
  font-size: 40px;
  font-weight: bold;
  line-height: 20px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    left: ${({ theme }) => theme.margins['3x']};
    height: 40px;
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

const BUTTONS = styled(CenteredDiv)`
  position: absolute;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    right: ${({ theme }) => theme.margins['3x']};
    height: 40px;
  `}
  ${({ theme }) => theme.mediaWidth.fromSmall`
    right: 58px;
    height: 50px;
  `}
`

const WRAPPER = styled.nav`
  position: relative;
  ${({ theme }) => theme.flexCenter}
  width: 100%;
  height: ${APP_LAYOUT_HEADER_HEIGHT};
  padding: ${({ theme }) => theme.margins['4x']};
  background-color: ${({ theme }) => theme.bg2};
  z-index: 300;
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
        <Connect />
        <More />
      </BUTTONS>
    </WRAPPER>
  )
}
