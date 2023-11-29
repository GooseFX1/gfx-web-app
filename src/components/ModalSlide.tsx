import React, { FC } from 'react'
import styled from 'styled-components'
import { RewardsPopup } from './rewards/RewardsPopup'
import { FeesPopup } from './FeesPopup'
import MenuPopup from './popups/MenuPopup'
import { MODAL_TYPES } from '../constants'
import SubmitPopup from '../pages/NFTs/CreatorPage/Popup/SubmitPopup'
import RelaxPopup from '../pages/NFTs/CreatorPage/Popup/Relax'
import DisclaimerPopup from '../pages/NFTs/CreatorPage/Popup/Disclaimer'
import tw from 'twin.macro'
import { ApprovePopup, RejectPopup } from '../pages/NFTs/adminPage/components/AdminPagePopup'

const WRAPPER = styled.div`
  ${tw`absolute top-0 left-0 right-0 bottom-0 h-screen w-screen overflow-hidden z-[999]`}
  background: ${({ theme }) => theme.modalBackground};
`
const MODAL = styled.div`
  ${tw`fixed left-0 right-0 bottom-0 w-screen rounded-t-bigger z-[1000] min-md:min-h-[500px]
  overflow-y-auto overflow-x-hidden flex`}
  
  animation: slideIn .625s linear;
}
@keyframes slideIn {
  0% {
    transform: translateY(1000px);
    animation-timing-function: ease-out;
  }
  60% {
    transform: translateY(-30px);
    animation-timing-function: ease-in;
  }
  80% {
    transform: translateY(10px);
    animation-timing-function: ease-out;
  }
  100% {
    transform: translateY(0px);
    animation-timing-function: ease-in;
  }
}
`
interface IModalSlide {
  rewardModal?: boolean
  rewardToggle?: (bool: boolean) => void
  modalType: string
}

const closeRewardModal = (e, rewardToggle) => {
  if (e.target.id === 'wrapper-background' && rewardToggle) {
    rewardToggle(false)
  }
}

export const ModalSlide: FC<IModalSlide> = (props: IModalSlide) => (
  <WRAPPER
    id="wrapper-background"
    onClick={(e) => (props.rewardToggle ? closeRewardModal(e, props.rewardToggle) : null)}
  >
    <MODAL id="modal">
      {props.modalType === MODAL_TYPES.REWARDS && <RewardsPopup />}
      {props.modalType === MODAL_TYPES.SUBMIT && <SubmitPopup rewardToggle={props.rewardToggle} />}
      {props.modalType === MODAL_TYPES.RELAX && <RelaxPopup rewardToggle={props.rewardToggle} />}
      {props.modalType === MODAL_TYPES.CREATOR_DISCLAIMER && <DisclaimerPopup rewardToggle={props.rewardToggle} />}
      {props.modalType === MODAL_TYPES.FEES && <FeesPopup {...props} />}
      {props.modalType === MODAL_TYPES.APPROVE_PROJECT && <ApprovePopup rewardToggle={props.rewardToggle} />}
      {props.modalType === MODAL_TYPES.REJECT_PROJECT && <RejectPopup rewardToggle={props.rewardToggle} />}
      {props.modalType === MODAL_TYPES.NFT_MENU && <MenuPopup rewardToggle={props.rewardToggle} />}
    </MODAL>
  </WRAPPER>
)
