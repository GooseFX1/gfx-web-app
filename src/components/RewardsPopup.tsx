import React, { FC } from 'react'
import styled from 'styled-components'
import { useRewardToggle } from '../context/reward_toggle'
import { RewardInfoComponent, RewardRedirectComponent } from './RewardDetails'
import tw from 'twin.macro'

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
const REWARDS_BTN = styled.button`
  ${tw`w-[111px] h-9 text-xs !font-semibold rounded-circle cursor-pointer text-white 
  border-none border-0 sm:h-[70px] sm:w-full sm:text-regular  sm:rounded-none sm:rounded-t-bigger sm:p-4 sm:mb-32`}
  background-image: linear-gradient(90deg, #8ade75 0%, #4b831d 100%);
  line-height: inherit;
`
const REWARDS_WITH_IMG = styled.img`
  ${tw`h-4 w-4 ml-2`}
`

const REWARD_BTN_TITLE = styled.span`
  ${tw`text-smallest font-semibold sm:text-sm`}

  @media (max-width: 500px) {
    line-height: inherit;
  }
`

export const RewardsButton: FC = () => {
  const { rewardModal, rewardToggle } = useRewardToggle()

  const handleModalClick = () => {
    rewardToggle(true)
  }

  return (
    <REWARDS_BTN onClick={handleModalClick}>
      <REWARD_BTN_TITLE>Rewards</REWARD_BTN_TITLE>
      <REWARDS_WITH_IMG src={'/img/assets/rewards.svg'} alt="rewards" />
      {rewardModal && <RewardsPopup />}
    </REWARDS_BTN>
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
