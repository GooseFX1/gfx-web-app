import React, { FC, useEffect, useState, useCallback, BaseSyntheticEvent, useRef, useMemo, ReactNode } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
/* eslint-disable @typescript-eslint/no-unused-vars */
import { RewardsButton } from '../components/RewardsPopup'
import { useCrypto, useDarkMode } from '../context'
import { SVGToWhite } from '../styles'

import { MODAL_TYPES, RIVE_ANIMATION } from '../constants'
import { checkMobile } from '../utils'
import { ThemeToggle } from '../components/ThemeToggle'
import { MyNFTBag } from '../pages/NFTs/MyNFTBag'
import tw from 'twin.macro'
import 'styled-components/macro'
import useBreakPoint from '../hooks/useBreakPoint'
import useRiveAnimations, { RiveAnimationWrapper } from '../hooks/useRiveAnimations'
import { Connect } from './Connect'
import { More } from './More'
import useClickOutside from '../hooks/useClickOutside'
import useRiveThemeToggle from '../hooks/useRiveThemeToggle'
import useRiveStateToggle from '../hooks/useRiveStateToggle'
import { Menu, Transition } from '@headlessui/react'
import { useRive, useStateMachineInput } from '@rive-app/react-canvas'
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
  const history = useHistory()
  const navigateHome = useCallback(() => history.push('/swap'), [history])
  return (
    <div
      css={[
        tw`w-screen h-14 px-5 items-center flex py-3 justify-between bg-grey-5 dark:bg-black-1
        relative border-b-1 border-solid border-grey-2  dark:border-black-4
       `
      ]}
    >
      {(breakpoint.isDesktop || breakpoint.isLaptop) && (
        <img
          css={tw`w-15.75 h-5.25 absolute cursor-pointer`}
          src={'img/assets/gofx-logo-new.svg'}
          onClick={navigateHome}
        />
      )}
      <DesktopNav />
      <MobileNav />
      <div css={tw`flex items-center gap-3.75 absolute right-0 mr-2.5 min-md:mr-0`}>
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
    text: 'Swap',
    path: '/swap'
  })
  useEffect(() => setIsOpen(false), [pathname])
  useEffect(() => {
    switch (true) {
      case pathname.includes('trade'):
        setCurrentPage((prev) => ({
          animation: 'dex',
          stateMachine: RIVE_ANIMATION.dex.stateMachines.DEXInteractions.stateMachineName,
          text: 'DEX',
          path: '/trade'
        }))
        break
      case pathname.includes('nfts'):
        setCurrentPage({
          animation: 'aggregator',
          stateMachine: RIVE_ANIMATION.aggregator.stateMachines.AggregatorInteractions.stateMachineName,
          text: 'NFTs',
          path: '/nfts'
        })
        break
      case pathname.includes('farm'):
        setCurrentPage({
          animation: 'farm',
          stateMachine: RIVE_ANIMATION.farm.stateMachines.FarmInteractions.stateMachineName,
          text: 'Farm',
          path: '/farm'
        })
        break
      case pathname.includes('stats'):
        setCurrentPage({
          animation: 'stats',
          stateMachine: RIVE_ANIMATION.stats.stateMachines.StatsInteractions.stateMachineName,
          text: 'Stats',
          path: '/stats'
        })
        break
      case pathname.includes('swap'):
        setCurrentPage({
          animation: 'swap',
          stateMachine: RIVE_ANIMATION.swap.stateMachines.SwapInteractions.stateMachineName,
          text: 'Swap',
          path: '/swap'
        })
        break
      default:
        break
    }
  }, [pathname])
  const { rive, RiveComponent, setContainerRef } = useRiveAnimations({
    animation: currentPage.animation,
    autoplay: true,
    canvasWidth: 40,
    canvasHeight: 40
  })

  useRiveThemeToggle(rive, currentPage.animation, currentPage.stateMachine)
  useRiveStateToggle(rive, currentPage.animation, currentPage.stateMachine, currentPage.path)
  const onClose = useCallback(() => setIsOpen(false), [])
  const toggleSettingsDrawer = useCallback(() => setIsOpen((prev) => !prev), [])
  const isOnPage = useMemo(() => pathname.includes(currentPage.path), [pathname, currentPage.path])
  const active = useMemo(
    () => (isOnPage && !isOpen ? 'active' : isOpen ? 'selected' : 'inactive'),
    [isOpen, isOnPage]
  )
  const localOnClose = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    setPlayCloseAnimation(true)
    closeTimerRef.current = setTimeout(() => {
      onClose()
      setPlayCloseAnimation(false)
    }, 100)
  }, [onClose])
  const closeTimerRef = useRef<NodeJS.Timer>(null)
  const [playCloseAnimation, setPlayCloseAnimation] = useState(false)

  const outsideRef = useClickOutside(localOnClose)
  if (breakpoint.isLaptop || breakpoint.isDesktop) return null
  return (
    <span ref={outsideRef}>
      <div css={tw`flex w-full items-center mr-auto cursor-pointer`} onClick={toggleSettingsDrawer}>
        <RiveAnimationWrapper setContainerRef={setContainerRef} width={40} height={40}>
          <RiveComponent />
        </RiveAnimationWrapper>
        <p css={[tw`mb-0 text-tiny font-semibold text-black-4 dark:text-grey-5 ml-2.75`]}>{currentPage.text}</p>
        <img css={[tw`ml-1.5`]} src={`img/assets/chevron-${mode}-${active}.svg`} />
      </div>
      <MobileSettingsDrawer isOpen={isOpen} playCloseAnimation={playCloseAnimation} />
    </span>
  )
}
interface MobileSettingsDrawerProps {
  isOpen: boolean
  playCloseAnimation: boolean
}
const MobileSettingsDrawer: FC<MobileSettingsDrawerProps> = ({ isOpen, playCloseAnimation }) => (
  <div
    css={[
      tw`absolute top-[62px] right-0 w-screen dark:bg-black-1 bg-grey-5 dark:text-grey-5 rounded-b-bigger
    items-center flex flex-col block justify-center z-50
   `,
      isOpen ? tw`flex animate-slideInTop` : tw`hidden `,
      playCloseAnimation ? tw`animate-slideOutTop` : tw``
    ]}
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
    <div>
      <MobileNavControls />
    </div>

    <span tw={'w-full flex justify-center items-center mb-3.75'}>
      <ThemeToggle />
    </span>
  </div>
)

