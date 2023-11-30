import React, { FC, ReactElement, useEffect, useMemo, useState } from 'react'

// import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { STYLED_POPUP_BUY_MODAL } from './BuyNFTModal'
import { checkMobile, formatSOLDisplay } from '../../../utils'
import { getNFTMetadata, minimizeTheString } from '../../../web3/nfts/utils'
import { GenericTooltip } from '../../../utils/GenericDegsin'
import { useConnectionConfig, useNFTAggregator, useNFTDetails } from '../../../context'
import { NFT_MARKET_TRANSACTION_FEE } from '../../../constants'
import { Button } from '../../../components'
import { getMetadata } from '../../../web3'

const AcceptBidModal: FC<{
  isLoading: boolean
  closeTheModal: any
  visible: boolean
  bidPrice: number
  callSellInstruction: any
}> = ({ visible, closeTheModal, isLoading, callSellInstruction, bidPrice }) => {
  const { general } = useNFTDetails()
  const [onChainNFTMetadata, setOnChainNFTMetadata] = useState<any>()
  const { connection } = useConnectionConfig()
  const { setOpenJustModal } = useNFTAggregator()

  useEffect(() => {
    ;(async () => {
      if (general.mint_address) {
        const metadata = await getMetadata(general.mint_address)
        const onChainMetadata = await getNFTMetadata(metadata, connection)
        setOnChainNFTMetadata(onChainMetadata)
      }
    })()
    return () => setOpenJustModal(false)
  }, [general])

  const sellerFeeBasisPoints = useMemo(
    () => (onChainNFTMetadata?.data ? onChainNFTMetadata.data.sellerFeeBasisPoints / 100 : 0),
    [onChainNFTMetadata]
  )
  const totalToReceive = useMemo(
    () => bidPrice - (bidPrice * sellerFeeBasisPoints) / 100 - NFT_MARKET_TRANSACTION_FEE / 100,
    [bidPrice, sellerFeeBasisPoints]
  )
  const serviceFee = useMemo(
    () => (bidPrice * sellerFeeBasisPoints) / 100 + NFT_MARKET_TRANSACTION_FEE / 100,
    [onChainNFTMetadata]
  )

  return (
    <STYLED_POPUP_BUY_MODAL
      lockModal={isLoading}
      height={checkMobile() ? '460px' : '393px'}
      width={checkMobile() ? '100%' : '580px'}
      title={null}
      centered={checkMobile() ? false : true}
      visible={visible}
      onCancel={!isLoading && closeTheModal}
      footer={null}
    >
      <div tw="flex flex-col items-center">
        <div className="delistText" tw="!text-[20px] sm:!text-[15px]">
          Are you sure you want to accept the bid
          <br />
          <GenericTooltip text={general?.nft_name}>
            <strong>{minimizeTheString(general?.nft_name, checkMobile() ? 12 : 16)} </strong>{' '}
          </GenericTooltip>
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
        {/* // TODO: Seller fees */}
        <div className="feesContainer" tw="!bottom-[180px]">
          <div className="rowContainer">
            <div className="leftAlign">Hightest Bid</div>
            <div className="rightAlign">{bidPrice} SOL</div>
          </div>
          <div className="rowContainer">
            <div className="leftAlign">Service Fee</div>
            <div className="rightAlign"> {serviceFee.toFixed(2)} SOL</div>
          </div>
          <div className="rowContainer">
            <div className="leftAlign">Total amount to receive</div>
            <div className="rightAlign"> {totalToReceive.toFixed(2)} SOL</div>
          </div>
        </div>
        <Button
          onClick={callSellInstruction}
          className={'buyButton'}
          tw="!bottom-[100px]   absolute  sm:!bottom-[55px]"
          loading={isLoading}
        >
          <span tw="font-semibold text-[20px] sm:text-[16px]"> Accept {formatSOLDisplay(totalToReceive)} SOL</span>
        </Button>

        <div className="cancelText" tw="!bottom-[58px] sm:!bottom-[20px] " onClick={closeTheModal}>
          {!isLoading && `Cancel`}
        </div>
        <TermsTextNFT string="Accept" />
      </div>
    </STYLED_POPUP_BUY_MODAL>
  )
}

export const TermsTextNFT: FC<{ string: string; bottom?: boolean }> = ({ string, bottom }): ReactElement => (
  <div
    className="termsText"
    css={[bottom ? tw`sm:bottom-[100px]` : tw`sm:bottom-[120px]`]}
    tw="absolute bottom-4 text-grey-1 dark:text-grey-2 "
  >
    By clicking ¨{string}¨ you agree to{' '}
    <u>
      <a
        target="_blank"
        tw="dark:text-grey-5 text-blue-1"
        rel="noopener noreferrer"
        href="https://docs.goosefx.io/risks"
      >
        {' '}
        Terms of Service.
      </a>
    </u>
  </div>
)

export default React.memo(AcceptBidModal)
