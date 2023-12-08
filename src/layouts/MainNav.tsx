import React, { FC, useEffect, useState, useCallback, BaseSyntheticEvent, useRef, useMemo, ReactNode } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { RewardsButton } from '../components/rewards/RewardsPopup'
import { useDarkMode, useRewardToggle } from '../context'
import { ThemeToggle } from '../components/ThemeToggle'
import tw, { TwStyle } from 'twin.macro'
import 'styled-components/macro'
import useBreakPoint from '../hooks/useBreakPoint'
import { Connect } from './Connect'
import { More } from './More'
import useClickOutside from '../hooks/useClickOutside'
import { Menu, Transition } from '@headlessui/react'
import { ModalSlide } from '../components/ModalSlide'
import { MODAL_TYPES } from '../constants'
import { RewardsProvider } from '../context/rewardsContext'
import { MyNFTBag } from '../pages/NFTs/MyNFTBag'

// import { RIVE_ANIMATION } from '../constants'
// import useRiveAnimations, { RiveAnimationWrapper } from '../hooks/useRiveAnimations'
// import useRiveThemeToggle from '../hooks/useRiveThemeToggle'
// import useRiveStateToggle from '../hooks/useRiveStateToggle'
// import { useRive, useStateMachineInput } from '@rive-app/react-canvas'