const MobileNavControls: FC = () => {
  const { pathname } = useLocation()
  const history = useHistory()
  const { isSpot, setIsSpot } = useCrypto()

  //TODO: leaderboard hook for is active
  //TODO: aggregator hook for is active
  const handlePerpsSpotToggle = useCallback(
    (isSpotToggle: boolean) => () => {
      setIsSpot(isSpotToggle)
      history.push(`/trade`)
    },
    [setIsSpot, history]
  )
  //TODO: replace below in the NFT/Stats segment for mobile
  // return (
  //   <MobileControls
  //     options={[
  //       {
  //         text: 'NFTs',
  //         onClick: () => {
  //           console.log('help')
  //         },
  //         isActive: false
  //       }
  //     ]}
  //   />
  // )
  switch (true) {
    case pathname.includes('trade'):
      return (
        <MobileControls
          options={[
            {
              text: 'Perps',
              onClick: handlePerpsSpotToggle(false),
              isActive: !isSpot
            },
            {
              text: 'Spot',
              onClick: handlePerpsSpotToggle(true),
              isActive: isSpot
            }
          ]}
        />
      )
    case pathname.includes('nfts'):
    case pathname.includes('stats'):
    case pathname.includes('swap'):
    case pathname.includes('farm'):
    default:
      return <></>
  }
}
interface DesktopControlsProps {
  children: ReactNode
  options: Controls[]
  isOpen: boolean
  onHover: (e: BaseSyntheticEvent) => void
  onClose: () => void
}

