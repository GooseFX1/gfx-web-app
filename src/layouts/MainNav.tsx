import React, { FC, useEffect, useState, useCallback, BaseSyntheticEvent, useRef, useMemo } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
// import styled from 'styled-components'
// import { Connect } from './Connect'
// import { More } from './More'
// import { Tabs } from './Tabs'
/* eslint-disable @typescript-eslint/no-unused-vars */
import { RewardsButton } from '../components/RewardsPopup'
import { useDarkMode } from '../context'
import { SVGToGrey2, CenteredDiv, SVGToWhite, CenteredImg, AlignCenterDiv } from '../styles'
import { useNavCollapse } from '../context'
import { ModalSlide } from '../components/ModalSlide'
import { useRewardToggle } from '../context/reward_toggle'
import { MODAL_TYPES, RIVE_ANIMATION } from '../constants'
import { checkMobile } from '../utils'
import { ThemeToggle } from '../components/ThemeToggle'
import { MyNFTBag } from '../pages/NFTs/MyNFTBag'
import tw from 'twin.macro'
import 'styled-components/macro'
import useBreakPoint from '../hooks/useBreakPoint'
import useRiveAnimations, { RiveAnimationWrapper } from '../hooks/useRiveAnimations'
import { useRive, useStateMachineInput } from '@rive-app/react-canvas'
import { Connect } from './Connect'
import { More } from './More'
import { Dropdown } from 'antd'
import useClickOutside from '../hooks/useClickOutside'
import useRiveThemeToggle from '../hooks/useRiveThemeToggle'
import useRiveStateToggle from '../hooks/useRiveStateToggle'
//
// const BRAND = styled.a`
//   ${tw`absolute flex justify-center items-center text-lg
//   leading-5 font-bold w-21 md:relative md:top-2 md:left-2 md:mb-6 md:h-11.75 min-md:h-12.5 min-md:left-[58px]`}
//
//   img {
//     ${tw`h-inherit w-inherit object-contain`}
//   }
// `
//
// const BUTTONS = styled(CenteredDiv)`
//   ${tw`absolute md:relative min-md:right-[58px] min-md:h-12.5`}
//
//   > *:not(:last-child) {
//     ${tw`mr-[12px]`}
//   }
//
//   ${({ theme }) => theme.mediaWidth.upToSmall`
//     > *:not(:last-child) {
//       ${tw`mr-4`}
//     }
//   `}
// `
//
// const WRAPPER = styled.nav`
//   ${tw`fixed w-full rounded-b-circle z-[300] md:flex-nowrap sm:w-[100vw]
//   md:flex md:h-auto md:p-2 min-md:flex min-md:items-center min-md:justify-center`}
//   background-color: ${({ theme }) => theme.bg20};
//   ${({ theme }) => theme.smallShadow}
// `
//
// const MobileWrapper = styled(WRAPPER)`
//   ${tw`flex !flex-row justify-between items-center rounded-none rounded-b-[30px]`}
//   background-color: ${({ theme }) => theme.bg20};
// `
//
// const CollapsibleWrapper = styled.div<{ $collapse: boolean }>`
//   ${tw`absolute rounded-bl-bigger rounded-br-bigger justify-center cursor-pointer flex w-10 h-5 bottom-[-20px]`}
//   background: ${({ $collapse, theme }) =>
//     $collapse ? 'linear-gradient(158.4deg, #5855FF 14.18%, #DC1FFF 82.14%);' : theme.bg20};
//
//   img {
//     ${tw`h-2.5 w-[14px]`}
//   }
// `
// const RESPONSIVE_MENU = styled.ul`
//   ${tw`absolute items-center flex flex-col left-0 top-0 h-screen w-screen pb-4 pt-[10vh] px-0`}
//   background-color: ${({ theme }) => theme.bg1};
// `
//
// const CLOSE = styled.img`
//   ${tw`absolute object-contain h-6 w-6 top-[30px] right-[18px]`}
// `
//
// const RESPONSIVE_DROPDOWN_WRAPPER = styled.div`
//   ${tw`mr-2 ml-[22px] min-sm:hidden`}
// `
//
// const DROPDOWN_ICON_WRAPPER = styled(CenteredImg)`
//   ${tw`w-7 h-[21px]`}
// `

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

  return <></>
}

