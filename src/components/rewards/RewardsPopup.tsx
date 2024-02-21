import React, { FC, useCallback } from 'react'
import { useRewardToggle } from '../../context/reward_toggle'
import tw from 'twin.macro'
import 'styled-components/macro'
import useBreakPoint from '../../hooks/useBreakPoint'
import { useDarkMode } from '../../context'
import useRewards from '../../context/rewardsContext'
// import PanelSelector from './RewardPanelSelector'
// import AnimatedButtonGroup from "../twComponents/AnimatedButtonGroup";
import { Button } from 'gfx-component-lib'
import Rewards from './v2/Rewards'
// import Raffle from './raffle/Raffle'
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

  const riveComponent =
    () => (
      <div css={[tw`relative`]}>
        <img
          css={[breakpoint.isMobile || breakpoint.isTablet ? tw`h-[30px] w-[32px]` : tw`h-[22px] w-[20px]`]}
          src={`/img/mainnav/rewards-${breakpoint.isMobile || breakpoint.isTablet ? 'mobile-' : ''}${mode}.svg`}
        />

      {hasRewards && (
        <img
          css={[
            tw`absolute top-[5px]
              min-md:top-[1px] right-0`
          ]}
          src={'/img/assets/red-notification-circle.svg'}
        />
      )}
    </div>
  );
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
      <span css={[tw`font-bold`]}>Rewards</span>
    </Button>
  )
}

export const RewardsPopup: FC = () => {
  const { rewardToggle } = useRewardToggle()
  const { panelIndex } = useRewardToggle()
  return (
    <div
      css={[
        tw`mt-auto  min-md:min-h-[441px] w-full flex flex-row md:flex-col
           rounded-t-bigger max-h-[100dvh] bg-white dark:bg-black-2 relative
           rounded-t-[10px]
           [&>div:first-child]:min-md:rounded-tl-[10px] [&>div:first-child]:min-md:rounded-tr-[0px]
           [&>div:last-child]:min-md:rounded-tr-[10px]
           [& * p:not([data-tw*="mb-"])]:mb-0 
           `
          ]}
        >
          <Button
            onClick={() => rewardToggle(false)}
            className={`hidden min-md:inline-block absolute p-[inherit] right-3.75 top-3 min-md:right-5
                   min-md:top-5`}
            size={'sm'}
          >
            <img css={[tw`h-7.5 w-7.5`]} src={'/img/assets/close_button.svg'} alt={'rewards-close-button'} />
          </Button>
          {panelIndex == REWARD_PANEL_INDEX && <Rewards />}
          {panelIndex == REFER_PANEL_INDEX && <Refer />}
          {panelIndex == RAFFLE_PANEL_INDEX && <Raffle />}
        </div>
  )
}
export default RewardsPopup
