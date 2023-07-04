import React, { FC, useEffect, useState, useCallback, BaseSyntheticEvent, useRef, useMemo, ReactNode } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { RewardsButton } from '../components/RewardsPopup'
import { useDarkMode, useNFTAggregator, useRewardToggle } from '../context'
import { ThemeToggle } from '../components/ThemeToggle'
import tw from 'twin.macro'
import 'styled-components/macro'
import useBreakPoint from '../hooks/useBreakPoint'
import { Connect } from './Connect'
import { More } from './More'
import useClickOutside from '../hooks/useClickOutside'
import { Menu, Switch, Transition } from '@headlessui/react'
import { ModalSlide } from '../components/ModalSlide'
import { MODAL_TYPES } from '../constants'
import { SVGBlackToGrey } from '../styles'
import { clamp } from '../utils'
// import { MyNFTBag } from '../pages/NFTs/MyNFTBag'

// import { RIVE_ANIMATION } from '../constants'
// import useRiveAnimations, { RiveAnimationWrapper } from '../hooks/useRiveAnimations'
// import useRiveThemeToggle from '../hooks/useRiveThemeToggle'
// import useRiveStateToggle from '../hooks/useRiveStateToggle'
// import { useRive, useStateMachineInput } from '@rive-app/react-canvas'
//

// const ResponsiveDropdown: FC<{ logoAnimationTime?: number }> = () => {
//   const { mode } = useDarkMode()
//   const [opacity, setOpacity] = useState(0)

//   const toggleOpacity = useCallback(() => setOpacity(1 - opacity), [opacity])

//   const computeDropdownIcon = useCallback(
//     () =>
//       mode === 'dark' ? (
//         <SVGToWhite src={`${process.env.PUBLIC_URL}/img/assets/dropdown_icon.svg`} onClick={toggleOpacity} />
//       ) : (
//         <img src={`${process.env.PUBLIC_URL}/img/assets/dropdown_icon.svg`} onClick={toggleOpacity} alt="" />
//       ),
//     [mode, toggleOpacity]
//   )
//   const [dropdownIcon, setDropdownIcon] = useState(computeDropdownIcon())

//   useEffect(() => {
//     setDropdownIcon(computeDropdownIcon())
//   }, [computeDropdownIcon, mode])

//   return <></>
// }

export const MainNav: FC = () => {
  const { mode } = useDarkMode()
  const breakpoint = useBreakPoint()
  const history = useHistory()
  const navigateHome = useCallback(() => history.push('/swap'), [history])
  const { rewardModal, rewardToggle } = useRewardToggle()

  return (
    <div
      css={[
        tw`w-screen flex flex-col border-b-1 border-solid border-grey-2 dark:border-black-4
       `
      ]}
    >
      {rewardModal && (
        <ModalSlide
          rewardModal={rewardModal}
          modalType={MODAL_TYPES.REWARDS}
          rewardToggle={!breakpoint.isMobile && rewardToggle}
        />
      )}
      <div
        css={[
          tw`h-14 px-5 items-center flex justify-between bg-grey-5 dark:bg-black-1
        relative
        `
        ]}
      >
        <div css={tw`w-15.75 h-5.25 flex items-center gap-2 absolute cursor-pointer`} onClick={navigateHome}>
          <img src={`/img/mainnav/g-logo.svg`} />
          {(breakpoint.isDesktop || breakpoint.isLaptop) && (
            <img css={tw`h-3`} src={`/img/mainnav/goosefx-logo-${mode}.svg`} />
          )}
        </div>

        <DesktopNav />
        <div css={tw`flex items-center gap-2 absolute right-0 mr-2.5 min-md:mr-0`}>
          <RewardsButton />
          <Connect />
          {/* <NotificationButton /> */}
          <More />
          <MobileNav />
        </div>
      </div>
      <SecondaryNavRoot />
    </div>
  )
}
const SecondaryNavRoot: FC = () => {
  const { pathname } = useLocation()

  switch (true) {
    case pathname.includes('nfts'):
      return <SecondaryNavNFTs />
    case pathname.includes('farm'):
    case pathname.includes('stats'):
    case pathname.includes('swap'):
    default:
      return <></>
  }
}
// TODO: Add notification back in
// const NotificationButton: FC = () => {
//   const { mode } = useDarkMode()
//   return (
//     <div css={[tw` cursor-pointer`]}>
//       <img css={[tw`h-7.5 w-7.5`]} src={`/img/mainnav/notification-${mode}.svg`} />
//     </div>
//   )
// }