export const MainNav: FC = () => {
  const breakpoint = useBreakPoint()
  return (
    <div
      css={[
        tw`w-screen h-14 px-5 items-center flex py-3 justify-between bg-grey-5 dark:bg-black-1
        relative
       `
      ]}
    >
      {(breakpoint.isDesktop || breakpoint.isLaptop) && (
        <img css={tw`w-15.75 h-5.25 absolute `} src={'img/assets/gofx-logo-new.svg'} />
      )}
      <DesktopNav />
      <MobileNav />
      <div css={tw`flex items-center gap-3.75 absolute right-0`}>
        <RewardsButton />
        <Connect />
        <CartButton />
        <More />
      </div>
    </div>
  )
}
const MobileNav: FC = () => {
  const breakpoint = useBreakPoint()
  const { mode } = useDarkMode()
  const { pathname } = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState({
    animation: 'swap',
    stateMachine: RIVE_ANIMATION.swap.stateMachines.SwapInteractions.stateMachineName,
    text: 'Swap'
  })
  useEffect(() => {
    switch (true) {
      case pathname.includes('dex'):
        setCurrentPage({
          animation: 'dex',
          stateMachine: RIVE_ANIMATION.dex.stateMachines.DEXInteractions.stateMachineName,
          text: 'DEX'
        })
        break
      case pathname.includes('nfts'):
        setCurrentPage({
          animation: 'aggregator',
          stateMachine: RIVE_ANIMATION.aggregator.stateMachines.AggregatorInteractions.stateMachineName,
          text: 'NFTs'
        })
        break
      case pathname.includes('farm'):
        setCurrentPage({
          animation: 'farm',
          stateMachine: RIVE_ANIMATION.farm.stateMachines.FarmInteractions.stateMachineName,
          text: 'Farm'
        })
        break
      case pathname.includes('stats'):
        setCurrentPage({
          animation: 'stats',
          stateMachine: RIVE_ANIMATION.stats.stateMachines.StatsInteractions.stateMachineName,
          text: 'Stats'
        })
        break
      case pathname.includes('swap'):
      default:
        setCurrentPage({
          animation: 'swap',
          stateMachine: RIVE_ANIMATION.swap.stateMachines.SwapInteractions.stateMachineName,
          text: 'Swap'
        })
        break
    }
  }, [pathname])
  const riveAnimation = useRiveAnimations({
    animation: currentPage.animation,
    autoplay: true,
    canvasWidth: 26,
    canvasHeight: 26
  })
  const themeInput = useStateMachineInput(
    riveAnimation.rive,
    RIVE_ANIMATION[currentPage.animation].stateMachines[currentPage.stateMachine].stateMachineName,
    RIVE_ANIMATION[currentPage.animation].stateMachines[currentPage.stateMachine].inputs.theme
  )
  const stateInput = useStateMachineInput(
    riveAnimation.rive,
    RIVE_ANIMATION[currentPage.animation].stateMachines[currentPage.stateMachine].stateMachineName,
    RIVE_ANIMATION[currentPage.animation].stateMachines[currentPage.stateMachine].inputs.state
  )

  useEffect(() => {
    if (!themeInput) return
    themeInput.value = mode === 'dark'
  }, [mode, themeInput])
  useEffect(() => {
    if (!stateInput) return
    stateInput.value = pathname.startsWith(`/${currentPage.animation}`)
  }, [pathname, stateInput])
  const onClose = useCallback(() => setIsOpen(false), [])
  const toggleSettingsDrawer = useCallback(() => setIsOpen((prev) => !prev), [])
  if (breakpoint.isLaptop || breakpoint.isDesktop) return null
  return (
    <div css={tw`flex w-full items-center mr-auto cursor-pointer`} onClick={toggleSettingsDrawer}>
      <RiveAnimationWrapper setContainerRef={riveAnimation.setContainerRef} width={26} height={26}>
        <riveAnimation.RiveComponent />
      </RiveAnimationWrapper>
      <p css={[tw`mb-0 text-tiny font-semibold text-black-4 dark:text-grey-5 ml-2.75`]}>{currentPage.text}</p>
      <img css={[tw`ml-1.5`]} src={`img/assets/chevron-${mode}-active.svg`} />
      <MobileSettingsDrawer isOpen={isOpen} onClose={onClose} />
    </div>
  )
}
interface MobileSettingsDrawerProps {
  isOpen: boolean
  onClose: () => void
}
const MobileSettingsDrawer: FC<MobileSettingsDrawerProps> = ({ isOpen, onClose }) => {
  const localOnClose = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    setPlayCloseAnimation(true)
    closeTimerRef.current = setTimeout(() => {
      onClose()
      setPlayCloseAnimation(false)
    }, 100)
  }, [onClose])
  const outsideRef = useClickOutside(localOnClose)
  const closeTimerRef = useRef<NodeJS.Timer>(null)
  const [playCloseAnimation, setPlayCloseAnimation] = useState(false)

  return (
    <div
      css={[
        tw`absolute top-[62px] right-0 w-screen dark:bg-black-1 bg-grey-5 dark:text-grey-5 rounded-b-bigger
    items-center flex flex-col block justify-center z-50
   `,
        isOpen ? tw`flex animate-slideInTop` : tw`hidden `
      ]}
      ref={outsideRef}
    >
      <div css={[tw`flex items-center justify-between w-full px-7 py-2.5 overflow-scroll gap-2`]}>
        <MobileNavItem
          animation={'swap'}
          stateMachine={RIVE_ANIMATION.swap.stateMachines.SwapInteractions.stateMachineName}
          text={'Swap'}
          path={'/swap'}
        />
        <MobileNavItem
          animation={'dex'}
          stateMachine={RIVE_ANIMATION.dex.stateMachines.DEXInteractions.stateMachineName}
          text={'DEX'}
          path={'/trade'}
        />
        <MobileNavItem
          animation={'aggregator'}
          stateMachine={RIVE_ANIMATION.aggregator.stateMachines.AggregatorInteractions.stateMachineName}
          text={"NFT's"}
          path={'/nfts'}
        />
        <MobileNavItem
          animation={'farm'}
          stateMachine={RIVE_ANIMATION.farm.stateMachines.FarmInteractions.stateMachineName}
          text={'Farm'}
          path={'/farm'}
        />
        <MobileNavItem
          animation={'stats'}
          stateMachine={RIVE_ANIMATION.stats.stateMachines.StatsInteractions.stateMachineName}
          text={'Stats'}
          path={'/stats'}
        />
      </div>
      <div css={[]}>
        <CurrentNavControls />
      </div>

      <span tw={'w-full flex justify-center items-center mb-3.75'}>
        <ThemeToggle />
      </span>
    </div>
  )
}

