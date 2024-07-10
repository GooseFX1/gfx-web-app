import React, { FC } from 'react'
import { RewardsPopup } from './rewards/RewardsPopup'
import { FeesPopup } from './FeesPopup'
import { MODAL_TYPES } from '../constants'
import { TraderProvider } from '@/context/trader_risk_group'
import { OrderProvider, PriceFeedProvider } from '@/context'
import { MarketProductGroupProvider } from '@/context/market_product_group'

interface IModalSlide {
  rewardModal?: boolean
  rewardToggle?: (bool: boolean) => void
  modalType: string
}

export const ModalSlide: FC<IModalSlide> = (props: IModalSlide) => (
  <PriceFeedProvider>
    <MarketProductGroupProvider>
      <OrderProvider>
        <TraderProvider>
          <div>
            {props.modalType === MODAL_TYPES.FEES && <FeesPopup {...props} />}
            {props.modalType === MODAL_TYPES.REWARDS && <RewardsPopup />}
          </div>
        </TraderProvider>
      </OrderProvider>
    </MarketProductGroupProvider>
  </PriceFeedProvider>
)