export const MainNav: FC = () => {
  const { mode } = useDarkMode()
  const breakpoint = useBreakPoint()
  const history = useHistory()
  const navigateHome = useCallback(() => window.location.reload(), [history])
  const { rewardModal, rewardToggle } = useRewardToggle()
  const location = useLocation()
  const query = new URLSearchParams(location.search)
  const showRewardsModal = query.get('rewards')

  useEffect(() => {
    if (showRewardsModal) {
      rewardToggle(true)
    }
  }, [location])

  return (
    <div
      css={[
        tw`w-screen flex flex-col border-0 border-b-1 border-solid border-grey-2 dark:border-black-4
        fixed top-0 z-[998]
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
        <div css={tw`flex items-center gap-1.5 absolute cursor-pointer`} onClick={navigateHome}>
          <img css={breakpoint.isMobile ? [tw`h-[28px]`] : [tw`h-[22px]`]} src={`/img/mainnav/Icon.svg`} />
          {(breakpoint.isDesktop || breakpoint.isLaptop) && (
            <img css={tw`h-[15px]`} src={`/img/mainnav/goosefx-logo-${mode}.svg`} />
          )}
        </div>

        <DesktopNav />
        <div css={tw`flex items-center gap-2 absolute right-0 mr-2.5 min-md:mr-0`}>
          <RewardsProvider>
            <RewardsButton />
          </RewardsProvider>
          <Connect />
          <MyNFTBag />
          {/* <NotificationButton /> */}
          <More />
          <MobileNav />
        </div>
      </div>
    </div>
  )
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
          text: 'More',
          path: '/leaderboard'
        })
        break
      // case pathname.includes('swap'):
      //   setCurrentPage({
      // animation: 'swap',
      // stateMachine: RIVE_ANIMATION.swap.stateMachines.SwapInteractions.stateMachineName,
      //   text: 'Swap',
      //   path: '/swap'
      // })
      // break
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
        <img css={tw`h-[35px]`} src={`/img/mainnav/menu-${mode}.svg`} />
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
  const { pathname } = useLocation()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const history = useHistory()
  return (
    <div
      css={[
        tw`fixed top-0 right-0 left-0 h-screen w-screen dark:bg-black-1 bg-grey-5 items-center flex flex-col
        dark:text-grey-5 rounded-b-bigger block justify-center z-[999]`,
        isOpen ? tw`flex animate-slideInTop` : tw`hidden `,
        playCloseAnimation ? tw`animate-slideOutTop` : tw``
      ]}
    >
      <div tw={'absolute top-3.75 left-0 w-full flex justify-center items-center'}>
        <ThemeToggle />
      </div>
      <button
        onClick={toggleSettingsDrawer}
        css={[tw`absolute top-2 right-2 bg-transparent border-none h-[35px]`]}
      >
        <img key={`close-mobile-button`} src={`/img/mainnav/close-thin-${mode}.svg`} alt="close-icon" />
      </button>
      <div css={[tw`h-[70vh] flex flex-col gap-5`]}>
        {/* <NavItem
          animation={'swap'}
          stateMachine={RIVE_ANIMATION.swap.stateMachines.SwapInteractions.stateMachineName}
          text={'swap'}
          path={'/swap'}
        /> */}
        <NavItem
          // animation={'dex'}
          // stateMachine={RIVE_ANIMATION.dex.stateMachines.DEXInteractions.stateMachineName}
          text={'trade'}
          path={'/trade'}
        />
        <NavItem
          // animation={'farm'}
          // stateMachine={RIVE_ANIMATION.farm.stateMachines.FarmInteractions.stateMachineName}
          text={'farm'}
          path={'/farm'}
        />
        <NavItem
          // animation={'aggregator'}
          // stateMachine={RIVE_ANIMATION.aggregator.stateMachines.AggregatorInteractions.stateMachineName}
          text={'NFTs'}
          iconBase={'nfts'}
          path={'/nfts'}
        />
        <NavItem
          // animation={'stats'}
          // stateMachine={RIVE_ANIMATION.stats.stateMachines.StatsInteractions.stateMachineName}
          text={'more'}
          path={'/leaderboard'}
          iconBase={'stats'}
          hasDropdown={true}
          menuPosition={'center'}
          customMenuStyle={{
            menuItems: [tw`w-42`]
          }}
          options={[
            {
              text: 'Leaderboard',
              onClick: () => history.push('/leaderboard'),
              //onClick: () => null,
              isActive: pathname.includes('leaderboard')
            }
          ]}
        />
      </div>
      {/* TODO: add notifications */}
      {/* <div css={[tw`flex items-center gap-3.25`]}>
        <NotificationButton />
        <p css={[tw`mb-0 text-average font-semibold text-grey-1 dark:text-white`]}>Notifications</p>
      </div> */}
    </div>
  )
}

interface DesktopControlsProps {
  children: ReactNode
  options: Controls[]
  isOpen: boolean
  onHover: (e: BaseSyntheticEvent) => void
  onClose: () => void
  onOpen?: () => void
  menuPosition?: string
  customMenuStyle?: CustomMenuStyle
}

const DropDownControls: FC<DesktopControlsProps> = ({
  children,
  options,
  onHover,
  isOpen,
  onClose,
  menuPosition = 'right',
  onOpen,
  customMenuStyle
}) => {
  const selfRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef(null)
  const localOnHover = useCallback(
    (e: BaseSyntheticEvent) => {
      console.log(isOpen, 'click')
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
  const menuPositionStyle = useMemo(() => {
    switch (menuPosition) {
      case 'center':
        return {
          left: '50%',
          transform: 'translateX(-50%)'
        }
      default:
        return {
          left: 0
        }
    }
  }, [menuPosition])
  const breakpoints = useBreakPoint()
  const handleMenuButtonClick = useCallback(() => (isOpen ? onClose() : onOpen()), [isOpen, onOpen, onClose])
  const handleOptionClick = useCallback(
    (callback: (...args: any[]) => any) => () => {
      onClose()
      buttonRef?.current?.click()
      callback()
    },
    [onClose]
  )
  return (
    <div css={tw`relative inline-block text-left z-20 `} ref={selfRef}>
      <span css={tw`absolute top-[44px] right-0 h-4 z-10`} style={{ width: '-webkit-fill-available' }} />
      <Menu>
        {() => (
          <>
            <Menu.Button
              css={[
                tw`bg-transparent border-0 outline-none focus-visible:outline-none active:outline-none
                focus:outline-none focus-visible:border-0 active:border-0
                focus:border-0 p-0`
              ].concat(customMenuStyle?.button ?? [])}
              onMouseEnter={breakpoints.isMobile ? () => null : localOnHover}
              onClick={handleMenuButtonClick}
              ref={buttonRef}
            >
              {children}
            </Menu.Button>
            <Transition
              show={isOpen}
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
                  tw`absolute w-56 min-md:w-max mt-1.75 origin-top
        border-1 border-solid border-black-1 dark:border-white rounded-tiny
        outline-none focus-visible:outline-none active:outline-none
        focus:outline-none
        z-50
        `
                ].concat(customMenuStyle?.menuItems ?? [])}
                style={menuPositionStyle}
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
                    ].concat(customMenuStyle?.menuItem ?? [])}
                  >
                    <p
                      css={[
                        tw`mb-0 text-average min-md:text-regular font-semibold min-md:font-medium text-grey-1
                         dark:text-grey-1 cursor-pointer hover:text-transparent hover:bg-gradient-1 hover:bg-clip-text`,
                        option.isActive ? tw`bg-clip-text bg-gradient-1` : tw``
                      ].concat(customMenuStyle?.menuItemText ?? [])}
                      style={{
                        WebkitBackgroundClip: option.isActive ? 'text' : '',
                        WebkitTextFillColor: option.isActive ? 'transparent' : ''
                      }}
                      onClick={handleOptionClick(option.onClick)}
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

interface Controls {
  key?: string
  text: string
  onClick: () => void
  isActive: boolean
}

const DesktopNav: FC = () => {
  const breakpoint = useBreakPoint()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const history = useHistory()
  const { pathname } = useLocation()
  if (breakpoint.isMobile || breakpoint.isTablet) return null
  return (
    <div css={tw`flex items-center gap-6 mx-auto`}>
      {/* <NavItem
        text={'swap'}
        riveAnimation={'swap'}
        stateMachine={RIVE_ANIMATION.swap.stateMachines.SwapInteractions.stateMachineName}
        path={'/swap'}
      /> */}
      <NavItem
        text={'trade'}
        // riveAnimation={'stats'}
        // stateMachine={RIVE_ANIMATION.stats.stateMachines.StatsInteractions.stateMachineName}
        path={'/trade'}
        hasDropdown={true} // Renable when added
        options={[
          {
            text: 'Trade',
            onClick: () => history.push('/trade'),
            //onClick: () => null,
            isActive: pathname.includes('trade')
          },
          {
            text: 'Account',
            onClick: () => history.push('/account'),
            //onClick: () => null,
            isActive: pathname.includes('account')
          }
        ]}
      />
      <NavItem
        text={'farm'}
        // riveAnimation={'farm'}
        // stateMachine={RIVE_ANIMATION.farm.stateMachines.FarmInteractions.stateMachineName}
        path={'/farm'}
      />
      <NavItem
        text={'NFTs'}
        iconBase={'nfts'}
        // riveAnimation={'aggregator'}
        // stateMachine={RIVE_ANIMATION.aggregator.stateMachines.AggregatorInteractions.stateMachineName}
        path={'/nfts'}
      />
      <NavItem
        text={'More'}
        // riveAnimation={'stats'}
        // stateMachine={RIVE_ANIMATION.stats.stateMachines.StatsInteractions.stateMachineName}
        path={'/stats'}
        hasDropdown={true} // Renable when added
        iconBase={'stats'}
        options={[
          {
            text: 'Leaderboard',
            onClick: () => history.push('/leaderboard'),
            //onClick: () => null,
            isActive: pathname.includes('leaderboard')
          }
          // {
          //   text: 'Leaderboard',
          //   onClick: () => console.log('something here'),
          //   isActive: false
          // }
        ]}
      />
    </div>
  )
}
interface MainNavIconProps {
  text: string
  iconBase?: string
  path: string
  hasDropdown?: boolean
  options?: Controls[]
  riveAnimation?: string
  stateMachine?: string
  menuPosition?: string
  customMenuStyle?: CustomMenuStyle
}
type CustomMenuStyle = {
  button?: TwStyle[]
  menuItems?: TwStyle[]
  menuItem?: TwStyle[]
  menuItemText?: TwStyle[]
}
const NavItem: FC<MainNavIconProps> = ({
  // riveAnimation,
  text,
  iconBase,
  // stateMachine,
  path,
  hasDropdown,
  options,
  menuPosition,
  customMenuStyle
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
  const onOpen = useCallback(() => setIsOpen(true), [])
  const component = useMemo(() => {
    // isOpened or on page
    const hasActiveItems = options && options.filter((option) => option.isActive).length > 0
    const activeDropdown: string = isOpen ? 'selected' : hasDropdown && hasActiveItems ? 'active' : 'inactive'
    const curRoute: boolean = pathname.startsWith(path) || hasActiveItems
    return (
      <div
        css={[
          tw`flex min-md:flex-col items-center justify-center h-full cursor-pointer
        px-4.5 py-1.25 min-md:p-0 rounded-full min-md:rounded-none h-12.5 min-md:h-auto
        w-42 min-md:w-auto bg-white dark:bg-black-2 min-md:bg-transparent dark:min-md:bg-transparent
        gap-2.5 min-md:gap-0.25 leading-[1]
        `
        ]}
        onClick={() => {
          if (!hasDropdown) {
            navigateToPath()
          }
        }}
      >
        <div css={[tw`flex gap-2.5 min-md:gap-0.25 items-center justify-start`]}>
          {/* <RiveAnimationWrapper setContainerRef={rive.setContainerRef} width={28} height={28}>
            <rive.RiveComponent />
          </RiveAnimationWrapper> */}
          <img
            css={[tw`h-[40px] w-[40px] min-md:h-[26px] min-md:w-[26px]`]}
            src={`/img/mainnav/${iconBase ?? text}-${mode}${curRoute || isOpen ? '-active' : ''}.svg`}
            alt={text}
          />
          <div css={[tw`flex gap-2.5`]}>
            <h5
              css={[
                tw`mb-0 text-average min-md:text-tiny uppercase font-semibold tracking-wider
            text-grey-1 dark:text-grey-2  min-md:mt-0.5 min-md:h-4 block min-md:hidden `,
                curRoute || isOpen ? tw`text-black-4 dark:text-grey-5` : tw``
              ]}
              // style={{
              //   opacity: curRoute ? 1 : 0.5
              // }}
            >
              {text}
            </h5>
            {hasDropdown && (
              <img
                css={[tw`w-3.5 min-md:w-2.25`]}
                src={`/img/assets/chevron-${mode}-${activeDropdown}.svg`}
                loading={'eager'}
              />
            )}
          </div>
        </div>
        <h6
          css={[
            tw`mb-0 text-smallest uppercase font-semibold tracking-wider
            text-grey-1 dark:text-grey-2 dark:text-white min-md:mt-1 hidden min-md:block`,
            curRoute || isOpen ? tw`text-black-4 dark:text-grey-5 min-md:opacity-100` : tw`min-md:opacity-50`
          ]}
          // style={{
          //   opacity: curRoute ? 1 : 0.5
          // }}
        >
          {text}
        </h6>
      </div>
    )
  }, [mode, pathname, navigateToPath, isOpen, hasDropdown])
  return hasDropdown ? (
    <DropDownControls
      customMenuStyle={customMenuStyle}
      onOpen={onOpen}
      menuPosition={menuPosition}
      options={options}
      isOpen={isOpen}
      onHover={onHover}
      onClose={onClose}
    >
      {component}
    </DropDownControls>
  ) : (
    component
  )
}