const CurrentNavControls: FC = () => {
  const { pathname } = useLocation()
  //TODO: perp hook for is active
  //TODO: leaderboard hook for is active
  //TODO: aggregator hook for is active
  switch (true) {
    case pathname.includes('nfts'):
      return (
        <MobileControls
          options={[
            {
              text: 'NFTs',
              onClick: () => {
                console.log('help')
              },
              isActive: false
            }
          ]}
        />
      )
    case pathname.includes('stats'):
      return (
        <MobileControls
          options={[
            {
              text: 'Leaderboard',
              onClick: () => {
                console.log('help')
              },
              isActive: false
            }
          ]}
        />
      )
    case pathname.includes('swap'):
    case pathname.includes('trade'):
    case pathname.includes('farm'):
    default:
      return (
        <MobileControls
          options={[
            {
              text: 'Perps',
              onClick: () => {
                console.log('help')
              },
              isActive: false
            },
            {
              text: 'Spot',
              onClick: () => {
                console.log('help')
              },
              isActive: false
            }
          ]}
        />
      )
  }
}
interface MobileControlsProps {
  options: Controls[]
}
interface Controls {
  text: string
  onClick: () => void
  isActive: boolean
}
const MobileControls: FC<MobileControlsProps> = ({ options }) => (
  <div css={[tw`flex items-center justify-center w-full gap-5.75`]}>
    {options.map((option) => (
      <p
        css={[
          tw`text-average font-semibold text-grey-1 dark:text-grey-1`,
          option.isActive ? tw`text-blue-1 dark:text-white` : tw``
        ]}
        onClick={option.onClick}
        key={option.text}
      >
        {option.text}
      </p>
    ))}
  </div>
)

