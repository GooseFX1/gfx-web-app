import { Button } from 'antd'
import React, { FC } from 'react'
/* eslint-disable @typescript-eslint/no-unused-vars */

// import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { STYLED_POPUP_BUY_MODAL } from './BuyNFTModal'
import { checkMobile, formatSOLDisplay } from '../../../utils'
import { minimizeTheString } from '../../../web3/nfts/utils'
import { GenericTooltip } from '../../../utils/GenericDegsin'
import { useNFTDetails } from '../../../context'
import { TermsTextNFT } from './AcceptBidModal'

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
          Are you sure you want to Remove Listing
          <br />
          <GenericTooltip text={general?.nft_name}>
            <strong>{minimizeTheString(general?.nft_name, checkMobile() ? 12 : 16)} </strong>{' '}
          </GenericTooltip>
          {checkMobile() && <br />}
          {general?.collection_name && (
            <>
              {' '}
              by{' '}
              <GenericTooltip text={general?.collection_name}>
                <strong>{minimizeTheString(general?.collection_name, checkMobile() ? 12 : 16)}</strong>
              </GenericTooltip>
            </>
          )}
        </div>

        <div className="feesContainer" tw="!bottom-[180px]">
          <div className="rowContainer">
            <div className="leftAlign">Listing Price</div>
            <div className="rightAlign">{formatSOLDisplay(ask?.buyer_price)} SOL</div>
          </div>
        </div>
        <Button
          onClick={callDelistInstruction}
          className={'sellButton'}
          tw="bottom-[100px] !absolute sm:!bottom-[70px]"
          loading={isDelistLoading}
        >
          <span tw="font-semibold text-[20px]">Remove Listing</span>
        </Button>
        <div className="cancelText" tw="bottom-[58px]" onClick={closeTheModal}>
          Cancel
        </div>
        <TermsTextNFT string="Remove" />
      </div>
    </STYLED_POPUP_BUY_MODAL>
  )
}

export default React.memo(DelistNFTModal)
