import React, { FC } from 'react'
import styled from 'styled-components'
import { Connect } from './Connect'
import { More } from './More'
import { Tabs } from './Tabs'
import { useDarkMode } from '../../context'
import { APP_LAYOUT_HEADER_HEIGHT, CenteredDiv } from '../../styles'

const BRAND = styled.a`
  ${({ theme }) => theme.flexCenter}
  float: left;
  width: auto;
  padding: ${({ theme }) => theme.margins['1x']};
  font-size: 40px;
  font-weight: bold;
  line-height: 20px;

  img {
    position: fixed;
    width: auto;
    object-fit: contain;

    ${({ theme }) => theme.mediaWidth.upToSmall`
      left: ${({ theme }) => theme.margins['2x']};
      height: 40px;
    `}
    ${({ theme }) => theme.mediaWidth.fromSmall`
      left: 50px;
      height: 50px;
    `}
  }
`

const BUTTONS = styled(CenteredDiv)`
  position: fixed;
  right: 50px;
`

const WRAPPER = styled.nav`
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
