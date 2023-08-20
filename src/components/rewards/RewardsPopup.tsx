import React, { FC, useCallback, useState, useMemo } from 'react'
import styled from 'styled-components'
import { useRewardToggle } from '../../context/reward_toggle'
import { EarnLeftSidePanel, EarnRightSidePanel } from './RewardDetails'
import tw from 'twin.macro'
import 'styled-components/macro'
import useBreakPoint from '../../hooks/useBreakPoint'
import { CryptoProvider, useDarkMode } from '../../context'
import useRewards, { RewardsProvider } from '../../context/rewardsContext'
import PanelSelector from './RewardPanelSelector'
// import { useRive, useStateMachineInput } from '@rive-app/react-canvas'
// import { RIVE_ANIMATION } from '../constants'
// import useRewards from '../hooks/useRewards'

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
          css={[breakpoint.isMobile || breakpoint.isTablet ? tw`h-[30px] w-[32px]` : tw`h-[22px] w-[20px]`]}
          src={`/img/mainnav/rewards-${mode}.svg`}
        />

        {hasRewards && (
          <img
            css={tw`absolute top-[5px] min-md:top-[1px] right-0`}
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
            text-tiny font-semibold text-black-4 dark:text-white leading-normal
       `,
        breakpoint.isMobile || breakpoint.isTablet ? tw`h-[30px]` : tw`h-[30px]`
      ]}
    >
      {riveComponent}
      <span>Rewards</span>
    </div>
  )
}

const REWARD_REDIRECT = styled.div<{ $index: number }>`
  ${tw`flex flex-col min-w-max w-[40%] justify-center w-full sm:rounded-t-bigger rounded-tr-bigger`}
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
  ${tw`h-full min-md:min-h-[500px] w-full flex flex-row sm:flex-col-reverse rounded-t-bigger`}
  font-family: Montserrat !important;
  background-color: ${({ theme }) => theme.bg9};
`

const REWARD_INFO = styled.div`
  ${tw`w-full min-w-[60%]  rounded-bigger`}
`

export const RewardsPopup: FC = () => {
  const [panelIndex, setPanelIndex] = useState<number>(0)

  return (
    <CryptoProvider>
      <RewardsProvider>
        <Wrapper>
          <REWARD_INFO>
            <EarnLeftSidePanel panelIndex={panelIndex}>
              <PanelSelector panelIndex={panelIndex} setPanelIndex={setPanelIndex} />
            </EarnLeftSidePanel>
          </REWARD_INFO>
          <REWARD_REDIRECT $index={panelIndex}>
            <EarnRightSidePanel panelIndex={panelIndex}>
              <PanelSelector panelIndex={panelIndex} setPanelIndex={setPanelIndex} />
            </EarnRightSidePanel>
          </REWARD_REDIRECT>
        </Wrapper>
      </RewardsProvider>
    </CryptoProvider>
  )
}

export default RewardsPopup
