import React, { FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Connect } from './Connect'
import { More } from './More'
import { Tabs } from './Tabs'
import { RewardsButton } from '../../components/RewardsPopup'
import { useDarkMode } from '../../context'
import { SVGToGrey2, CenteredDiv } from '../../styles'
import { useNavCollapse } from '../../context'
import { ModalSlide } from '../../components/ModalSlide'
import { useRewardToggle } from '../../context/reward_toggle'
import { MODAL_TYPES } from '../../constants'

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

const BUTTONS = styled(CenteredDiv)`
  position: absolute;

  > *:not(:last-child) {
    margin-right: ${({ theme }) => theme.margin(3)};
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
  position: fixed;

  width: 100%;
  ${({ theme }) => theme.headerRoundedBorders}
  background-color: ${({ theme }) => theme.bg9};
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

const MobileWrapper = styled(WRAPPER)`
  display: flex;
  flex-direction: row !important;
  justify-content: space-around;
  align-items: center;
  border-radius: 0px;
`

const CollapsibleWrapper = styled.div`
  position: absolute;
  width: 40px;
  height: 20px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  bottom: -15px;
  display: flex;
  justify-content: center;
  background-color: ${({ theme }) => theme.bg9};
  cursor: pointer;

  img {
    height: 10px;
    width: 10px;
  }
`

export const Header: FC = () => {
  const { isCollapsed, toggleCollapse } = useNavCollapse()
  const { rewardModal, rewardToggle } = useRewardToggle()
  const { mode } = useDarkMode()
  const [mobile, setMobile] = useState(true) //initial mobile

  const handleCollapse = (val) => {
    toggleCollapse(val)
  }

  const slideModal = () => {
    if (rewardModal) {
      return <ModalSlide rewardModal={rewardModal} modalType={MODAL_TYPES.REWARDS} rewardToggle={rewardToggle} />
    }
  }

  useEffect(() => {
    const mobile = window?.innerWidth < 500
    setMobile(mobile)
  }, [])

  if (mobile) {
    return (
      <MobileWrapper id="menu">
        <BRAND href="/">
          <img id="logo" src={`/img/assets/gfx_logo_gradient_${mode}.svg`} alt="GFX Logo" />
        </BRAND>
        <Connect />
        <More />
      </MobileWrapper>
    )
  } else {
    return (
      <WRAPPER id="menu">
        {!isCollapsed && (
          <>
            {slideModal()}
            <BRAND href="/">
              <img id="logo" src={`/img/assets/gfx_logo_gradient_${mode}.svg`} alt="GFX Logo" />
            </BRAND>
            {!mobile && <Tabs />}
            <BUTTONS>
              {!mobile && <RewardsButton />}
              <Connect />

              <More />
            </BUTTONS>
          </>
        )}

        <Collapsible collapse={isCollapsed} onCollapse={handleCollapse} />
      </WRAPPER>
    )
  }
}

const Collapsible: React.FC<{ collapse: boolean; onCollapse: (val: boolean) => void }> = ({ collapse, onCollapse }) => {
  const { mode } = useDarkMode()
  const icon = `/img/assets/arrow-down.svg`
  const handleCollapse = () => onCollapse(!collapse)

  return (
    <CollapsibleWrapper
      onClick={() => {
        handleCollapse()
      }}
    >
      {mode === 'dark' ? (
        <img
          style={{ transform: `rotate(${collapse ? 0 : 180}deg)`, marginTop: `${collapse ? '5px' : '2px'}` }}
          src={icon}
          alt=""
        />
      ) : (
        <SVGToGrey2
          style={{ transform: `rotate(${collapse ? 0 : 180}deg)`, marginTop: `${collapse ? '5px' : '2px'}` }}
          src={icon}
          alt=""
        />
      )}
    </CollapsibleWrapper>
  )
}
