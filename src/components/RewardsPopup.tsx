import React, { FC, useCallback, useEffect, useMemo } from 'react'
import styled from 'styled-components'
// import { useRewardToggle } from '../context/reward_toggle'
import { RewardInfoComponent, RewardRedirectComponent } from './RewardDetails'
import tw from 'twin.macro'
import 'styled-components/macro'
import useRiveAnimations, { RiveAnimationWrapper } from '../hooks/useRiveAnimations'
import { useDarkMode, useRewardToggle } from '../context'
import { useStateMachineInput } from '@rive-app/react-canvas'
import useBreakPoint from '../hooks/useBreakPoint'

const REWARD_INFO = styled.div`
  ${tw`w-[68%] h-[75vh] rounded-bigger`}
`

const REWARD_REDIRECT = styled.div`
  ${tw`flex flex-col justify-center w-[32%] rounded-tr-bigger`}
  background-image: ${({ theme }) => theme.bgReward};
`

const Wrapper = styled.div`
  ${tw`h-full w-full flex rounded-t-bigger`}
  font-family: Montserrat !important;
  background-color: ${({ theme }) => theme.bg9};
`
// const REWARDS_BTN = styled.button`
//   ${tw`w-[111px] h-9 text-xs !font-semibold rounded-circle cursor-pointer text-white
//   border-none border-0 sm:h-[70px] sm:w-full sm:text-regular  sm:rounded-none sm:rounded-t-bigger sm:p-4 sm:mb-32`}
//   background-image: linear-gradient(90deg, #8ade75 0%, #4b831d 100%);
//   line-height: inherit;
// `
// const REWARDS_WITH_IMG = styled.img`
//   ${tw`h-4 w-4 ml-2`}
// `

// const REWARD_BTN_TITLE = styled.span`
//   ${tw`text-smallest font-semibold sm:text-sm`}
//
//   @media (max-width: 500px) {
//     line-height: inherit;
//   }
// `

export const RewardsButton: FC = () => {
  const { rewardToggle } = useRewardToggle()
  const breakpoint = useBreakPoint()
  const rewardsAnimation = useRiveAnimations({
    animation: 'rewards',
    autoplay: true,
    canvasWidth: 20,
    canvasHeight: 22.32
  })
  const { mode } = useDarkMode()
  const rewardsThemeInput = useStateMachineInput(rewardsAnimation.rive, 'Rewards', 'Theme')
  useEffect(() => {
    if (!rewardsThemeInput) return
    const isDark = mode === 'dark'
    if (isDark != rewardsThemeInput.value) rewardsThemeInput.value = !isDark
  }, [mode, rewardsThemeInput])
  const hasRewards = false // TODO: hook into useRewards hook
  const riveComponent = useMemo(() => {
    const breakpointWidth = breakpoint.isMobile || breakpoint.isTablet ? 30.1 : 20
    const breakpointHeight = breakpoint.isMobile || breakpoint.isTablet ? 34.09 : 22.32
    return (
      <div css={[tw`relative`]}>
        <RiveAnimationWrapper
          setContainerRef={rewardsAnimation.setContainerRef}
          width={breakpointWidth}
          height={breakpointHeight}
        >
          <rewardsAnimation.RiveComponent />
        </RiveAnimationWrapper>
        {hasRewards && (
          <img
            css={tw`absolute top-[5px] min-md:top-[1px] right-0`}
            src={'img/assets/red-notification-circle.svg'}
          />
        )}
      </div>
    )
  }, [rewardsAnimation, breakpoint, hasRewards])
  const handleClick = useCallback(() => rewardToggle(true), [])
  if (breakpoint.isMobile || breakpoint.isTablet) return <div css={[tw`cursor-pointer`]}>{riveComponent}</div>
  return (
    <div
      css={[
        tw`h-7.5 w-27.5 border-1 border-solid border-grey-1 dark:border-white rounded-full
       bg-grey-5 dark:bg-black-1 px-2.25 py-0.5 flex flex-row items-center gap-1.75 cursor-pointer
       text-tiny font-semibold text-black-4 dark:text-white
       `
      ]}
      onClick={handleClick}
    >
      {riveComponent}
      <span>Rewards</span>
    </div>
  )
}

export const RewardsPopup: FC = () => (
  <Wrapper>
    <REWARD_INFO>
      <RewardInfoComponent />
    </REWARD_INFO>
    <REWARD_REDIRECT>
      <RewardRedirectComponent />
    </REWARD_REDIRECT>
  </Wrapper>
)

export default RewardsPopup