interface MobileNavItemProps {
  animation: string
  stateMachine: string
  text: string
  path: string
}
const MobileNavItem: FC<MobileNavItemProps> = ({ animation, stateMachine, text, path }) => {
  const { pathname } = useLocation()
  const history = useHistory()
  const riveAnimation = useRiveAnimations({
    animation,
    autoplay: true,
    canvasWidth: 40,
    canvasHeight: 40
  })

  useRiveThemeToggle(riveAnimation.rive, animation, stateMachine)
  const { stateInput } = useRiveStateToggle(riveAnimation.rive, animation, stateMachine, path)
  const onHover = useCallback(() => {
    if (!stateInput) return
    if (pathname.includes(path)) return
    stateInput.value = !stateInput.value
  }, [stateInput, pathname, path])
  const isActive = useMemo(() => pathname.includes(path), [pathname, path])
  const navigateToPath = useCallback(() => history.push(path), [path, history])
  return (
    <button
      css={[
        tw`flex items-center gap-2.5 cursor-pointer border-none px-4.5 py-1.25 rounded-full
    h-12.5 w-max bg-transparent dark:bg-transparent
    `,
        isActive ? tw`bg-grey-4 dark:bg-black-2` : tw``
      ]}
      onMouseEnter={onHover}
      onMouseLeave={onHover}
      onClick={navigateToPath}
    >
      <RiveAnimationWrapper setContainerRef={riveAnimation.setContainerRef} width={40} height={40}>
        <riveAnimation.RiveComponent />
      </RiveAnimationWrapper>
      <p
        css={[
          tw`mb-0 text-tiny font-semibold text-grey-1 dark:text-grey-5`,
          isActive ? tw`text-black-4 dark:text-grey-5` : tw``
        ]}
      >
        {text}
      </p>
    </button>
  )
}
const DesktopNav: FC = () => {
  const breakpoint = useBreakPoint()
  if (breakpoint.isMobile || breakpoint.isTablet) return null
  return (
    <div css={tw`flex items-center gap-3 mx-auto`}>
      <HeaderMainNav
        Text={'Swap'}
        riveAnimation={'swap'}
        stateMachine={RIVE_ANIMATION.swap.stateMachines.SwapInteractions.stateMachineName}
        path={'/swap'}
      />
      <HeaderMainNav
        Text={'Trade'}
        riveAnimation={'dex'}
        stateMachine={RIVE_ANIMATION.dex.stateMachines.DEXInteractions.stateMachineName}
        path={'/trade'}
      />
      <HeaderMainNav
        Text={"NFT's"}
        riveAnimation={'aggregator'}
        stateMachine={RIVE_ANIMATION.aggregator.stateMachines.AggregatorInteractions.stateMachineName}
        path={'/nfts'}
      />
      <HeaderMainNav
        Text={'Farm'}
        riveAnimation={'farm'}
        stateMachine={RIVE_ANIMATION.farm.stateMachines.FarmInteractions.stateMachineName}
        path={'/farm'}
      />
      <HeaderMainNav
        Text={'Stats'}
        riveAnimation={'stats'}
        stateMachine={RIVE_ANIMATION.stats.stateMachines.StatsInteractions.stateMachineName}
        hasDropdown={true}
        path={'/stats'}
      />
    </div>
  )
}
interface HeaderMainNavProps {
  Text: string
  riveAnimation: string
  stateMachine: string
  path: string
  hasDropdown?: boolean
}
const HeaderMainNav: FC<HeaderMainNavProps> = ({ riveAnimation, Text, stateMachine, path }) => {
  const { mode } = useDarkMode()
  const { pathname } = useLocation()
  const history = useHistory()
  //const breakpoint = useBreakPoint()
  const rive = useRiveAnimations({
    animation: riveAnimation,
    autoplay: true,
    canvasWidth: 24,
    canvasHeight: 24
  })
  const themeInput = useStateMachineInput(rive.rive, stateMachine, 'Theme')
  const stateInput = useStateMachineInput(rive.rive, stateMachine, 'State')
  useEffect(() => {
    if (stateInput) {
      stateInput.value = pathname.startsWith(path)
    }
  }, [stateInput, pathname])
  useEffect(() => {
    if (themeInput) {
      themeInput.value = mode === 'dark'
    }
  }, [mode, themeInput])
  const navigateToPath = useCallback(() => {
    history.push(path)
  }, [history, path])
  const onHover = useCallback(
    (e: BaseSyntheticEvent) => {
      if (stateInput && !pathname.startsWith(path)) {
        stateInput.value = !stateInput.value
      }
    },
    [stateInput, pathname, path]
  )
  return (
    <div css={tw`flex flex-col items-center justify-center h-full cursor-pointer`} onClick={navigateToPath}>
      <div css={[tw`flex gap-0.25 items-center justify-center`]}>
        <RiveAnimationWrapper
          setContainerRef={rive.setContainerRef}
          width={24}
          height={24}
          onMouseEnter={onHover}
          onMouseLeave={onHover}
        >
          <rive.RiveComponent />
        </RiveAnimationWrapper>
        <img src={`img/assets/chevron-${mode}-active.svg`} />
      </div>
      <p
        css={[tw`mb-0 text-tiny font-medium text-grey-1 dark:text-grey-2 dark:text-white mt-0.5 h-4`]}
        style={{
          opacity: pathname.startsWith(path) ? 1 : 0.5
        }}
      >
        {Text}
      </p>
    </div>
  )
}

