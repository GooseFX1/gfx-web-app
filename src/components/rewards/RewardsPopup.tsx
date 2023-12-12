import React, { FC, useCallback, useMemo } from 'react'
import { useRewardToggle } from '../../context/reward_toggle'
import tw from 'twin.macro'
import 'styled-components/macro'
import useBreakPoint from '../../hooks/useBreakPoint'
import { CryptoProvider, useDarkMode } from '../../context'
import useRewards, { RewardsProvider } from '../../context/rewardsContext'
// import PanelSelector from './RewardPanelSelector'
// import AnimatedButtonGroup from "../twComponents/AnimatedButtonGroup";
import Button from '../twComponents/Button'

import Rewards from './v2/Rewards'
import Raffle from './raffle/Raffle'

export const RewardsButton: FC = () => {
  const { mode } = useDarkMode()
  const { rewardToggle } = useRewardToggle()
  const breakpoint = useBreakPoint()

  const { hasRewards } = useRewards()

  const riveComponent = useMemo(
    () => (
      <div css={[tw`relative`]}>
        <img
          css={[breakpoint.isMobile || breakpoint.isTablet ? tw`h-[30px] w-[32px]` : tw`h-[22px] w-[20px]`]}
          src={`/img/mainnav/rewards-${mode}.svg`}
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
    ),
    [mode, breakpoint, hasRewards]
  )
  const handleClick = useCallback(() => rewardToggle(true), [])

  if (breakpoint.isMobile || breakpoint.isTablet) {
    return (
      <div onClick={handleClick} css={[tw`cursor-pointer`]}>
        {riveComponent}
      </div>
    )
  }
  return (
    <div
      onClick={handleClick}
      css={[
        tw`w-28 border-1 border-solid border-grey-1 dark:border-white rounded-full
            bg-grey-5 dark:bg-black-1 px-2.25 flex flex-row items-center gap-1.75 cursor-pointer
            text-regular  text-black-4 dark:text-white leading-normal
       `,
        breakpoint.isMobile || breakpoint.isTablet ? tw`h-[30px]` : tw`h-[30px]`
      ]}
    >
      {riveComponent}
      <span css={[tw`font-bold`]}>Rewards</span>
    </div>
  )
}

export const RewardsPopup: FC = () => {
  const { rewardToggle, panelIndex } = useRewardToggle()
  return (
    <CryptoProvider>
      <RewardsProvider>
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
          <Button onClick={() => rewardToggle(false)} cssClasses={[tw`absolute p-[inherit] right-2 top-2`]}>
            <img css={[tw`h-8.75 w-8.75`]} src={'/img/assets/close_button.svg'} alt={'rewards-close-button'} />
          </Button>
          {panelIndex == 0 && <Rewards />}
          {panelIndex == 1 && <Raffle />}
          {/* CHANGE */}
        </div>
      </RewardsProvider>
    </CryptoProvider>
  )
}
export default RewardsPopup
