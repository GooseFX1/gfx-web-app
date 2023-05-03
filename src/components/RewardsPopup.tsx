import React, { FC, useState } from 'react'
import styled from 'styled-components'
import { useRewardToggle } from '../context/reward_toggle'
import { RewardInfoComponent, RewardRedirectComponent } from './RewardDetails'
import tw from 'twin.macro'

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
  ${tw`w-[111px] h-9 text-xs !font-semibold rounded-circle cursor-pointer text-white 
  border-none border-0 sm:h-[70px] sm:w-full sm:text-regular  sm:rounded-none sm:rounded-t-bigger sm:p-4 sm:mb-32`}
  background-image: linear-gradient(90deg, #4FCF95 0%, #18495D 100%);
  line-height: inherit;
`
const REWARDS_WITH_IMG = styled.img`
  ${tw`ml-2`}
`

const REWARD_BTN_TITLE = styled.span`
  ${tw`text-smallest font-semibold sm:text-sm`};

  @media (max-width: 500px) {
    line-height: inherit;
  }
`

export const RewardsButton: FC = () => {
  const { rewardToggle } = useRewardToggle()

  const handleModalClick = () => {
    rewardToggle(true)
  }

  return (
    <REWARDS_BTN onClick={handleModalClick}>
      <REWARD_BTN_TITLE>Rewards</REWARD_BTN_TITLE>
      <REWARDS_WITH_IMG src={'/img/assets/rewards-program-small.svg'} alt="rewards" />
    </REWARDS_BTN>
  )
}

export const RewardsPopup: FC = () => {
  const [panelIndex, setPanelIndex] = useState(0)
  return (
    <Wrapper>
      <REWARD_INFO>
        <RewardInfoComponent panelIndex={panelIndex} setPanelIndex={setPanelIndex} />
      </REWARD_INFO>
      <REWARD_REDIRECT $index={panelIndex}>
        <RewardRedirectComponent panelIndex={panelIndex} />
      </REWARD_REDIRECT>
    </Wrapper>
  )
}

export default RewardsPopup
