import React, { FC, useCallback, useState, useMemo } from 'react'
import styled from 'styled-components'
import { useRewardToggle } from '../context/reward_toggle'
import { PanelSelector, RewardInfoComponent, RewardRedirectComponent } from './RewardDetails'
import tw from 'twin.macro'
import 'styled-components/macro'
import useBreakPoint from '../hooks/useBreakPoint'
import { useDarkMode } from '../context'
import useRewards, { RewardsProvider } from '../context/rewardsContext'
// import { useRive, useStateMachineInput } from '@rive-app/react-canvas'
// import { RIVE_ANIMATION } from '../constants'
// import useRewards from '../hooks/useRewards'

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
  const { mode } = useDarkMode()
  const { rewardToggle } = useRewardToggle()
  const breakpoint = useBreakPoint()
  // const rewardsAnimation = useRiveAnimations({
  //   animation: 'rewards',
  //   autoplay: true,
  //   canvasWidth: breakpoint.isMobile || breakpoint.isTablet ? 31 : 20,
  //   canvasHeight: breakpoint.isMobile || breakpoint.isTablet ? 35 : 22.32
  // })
  // useRiveThemeToggle(rewardsAnimation.rive, 'rewards', 'Rewards')
  const { hasRewards } = useRewards()
  // const breakpointWidth = breakpoint.isMobile || breakpoint.isTablet ? 31 : 20
  // const breakpointHeight = breakpoint.isMobile || breakpoint.isTablet ? 35 : 22.32
  const riveComponent = useMemo(
    () => (
      <div css={[tw`relative`]}>
        {/* <RiveAnimationWrapper
          setContainerRef={rewardsAnimation.setContainerRef}
          width={breakpointWidth}
          height={breakpointHeight}
        >
          <rewardsAnimation.RiveComponent />
        </RiveAnimationWrapper> */}

        <img
          css={[breakpoint.isMobile || breakpoint.isTablet ? tw`h-[35px] w-[31px]` : tw`h-[22px] w-[20px]`]}
          src={`img/mainnav/rewards-${mode}.${breakpoint.isMobile || breakpoint.isTablet ? 'png' : 'svg'}`}
        />

        {hasRewards && (
          <img
            css={tw`absolute top-[5px] min-md:top-[1px] right-0`}
            src={'img/assets/red-notification-circle.svg'}
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
            bg-grey-5 dark:bg-black-1 px-2.25 py-0.5 flex flex-row items-center gap-1.75 cursor-pointer
            text-tiny font-semibold text-black-4 dark:text-white
       `,
        breakpoint.isMobile || breakpoint.isTablet ? tw`h-[35px]` : tw`h-[30px]`
      ]}
    >
      {riveComponent}
      <span>Rewards</span>
    </div>
  )
}

const REWARD_REDIRECT = styled.div<{ $index: number }>`
  ${tw`flex flex-col min-w-max w-[35%] justify-center w-full sm:rounded-t-bigger rounded-tr-bigger`}
  background-image: ${({ theme, $index }) => {
    switch ($index) {
      case 0:
        return theme.bgEarn
      case 1:
        return theme.bgRefer
    }
  }};
`

const Wrapper = styled.div`
  ${tw`h-full min-h-[500px] w-full flex flex-row sm:flex-col-reverse rounded-t-bigger`}
  font-family: Montserrat !important;
  background-color: ${({ theme }) => theme.bg9};
`

const REWARD_INFO = styled.div`
  ${tw`w-full min-w-[65%]  rounded-bigger`}
`

export const RewardsPopup: FC = () => {
  const [panelIndex, setPanelIndex] = useState<number>(0)

  return (
    <RewardsProvider>
      <Wrapper>
        <REWARD_INFO>
          <RewardInfoComponent panelIndex={panelIndex}>
            <PanelSelector panelIndex={panelIndex} setPanelIndex={setPanelIndex} />
          </RewardInfoComponent>
        </REWARD_INFO>
        <REWARD_REDIRECT $index={panelIndex}>
          <RewardRedirectComponent panelIndex={panelIndex}>
            <PanelSelector panelIndex={panelIndex} setPanelIndex={setPanelIndex} />
          </RewardRedirectComponent>
        </REWARD_REDIRECT>
      </Wrapper>
    </RewardsProvider>
  )
}

export default RewardsPopup
