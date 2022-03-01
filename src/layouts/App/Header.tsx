import React, { FC } from 'react'
import styled from 'styled-components'
import { Connect } from './Connect'
import { More } from './More'
import { Tabs } from './Tabs'
import { SelectRPCNode } from "./SelectRPCNode";
import { useDarkMode } from '../../context'
import { SVGToGrey2, CenteredDiv } from '../../styles'
import { useNavCollapse } from '../../context'

const BRAND = styled.a`
  position: absolute;
  ${({ theme }) => theme.flexCenter}
  width: 84px;
  font-size: 40px;
  font-weight: bold;
  line-height: 20px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    position: relative;
    top: ${({ theme }) => theme.margin(1)};
    height: 40px;
    margin-bottom: ${({ theme }) => theme.margin(3)};
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
    margin-right: ${({ theme }) => theme.margin(2)};
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    position: relative;

    > *:not(:last-child) {
      margin-right: ${({ theme }) => theme.margin(1)};
    }
  `}

  ${({ theme }) => theme.mediaWidth.fromSmall`
    right: 58px;
    height: 50px;
  `}
`

const WRAPPER = styled.nav`
  position: absolute;

  width: 100%;
  ${({ theme }) => theme.headerRoundedBorders}
  background-color: ${({ theme }) => theme.bg3};
  ${({ theme }) => theme.smallShadow}
  z-index: 300;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    ${({ theme }) => theme.flexColumnNoWrap};
    height: auto;
    padding: ${({ theme }) => theme.margin(1)};
  `}
  ${({ theme }) => theme.mediaWidth.fromSmall`
    ${({ theme }) => theme.flexCenter}
  `}
`

const CollapsibleWrapper = styled.div`
  position: absolute;
  width: 40px;
  height: 20px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  bottom: -20px;
  display: flex;
  justify-content: center;
  background-color: ${({ theme }) => theme.bg3};
  cursor: pointer;

  img {
    height: 10px;
    width: 10px;
  }
`

export const Header: FC = () => {
  const { mode } = useDarkMode()
  const { isCollapsed, toggleCollapse } = useNavCollapse()

  const handleCollapse = (val) => {
    toggleCollapse(val)
  }

  return (
    <WRAPPER id="menu">
      {!isCollapsed && (
        <>
          <BRAND href="/">
            <img id="logo" src={`/img/assets/gfx_logo_gradient.svg`} alt="GFX Logo" />
          </BRAND>
          <Tabs />
          <BUTTONS>
            <RefreshWrapper href="/">
              <img src={`/img/assets/refresh.svg`} alt="" />
            </RefreshWrapper>
            <Connect />
            <SelectRPCNode />
            <More />
          </BUTTONS>
        </>
      )}

      <Collapsible collapse={isCollapsed} onCollapse={handleCollapse} />
    </WRAPPER>
  )
}

const Collapsible: React.FC<{ collapse: boolean; onCollapse: (val: boolean) => void }> = ({ collapse, onCollapse }) => {
  const { mode } = useDarkMode()

  const icon = `/img/assets/arrow-down.svg`

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
        <img
          style={{ transform: `rotate(${collapse ? 180 : 0}deg)`, marginTop: `${collapse ? '2px' : '5px'}` }}
          src={icon}
          alt=""
        />
      ) : (
        <SVGToGrey2
          style={{ transform: `rotate(${collapse ? 180 : 0}deg)`, marginTop: `${collapse ? '2px' : '5px'}` }}
          src={icon}
          alt=""
        />
      )}
    </CollapsibleWrapper>
  )
}
