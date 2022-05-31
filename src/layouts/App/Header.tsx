import React, { FC, useEffect, useState, useCallback } from 'react'
import styled from 'styled-components'
import { Connect } from './Connect'
import { More } from './More'
import { Tabs } from './Tabs'
import { RewardsButton } from '../../components/RewardsPopup'
import { useDarkMode } from '../../context'
import { SVGToGrey2, CenteredDiv, SVGToWhite, CenteredImg, AlignCenterDiv } from '../../styles'
import { useNavCollapse } from '../../context'
import { ModalSlide } from '../../components/ModalSlide'
import { useRewardToggle } from '../../context/reward_toggle'
import { MODAL_TYPES } from '../../constants'
import { checkMobile } from '../../utils'
import { ThemeToggle } from '../../components/ThemeToggle'

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
    left: 8px;
    height: 47px;
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
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme }) => theme.bg2};
  box-shadow: none;
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
const RESPONSIVE_MENU = styled.ul`
  display: flex;
  align-items: center;
  flex-direction: column;
  position: absolute;
  left: 0;
  top: 0;
  height: 100vh;
  width: 100vw;
  padding: 10vh 0px 1rem 0px;
  background-color: ${({ theme }) => theme.bg1};
`

const CLOSE = styled.img`
  position: absolute;
  ${({ theme }) => theme.measurements('24px')}
  object-fit: contain;
  top: 30px;
  right: 18px;
`

const RESPONSIVE_DROPDOWN_WRAPPER = styled.div`
  margin: 0 8px 0 22px;
  @media (min-width: 500px) {
    display: none;
  }
`

const DROPDOWN_ICON_WRAPPER = styled(CenteredImg)`
  height: 21px;
  width: 28px;
`

const ResponsiveDropdown: FC<{ logoAnimationTime: number }> = ({ logoAnimationTime }) => {
  const { mode } = useDarkMode()
  const [opacity, setOpacity] = useState(0)

  const toggleOpacity = useCallback(() => setOpacity(1 - opacity), [opacity])

  const computeDropdownIcon = useCallback(
    () =>
      mode === 'dark' || window.location.hash ? (
        <SVGToWhite src={`${process.env.PUBLIC_URL}/img/assets/dropdown_icon.svg`} onClick={toggleOpacity} />
      ) : (
        <img src={`${process.env.PUBLIC_URL}/img/assets/dropdown_icon.svg`} onClick={toggleOpacity} alt="" />
      ),
    [mode, toggleOpacity]
  )
  const [dropdownIcon, setDropdownIcon] = useState(computeDropdownIcon())

  useEffect(() => {
    setDropdownIcon(computeDropdownIcon())
  }, [computeDropdownIcon, mode])

  return (
    <RESPONSIVE_DROPDOWN_WRAPPER>
      <DROPDOWN_ICON_WRAPPER>{dropdownIcon}</DROPDOWN_ICON_WRAPPER>
      <RESPONSIVE_MENU style={{ display: opacity ? 'flex' : 'none', opacity }}>
        <CLOSE
          as={mode === 'dark' ? SVGToWhite : 'img'}
          src={`${process.env.PUBLIC_URL}/img/assets/cross.svg`}
          onClick={toggleOpacity}
        />
        <Tabs mobileToggle={toggleOpacity} />
        <RewardsButton />
        <ThemeToggle />
      </RESPONSIVE_MENU>
    </RESPONSIVE_DROPDOWN_WRAPPER>
  )
}

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

  // const mobileNavItems = ['/swap', '/trade', '/NFTs', '/farm'].map((link: string) => {
  //   return (
  //     <LINK onClick={() => updatePath(link, link === 'docs')} href={'javascript:void(0);'}>
  //       <LINK_TEXT>{link}</LINK_TEXT>
  //     </LINK>
  //   )
  // })

  useEffect(() => {
    const mobile = window?.innerWidth < 500
    setMobile(mobile)
  }, [])

  if (checkMobile()) {
    return (
      <MobileWrapper id="menu">
        <BRAND href="/">
          <img id="logo" src={`/img/assets/gfx_logo_gradient_${mode}.svg`} alt="GFX Logo" />
        </BRAND>
        <AlignCenterDiv>
          <Connect />
          <ResponsiveDropdown logoAnimationTime={2} />
        </AlignCenterDiv>
        {/* <More /> */}
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
            <Tabs />
            <BUTTONS>
              <RewardsButton />
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
