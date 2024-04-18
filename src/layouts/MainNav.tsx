import React, { FC, useEffect, useCallback } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { RewardsButton } from '../components/rewards/RewardsPopup'
import { useDarkMode, useRewardToggle } from '../context'
import { ThemeToggle } from '../components/ThemeToggle'
import tw from 'twin.macro'
import 'styled-components/macro'
import useBreakPoint from '../hooks/useBreakPoint'
import { Connect } from './Connect'
import { More } from './More'
import { ModalSlide } from '../components/ModalSlide'
import { MODAL_TYPES, APP_DEFAULT_ROUTE } from '../constants'
import { CircularArrow } from '../components/common/Arrow'
import {
  Button,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Icon,
  cn,
  Dialog,
  DialogFooter
} from 'gfx-component-lib'
import useBoolean from '../hooks/useBoolean'
import { SOCIAL_MEDIAS } from '../constants'
import NetworkStatus from '@/components/footer/NetworkStatus'
import RPCToggle from '@/components/footer/RPCToggle'
import PriorityFee from '@/components/footer/PriorityFee'

export const MainNav: FC = () => {
  const { mode } = useDarkMode()
  const breakpoint = useBreakPoint()
  const history = useHistory()
  const navigateHome = useCallback(() => history.push(APP_DEFAULT_ROUTE), [history])
  const { rewardModal, rewardToggle } = useRewardToggle()
  const location = useLocation()
  const query = new URLSearchParams(location.search)
  const showRewardsModal = query.get('rewards')
  const [isBannerActive] = useBoolean(false)

  useEffect(() => {
    if (showRewardsModal) {
      rewardToggle(true)
    }
  }, [location])

  const bannerInfo = (
    <div>
      Solana network is currently congested. Due to this some transactions may fail to confirm without retries and
      volumes will be lower than usual. See our{' '}
      <a href={SOCIAL_MEDIAS.twitter} target="_blank" rel="noreferrer">
        Twitter
      </a>{' '}
      for further updates.
    </div>
  )

  return (
    <div className={`w-screen flex flex-col fixed top-0 z-[10]`}>
      {rewardModal && (
        <ModalSlide
          rewardModal={rewardModal}
          modalType={MODAL_TYPES.REWARDS}
          rewardToggle={!breakpoint.isMobile && rewardToggle}
        />
      )}
      {isBannerActive && breakpoint.isDesktop && (
        <div className={'bg-[#FFB800] px-5 py-1 text-text-lightmode-primary'}>{bannerInfo}</div>
      )}

      <div
        className={`h-[56px] px-5 items-center flex justify-between bg-grey-5 dark:bg-black-1
        relative border-0 border-b-1 border-solid border-grey-2 dark:border-black-4`}
      >
        <div className={`flex items-center gap-1.5 absolute cursor-pointer`} onClick={navigateHome}>
          <img className={cn(breakpoint.isMobile ? 'h-[28px]' : 'h-[22px]')} src={`/img/mainnav/Icon.svg`} />
          {(breakpoint.isDesktop || breakpoint.isLaptop) && (
            <img className={`h-[15px]`} src={`/img/mainnav/goosefx-logo-${mode}.svg`} />
          )}
        </div>

        <DesktopNav />
        <div className={`flex items-center gap-2 absolute right-0 mr-2.5 min-md:mr-0`}>
          <RewardsButton />
          <Connect />
          {/* <NotificationButton /> */}
          <More />
          <MobileNav />
        </div>
      </div>
    </div>
  )
}

