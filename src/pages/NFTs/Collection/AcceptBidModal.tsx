import React, { FC, ReactElement, useMemo } from 'react'
/* eslint-disable @typescript-eslint/no-unused-vars */

// import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { STYLED_POPUP_BUY_MODAL } from './BuyNFTModal'
import { checkMobile } from '../../../utils'
import { minimizeTheString } from '../../../web3/nfts/utils'
import { GenericTooltip } from '../../../utils/GenericDegsin'
import { useNFTDetails } from '../../../context'
import { NFT_MARKET_TRANSACTION_FEE } from '../../../constants'
import { Button } from '../../../components/Button'

const AcceptBidModal: FC<{
  isLoading: boolean
  closeTheModal: any
  visible: boolean
  bidPrice: number
  callSellInstruction: any
}> = ({ visible, closeTheModal, isLoading, callSellInstruction, bidPrice }) => {
  const { general } = useNFTDetails()
  const totalToReceive = useMemo(() => bidPrice - NFT_MARKET_TRANSACTION_FEE / 100, [bidPrice])
  return (
    <STYLED_POPUP_BUY_MODAL
      lockModal={isLoading}
      height={checkMobile() ? '50%' : '393px'}
      width={checkMobile() ? '100%' : '580px'}
      title={null}
      centered={checkMobile() ? false : true}
      visible={visible}
      onCancel={!isLoading && closeTheModal}
      footer={null}
    >
      <div tw="flex flex-col items-center">
        <div className="delistText" tw="!text-[20px]">
          Are you sure you want to accept the bid
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
            <div className="leftAlign">Hightest Bid</div>
            <div className="rightAlign">{bidPrice} SOL</div>
          </div>
          <div className="rowContainer">
            <div className="leftAlign">Service Fee</div>
            <div className="rightAlign"> {NFT_MARKET_TRANSACTION_FEE / 100} SOL</div>
          </div>
          <div className="rowContainer">
            <div className="leftAlign">Total amount to receive</div>
            <div className="rightAlignFinal"> {totalToReceive.toFixed(2)} SOL</div>
          </div>
        </div>

        <Button
          onClick={callSellInstruction}
          className={'buyButton'}
          tw="!bottom-[100px] !h-[56px] !absolute sm:!bottom-[70px]"
          loading={isLoading}
        >
          <span tw="font-semibold text-[20px]">Yes, Accept bid</span>
        </Button>
        <div className="cancelText" tw="!bottom-[58px] absolute" onClick={closeTheModal}>
          Cancel
        </div>
        <TermsTextNFT string="Accept" />
      </div>
    </STYLED_POPUP_BUY_MODAL>
  )
}

export const TermsTextNFT: FC<{ string }> = ({ string }): ReactElement => (
  <div className="termsText" tw="absolute bottom-4">
    By clicking ¨{string}¨, you agree to the <strong> Terms of Service.</strong>
  </div>
)

export default React.memo(AcceptBidModal)
