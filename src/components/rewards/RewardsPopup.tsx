import React, { FC, useCallback } from 'react'
import { useRewardToggle } from '../../context/reward_toggle'
import 'styled-components/macro'
import useBreakPoint from '../../hooks/useBreakPoint'
import { useDarkMode } from '../../context'
import useRewards from '../../context/rewardsContext'
import { Button, cn, Dialog, DialogBody, DialogContent, DialogOverlay } from 'gfx-component-lib'
import Rewards from './v2/Rewards'
import Refer from './Refer'
import Raffle from './raffle/Raffle'

export const REWARD_PANEL_INDEX = 0
export const REFER_PANEL_INDEX = 1
export const RAFFLE_PANEL_INDEX = 2
export const RewardsButton: FC = () => {
  const { mode } = useDarkMode()
  const { rewardToggle, changePanel } = useRewardToggle()
  const breakpoint = useBreakPoint()

  const { hasRewards } = useRewards()

  const riveComponent = (
    <div className={`relative`}>
      <img
        className={cn(breakpoint.isMobile || breakpoint.isTablet ? `h-[30px] w-[32px]` : `h-[22px] w-[20px]`)}
        src={`/img/mainnav/rewards-${breakpoint.isMobile || breakpoint.isTablet ? 'mobile-' : ''}${mode}.svg`}
      />

      {hasRewards && (
        <img
          className={`absolute top-[5px]
              min-md:top-[1px] right-0`}
          src={'/img/assets/red-notification-circle.svg'}
        />
      )}
    </div>
  )

  const handleClick = useCallback(() => {
    rewardToggle(true)
    changePanel(REWARD_PANEL_INDEX)
  }, [])

  if (breakpoint.isMobile || breakpoint.isTablet) {
    return (
      <Button onClick={handleClick} variant={'ghost'}>
        {riveComponent}
      </Button>
    )
  }
  return (
    <Button
      onClick={handleClick}
      variant={'outline'}
      size={'sm'}
      className={'border-background-blue dark:border-white'}
    >
      {riveComponent}
      <span className={`font-bold`}>Rewards</span>
    </Button>
  )
}

export const RewardsPopup: FC = () => {
  const { rewardToggle, rewardModal } = useRewardToggle()
  const { panelIndex } = useRewardToggle()
  const breakpoint = useBreakPoint()
  const isMobile = breakpoint.isMobile || breakpoint.isTablet
  return (
    <Dialog open={rewardModal} onOpenChange={rewardToggle}>
      <DialogOverlay />
      <DialogContent
        className={'w-full min-md:h-[377px] max-h-[calc(100dvh-55px)] z-[960]'}
        fullScreen={!isMobile}
        placement={'bottom'}
      >
        <Button
          onClick={() => rewardToggle(false)}
          className={`hidden min-md:inline-block absolute p-[inherit] right-3.75 top-3 min-md:right-5
                   min-md:top-5`}
          size={'sm'}
        >
          <img className={`h-7.5 w-7.5`} src={'/img/assets/close_button.svg'} alt={'rewards-close-button'} />
        </Button>
        <DialogBody
          className={`bg-white dark:bg-black-2 relative min-md:min-h-[441px]
         w-full flex flex-row md:flex-col `}
        >
          {panelIndex == REWARD_PANEL_INDEX && <Rewards />}
          {panelIndex == REFER_PANEL_INDEX && <Refer />}
          {panelIndex == RAFFLE_PANEL_INDEX && <Raffle />}
        </DialogBody>
      </DialogContent>
    </Dialog>
  )
}
export default RewardsPopup