const MobileNav: FC = () => {
  const breakpoint = useBreakPoint()
  const { mode } = useDarkMode()
  const { pathname } = useLocation()
  const [isOpen, setIsOpen] = useBoolean(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const history = useHistory()
  const { rewardToggle, changePanel, rewardModal, panelIndex } = useRewardToggle()
  const [isTradeOpen, setIsTradeOpen] = useBoolean(false)
  const [isLeaderboardOpen, setIsLeaderBoardOpen] = useBoolean(false)
  const [isAboutOpen, setIsAboutOpen] = useBoolean(false)
  const tradeActive =
    pathname.includes('trade') || (rewardModal && panelIndex == 1) || pathname.includes('account')

  if (breakpoint.isLaptop || breakpoint.isDesktop) return null
  return (
    <>
      <Dialog open={isOpen} modal={false}>
        <DialogTrigger onClick={setIsOpen.on}>
          <img className={`h-[35px]`} src={`/img/mainnav/menu-${mode}.svg`} alt={'open drawer'} />
        </DialogTrigger>
        <DialogContent fullScreen={true} className={'z-[999] flex flex-col gap-0'}>
          <DialogHeader className={'items-center'}>
            <DialogClose className={'ml-auto mr-3.75 mt-3.75'} onClick={setIsOpen.off}>
              <Icon src={`/img/assets/close-${mode}.svg`} size={'sm'} />
            </DialogClose>
            <ThemeToggle />
          </DialogHeader>
          <DialogBody
            className={
              'mx-auto my-auto justify-center items-center flex flex-col flex-1 gap-[15px] w-full px-[15px]'
            }
          >
            <Button
              variant={pathname.includes('bridge') ? 'outline' : 'ghost'}
              colorScheme={pathname.includes('bridge') ? 'secondaryGradient' : 'none'}
              size={'lg'}
              fullWidth
              onClick={() => {
                setIsOpen.off()
                history.push('/bridge')
              }}
              className={cn(
                `text-center text-h3 font-semibold font-poppins justify-start`,
                pathname.includes('bridge') ? 'text-text-lightmode-primary dark:text-text-darkmode-primary' : ''
              )}
              iconLeft={
                <img
                  className="h-[35px]"
                  src={`/img/mainnav/bridge-${mode}${pathname.includes('bridge') ? '-active' : ''}.svg`}
                  alt="dark"
                />
              }
            >
              Bridge
            </Button>
            <Button
              variant={pathname.includes('farm') ? 'outline' : 'ghost'}
              colorScheme={pathname.includes('farm') ? 'secondaryGradient' : 'none'}
              size={'lg'}
              onClick={() => {
                setIsOpen.off()
                history.push('/farm')
              }}
              className={cn(
                `text-center text-h3 font-semibold font-poppins justify-start`,
                pathname.includes('farm') ? 'text-text-lightmode-primary dark:text-text-darkmode-primary' : ''
              )}
              fullWidth
              iconLeft={
                <img
                  className="h-[35px]"
                  src={`/img/mainnav/farm-${mode}${pathname.includes('farm') ? '-active' : ''}.svg`}
                  alt="dark"
                />
              }
            >
              Farm
            </Button>
            <DropdownMenu onOpenChange={setIsTradeOpen.toggle}>
              <DropdownMenuTrigger asChild={true}>
                <Button
                  variant={pathname.includes('trade') || isTradeOpen ? 'outline' : 'ghost'}
                  colorScheme={pathname.includes('trade') || isTradeOpen ? 'secondaryGradient' : 'none'}
                  className={cn(
                    `text-h3 text-center font-semibold font-poppins`,
                    tradeActive ? 'text-text-lightmode-primary dark:text-text-darkmode-primary' : ''
                  )}
                  size={'lg'}
                  fullWidth
                  iconLeft={
                    <img
                      className="h-[35px]"
                      src={`/img/mainnav/trade-${mode}${tradeActive ? '-active' : ''}.svg`}
                      alt="dark"
                    />
                  }
                  iconRight={
                    <CircularArrow
                      cssStyle={tw`ml-auto w-[16px] h-[16px]`}
                      invert={isTradeOpen}
                      css={[tradeActive || isTradeOpen ? tw`opacity-[1]` : tw`opacity-[0.6]`]}
                    />
                  }
                >
                  Trade
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent portal={false} className={'mt-1 w-[300px]'}>
                <DropdownMenuItem
                  onClick={() => {
                    setIsOpen.off()
                    history.push('/trade')
                  }}
                  isActive={pathname.includes('trade')}
                >
                  <div>
                    <h4 className={`text-text-lightmode-primary dark:text-text-darkmode-primary`}>Trade</h4>
                    <p className={'text-b3'}>Trade perps on the fastest and most liquid DEX with 10x leverage</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setIsOpen.off()
                    history.push('/account')
                  }}
                  isActive={pathname.includes('account')}
                >
                  <div>
                    <h4 className={`text-text-lightmode-primary dark:text-text-darkmode-primary`}>Account</h4>
                    <p className={'text-b3'}>View your deposits, trade history, funding, and more</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setIsOpen.off()
                    changePanel(1)
                    rewardToggle(!rewardModal)
                  }}
                  isActive={panelIndex == 1}
                >
                  <div>
                    <h4 className={`text-text-lightmode-primary dark:text-text-darkmode-primary`}>Referrals</h4>
                    <p className={'text-b3'}>Refer your friends to earn a share of their fees</p>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu onOpenChange={setIsLeaderBoardOpen.toggle}>
              <DropdownMenuTrigger asChild={true}>
                <Button
                  variant={pathname.includes('leaderboard') || isLeaderboardOpen ? 'outline' : 'ghost'}
                  colorScheme={
                    pathname.includes('leaderboard') || isLeaderboardOpen ? 'secondaryGradient' : 'none'
                  }
                  className={cn(
                    `text-h3 text-center justify-center items-center [&>span]:inline-flex `,
                    pathname.includes('leaderboard')
                      ? 'text-text-lightmode-primary dark:text-text-darkmode-primary'
                      : ''
                  )}
                  fullWidth
                  size={'lg'}
                  iconLeft={
                    <img
                      className="h-[35px]"
                      src={`/img/mainnav/more-${mode}${pathname.includes('leaderboard') ? '-active' : ''}.svg`}
                      alt="dark"
                    />
                  }
                  iconRight={
                    <CircularArrow
                      cssStyle={tw`ml-auto w-[16px] h-[16px]`}
                      invert={isLeaderboardOpen}
                      css={[
                        pathname.includes('leaderboard') || isLeaderboardOpen ? tw`opacity-[1]` : tw`opacity-[0.6]`
                      ]}
                    />
                  }
                >
                  More
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent portal={false} className={'mt-1 w-[300px]'}>
                <DropdownMenuItem
                  onClick={() => {
                    setIsOpen.off()
                    history.push('/leaderboard')
                  }}
                  isActive={pathname.includes('leaderboard')}
                >
                  <div>
                    <h4 className={`text-text-lightmode-primary dark:text-text-darkmode-primary`}>Leaderboard</h4>
                    <p className={'text-b3'}>See how you rank against other traders and earn rewards</p>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu onOpenChange={setIsAboutOpen.toggle}>
              <DropdownMenuTrigger asChild={true}>
                <Button
                  variant={isAboutOpen ? 'outline' : 'ghost'}
                  colorScheme={isAboutOpen ? 'secondaryGradient' : 'none'}
                  className={cn(
                    `text-h3 text-center justify-center items-center [&>span]:inline-flex `,
                    isAboutOpen ? 'text-text-lightmode-primary dark:text-text-darkmode-primary' : ''
                  )}
                  fullWidth
                  size={'lg'}
                  iconLeft={
                    <img
                      className="h-[35px]"
                      src={`/img/mainnav/about-${isAboutOpen ? 'active' : 'inactive'}-${mode}.svg`}
                      alt="dark"
                    />
                  }
                  iconRight={
                    <CircularArrow
                      cssStyle={tw`ml-auto w-[16px] h-[16px]`}
                      invert={isAboutOpen}
                      css={[isAboutOpen ? tw`opacity-[1]` : tw`opacity-[0.6]`]}
                    />
                  }
                >
                  About
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent portal={false} className={'mt-1 w-[300px]'}>
                <DropdownMenuItem
                  onClick={() => {
                    setIsOpen.off()
                    history.push('/leaderboard')
                  }}
                >
                  What's New
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setIsOpen.off()
                    history.push('/leaderboard')
                  }}
                >
                  Blog
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setIsOpen.off()
                    history.push('/leaderboard')
                  }}
                >
                  Docs
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </DialogBody>
          <DialogFooter
            className={`border-t-1 border-solid border-t-border-lightmode-secondary 
          dark:border-t-border-darkmode-secondary h-[75px] items-center justify-center`}
          >
            <NetworkStatus />
            <RPCToggle />
            <PriorityFee />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

