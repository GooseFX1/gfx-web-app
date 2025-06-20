import useBoolean from '@/hooks/useBoolean'
import { useDrag } from '@use-gesture/react'
import {
  cn,
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogPortal
} from 'gfx-component-lib'
import TokenFeedSocialRadioGroup from '@/pages/TokenFeed/TokenFeedSocialRadioGroup'
import { H2, H3, P } from '@/components/text/TextComponents'
import React, { useMemo } from 'react'
import Lottie from 'lottie-react'
import { Connect } from '@/layouts'
import { useTokenFeed } from '@/context/tokenFeedContext'
import { useDarkMode } from '@/context'
import { useWallet } from '@/hooks/useWallet'
import LockedDark from '@/animations/profile_locked_dark.json'
import LockedLite from '@/animations/profile_locked_lite.json'
import ComingSoonDark from '@/animations/coming_soon_dark.json'
import ComingSoonLite from '@/animations/coming_soon_lite.json'
import PerformanceDark from '@/animations/performance_dark.json'
import PerformanceLite from '@/animations/performance_lite.json'

function TokenFeedMobileDrawer({ container }: { container?: HTMLElement | null }) {
  const [open, setOpen] = useBoolean(false)
  const bind = useDrag(
    (state) => {
      const [, swipeY] = state.swipe
      console.log('SWIPE', { swipeY, state })
      // swipeY === -1 indicates a “swipe up” gesture
      if (state.last && swipeY === -1) {
        setOpen.on()
      } else if (state.last && swipeY === 1) {
        setOpen.off()
      }
    },
    {
      axis: 'y',
      filterTaps: true
    }
  )
  const { socialPanelTab } = useTokenFeed()
  const { mode } = useDarkMode()
  const { connected } = useWallet()

  const performanceAnimation = useMemo(() => {
    if (!connected) {
      return mode === 'dark' ? LockedDark : LockedLite
    }
    if (socialPanelTab == 'social') {
      return mode === 'dark' ? ComingSoonDark : ComingSoonLite
    }
    return mode === 'dark' ? PerformanceDark : PerformanceLite
  }, [mode, connected, socialPanelTab])

  return (
    <Dialog open={true} modal={false}>
      <DialogPortal container={container}>
        {open && <DialogOverlay className={'z-[49]'} />}
        <DialogContent
          className={cn(
            `w-full h-screen max-h-[calc(100dvh_-_120px)] overflow-y-scroll rounded-b-none z-[50]
           duration-300 px-2.5 py-2 gap-4 border-1 border-solid border-border-lightmode-secondary animate transition-all
           dark:border-border-darkmode-secondary flex flex-col`,
            !open && `-translate-y-[88px]`
          )}
          placement={'bottom'}
          {...bind()}
          style={{
            touchAction: 'none',
            zIndex: '50'
          }}
          onInteractOutside={() => {
            setOpen.off()
          }}
        >
          <DialogHeader
            className={`flex flex-col gap-4 border-b-1 border-solid border-border-lightmode-secondary 
            dark:border-border-darkmode-secondary pb-2`}
          >
            <span
              className={`h-1.5 rounded-full w-8 bg-border-lightmode-secondary dark:bg-border-darkmode-secondary
               mx-auto`}
            />
            <TokenFeedSocialRadioGroup groupClassName={'w-full'} itemClassName={'h-[35px]'} itemSize={'lg'} />
            <div className={`inline-flex items-center justify-between w-full`}>
              <H3 className={`text-text-lightmode-tertiary dark:text-text-darkmode-tertiary`}>0.00% AVG APR</H3>
              <P className={`text-text-lightmode-tertiary dark:text-text-darkmode-tertiary font-semibold`}>
                0 Tokens
              </P>
            </div>
          </DialogHeader>
          <DialogBody
            className={`flex flex-1 flex-col gap-4 pt-4 overflow-scroll items-center justify-center w-full h-full`}
          >
            <div className={`flex flex-col items-center justify-between w-full gap-4`}>
              <Lottie
                loop={true}
                animationData={performanceAnimation}
                className={cn(`h-[80px]`, connected && `h-[77px]`)}
              />
              <div className={`flex flex-col gap-2 items-center text-center w-[300px]`}>
                <H2>{socialPanelTab == 'social' ? 'Coming Soon' : 'My Performance'}</H2>
                <P className={`text-b2`}>
                  {connected
                    ? socialPanelTab == 'social'
                      ? `We are currently working on this feature, expect it very soon...`
                      : `Start trading tokens to view your performance, track tokens, apr and more.`
                    : `Connect your wallet to view your performance, track tokens, apr and more.`}
                </P>
              </div>
              {!connected && <Connect />}
            </div>
          </DialogBody>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}

export default TokenFeedMobileDrawer
