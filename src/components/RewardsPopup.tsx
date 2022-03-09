import React, {FC , useState} from "react"
import styled from "styled-components";
import Modal from 'react-modal'; 
import { RewardInfoComponent , RewardRedirectComponent } from "./RewardDetails";
const REWARD_INFO = styled.div`
    min-width: 75vw;
`;

const customStyles = {
    content : {
      top: '65%',
      padding: "0 !important",
      left: '50%',
      right: 'auto',
      width: "100%",
      height: "70%",
      display: "flex",
      transform : 'translate(-50%, -50%)',
      borderTopLeftRadius: "30px",
      borderTopRightRadius: "30px",
      border: "none !important",
      zIndex: 20,
    }
};
const REWARD_REDIRECT = styled.div`
    min-width: 25vw;
    background: ${({ theme }) => theme.bgReward};
`;

const Wrapper = styled.div`
  min-width: 99vw;
  min-height: 60vh;
  font-family: Montserrat !important;
  display: flex;
  background-color: ${({ theme }) => theme.bg9};
`
const REWARDS_BTN = styled.a`
    padding: 14px;
`
Modal.setAppElement('#root');

export const RewardsButton: FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleModalClick = (event) => {
        if(event.target.id === "rewardsButton"){
            if(document.body.style.overflow === "hidden"){
                setIsModalOpen(false)
                document.body.style.overflow = "auto"
            }
            else{
                setIsModalOpen(true)
                document.body.style.overflow = "hidden"
            }
        }
    }
    return (
        <REWARDS_BTN  onClick={(e) => handleModalClick(e)} onKeyDown={(e) => handleModalClick(e)}> 
            <Modal isOpen = {isModalOpen} style={customStyles} >
                <RewardsPopup/>
            </Modal>
        <img src={`/img/assets/rewards.svg`} alt="" id="rewardsButton"/>
      </REWARDS_BTN>
    );
}


const RewardsPopup: FC = () => {

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