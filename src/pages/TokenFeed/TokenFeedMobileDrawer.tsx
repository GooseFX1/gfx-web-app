import useBoolean from '@/hooks/useBoolean'
import { useDrag } from '@use-gesture/react'
import {
  cn,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal
} from 'gfx-component-lib'
import TokenFeedSocialRadioGroup from '@/pages/TokenFeed/TokenFeedSocialRadioGroup'
import { H3, P } from '@/components/text/TextComponents'
import React from 'react'

function TokenFeedMobileDrawer({ container }: { container?: HTMLElement | null }) {
  const [open, setOpen] = useBoolean(false)
  const bind = useDrag((state) => {
    const [, swipeY] = state.swipe
    console.log('SWIPE', { swipeY, state })
    // swipeY === -1 indicates a “swipe up” gesture
    if (state.last && swipeY === -1) {
      setOpen.on()
    } else if (state.last && swipeY === 1) {
      setOpen.off()
    }
  }, {})
  return (
    <Dialog open={true} modal={false}>
      <DialogPortal container={container}>
        {open && <DialogOverlay className={'z-[49]'} />}
        <DialogContent
          className={cn(
            `w-full h-screen max-h-[calc(100dvh_-_120px)] overflow-y-scroll rounded-b-none z-[100]
           duration-300 px-2.5 py-2 gap-4 border-1 border-solid border-border-lightmode-secondary animate transition-all
           dark:border-border-darkmode-secondary`,
            !open && `-translate-y-[88px]`
          )}
          placement={'bottom'}
          {...bind()}
          style={{
            touchAction: 'none',
            zIndex: '50'
          }}
        >
          <DialogHeader className={'flex flex-col gap-4'}>
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
          <DialogBody>TEST</DialogBody>
          <DialogFooter>Test</DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}

export default TokenFeedMobileDrawer
