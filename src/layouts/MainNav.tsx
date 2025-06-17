import React, { FC, useCallback, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { RewardsButton } from '../components/rewards/RewardsPopup'
import { useConnectionConfig, useDarkMode, useRewardToggle } from '../context'
import { ThemeToggle } from '../components/ThemeToggle'
import tw from 'twin.macro'
import 'styled-components/macro'
import useBreakPoint from '../hooks/useBreakPoint'
import { Connect } from './Connect'
// import { More } from './More'
import { ModalSlide } from '../components/ModalSlide'
import { APP_DEFAULT_ROUTE, MODAL_TYPES, SOCIAL_MEDIAS } from '../constants'
import { CircularArrow } from '../components/common/Arrow'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  cn,
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogPortal,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Icon,
  ListItem
} from 'gfx-component-lib'
import useBoolean from '../hooks/useBoolean'
import NetworkStatus from '@/components/footer/NetworkStatus'
import RPCToggle from '@/components/footer/RPCToggle'
// import PriorityFee from '@/components/footer/PriorityFee'
import SocialLinks from '@/components/common/SocialLinks'
import { NAV_LINKS, navigateTo, navigateToCurried } from '@/utils/requests'
import { FooterDivider } from '@/layouts/Footer'
import PriorityFee from '@/components/footer/PriorityFee'
import { ROUTES } from '@/Router'