const DesktopControls: FC<DesktopControlsProps> = ({ children, options, onHover, isOpen, onClose }) => {
  const selfRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef(null)
  const localOnHover = useCallback(
    (e: BaseSyntheticEvent) => {
      if (!isOpen) {
        e.currentTarget.click()
        onHover(e)
      }
    },
    [onHover, isOpen]
  )

  const handleMove = useCallback(
    (e: MouseEvent) => {
      if (isOpen) {
        if (!selfRef.current.contains(e.target as HTMLElement)) {
          buttonRef.current.click()
          onClose()
        }
      }
    },
    [onClose, isOpen]
  )
  useEffect(() => {
    window.addEventListener('mousemove', handleMove)
    return () => {
      window.removeEventListener('mousemove', handleMove)
    }
  }, [handleMove])
  return (
    <div css={tw`relative inline-block text-left z-20`} ref={selfRef}>
      <span
        css={tw`
    absolute top-[44px] right-0 h-4 z-10
    `}
        style={{ width: '-webkit-fill-available' }}
      />
      <Menu>
        {({ open }) => (
          <>
            <Menu.Button
              tw={'bg-transparent border-0 active:border-0 focus:border-0'}
              onMouseEnter={localOnHover}
              ref={buttonRef}
            >
              {children}
            </Menu.Button>
            <Transition
              as={'div'}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
              beforeLeave={onClose}
            >
              <Menu.Items
                static
                css={[
                  tw`absolute left-0 w-56 mt-2 origin-top
        border-1 border-solid border-black-1 dark:border-white rounded-tiny
        z-50
        `
                ]}
              >
                {options.map((option, i) => (
                  <Menu.Item
                    key={option?.key ?? option.text}
                    as={'div'}
                    css={[
                      tw`flex items-center w-full bg-white dark:bg-black-2  px-2.5 py-0.5`,
                      option.isActive ? tw`bg-grey-5 dark:bg-black-1` : tw``,
                      i === 0 ? tw`rounded-tiny` : tw``,
                      i === options.length - 1 ? tw`rounded-b-tiny` : tw``
                    ]}
                  >
                    <p
                      css={[
                        tw`mb-0 text-average font-semibold text-grey-1 dark:text-grey-1 cursor-pointer`,
                        option.isActive
                          ? tw`
            bg-clip-text bg-gradient-1
            `
                          : tw``
                      ]}
                      style={{
                        WebkitBackgroundClip: option.isActive ? 'text' : 'unset',
                        WebkitTextFillColor: option.isActive ? 'transparent' : 'unset'
                      }}
                      onClick={option.onClick}
                    >
                      {option.text}
                    </p>
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    </div>
  )
}

interface MobileControlsProps {
  options: Controls[]
}
interface Controls {
  key?: string
  text: string
  onClick: () => void
  isActive: boolean
}
const MobileControls: FC<MobileControlsProps> = ({ options }) => (
  <div css={[tw`flex items-center justify-center w-full gap-5.75`]}>
    {options.map((option) => (
      <p
        css={[
          tw`text-average font-semibold text-grey-1 dark:text-grey-1 cursor-pointer`,
          option.isActive ? tw`text-blue-1 dark:text-white` : tw``
        ]}
        onClick={option.onClick}
        key={option?.key ?? option.text}
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
  const { rive, RiveComponent, setContainerRef } = useRiveAnimations({
    animation,
    autoplay: true,
    canvasWidth: 40,
    canvasHeight: 40
  })

  useRiveThemeToggle(rive, animation, stateMachine)
  const { stateInput } = useRiveStateToggle(rive, animation, stateMachine, path)
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
        isActive ? tw` dark:bg-black-2 bg-grey-4` : tw``
      ]}
      onMouseEnter={onHover}
      onMouseLeave={onHover}
      onClick={navigateToPath}
    >
      <RiveAnimationWrapper setContainerRef={setContainerRef} width={40} height={40}>
        <RiveComponent />
      </RiveAnimationWrapper>
      <p
        css={[
          tw`mb-0 text-tiny font-semibold text-grey-1 dark:text-grey-1`,
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
  const { isSpot, setIsSpot } = useCrypto()
  const setSpot = useCallback(() => setIsSpot(true), [setIsSpot])
  const setPerps = useCallback(() => setIsSpot(false), [setIsSpot])
  if (breakpoint.isMobile || breakpoint.isTablet) return null
  return (
    <div css={tw`flex items-center gap-3 mx-auto`}>
      <HeaderMainNav
        text={'Swap'}
        riveAnimation={'swap'}
        stateMachine={RIVE_ANIMATION.swap.stateMachines.SwapInteractions.stateMachineName}
        path={'/swap'}
      />
      <HeaderMainNav
        text={'Trade'}
        riveAnimation={'dex'}
        stateMachine={RIVE_ANIMATION.dex.stateMachines.DEXInteractions.stateMachineName}
        path={'/trade'}
        hasDropdown={true}
        options={[
          {
            text: 'Perps',
            onClick: setPerps,
            isActive: !isSpot
          },
          {
            text: 'Spot',
            onClick: setSpot,
            isActive: isSpot
          }
        ]}
      />
      <HeaderMainNav
        text={"NFT's"}
        riveAnimation={'aggregator'}
        stateMachine={RIVE_ANIMATION.aggregator.stateMachines.AggregatorInteractions.stateMachineName}
        path={'/nfts'}
        hasDropdown={false} // TODO: add when it is added
        options={[
          {
            text: 'NFTs',
            onClick: () => console.log('something here'),
            isActive: true
          },
          {
            text: 'Marketplace',
            onClick: () => console.log('something here'),
            isActive: false
          }
        ]}
      />
      <HeaderMainNav
        text={'Farm'}
        riveAnimation={'farm'}
        stateMachine={RIVE_ANIMATION.farm.stateMachines.FarmInteractions.stateMachineName}
        path={'/farm'}
      />
      <HeaderMainNav
        text={'Stats'}
        riveAnimation={'stats'}
        stateMachine={RIVE_ANIMATION.stats.stateMachines.StatsInteractions.stateMachineName}
        path={'/stats'}
        hasDropdown={false} // Renable when added
        options={[
          {
            text: 'Stats',
            onClick: () => console.log('something here'),
            isActive: true
          },
          {
            text: 'Leaderboard',
            onClick: () => console.log('something here'),
            isActive: false
          }
        ]}
      />
    </div>
  )
}
interface HeaderMainNavProps {
  text: string
  riveAnimation: string
  stateMachine: string
  path: string
  hasDropdown?: boolean
  options?: Controls[]
}
const HeaderMainNav: FC<HeaderMainNavProps> = ({
  riveAnimation,
  text,
  stateMachine,
  path,
  hasDropdown,
  options
}) => {
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
  useRiveThemeToggle(rive.rive, riveAnimation, stateMachine)
  const { stateInput } = useRiveStateToggle(rive.rive, riveAnimation, stateMachine, path)
  const [isOpen, setIsOpen] = useState(false)

  const navigateToPath = useCallback(() => {
    history.push(path)
  }, [history, path])
  const onHover = useCallback(
    (e: BaseSyntheticEvent) => {
      if (stateInput && !pathname.startsWith(path)) {
        stateInput.value = !stateInput.value
      }
      setIsOpen(true)
    },
    [stateInput, pathname, path]
  )
  const onClose = useCallback(() => {
    setIsOpen(false)
    if (stateInput && !pathname.startsWith(path)) {
      stateInput.value = false
    }
  }, [stateInput, pathname, path])
  const component = useMemo(() => {
    const active = isOpen ? 'selected' : 'inactive'
    return (
      <div css={tw`flex flex-col items-center justify-center h-full cursor-pointer`} onClick={navigateToPath}>
        <div css={[tw`flex gap-0.25 items-center justify-center`]}>
          <RiveAnimationWrapper setContainerRef={rive.setContainerRef} width={24} height={24}>
            <rive.RiveComponent />
          </RiveAnimationWrapper>
          {hasDropdown && <img src={`img/assets/chevron-${mode}-${active}.svg`} />}
        </div>
        <p
          css={[tw`mb-0 text-tiny font-medium text-grey-1 dark:text-grey-2 dark:text-white mt-0.5 h-4`]}
          style={{
            opacity: pathname.startsWith(path) ? 1 : 0.5
          }}
        >
          {text}
        </p>
      </div>
    )
  }, [pathname, navigateToPath, text, mode, riveAnimation, isOpen, hasDropdown])
  return hasDropdown ? (
    <DesktopControls options={options} isOpen={isOpen} onHover={onHover} onClose={onClose}>
      {component}
    </DesktopControls>
  ) : (
    component
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