const SecondaryNavNFTs: FC = () => {
  const [enabled, setEnabled] = useState(false)

  return (
    <div css={[tw`h-12 w-full flex items-center px-2.5 py-2.25 bg-grey-5 dark:bg-black-1`]}>
      {/* <NFTProfileButton /> */}
      <div css={[tw`flex ml-auto gap-4.75 items-center`]}>
        <Switch
          checked={enabled}
          onChange={setEnabled}
          style={{ flexShrink: 0 }}
          css={[
            tw`bg-gradient-1 border-0
          relative inline-flex h-8.75 w-19 min-md:h-6.5 min-md:w-12.5 cursor-pointer rounded-full
          transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white
           focus-visible:ring-opacity-75`
          ]}
        >
          <span className="sr-only">Use setting</span>
          <img
            aria-hidden="true"
            css={[
              tw`pointer-events-none absolute h-8.75 w-8.75 min-md:h-6.5 min-md:w-6.5  rounded-full bg-white shadow-lg
             ring-0 transition-all duration-200 ease-in-out object-cover top-0`,
              enabled ? tw`right-0` : tw`left-0`
            ]}
            src={enabled ? '/img/crypto/SOL.svg' : '/img/crypto/USDC.svg'}
          />
        </Switch>
        {/* TODO: remove div wrapper */}
        <div style={{ display: 'none' }}>
          <CartButton />
        </div>
      </div>
    </div>
  )
}

// const NFTProfileButton: FC = () => {
//   console.log('NFTProfileButton')
//   return (
//     <button
//       css={[
//         tw`border-1 border-solid border-grey-1 dark:border-grey-2 p-1.25 rounded-full
//      bg-white dark:bg-black-2 flex items-center
//      `
//       ]}
//     >
//       <img
//         css={[tw`h-6 w-6 rounded-full object-cover border-1 border-solid border-grey-1 dark:border-grey-2`]}
//         src={`/img/mainnav/nft-profile.svg`}
//       />
//       <p css={[tw`mb-0 text-tiny font-semibold text-black-4 dark:text-white ml-1.25`]}>My Profile</p>
//     </button>
//   )
// }

const MobileNav: FC = () => {
  const breakpoint = useBreakPoint()
  const { mode } = useDarkMode()
  const { pathname } = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState({
    // animation: 'swap',
    // stateMachine: RIVE_ANIMATION.swap.stateMachines.SwapInteractions.stateMachineName,
    text: 'Swap',
    path: '/swap'
  })
  useEffect(() => setIsOpen(false), [pathname])
  useEffect(() => {
    switch (true) {
      case pathname.includes('trade'):
        setCurrentPage(() => ({
          // animation: 'dex',
          // stateMachine: RIVE_ANIMATION.dex.stateMachines.DEXInteractions.stateMachineName,
          text: 'trade',
          path: '/trade'
        }))
        break
      case pathname.includes('nfts'):
        setCurrentPage({
          // animation: 'aggregator',
          // stateMachine: RIVE_ANIMATION.aggregator.stateMachines.AggregatorInteractions.stateMachineName,
          text: 'NFTs',
          path: '/nfts'
        })
        break
      case pathname.includes('farm'):
        setCurrentPage({
          // animation: 'farm',
          // stateMachine: RIVE_ANIMATION.farm.stateMachines.FarmInteractions.stateMachineName,
          text: 'Farm',
          path: '/farm'
        })
        break
      case pathname.includes('stats'):
        setCurrentPage({
          // animation: 'stats',
          // stateMachine: RIVE_ANIMATION.stats.stateMachines.StatsInteractions.stateMachineName,
          text: 'Stats',
          path: '/stats'
        })
        break
      case pathname.includes('swap'):
        setCurrentPage({
          // animation: 'swap',
          // stateMachine: RIVE_ANIMATION.swap.stateMachines.SwapInteractions.stateMachineName,
          text: 'Swap',
          path: '/swap'
        })
        break
      default:
        break
    }
  }, [pathname])
  // const { rive, RiveComponent, setContainerRef } = useRiveAnimations({
  //   animation: currentPage.animation,
  //   autoplay: true,
  //   canvasWidth: 40,
  //   canvasHeight: 40
  // })

  // useRiveThemeToggle(rive, currentPage.animation, currentPage.stateMachine)
  // useRiveStateToggle(rive, currentPage.animation, currentPage.stateMachine, currentPage.path)
  const onClose = useCallback(() => setIsOpen(false), [])
  const toggleSettingsDrawer = useCallback(() => setIsOpen((prev) => !prev), [])
  const isOnPage = useMemo(() => pathname.includes(currentPage.path), [pathname, currentPage.path])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        <img css={tw`h-[35px]`} src={`img/mainnav/menu-${mode}.svg`} />
      </div>
      <MobileSettingsDrawer
        isOpen={isOpen}
        playCloseAnimation={playCloseAnimation}
        toggleSettingsDrawer={toggleSettingsDrawer}
      />
    </span>
  )
}