export const MainNav: FC = () => {
  const { mode } = useDarkMode()
  const breakpoint = useBreakPoint()
  const navigate = useNavigate()
  const navigateHome = useCallback(() => navigate(APP_DEFAULT_ROUTE), [navigate])
  const { rewardModal, rewardToggle } = useRewardToggle()
  const location = useLocation()
  const query = new URLSearchParams(location.search)
  const showRewardsModal = query.get('rewards')
  const [isBannerActive] = useBoolean(false)
  //const { pathname } = useLocation()

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
    <div className={`w-screen flex flex-col sticky top-0 z-[10]`}>
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
        <div className={`flex items-center gap-3.75 absolute right-0 mr-2.5 min-md:mr-0 min-md:pr-[15px]`}>
          <RewardsButton />
          {/* {pathname.includes('gamma') && <LiteProToggle />} */}
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
  const { featureFlags } = useConnectionConfig()
  const { mode } = useDarkMode()
  const { pathname } = useLocation()
  const [isOpen, setIsOpen] = useBoolean(false)
  const navigate = useNavigate()
  const isMoreOpen = pathname.includes('bridge') || pathname.includes('ssl')

  if (breakpoint.isLaptop || breakpoint.isDesktop) return null
  return (
    <>
      <Dialog open={isOpen} modal={false}>
        <DialogTrigger onClick={setIsOpen.on}>
          <img className={`h-[35px]`} src={`/img/mainnav/menu-${mode}.svg`} alt={'open drawer'} />
        </DialogTrigger>
        <DialogPortal>
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
                variant={pathname.includes('swap') && 'primary'}
                className={cn(
                  `text-center text-h3 font-semibold font-poppins justify-start text-text-lightmode-tertiary
                         dark:text-text-darkmode-tertiary h-[43px]`,
                  pathname.includes('swap') ? 'text-text-lightmode-primary dark:text-text-darkmode-primary' : ''
                )}
                onClick={() => {
                  setIsOpen.off()
                  navigate('/swap')
                }}
              >
                <img
                  className="!h-[35px] aspect-square"
                  src={`/img/mainnav/swap-${mode}${pathname.includes('swap') ? '-active' : '-inactive'}.svg`}
                  alt="dark"
                />
                &nbsp;Swap
              </ListItem>
              {featureFlags.tokenFeed && (
                <ListItem
                  variant={pathname.includes(ROUTES.TOKEN_FEED) && 'primary'}
                  className={cn(
                    `text-center text-h3 font-semibold font-poppins justify-start text-text-lightmode-tertiary
                         dark:text-text-darkmode-tertiary h-[43px]`,
                    pathname.includes(ROUTES.TOKEN_FEED)
                      ? 'text-text-lightmode-primary dark:text-text-darkmode-primary'
                      : ''
                  )}
                  onClick={() => {
                    setIsOpen.off()
                    navigate('/token-feed')
                  }}
                >
                  <img
                    className="!h-[35px] !w-[35px] p-1.5 aspect-square"
                    src={`/img/mainnav/token_feed_${mode}${
                      pathname.includes(ROUTES.TOKEN_FEED) ? '_active' : '_inactive'
                    }.svg`}
                    alt="dark"
                  />
                  &nbsp;Trade
                </ListItem>
              )}
              <ListItem
                variant={pathname.includes('gamma') && 'primary'}
                className={cn(
                  `text-center text-h3 font-semibold font-poppins justify-start text-text-lightmode-tertiary
                         dark:text-text-darkmode-tertiary h-[43px]`,
                  pathname.includes('gamma') ? 'text-text-lightmode-primary dark:text-text-darkmode-primary' : ''
                )}
                onClick={() => {
                  setIsOpen.off()
                  navigate('/gamma')
                }}
              >
                <img
                  className="!h-[35px] !w-[35px] py-[5px] px-[2.5px] aspect-square"
                  src={`/img/mainnav/pool-${mode}${pathname.includes('gamma') ? '-active' : '-inactive'}.svg`}
                  alt="dark"
                />
                &nbsp;Pools
              </ListItem>

              <Accordion type={'single'} collapsible variant={'unset'}>
                <AccordionItem value={'ssl'} variant={'unset'}>
                  <AccordionTrigger variant={'primary'} isSelected={isMoreOpen} className={'text-h3  px-1.25'}>
                    <span
                      className={`inline-flex items-center font-poppins font-semibold font-inherit text-inherit`}
                    >
                      <img
                        className="!h-[35px] aspect-square"
                        src={`/img/mainnav/more-${mode}${isMoreOpen ? '-active' : '-inactive'}.svg`}
                        alt="dark"
                      />
                      &nbsp;More
                    </span>
                  </AccordionTrigger>
                  <AccordionContent variant={'unset'} className={'flex flex-col gap-1.5 pt-2.5'}>
                    <MobileAccordionContent
                      title={'SSL'}
                      description={'LP using a single asset'}
                      onClick={() => {
                        setIsOpen.off()
                        navigate('/ssl')
                      }}
                      isActive={pathname.includes('ssl')}
                    />
                    <MobileAccordionContent
                      title={'Bridge'}
                      description={'Bridge your assets to and from other chains'}
                      onClick={() => {
                        setIsOpen.off()
                        navigate('/bridge')
                      }}
                      isActive={pathname.includes('bridge')}
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
                    <div className={'inline-flex items-center justify-center gap-8 my-1'}>
                      <SocialLinks />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </DialogBody>
            <DialogFooter
              className={`border-t-1 border-solid border-t-border-lightmode-secondary px-3.75 py-2.5 
          dark:border-t-border-darkmode-secondary h-[75px] items-center justify-between flex-row`}
            >
              <NetworkStatus />
              <FooterDivider className={'h-[30px]'} />
              <RPCToggle />
              <FooterDivider className={'h-[30px]'} />
              <PriorityFee />
            </DialogFooter>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  )
}

