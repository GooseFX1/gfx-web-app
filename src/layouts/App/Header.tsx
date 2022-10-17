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
import tw from 'twin.macro'

const BRAND = styled.a`
  ${tw`absolute flex justify-center items-center text-big 
  leading-5 font-bold w-21 md:relative md:top-2 md:left-2 md:mb-6 md:h-11.75 min-md:h-12.5 min-md:left-[58px]`}

  img {
    ${tw`h-inherit w-inherit object-contain`}
  }
`

const BUTTONS = styled(CenteredDiv)`
  ${tw`absolute md:relative min-md:right-[58px] min-md:h-12.5`}

  > *:not(:last-child) {
    ${tw`mr-6`}
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    > *:not(:last-child) {
      ${tw`mr-4`}
    }
  `}
`

const WRAPPER = styled.nav`
  ${tw`fixed w-full rounded-b-circle z-[300] md:flex-nowrap 
  md:flex md:h-auto md:p-2 min-md:flex min-md:items-center min-md:justify-center`}
  background-color: ${({ theme }) => theme.bg9};
  ${({ theme }) => theme.smallShadow}
`

const MobileWrapper = styled(WRAPPER)`
  ${tw`flex !flex-row justify-between items-center rounded-none shadow-none rounded-b-[30px]`}
  background-color: ${({ theme }) => theme.bg18};
`

const CollapsibleWrapper = styled.div<{ $collapse: boolean }>`
  ${tw`absolute rounded-bl-bigger rounded-br-bigger justify-center cursor-pointer flex w-10 h-5 bottom-[-20px]`}
  background: ${({ $collapse, theme }) =>
    $collapse ? 'linear-gradient(158.4deg, #5855FF 14.18%, #DC1FFF 82.14%);' : theme.bg9};

  img {
    ${tw`h-2.5 w-2.5`}
  }
`
const RESPONSIVE_MENU = styled.ul`
  ${tw`absolute items-center flex flex-col left-0 top-0 h-screen w-screen pb-4 pt-[10vh] px-0`}
  background-color: ${({ theme }) => theme.bg1};
`

const CLOSE = styled.img`
  ${tw`absolute object-contain h-6 w-6 top-[30px] right-[18px]`}
`

const RESPONSIVE_DROPDOWN_WRAPPER = styled.div`
  ${tw`mr-2 ml-[22px] min-sm:hidden`}
  @media (max-width: 500px) {
    background-color: ${({ theme }) => theme.bg2};
  }
`

const DROPDOWN_ICON_WRAPPER = styled(CenteredImg)`
  ${tw`w-7 h-[21px]`}
`

const ResponsiveDropdown: FC<{ logoAnimationTime?: number }> = () => {
  const { mode } = useDarkMode()
  const [opacity, setOpacity] = useState(0)

  const toggleOpacity = useCallback(() => setOpacity(1 - opacity), [opacity])

  const computeDropdownIcon = useCallback(
    () =>
      mode === 'dark' ? (
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
        <ThemeToggle />
        <Tabs mobileToggle={toggleOpacity} />
        {/* <RewardsButton /> */}
      </RESPONSIVE_MENU>
    </RESPONSIVE_DROPDOWN_WRAPPER>
  )
}

export const Header: FC = () => {
  const { isCollapsed, toggleCollapse } = useNavCollapse()
  const { rewardModal, rewardToggle } = useRewardToggle()
  const { mode } = useDarkMode()
  const [, setMobile] = useState(true) //initial mobile

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

const Collapsible: React.FC<{ collapse: boolean; onCollapse: (val: boolean) => void }> = ({
  collapse,
  onCollapse
}) => {
  const { mode } = useDarkMode()
  const icon = `/img/assets/arrow-down.svg`
  const handleCollapse = () => onCollapse(!collapse)

  return (
    <CollapsibleWrapper
      $collapse={collapse}
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