interface MobileSettingsDrawerProps {
  isOpen: boolean
  playCloseAnimation: boolean
  toggleSettingsDrawer: () => void
}

const MobileSettingsDrawer: FC<MobileSettingsDrawerProps> = ({
  isOpen,
  playCloseAnimation,
  toggleSettingsDrawer
}) => {
  const { mode } = useDarkMode()

  return (
    <div
      css={[
        tw`fixed top-0 right-0 left-0 h-screen w-screen dark:bg-black-1 bg-grey-5 items-center flex flex-col
        dark:text-grey-5 rounded-b-bigger block justify-center z-50`,
        isOpen ? tw`flex animate-slideInTop` : tw`hidden `,
        playCloseAnimation ? tw`animate-slideOutTop` : tw``
      ]}
    >
      <div tw={'absolute top-3 left-0 w-full flex justify-center items-center'}>
        <ThemeToggle />
      </div>
      <button
        onClick={toggleSettingsDrawer}
        css={[tw`absolute top-2 right-2 bg-transparent border-none h-[35px]`]}
      >
        {mode === 'dark' ? (
          <img src={`/img/assets/cross-white.svg`} alt="close-icon" />
        ) : (
          <SVGBlackToGrey src={`/img/assets/cross-white.svg`} alt="close-icon" />
        )}
      </button>
      <div css={[tw`h-[70vh] flex flex-col gap-5`]}>
        <MobileNavItem
          // animation={'swap'}
          // stateMachine={RIVE_ANIMATION.swap.stateMachines.SwapInteractions.stateMachineName}
          text={'swap'}
          path={'/swap'}
        />
        <MobileNavItem
          // animation={'dex'}
          // stateMachine={RIVE_ANIMATION.dex.stateMachines.DEXInteractions.stateMachineName}
          text={'trade'}
          path={'/trade'}
        />
        <MobileNavItem
          // animation={'aggregator'}
          // stateMachine={RIVE_ANIMATION.aggregator.stateMachines.AggregatorInteractions.stateMachineName}
          text={'nfts'}
          path={'/nfts'}
        />
        <MobileNavItem
          // animation={'farm'}
          // stateMachine={RIVE_ANIMATION.farm.stateMachines.FarmInteractions.stateMachineName}
          text={'farm'}
          path={'/farm'}
        />
        {/* <MobileNavItem
        animation={'stats'}
        stateMachine={RIVE_ANIMATION.stats.stateMachines.StatsInteractions.stateMachineName}
        text={'Stats'}
        path={'/stats'}
      /> */}
      </div>
      <div>
        <MobileNavControls />
      </div>
      {/* TODO: add notifications */}
      {/* <div css={[tw`flex items-center gap-3.25`]}>
        <NotificationButton />
        <p css={[tw`mb-0 text-average font-semibold text-grey-1 dark:text-white`]}>Notifications</p>
      </div> */}
    </div>
  )
}

