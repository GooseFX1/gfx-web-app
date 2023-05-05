import { Button } from 'antd'
import { FC, useMemo } from 'react'
import { LAMPORTS_PER_SOL_NUMBER } from '../../../../constants'
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useNFTCollections } from '../../../../context/nft_collections'
import { useNFTDetails } from '../../../../context/nft_details'
import { checkMobile } from '../../../../utils'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { AppraisalValue } from '../../../../utils/GenericDegsin'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js'
import {
  CancelInstructionAccounts,
  CancelInstructionArgs,
  createCancelInstruction
} from '../../../../web3/auction-house/generated/instructions'
import { AH_FEE_ACCT, AUCTION_HOUSE, AUCTION_HOUSE_AUTHORITY, TREASURY_MINT } from '../../../../web3/ids'
import { useConnectionConfig } from '../../../../context'
import { bnTo8, confirmTransaction } from '../../../../web3/utils'
import BN from 'bn.js'
import { tokenSize, tradeStatePDA } from '../../actions'
import { successfulCancelBidMessage, TransactionSignatureErrorNotify } from './AggNotifications'
import { minimizeTheString } from '../../../../web3/nfts/utils'

const REVIEW_MODAL = styled.div`
  ${tw``}
`
export const ReviewBidModal: FC<{
  curBid: number
  updateBidValue: any
  handleSetCurBid: any
  selectedBtn: number
  setReviewClicked: any
}> = ({ curBid, updateBidValue, handleSetCurBid, selectedBtn, setReviewClicked }) => {
  const { singleCollection } = useNFTCollections()
  const { general, ask, bids } = useNFTDetails()
  const { wallet, sendTransaction } = useWallet()
  const { connection } = useConnectionConfig()
  const publicKey: PublicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet])

  const buyerPrice = parseFloat(ask?.buyer_price ? ask?.buyer_price : '0') / LAMPORTS_PER_SOL_NUMBER
  const highestBid: number = useMemo(
    () =>
      bids.length > 0 ? Math.max(...bids.map((b) => parseFloat(b.buyer_price) / LAMPORTS_PER_SOL_NUMBER)) : 0,
    [bids]
  )
  const yourPreviousBid = useMemo(
    () => (bids.length ? bids.filter((b) => b.wallet_key === publicKey.toString()) : null),
    [bids, wallet?.adapter, wallet?.adapter?.publicKey]
  )
  const derivePDAsForInstruction = async () => {
    const buyerPriceInLamports = yourPreviousBid.length ? parseFloat(yourPreviousBid[0].buyer_price) : null
    const buyerPrice: BN = new BN(buyerPriceInLamports)

    const buyerTradeState: [PublicKey, number] = await tradeStatePDA(
      publicKey,
      yourPreviousBid[0].auction_house_key ? yourPreviousBid[0].auction_house_key : AUCTION_HOUSE,
      general.token_account,
      general.mint_address,
      yourPreviousBid[0].auction_house_treasury_mint_key
        ? yourPreviousBid[0]?.auction_house_treasury_mint_key
        : TREASURY_MINT,
      bnTo8(buyerPrice)
    )

    if (!buyerTradeState) {
      return {
        buyerTradeState: undefined,
        buyerPrice: undefined
      }
    }

    return {
      buyerTradeState,
      buyerPrice
    }
  }

  const callCancelInstruction = async () => {
    const { buyerTradeState, buyerPrice } = await derivePDAsForInstruction()

    const cancelInstructionArgs: CancelInstructionArgs = {
      buyerPrice: buyerPrice,
      tokenSize: tokenSize
    }

    const cancelInstructionAccounts: CancelInstructionAccounts = {
      wallet: publicKey,
      tokenAccount: new PublicKey(general.token_account),
      tokenMint: new PublicKey(general.mint_address),
      authority: new PublicKey(AUCTION_HOUSE_AUTHORITY),
      auctionHouse: new PublicKey(AUCTION_HOUSE),
      auctionHouseFeeAccount: new PublicKey(AH_FEE_ACCT),
      tradeState: buyerTradeState[0]
    }

    const cancelIX: TransactionInstruction = await createCancelInstruction(
      cancelInstructionAccounts,
      cancelInstructionArgs
    )
    try {
      const transaction = new Transaction().add(cancelIX)
      const signature = await sendTransaction(transaction, connection)
      console.log(signature)
      const confirm = await confirmTransaction(connection, signature, 'finalized')
      console.log(confirm)
      if (confirm?.value?.err === null) {
        successfulCancelBidMessage(signature, general.nft_name)
      }
    } catch (err) {
      TransactionSignatureErrorNotify(general.nft_name)
    }
  }
  return (
    <REVIEW_MODAL>
      {checkMobile() && <img className="nftImgBid" src={general.image_url} alt="" />}
      <div tw="flex flex-col sm:mt-[-135px] sm:items-start items-center">
        <div className="buyTitle">
          You are about to bid for:
          <br />
          <strong>{minimizeTheString(general?.nft_name, checkMobile() ? 16 : 30)} </strong>
          {checkMobile() && <br />}
          <strong>
            {general?.collection_name &&
              `by ${minimizeTheString(general?.collection_name, checkMobile() ? 16 : 30)}`}
          </strong>
        </div>
        {singleCollection && singleCollection[0]?.is_verified && (
          <div className="verifiedText">
            <div>
              {!checkMobile() && (
                <img className="verifiedImg" src={`/img/assets/Aggregator/verifiedNFT.svg`} alt="" />
              )}
              This is a verified {checkMobile() && <br />} Creator
              {checkMobile() && (
                <img className="verifiedImg" src={`/img/assets/Aggregator/verifiedNFT.svg`} alt="" />
              )}
            </div>
          </div>
        )}
      </div>
      <div className="vContainer" tw="flex">
        {!checkMobile() && (
          <div tw="mt-6" className="nftImgBid">
            <img src={general?.image_url} alt="" />
          </div>
        )}
        <div tw="flex flex-col sm:mt-6">
          <div className="currentBid">Existing {!checkMobile() && <br />} Hightest Bid</div>
          <div className="priceNumber" tw=" ml-4 mt-2 flex items-center">
            {highestBid}
            <img src={`/img/crypto/SOL.svg`} />
          </div>
        </div>
      </div>

      <div tw="mt-[30px] sm:mt-[10px]">
        <AppraisalValue
          text={general?.gfx_appraisal_value ? `${general.gfx_appraisal_value} SOL` : null}
          label={general?.gfx_appraisal_value ? 'Appraisal Value' : 'Appraisal Not Supported'}
          width={360}
        />
      </div>
      <div className="vContainer">
        <div className="maxBid" tw="mt-8 sm:mt-[12px]">
          Enter Maximum Bid
        </div>
      </div>
      <div className="vContainer">
        <input
          className="enterBid"
          placeholder="0.0"
          type="number"
          value={curBid >= 0 ? curBid : undefined}
          onChange={(e) => updateBidValue(e)}
        />
        <img src="/img/crypto/SOL.svg" tw="w-8 h-8 mt-3 ml-[-30px] sm:mt-0 " />
      </div>
      <div className="vContainer" tw="mt-[40px] sm:mt-[30px] flex items-center !justify-between">
        <div
          className={selectedBtn === 0 ? 'bidButtonSelected' : 'bidButton'}
          onClick={() => handleSetCurBid(buyerPrice + 10, 0)}
        >
          {buyerPrice + 10}
        </div>
        <div
          className={selectedBtn === 1 ? 'bidButtonSelected' : 'bidButton'}
          onClick={() => handleSetCurBid(buyerPrice + 20, 1)}
        >
          {buyerPrice + 20}
        </div>
        {!checkMobile() && (
          <div
            className={selectedBtn === 2 ? 'bidButtonSelected' : 'bidButton'}
            onClick={() => handleSetCurBid(buyerPrice + 30, 2)}
          >
            {buyerPrice + 30}
          </div>
        )}
      </div>

      <div className="buyBtnContainer">
        {/* {yourPreviousBid ? (
          <div tw=" flex !bottom-0">
            <Button className="semiBuyButton" disabled={curBid <= 0} onClick={() => setReviewClicked(true)}>
              Review Offer
            </Button>
            <Button
              className="semiSellButton"
              tw="!mt[-10px]"
              disabled={curBid <= 0}
              onClick={callCancelInstruction}
            >
              Cancel bid
            </Button>
          </div>
        ) : */}

        <Button className="buyButton" disabled={curBid <= 0} onClick={() => setReviewClicked(true)}>
          Review Offer
        </Button>
      </div>
    </REVIEW_MODAL>
  )
}
