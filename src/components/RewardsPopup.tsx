import React, {FC} from "react"
import styled from "styled-components";
import { useRewardToggle } from "../context/reward_toggle";
import { RewardInfoComponent , RewardRedirectComponent } from "./RewardDetails";

const REWARD_INFO = styled.div`
    min-width: 75vw;
    min-height: 70vh;
    border-radius: 20px;
`;

const REWARD_REDIRECT = styled.div`
    min-width: 25vw;
    background: ${({ theme }) => theme.bgReward};
    border-radius: 0 20px 0 0 ;
`;

const Wrapper = styled.div`
  min-width: 99vw;
  min-height: 60vh;
  font-family: Montserrat !important;
  display: flex;
  background-color: ${({ theme }) => theme.bg9};
  border-radius: 20px 20px 0 0;
`
const REWARDS_BTN = styled.a`
    padding: 14px;
`

export const RewardsButton: FC = () => {
    const { rewardToggle } = useRewardToggle(); 
    const handleModalClick = () => {
        rewardToggle(true)
    }
    return (
      <REWARDS_BTN onClick={handleModalClick}> 
        <img src={`/img/assets/rewards.svg`} alt="" id="rewardsButton"/>
      </REWARDS_BTN>
    );
}


export const RewardsPopup: FC = () => {

        return (
            <Wrapper>
                <REWARD_INFO> 
                    <RewardInfoComponent/>
                </REWARD_INFO>
                <REWARD_REDIRECT>
                    <RewardRedirectComponent/>
                </REWARD_REDIRECT>
            </Wrapper>
        )

}

export default RewardsPopup