const DesktopNav: FC = () => {
  const breakpoint = useBreakPoint()
  const { featureFlags } = useConnectionConfig()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [isMoreOpen, setIsMoreOpen] = useBoolean(false)

  const { mode } = useDarkMode()
  if (breakpoint.isMobile || breakpoint.isTablet) return null

  const isMoreActive = pathname.includes('bridge') || pathname.includes('ssl')

  return (
    <div className={`flex items-center gap-6 mx-auto`}>
      <Button
        variant={'ghost'}
        onClick={() => navigate('/swap')}
        className={cn(
          `tracking-wider flex-col gap-0 p-0 text-center text-h6 font-semibold font-poppins leading-4`,
          pathname.includes('swap') ? 'text-text-lightmode-primary dark:text-text-darkmode-primary' : ''
        )}
      >
        <img
          className="!w-[24px] !h-[24px] aspect-square"
          src={`/img/mainnav/swap-${mode}${pathname.includes('swap') ? '-active' : '-inactive'}.svg`}
          alt="dark"
        />
        <h6 className={'h-6 leading-4'}>Swap</h6>
      </Button>
      {featureFlags.tokenFeed && (
        <Button
          variant={'ghost'}
          onClick={() => navigate(ROUTES.TOKEN_FEED)}
          className={cn(
            `tracking-wider flex-col gap-[2px] p-0 text-center text-h6 font-semibold font-poppins justify-center
            leading-4`,
            pathname.includes(ROUTES.TOKEN_FEED)
              ? 'text-text-lightmode-primary dark:text-text-darkmode-primary'
              : ''
          )}
        >
          <img
            className="!w-[24px] !h-[24px] p-0.5 "
            src={`/img/mainnav/token_feed_${mode}${
              pathname.includes(ROUTES.TOKEN_FEED) ? '_active' : '_inactive'
            }.svg`}
            alt="dark"
          />
          <h6 className={'h-6 leading-4'}>Trade</h6>
        </Button>
      )}
      <Button
        variant={'ghost'}
        onClick={() => navigate('/gamma')}
        className={cn(
          `tracking-wider flex-col gap-[2px] p-0 text-center font-semibold font-poppins`,
          pathname.includes('gamma') ? 'text-text-lightmode-primary dark:text-text-darkmode-primary' : ''
        )}
      >
        <img
          className="!w-[24px] !h-[24px] aspect-square p-0.5 "
          src={`/img/mainnav/pool-${mode}${pathname.includes('gamma') ? '-active' : '-inactive'}.svg`}
          alt="dark"
        />
        <h6 className={'h-6 leading-4'}>Pools</h6>
      </Button>

      <DropdownMenu onOpenChange={setIsMoreOpen.toggle}>
        <DropdownMenuTrigger asChild={true}>
          <Button
            variant={'ghost'}
            className={cn(
              `tracking-wider p-0 flex-col text-center justify-center items-center text-h6 [&>span]:inline-flex
               gap-[2px] leading-4`,
              isMoreActive ? 'text-text-lightmode-primary dark:text-text-darkmode-primary' : ''
            )}
          >
            <span className={`inline-flex justify-center items-center`}>
              <img
                className="!w-[24px] !h-[24px] p-0.5"
                src={`/img/mainnav/more-${mode}${isMoreActive ? '-active' : '-inactive'}.svg`}
                alt="dark"
              />
              <CircularArrow
                cssStyle={tw`w-[12px] h-[12px] mt-auto mb-[2px]`}
                invert={isMoreOpen}
                css={[isMoreActive || isMoreOpen ? tw`opacity-[1]` : tw`opacity-[0.6]`]}
              />
            </span>
            <h6 className={'h-6 leading-4'}>More</h6>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent portal={false} className={'mt-3 w-[300px]'}>
          <DropdownMenuItem onClick={() => navigate('/ssl')} isActive={pathname.includes('ssl')}>
            <div>
              <h4 className={`text-text-lightmode-primary dark:text-text-darkmode-primary`}>SSL</h4>
              <p className={'text-b3'}>LP using a single asset</p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/bridge')} isActive={pathname.includes('bridge')}>
            <div>
              <h4 className={`text-text-lightmode-primary dark:text-text-darkmode-primary`}>Bridge</h4>
              <p className={'text-b3'}>Bridge your assets to and from other chains</p>
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
