import React, { FC, useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useRewardToggle } from '../context/reward_toggle'
import { PanelSelector, RewardInfoComponent, RewardRedirectComponent } from './RewardDetails'
import tw from 'twin.macro'
import 'styled-components/macro'
import { useRive, useStateMachineInput } from '@rive-app/react-canvas'
import useBreakPoint from '../hooks/useBreakPoint'
import { RIVE_ANIMATION } from '../constants'
import { useDarkMode } from '../context'
import useRewards from '../hooks/useRewards'

const REWARD_INFO = styled.div`
  ${tw`w-full min-w-[65%]  rounded-bigger`}
`

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
const REWARDS_BTN = styled.button`
  ${tw`w-[111px] h-9 text-xs font-semibold rounded-circle cursor-pointer text-white
  border-none border-0 sm:h-[70px] sm:w-full sm:text-regular  sm:rounded-none sm:rounded-t-bigger sm:p-4 sm:mb-32
  flex flex-row justify-center items-center
  `}
  background-image: linear-gradient(90deg, #4FCF95 0%, #18495D 100%);
  line-height: inherit;
`
// const REWARDS_WITH_IMG = styled.img`
//   ${tw`ml-2`}
// `

const REWARD_BTN_TITLE = styled.span`
  ${tw`text-smallest font-semibold sm:text-sm`};

  @media (max-width: 500px) {
    line-height: inherit;
  }
`
const RiveRewardsAnimation = () => {
  const { mode } = useDarkMode()
  const { rewards } = useRewards()
  const { rive, RiveComponent } = useRive({
    src: RIVE_ANIMATION['rewards'].src,
    autoplay: true,
    stateMachines: Object.keys(RIVE_ANIMATION['rewards'].stateMachines)
  })
  const animationColor = useStateMachineInput(
    rive,
    RIVE_ANIMATION['rewards'].stateMachines.Rewards.stateMachineName,
    RIVE_ANIMATION['rewards'].stateMachines.Rewards.inputs.theme
  )

  useEffect(() => {
    if (!animationColor) return
    animationColor.value = mode == 'dark'
  }, [mode, animationColor])

  return (
    <div css={tw`relative h-[30px] w-[30px]`}>
      <RiveComponent
        style={{
          width: '30px',
          height: '30px'
        }}
      />
      {rewards.user.staking.claimable ||
        (rewards.user.staking.unstakeableTickets.length > 0 && (
          <img css={tw`absolute top-[5px] right-0`} src={'img/assets/red-notification-circle.svg'} />
        ))}
    </div>
  )
}
export const RewardsButton: FC = () => {
  const { rewardToggle } = useRewardToggle()
  const breakpoints = useBreakPoint()

  const handleModalClick = useCallback(() => {
    rewardToggle(true)
  }, [])

  return breakpoints.isMobile ? (
    <button onClick={handleModalClick}>
      <RiveRewardsAnimation />
    </button>
  ) : (
    <REWARDS_BTN onClick={handleModalClick}>
      <REWARD_BTN_TITLE>Rewards</REWARD_BTN_TITLE>
      <RiveRewardsAnimation />
    </REWARDS_BTN>
  )
}

export const RewardsPopup: FC = () => {
  const [panelIndex, setPanelIndex] = useState(0)

  return (
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
  )
}

export default RewardsPopup
