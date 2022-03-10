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
const REWARDS_BTN = styled.button`
  background-image: linear-gradient(90deg,#9cc034 0%,#49821c 90%);
  width: 111px;
  height: 36px;
  font-size: 12px;
  font-weight: 600 !important;
  color: white;
  border: none;
  border-radius: 50px;
  box-shadow: 0 4px 15px 2px rgb(0 0 0 / 25%);
  cursor: pointer;
`
const REWARDS_WITH_IMG = styled.span`
    height: 38px;
    width: 38px;
    margin-top: -10px;
    display: inline-block;
    transform:scale(0.5);
    position: absolute;
    background-image: url('/img/assets/Substract.svg');
`;

const REWARD_BTN_TITLE = styled.span`
    font-weight: bold;
    margin-left: -20%;
`;

export const RewardsButton: FC = () => {
    const { rewardToggle } = useRewardToggle(); 
    const handleModalClick = () => {
        rewardToggle(true)
    }
    return (
      <REWARDS_BTN onClick={handleModalClick}> 
            <REWARD_BTN_TITLE>Rewards</REWARD_BTN_TITLE><REWARDS_WITH_IMG/>  
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