const CartButton: FC = () => {
  // // TODO: fill me in - clamp to 9+
  const cartSize = 0
  const { mode } = useDarkMode()
  const { pathname } = useLocation()
  // Below is rive code for when the animation is added - some thigns might need to changed

  // const rive = useRiveAnimations({
  //   animation:'swap',
  //   autoplay: true,
  //   canvasWidth: 35,
  //   canvasHeight: 35
  // })
  // const themeInput = useStateMachineInput(rive.rive,
  //   RIVE_ANIMATION.cart.stateMachines.CartInteractions.stateMachineName
  //   ,RIVE_ANIMATION.cart.stateMachines.CartInteractions.inputs.Theme)
  // const stateInput = useStateMachineInput(rive.rive,
  //   RIVE_ANIMATION.cart.stateMachines.CartInteractions.stateMachineName
  //   ,RIVE_ANIMATION.cart.stateMachines.CartInteractions.inputs.State)

  // useEffect(()=>{
  //   if(!stateInput) return
  //   stateInput.value=pathname.startsWith('/cart')
  // },[pathname,stateInput])
  // useEffect(()=>{
  //   if(!themeInput) return
  //   themeInput.value = mode === 'dark'
  // },[themeInput,mode])
  // const onHover = useCallback((e: BaseSyntheticEvent)=>{
  //   if(pathname.startsWith('/cart'))return
  //   stateInput.value=!stateInput.value
  // },[stateInput,pathname])

  const openCart = useCallback(() => {
    // TODO: fill me in
    console.log('FILL ME IN')
  }, [])
  if (!pathname.startsWith('/nfts')) return null
  return (
    <div css={tw`flex items-center justify-center h-full cursor-pointer relative w-7.5 h-7.5`} onClick={openCart}>
      {/*<RiveAnimationWrapper setContainerRef={rive.setContainerRef}*/}
      {/*                      width={35}*/}
      {/*                      height={35}*/}
      {/*                      // onMouseEnter={onHover}*/}
      {/*                      // onMouseLeave={onHover}*/}
      {/*>*/}
      {/*  <rive.RiveComponent />*/}
      {/*</RiveAnimationWrapper>*/}
      <img src={`img/assets/shopping-bag-${mode}-active.svg`} />
      <p
        css={[
          tw`mb-0 absolute top-1/4 transform -translate-x-1/2 -translate-y-1/2 text-tiny font-medium
        text-grey-1 dark:text-white mt-0.5 h-4`
        ]}
      >
        {cartSize}
      </p>
    </div>
  )
}
