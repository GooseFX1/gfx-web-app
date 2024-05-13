import React, { FC, useEffect, useCallback } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { RewardsButton } from '../components/rewards/RewardsPopup'
import { useDarkMode, useRewardToggle } from '../context'
import { ThemeToggle } from '../components/ThemeToggle'
import tw from 'twin.macro'
import 'styled-components/macro'
import useBreakPoint from '../hooks/useBreakPoint'
import { Connect } from './Connect'
// import { More } from './More'
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
  DialogFooter,
  ListItem,
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger
} from 'gfx-component-lib'
import useBoolean from '../hooks/useBoolean'
import { SOCIAL_MEDIAS } from '../constants'
import NetworkStatus from '@/components/footer/NetworkStatus'
import RPCToggle from '@/components/footer/RPCToggle'
// import PriorityFee from '@/components/footer/PriorityFee'
import SocialLinks from '@/components/common/SocialLinks'
import { NAV_LINKS, navigateTo, navigateToCurried } from '@/utils/requests'
import { FooterDivider } from '@/layouts/Footer'
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
      volumes will be lower than usual. See our&nbsp;
      <a href={SOCIAL_MEDIAS.twitter} target="_blank" rel="noreferrer">
        Twitter
      </a>
      &nbsp; for further updates.
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
        <div className={`flex items-center gap-2 absolute right-0 mr-2.5 min-md:mr-0 min-md:pr-[15px]`}>
          <RewardsButton />
          <Connect />
          {/* <NotificationButton /> */}
          {/*<More />*/}
          <MobileNav />
        </div>
      </div>
    </div>
  )
}
type MobileAccordionContentProps = {
  title: string
  description: string
  onClick?: (e) => void
  isActive?: boolean
  className?: string
}
const MobileAccordionContent: FC<MobileAccordionContentProps> = ({
  title,
  description,
  className,
  isActive,
  ...rest
}) => (
  <ListItem
    className={cn('flex flex-col items-start px-2 py-1.5', className)}
    variant={isActive && 'primary'}
    {...rest}
  >
    <p className={`text-b2 font-bold text-text-lightmode-primary dark:text-text-darkmode-primary`}>{title}</p>
    <p className={'text-b3 font-semibold text-text-lightmode-secondary dark:text-text-darkmode-secondary'}>
      {description}
    </p>
  </ListItem>
)
const MobileNav: FC = () => {
  const breakpoint = useBreakPoint()
  const { mode } = useDarkMode()
  const { pathname } = useLocation()
  const [isOpen, setIsOpen] = useBoolean(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const history = useHistory()
  const { rewardToggle, changePanel, rewardModal, panelIndex } = useRewardToggle()
  // const [isTradeOpen, setIsTradeOpen] = useBoolean(false)
  // const [isLeaderboardOpen, setIsLeaderBoardOpen] = useBoolean(false)
  const tradeActive =
    pathname.includes('trade') || (rewardModal && panelIndex == 1) || pathname.includes('account')
  const isLeaderboardOpen = pathname.includes('leaderboard')

  if (breakpoint.isLaptop || breakpoint.isDesktop) return null
  return (
    <>
      <Dialog open={isOpen} modal={false}>
        <DialogTrigger onClick={setIsOpen.on}>
          <img className={`h-[35px]`} src={`/img/mainnav/menu-${mode}.svg`} alt={'open drawer'} />
        </DialogTrigger>
        <DialogContent fullScreen={true} className={'flex flex-col gap-0 '}>
          <DialogHeader className={'items-center'}>
            <DialogClose className={'ml-auto mr-3.75 mt-3.75'} onClick={setIsOpen.off}>
              <Icon src={`/img/assets/close-${mode}.svg`} size={'sm'} />
            </DialogClose>
            <ThemeToggle />
          </DialogHeader>
          <DialogBody
            className={`mx-auto my-auto justify-center items-center flex flex-col flex-1 gap-[15px] w-full px-[15px]
              overflow-y-scroll`}
          >
            <ListItem
              variant={pathname.includes('bridge') && 'primary'}
              className={cn(
                `text-center text-h3 font-semibold font-poppins justify-start text-text-lightmode-tertiary
                         dark:text-text-darkmode-tertiary h-[43px]`,
                pathname.includes('bridge') ? 'text-text-lightmode-primary dark:text-text-darkmode-primary' : ''
              )}
              onClick={() => {
                setIsOpen.off()
                history.push('/bridge')
              }}
            >
              <img
                className="h-[35px]"
                src={`/img/mainnav/bridge-${mode}${pathname.includes('bridge') ? '-active' : ''}.svg`}
                alt="dark"
              />
              &nbsp;Bridge
            </ListItem>
            <ListItem
              variant={pathname.includes('farm') && 'primary'}
              className={cn(
                `text-center text-h3 font-semibold font-poppins justify-start text-text-lightmode-tertiary
                         dark:text-text-darkmode-tertiary h-[43px]`,
                pathname.includes('farm') ? 'text-text-lightmode-primary dark:text-text-darkmode-primary' : ''
              )}
              onClick={() => {
                setIsOpen.off()
                history.push('/farm')
              }}
            >
              <img
                className="h-[35px]"
                src={`/img/mainnav/farm-${mode}${pathname.includes('farm') ? '-active' : ''}.svg`}
                alt="dark"
              />
              &nbsp;Farm
            </ListItem>
            <Accordion type={'single'} collapsible variant={'unset'}>
              <AccordionItem value={'trade'} variant={'unset'}>
                <AccordionTrigger variant={'primary'} isSelected={tradeActive} className={'text-h3 px-2.5'}>
                  <span className={'inline-flex items-center font-poppins font-inherit text-inherit'}>
                    <img
                      className="h-[35px]"
                      src={`/img/mainnav/trade-${mode}${tradeActive ? '-active' : ''}.svg`}
                      alt="dark"
                    />{' '}
                    &nbsp;Trade
                  </span>
                </AccordionTrigger>
                <AccordionContent variant={'unset'} className={'flex flex-col gap-1.5 pt-2.5'}>
                  <MobileAccordionContent
                    title={'Trade'}
                    description={'Trade perps on the fastest and most liquid DEX with 10x leverage.'}
                    onClick={() => {
                      setIsOpen.off()
                      history.push('/trade')
                    }}
                    isActive={pathname.includes('trade')}
                  />
                  <MobileAccordionContent
                    title={'Account'}
                    description={'View your deposits, trade history, funding and more.'}
                    onClick={() => {
                      setIsOpen.off()
                      history.push('/account')
                    }}
                    isActive={pathname.includes('account')}
                  />
                  <MobileAccordionContent
                    title={'Referrals'}
                    description={'Refer your friends to earn a share of their fees.'}
                    onClick={() => {
                      setIsOpen.off()
                      changePanel(1)
                      rewardToggle(!rewardModal)
                    }}
                    isActive={panelIndex == 1}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Accordion type={'single'} collapsible variant={'unset'}>
              <AccordionItem value={'leaderboard'} variant={'unset'}>
                <AccordionTrigger variant={'primary'} isSelected={isLeaderboardOpen} className={'text-h3  px-2.5'}>
                  <span className={'inline-flex items-center font-poppins font-inherit text-inherit'}>
                    <img
                      className="h-[35px]"
                      src={`/img/mainnav/more-${mode}${isLeaderboardOpen ? '-active' : ''}.svg`}
                      alt="dark"
                    />
                    &nbsp;More
                  </span>
                </AccordionTrigger>
                <AccordionContent variant={'unset'} className={'flex flex-col gap-1.5 pt-2.5'}>
                  <MobileAccordionContent
                    title={'Leaderboard'}
                    description={'Trade smart and be among the top to win exciting rewards!'}
                    onClick={() => {
                      setIsOpen.off()
                      history.push('/leaderboard')
                    }}
                    isActive={pathname.includes('leaderboard')}
                  />
                  <MobileAccordionContent
                    title={'Blog'}
                    description={'Stay up to date with the latest updates and industry news!'}
                    onClick={() => {
                      setIsOpen.off()
                      navigateTo(NAV_LINKS.blog, '_blank')
                    }}
                  />
                  <MobileAccordionContent
                    title={'Docs'}
                    description={'Learn about GOOSEFX and how we work in depth.'}
                    onClick={() => {
                      setIsOpen.off()
                      navigateTo(NAV_LINKS.docs, '_blank')
                    }}
                  />
                  <div className={'inline-flex items-center justify-center gap-8 mt-1'}>
                    <SocialLinks />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </DialogBody>
          <DialogFooter
            className={`border-t-1 border-solid border-t-border-lightmode-secondary px-3.75 py-2.5 
          dark:border-t-border-darkmode-secondary h-[75px] items-center justify-between`}
          >
            <NetworkStatus />
            <FooterDivider className={'h-[30px] mx-auto'} />
            <RPCToggle className={'mr-auto'} />
            <FooterDivider className={'h-[30px]'} />
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
          className="w-[26px] h-[26px] mb-0.5"
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
          className="w-[26px] h-[26px] mb-0.5"
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
                className="w-[26px] h-[26px] mb-0.5"
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
                className="w-[26px] h-[26px] mb-0.5"
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
          <DropdownMenuItem onClick={navigateToCurried(NAV_LINKS.blog, '_blank')}>
            <div>
              <h4 className={`text-text-lightmode-primary dark:text-text-darkmode-primary`}>Blog</h4>
              <p className={'text-b3'}>Stay up to date with the latest updates and industry news!</p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={navigateToCurried(NAV_LINKS.docs, '_blank')}>
            <div>
              <h4 className={`text-text-lightmode-primary dark:text-text-darkmode-primary`}>Docs</h4>
              <p className={'text-b3'}>Learn about GOOSEFX and how we work in depth.</p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem variant={'blank'} className={'flex items-center justify-center gap-8 mt-1.5 p-1.5'}>
            <SocialLinks />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
