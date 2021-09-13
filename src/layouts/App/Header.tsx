import React, { FC } from 'react'
import styled from 'styled-components'
import { Connect } from './Connect'
import { More } from './More'
import { Tabs } from './Tabs'
import { useDarkMode } from '../../context'
import { Brand, CenteredDiv, NavBar } from '../../styles'

const BUTTONS = styled(CenteredDiv)`
  position: fixed;
  right: 50px;
`

const WRAPPER = styled(NavBar)`
  justify-content: center;
  padding: ${({ theme }) => theme.margins['4x']};
  background-color: ${({ theme }) => theme.bg2};
`

export const Header: FC = () => {
  const { mode } = useDarkMode()

  return (
    <WRAPPER id="menu">
      <Brand href="/">
        <img
          id="logo"
          srcSet={`${process.env.PUBLIC_URL}/img/assets/gfx_logo_gradient_${mode}@3x.webp 232w,
               ${process.env.PUBLIC_URL}/img/assets/gfx_logo_gradient_${mode}@2x.webp 155w,
               ${process.env.PUBLIC_URL}/img/assets/gfx_logo_gradient_${mode}.webp 78w`}
          src={`${process.env.PUBLIC_URL}/img/assets/gfx_logo_gradient_${mode}.webp`}
          alt="GFX Logo"
        />
      </Brand>
      <Tabs />
      <BUTTONS>
        <Connect />
        <More />
      </BUTTONS>
    </WRAPPER>
  )
}
