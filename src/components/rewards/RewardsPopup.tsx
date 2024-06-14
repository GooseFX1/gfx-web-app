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
import RewardsClose from '@/assets/rewards_close.svg?react'

export const REWARD_PANEL_INDEX = 0
export const REFER_PANEL_INDEX = 1
export const RAFFLE_PANEL_INDEX = 2
export const RewardsButton: FC = () => {
  const { mode } = useDarkMode()
  const { rewardToggle, changePanel } = useRewardToggle()

  const { hasRewards } = useRewards()

  const riveComponent = (
    <>
      <img className={cn(`min-h-[20px] min-w-[20px]`)} src={`/img/mainnav/rewards-${mode}.svg`} />

      {hasRewards && (
        <img
          className={`absolute top-[-1px] -left-0.5 border-1 border-solid border-background-lightmode-primary
               dark:border-background-darkmode-primary rounded-full`}
          src={'/img/assets/red-notification-circle.svg'}
        />
      )}
    </>
  )

  const handleClick = useCallback(() => {
    rewardToggle(true)
    changePanel(REWARD_PANEL_INDEX)
  }, [])

  return (
    <Button
      onClick={handleClick}
      variant={'outline'}
      size={'sm'}
      className={'border-background-blue dark:border-white rounded-full w-[30px] relative'}
    >
      {riveComponent}
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
        className={`w-full h-max max-h-[100dvh] overflow-y-scroll rounded-b-none min-lg:max-w-full
        `}
        fullScreen={!isMobile}
        placement={'bottom'}
      >
        <Button
          onClick={() => rewardToggle(false)}
          variant={'ghost'}
          className={`hidden min-md:inline-block absolute p-[inherit] right-3.75 top-3 min-md:right-5
                   min-md:top-5 z-[1] w-max p-0`}
          size={'sm'}
        >
          <RewardsClose
            className={`h-3 w-3 min-md:h-5 min-md:w-5 stroke-border-lightmode-primary 
          min-md:stroke-border-darkmode-primary min-md:dark:stroke-border-darkmode-primary`}
          />
        </Button>
        <DialogBody
          className={`bg-white dark:bg-black-2 relative min-md:min-h-[441px]
         w-full flex flex-row max-md:flex-col rounded-t-[10px]`}
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
