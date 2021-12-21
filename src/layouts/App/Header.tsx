import React, { FC, useState } from 'react'
import styled from 'styled-components'
import { Connect } from './Connect'
import { More } from './More'
import { Tabs } from './Tabs'
import { useDarkMode } from '../../context'
import { SVGToGrey2, CenteredDiv } from '../../styles'

const BRAND = styled.a`
  position: absolute;
  top: ${({ theme }) => theme.margins['3x']};
  ${({ theme }) => theme.flexCenter}
  width: 84px;
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

const RefreshWrapper = styled.a`
  padding: 14px;
`

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

const CollapsibleWrapper = styled.div`
  position: absolute;
  width: 48px;
  height: 24px;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  bottom: -24px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.bg3};
`

export const Header: FC = () => {
  const { mode } = useDarkMode()
  const [collapse, setCollapse] = useState(true)

  const handleCollapse = (val) => {
    setCollapse(val)
  }

  return (
    <WRAPPER id="menu">
      {collapse && (
        <>
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
        </>
      )}

      <Collapsible collapse={collapse} onCollapse={handleCollapse} />
    </WRAPPER>
  )
}

const Collapsible: React.FC<{ collapse: boolean; onCollapse: (val: boolean) => void }> = ({ collapse, onCollapse }) => {
  const { mode } = useDarkMode()

  const icon = `${process.env.PUBLIC_URL}/img/assets/arrow-down.svg`

  const handleCollapse = () => {
    onCollapse(!collapse)
  }

  return (
    <CollapsibleWrapper
      onClick={() => {
        handleCollapse()
      }}
    >
      {mode === 'dark' ? (
        <img style={{ transform: `rotate(${collapse ? 180 : 0}deg)` }} src={icon} alt="" />
      ) : (
        <SVGToGrey2 style={{ transform: `rotate(${collapse ? 180 : 0}deg)` }} src={icon} alt="" />
      )}
    </CollapsibleWrapper>
  )
}
