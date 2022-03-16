import React, { FC } from 'react'
import styled from 'styled-components'
import { useRewardToggle } from '../context/reward_toggle'
import { RewardInfoComponent, RewardRedirectComponent } from './RewardDetails'

const REWARD_INFO = styled.div`
  width: 68%;
  height: 75vh;
  border-radius: 20px;
`

const REWARD_REDIRECT = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 32%;
  background-image: ${({ theme }) => theme.bgReward};
  border-radius: 0 20px 0 0;
`

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  font-family: Montserrat !important;
  display: flex;
  background-color: ${({ theme }) => theme.bg9};
  border-radius: 20px 20px 0 0;
`
const REWARDS_BTN = styled.button`
  background-image: linear-gradient(90deg, #9cc034 0%, #49821c 90%);
  width: 111px;
  height: 36px;
  font-size: 12px;
  font-weight: 600 !important;
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
`
const REWARDS_WITH_IMG = styled.img`
  height: 16px;
  width: 16px;
  margin-left: 8px;
`

const REWARD_BTN_TITLE = styled.span`
  font-size: 11px;
  font-weight: 600;
`

export const RewardsButton: FC = () => {
  const { rewardToggle } = useRewardToggle()
  const handleModalClick = () => {
    rewardToggle(true)
  }
  return (
    <REWARDS_BTN onClick={handleModalClick}>
      <REWARD_BTN_TITLE>Rewards</REWARD_BTN_TITLE>
      <REWARDS_WITH_IMG src={'/img/assets/rewards.svg'} alt="rewards" />
    </REWARDS_BTN>
  )
}

export const RewardsPopup: FC = () => {
  return (
    <Wrapper>
      <REWARD_INFO>
        <RewardInfoComponent />
      </REWARD_INFO>
      <REWARD_REDIRECT>
        <RewardRedirectComponent />
      </REWARD_REDIRECT>
    </Wrapper>
  )
}

export default RewardsPopup
