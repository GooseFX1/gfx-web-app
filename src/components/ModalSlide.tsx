import React, { Dispatch, SetStateAction } from 'react'
import styled from 'styled-components'
import { RewardsPopup } from './RewardsPopup'
import { FeesPopup } from './FeesPopup'
import { MODAL_TYPES } from '../constants'
import { GoldenTicketPopup } from '../pages/NFTs/launchpad/pages/LaunchpadComponents'

const WRAPPER = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100vh;
  width: 100vw;
  background: ${({ theme }) => theme.modalBackground};
  overflow: hidden;
  z-index: 999;
`
const MODAL = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: -35px;
  width: 100vw;
  height: calc(72vh + 35px);
  animation: slideIn .625s linear;
  border-radius: 20px 20px 0 0;
  z-index: 1000;
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
  rewardToggle?: Dispatch<SetStateAction<boolean>>
  modalType: string
}

const closeRewardModal = (e, rewardToggle) => {
  if (e.target.id === 'wrapper-background') {
    rewardToggle(false)
  }
}

export const ModalSlide = (props: IModalSlide) => {
  return (
    <WRAPPER id="wrapper-background" onClick={(e) => closeRewardModal(e, props.rewardToggle)}>
      <MODAL id="modal">
        {props.modalType === MODAL_TYPES.REWARDS && <RewardsPopup />}
        {props.modalType === MODAL_TYPES.FEES && <FeesPopup {...props} />}
        {props.modalType === MODAL_TYPES.GOLDEN_TICKET && <GoldenTicketPopup />}
      </MODAL>
    </WRAPPER>
  )
}
