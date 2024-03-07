import React, { FC } from 'react'
// import styled from 'styled-components'
import { RewardsPopup } from './rewards/RewardsPopup'
import { FeesPopup } from './FeesPopup'
import { MODAL_TYPES } from '../constants'
import { TraderProvider } from '@/context/trader_risk_group'
import { OrderProvider, PriceFeedProvider } from '@/context'
// import tw from 'twin.macro'

// const WRAPPER = styled.div`
//   ${tw`absolute top-0 left-0 right-0 bottom-0 h-screen w-screen overflow-hidden z-[999]`}
//   background: ${({ theme }) => theme.modalBackground};
// `
// const MODAL = styled.div`
//   ${tw`fixed left-0 right-0 bottom-0 w-screen rounded-t-bigger z-[1000] min-md:min-h-[500px]
//   overflow-y-auto overflow-x-hidden flex`}
//
//   animation: slideIn .625s linear;
// }
// @keyframes slideIn {
//   0% {
//     transform: translateY(1000px);
//     animation-timing-function: ease-out;
//   }
//   60% {
//     transform: translateY(-30px);
//     animation-timing-function: ease-in;
//   }
//   80% {
//     transform: translateY(10px);
//     animation-timing-function: ease-out;
//   }
//   100% {
//     transform: translateY(0px);
//     animation-timing-function: ease-in;
//   }
// }
// `
interface IModalSlide {
  rewardModal?: boolean
  rewardToggle?: (bool: boolean) => void
  modalType: string
}

// const closeRewardModal = (e, rewardToggle) => {
//   if (e.target.id === 'wrapper-background' && rewardToggle) {
//     rewardToggle(false)
//   }
// }

export const ModalSlide: FC<IModalSlide> = (props: IModalSlide) => (
  <PriceFeedProvider>
    <OrderProvider>
      <TraderProvider>
        <div>
          {props.modalType === MODAL_TYPES.FEES && <FeesPopup {...props} />}
          {props.modalType === MODAL_TYPES.REWARDS && <RewardsPopup />}
        </div>
      </TraderProvider>
    </OrderProvider>
  </PriceFeedProvider>
)
