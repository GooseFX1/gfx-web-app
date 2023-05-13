import { Button } from 'antd'
import React, { FC } from 'react'
// import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { STYLED_POPUP_BUY_MODAL } from './BuyNFTModal'
import { checkMobile, formatSOLDisplay } from '../../../utils'
import { minimizeTheString } from '../../../web3/nfts/utils'
import { GenericTooltip } from '../../../utils/GenericDegsin'
import { useNFTDetails } from '../../../context'
import { PriceWithToken } from '../../../components/common/PriceWithToken'

const DelistNFTModal: FC<{
  isDelistLoading: boolean
  closeTheModal: any
  visible: boolean
  callDelistInstruction: any
}> = ({ visible, closeTheModal, isDelistLoading, callDelistInstruction }) => {
  const { general, ask } = useNFTDetails()

  return (
    <STYLED_POPUP_BUY_MODAL
      height={checkMobile() ? '50%' : '357px'}
      width={checkMobile() ? '100%' : '580px'}
      title={null}
      centered={checkMobile() ? false : true}
      visible={visible}
      onCancel={!isDelistLoading && closeTheModal}
      footer={null}
    >
      <div tw="flex flex-col items-center">
        <div className="delistText">
          Are you sure you want to delist
          <br />
          <GenericTooltip text={general?.nft_name}>
            <strong>{minimizeTheString(general?.nft_name, checkMobile() ? 12 : 16)} </strong>{' '}
          </GenericTooltip>
          {checkMobile() && <br />}
          <GenericTooltip text={general?.collection_name}>
            <strong>
              {general?.collection_name &&
                `by ${minimizeTheString(general?.collection_name, checkMobile() ? 12 : 16)}`}
            </strong>
          </GenericTooltip>
        </div>

        <div className="priceText" tw="!mt-6 mb-2 sm:!mt-10">
          Price
        </div>
        <PriceWithToken
          price={formatSOLDisplay(ask?.buyer_price)}
          token={'SOL'}
          cssStyle={tw`h-6 w-6 !text-[40px]`}
        />
        <Button
          onClick={callDelistInstruction}
          className={'sellButton'}
          tw="mt-[30px] sm:!absolute sm:!bottom-[70px]"
          loading={isDelistLoading}
        >
          <span tw="font-semibold text-[20px]">Yes, Delist item</span>
        </Button>
        <div className="cancelText" onClick={closeTheModal}>
          Cancel
        </div>
      </div>
    </STYLED_POPUP_BUY_MODAL>
  )
}

export default React.memo(DelistNFTModal)