const MobileNavControls: FC = () => {
  const { pathname } = useLocation()
  // const history = useHistory()
  // const { setIsSpot } = useCrypto()

  //TODO: leaderboard hook for is active
  //TODO: aggregator hook for is active
  // const handlePerpsSpotToggle = useCallback(
  //   (isSpotToggle: boolean) => () => {
  //     setIsSpot(isSpotToggle)
  //     history.push(`/trade`)
  //   },
  //   [setIsSpot, history]
  // )
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
  // return (
  //   <MobileControls
  //     options={[
  //       {
  //         text: 'Perps',
  //         onClick: handlePerpsSpotToggle(false),
  //         isActive: !isSpot
  //       },
  //       {
  //         text: 'Spot',
  //         onClick: handlePerpsSpotToggle(true),
  //         isActive: isSpot
  //       }
  //     ]}
  //   />
  // )
  switch (true) {
    case pathname.includes('trade'):
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
      <span css={tw`absolute top-[44px] right-0 h-4 z-10`} style={{ width: '-webkit-fill-available' }} />
      <Menu>
        {() => (
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
                        option.isActive ? tw`bg-clip-text bg-gradient-1` : tw``
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

// interface MobileControlsProps {
//   options: Controls[]
// }
interface Controls {
  key?: string
  text: string
  onClick: () => void
  isActive: boolean
}
// const MobileControls: FC<MobileControlsProps> = ({ options }) => (
//   <div css={[tw`flex items-center justify-center w-full gap-5.75`]}>
//     {options.map((option) => (
//       <p
//         css={[
//           tw`text-average font-semibold text-grey-1 dark:text-grey-1 cursor-pointer`,
//           option.isActive ? tw`text-blue-1 dark:text-white` : tw``
//         ]}
//         onClick={option.onClick}
//         key={option?.key ?? option.text}
//       >
//         {option.text}
//       </p>
//     ))}
//   </div>
// )

interface MobileNavItemProps {
  text: string
  path: string
  animation?: string
  stateMachine?: string
}
const MobileNavItem: FC<MobileNavItemProps> = ({ text, path }) => {
  const { mode } = useDarkMode()
  const { pathname } = useLocation()
  const history = useHistory()
  // const { rive, RiveComponent, setContainerRef } = useRiveAnimations({
  //   animation,
  //   autoplay: true,
  //   canvasWidth: 40,
  //   canvasHeight: 40
  // })

  // useRiveThemeToggle(rive, animation, stateMachine)
  // const { stateInput } = useRiveStateToggle(rive, animation, stateMachine, path)
  const onHover = useCallback(() => {
    // if (!stateInput) return
    if (pathname.includes(path)) return
    // stateInput.value = !stateInput.value
  }, [pathname, path])
  const isActive = useMemo(() => pathname.includes(path), [pathname, path])
  const navigateToPath = useCallback(() => history.push(path), [path, history])
  return (
    <button
      css={[
        tw`flex items-center gap-2.5 cursor-pointer border-none px-4.5 py-1.25 rounded-full
    h-12.5 w-max bg-transparent dark:bg-transparent w-42 justify-center
    `,
        isActive ? tw` dark:bg-black-2 bg-grey-4` : tw``
      ]}
      onMouseEnter={onHover}
      onMouseLeave={onHover}
      onClick={navigateToPath}
    >
      {/* <RiveAnimationWrapper setContainerRef={setContainerRef} width={40} height={40}>
        <RiveComponent />
      </RiveAnimationWrapper> */}
      <img
        css={[tw`h-[40px] w-[40px]`]}
        src={`/img/mainnav/${text}-${mode}${isActive ? '-active' : ''}.svg`}
        alt={text}
      />
      <p
        css={[
          tw`mb-0 text-average font-semibold uppercase text-grey-1 dark:text-grey-1`,
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
    <div css={tw`flex items-center gap-6 mx-auto`}>
      <MainNavIcon
        text={'swap'}
        // riveAnimation={'swap'}
        // stateMachine={RIVE_ANIMATION.swap.stateMachines.SwapInteractions.stateMachineName}
        path={'/swap'}
      />
      <MainNavIcon
        text={'trade'}
        // riveAnimation={'dex'}
        // stateMachine={RIVE_ANIMATION.dex.stateMachines.DEXInteractions.stateMachineName}
        path={'/trade'}
        hasDropdown={false}
      />
      <MainNavIcon
        text={'nfts'}
        // riveAnimation={'aggregator'}
        // stateMachine={RIVE_ANIMATION.aggregator.stateMachines.AggregatorInteractions.stateMachineName}
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
      <MainNavIcon
        text={'farm'}
        // riveAnimation={'farm'}
        // stateMachine={RIVE_ANIMATION.farm.stateMachines.FarmInteractions.stateMachineName}
        path={'/farm'}
      />

      {/* <MainNavIcon
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
      /> */}
    </div>
  )
}
interface MainNavIconProps {
  text: string
  path: string
  hasDropdown?: boolean
  options?: Controls[]
  riveAnimation?: string
  stateMachine?: string
}
const MainNavIcon: FC<MainNavIconProps> = ({
  // riveAnimation,
  text,
  // stateMachine,
  path,
  hasDropdown,
  options
}) => {
  const { mode } = useDarkMode()
  const { pathname } = useLocation()
  const history = useHistory()
  //const breakpoint = useBreakPoint()
  // const rive = useRiveAnimations({
  //   animation: riveAnimation,
  //   autoplay: true,
  //   canvasWidth: 24,
  //   canvasHeight: 24
  // })
  // useRiveThemeToggle(rive.rive, riveAnimation, stateMachine)
  // const { stateInput } = useRiveStateToggle(rive.rive, riveAnimation, stateMachine, path)
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const navigateToPath = useCallback(() => {
    history.push(path)
  }, [history, path])

  const onHover = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (e: BaseSyntheticEvent) => {
      // if (stateInput && !pathname.startsWith(path)) {
      //   stateInput.value = !stateInput.value
      // }
      setIsOpen(true)
    },
    [pathname, path]
  )

  const onClose = useCallback(() => {
    setIsOpen(false)
    // if (stateInput && !pathname.startsWith(path)) {
    //   stateInput.value = false
    // }
  }, [pathname, path])

  const component = useMemo(() => {
    const activeDropdown: string = isOpen ? 'selected' : 'inactive'
    const curRoute: boolean = pathname.startsWith(path)

    return (
      <div css={tw`flex flex-col items-center justify-center h-full cursor-pointer`} onClick={navigateToPath}>
        <div css={[tw`flex gap-0.25 items-center justify-center`]}>
          {/* <RiveAnimationWrapper setContainerRef={rive.setContainerRef} width={28} height={28}>
            <rive.RiveComponent />
          </RiveAnimationWrapper> */}
          <img
            css={[tw`h-[26px] w-[26px]`]}
            src={`/img/mainnav/${text}-${mode}${curRoute ? '-active' : ''}.svg`}
            alt={text}
          />
          {hasDropdown && <img src={`img/assets/chevron-${mode}-${activeDropdown}.svg`} />}
        </div>
        <p
          css={[
            tw`mb-0 text-smallest uppercase font-semibold tracking-wider
            text-grey-1 dark:text-grey-2 dark:text-white mt-0.5 h-4`
          ]}
          style={{
            opacity: curRoute ? 1 : 0.5
          }}
        >
          {text}
        </p>
      </div>
    )
  }, [mode, pathname, navigateToPath, isOpen])
  return hasDropdown ? (
    <DesktopControls options={options} isOpen={isOpen} onHover={onHover} onClose={onClose}>
      {component}
    </DesktopControls>
  ) : (
    component
  )
}

const CartButton: FC = () => {
  const { nftInBag } = useNFTAggregator()
  const cartSize = useMemo(() => {
    const val = clamp(nftInBag.length, 0, 9)
    return val >= 9 ? '9+' : val
  }, [nftInBag])
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
      <img src={`img/assets/shopping-bag-${mode}-inactive.svg`} />
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