const DesktopNav: FC = () => {
  const breakpoint = useBreakPoint()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const history = useHistory()
  const { pathname } = useLocation()
  const { rewardToggle, changePanel, rewardModal, panelIndex } = useRewardToggle()
  const [isTradeOpen, setIsTradeOpen] = useBoolean(false)
  const [isLeaderboardOpen, setIsLeaderBoardOpen] = useBoolean(false)

  const { mode } = useDarkMode()
  if (breakpoint.isMobile || breakpoint.isTablet) return null
  const tradeActive =
    pathname.includes('trade') || (rewardModal && panelIndex == 1) || pathname.includes('account')
  return (
    <div className={`flex items-center gap-6 mx-auto`}>
      <Button
        variant={'ghost'}
        onClick={() => history.push('/bridge')}
        className={cn(
          `tracking-wider flex-col gap-0 p-0 text-center text-h6 font-semibold font-poppins`,
          pathname.includes('bridge') ? 'text-text-lightmode-primary dark:text-text-darkmode-primary' : ''
        )}
      >
        <img
          className="h-[26px] mb-0.5"
          src={`/img/mainnav/bridge-${mode}${pathname.includes('bridge') ? '-active' : ''}.svg`}
          alt="dark"
        />
        Bridge
      </Button>
      <Button
        variant={'ghost'}
        onClick={() => history.push('/farm')}
        className={cn(
          `tracking-wider flex-col gap-0 p-0 text-center text-h6 font-semibold font-poppins`,
          pathname.includes('farm') ? 'text-text-lightmode-primary dark:text-text-darkmode-primary' : ''
        )}
      >
        <img
          className="h-[26px] mb-0.5"
          src={`/img/mainnav/farm-${mode}${pathname.includes('farm') ? '-active' : ''}.svg`}
          alt="dark"
        />
        Farm
      </Button>
      <DropdownMenu onOpenChange={setIsTradeOpen.toggle}>
        <DropdownMenuTrigger asChild={true}>
          <Button
            variant={'ghost'}
            className={cn(
              `tracking-wider flex-col gap-0 p-0 text-center justify-center items-center 
              text-h6 font-semibold font-poppins`,
              tradeActive ? 'text-text-lightmode-primary dark:text-text-darkmode-primary' : ''
            )}
          >
            <span className={`inline-flex justify-center items-center`}>
              <img
                className="h-[26px] mb-0.5"
                src={`/img/mainnav/trade-${mode}${tradeActive ? '-active' : ''}.svg`}
                alt="dark"
              />
              <CircularArrow
                cssStyle={tw`w-[12px] h-[12px]`}
                invert={isTradeOpen}
                css={[tradeActive || isTradeOpen ? tw`opacity-[1]` : tw`opacity-[0.6]`]}
              />
            </span>
            Trade
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent portal={false} className={'mt-3 w-[300px]'}>
          <DropdownMenuItem onClick={() => history.push('/trade')} isActive={pathname.includes('trade')}>
            <div>
              <h4 className={`text-text-lightmode-primary dark:text-text-darkmode-primary`}>Trade</h4>
              <p className={'text-b3'}>Trade perps on the fastest and most liquid DEX with 10x leverage</p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => history.push('/account')} isActive={pathname.includes('account')}>
            <div>
              <h4 className={`text-text-lightmode-primary dark:text-text-darkmode-primary`}>Account</h4>
              <p className={'text-b3'}>View your deposits, trade history, funding, and more</p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              changePanel(1)
              rewardToggle(!rewardModal)
            }}
            isActive={panelIndex == 1}
          >
            <div>
              <h4 className={`text-text-lightmode-primary dark:text-text-darkmode-primary`}>Referrals</h4>
              <p className={'text-b3'}>Refer your friends to earn a share of their fees</p>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu onOpenChange={setIsLeaderBoardOpen.toggle}>
        <DropdownMenuTrigger asChild={true}>
          <Button
            variant={'ghost'}
            className={cn(
              `tracking-wider p-0 flex-col text-center justify-center items-center text-h6 [&>span]:inline-flex gap-0`,
              pathname.includes('leaderboard') ? 'text-text-lightmode-primary dark:text-text-darkmode-primary' : ''
            )}
          >
            <span className={`inline-flex justify-center items-center`}>
              <img
                className="h-[26px] mb-0.5"
                src={`/img/mainnav/more-${mode}${pathname.includes('leaderboard') ? '-active' : ''}.svg`}
                alt="dark"
              />
              <CircularArrow
                cssStyle={tw`w-[12px] h-[12px]`}
                invert={isLeaderboardOpen}
                css={[pathname.includes('leaderboard') || isLeaderboardOpen ? tw`opacity-[1]` : tw`opacity-[0.6]`]}
              />
            </span>
            More
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent portal={false} className={'mt-3 w-[300px]'}>
          <DropdownMenuItem
            onClick={() => history.push('/leaderboard')}
            isActive={pathname.includes('leaderboard')}
          >
            <div>
              <h4 className={`text-text-lightmode-primary dark:text-text-darkmode-primary`}>Leaderboard</h4>
              <p className={'text-b3'}>See how you rank against other traders and earn rewards</p>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
