import React, { FC } from 'react'
import { RewardsPopup } from './rewards/RewardsPopup'
import { MODAL_TYPES } from '../constants'

interface IModalSlide {
  rewardModal?: boolean
  rewardToggle?: (bool: boolean) => void
  modalType: string
}

export const ModalSlide: FC<IModalSlide> = (props: IModalSlide) => (
  <div>
    {props.modalType === MODAL_TYPES.REWARDS && <RewardsPopup />}
  </div>
)
