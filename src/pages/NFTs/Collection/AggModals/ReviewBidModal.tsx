import { Button } from 'antd'
import { FC, useEffect, useMemo, useRef } from 'react'
import { LAMPORTS_PER_SOL_NUMBER } from '../../../../constants'
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useNFTCollections } from '../../../../context/nft_collections'
import { useNFTDetails } from '../../../../context/nft_details'
import { checkMobile, formatSOLDisplay, formatSOLNumber } from '../../../../utils'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { AppraisalValue, GenericTooltip } from '../../../../utils/GenericDegsin'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js'
import {
  CancelInstructionAccounts,
  CancelInstructionArgs,
  createCancelInstruction
} from '../../../../web3/auction-house/generated/instructions'
import {
  AH_FEE_ACCT,
  AUCTION_HOUSE,
  AUCTION_HOUSE_AUTHORITY,
  TREASURY_MINT,
  WRAPPED_SOL_MINT
} from '../../../../web3/ids'
import { useAccounts, useConnectionConfig } from '../../../../context'
import { bnTo8, confirmTransaction } from '../../../../web3/utils'
import BN from 'bn.js'
import { tokenSize, tradeStatePDA } from '../../actions'
import { successfulCancelBidMessage, TransactionSignatureErrorNotify } from './AggNotifications'
import { minimizeTheString } from '../../../../web3/nfts/utils'
import { BorderBottom } from '../SellNFTModal'

const PERCENT_80 = 0.8
const PERCENT_90 = 0.9
const PERCENT_100 = 1

const REVIEW_MODAL = styled.div`
  ${tw`h-[100%]`}
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
  const { getUIAmount } = useAccounts()

  const publicKey: PublicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet])
  const inputRef = useRef<HTMLInputElement | null>(null)

  const floorPrice = useMemo(
    () => (singleCollection ? formatSOLNumber(singleCollection[0]?.floor_price) : 0),
    [singleCollection]
  )

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus()
  }, [inputRef.current])

  const listingPrice = useMemo(() => (ask?.buyer_price ? formatSOLNumber(ask?.buyer_price) : 0), [ask])
  const highestBid: number = useMemo(
    () =>
      bids.length > 0 ? Math.max(...bids.map((b) => parseFloat(b.buyer_price) / LAMPORTS_PER_SOL_NUMBER)) : 0,
    [bids]
  )
  const userBidPrice = useMemo(
    () => (listingPrice > 0 ? listingPrice : floorPrice ? floorPrice : 0.1),
    [listingPrice]
  )
  const notEnough: boolean = useMemo(
    () => (curBid >= getUIAmount(WRAPPED_SOL_MINT.toBase58()) ? true : false),
    [curBid]
  )

  //bid can not be more than listing price
  //bid can not be less than 50% of the listing price - Minimum offer (50%)

  const displayErrorMsg = useMemo(() => {
    if (curBid && listingPrice) {
      if (curBid < listingPrice / 2) return `Offer ${formatSOLDisplay(listingPrice / 2)} (50%) or more`
      if (curBid > listingPrice) return `You can buy this NFT at ${formatSOLDisplay(listingPrice)}`
    }
    if (curBid && floorPrice) {
      if (curBid < floorPrice / 2) return `Offer ${formatSOLDisplay(floorPrice / 2)} (50%) of floor price or more`
    }
    return false
  }, [curBid])

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
          <GenericTooltip text={general?.nft_name}>
            <strong>{minimizeTheString(general?.nft_name, checkMobile() ? 12 : 15)} </strong>
          </GenericTooltip>
          {checkMobile() && <br />}
          <GenericTooltip text={general?.collection_name}>
            <strong>
              {general?.collection_name &&
                `by ${minimizeTheString(general?.collection_name, checkMobile() ? 12 : 15)}`}
            </strong>
          </GenericTooltip>
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

      <div tw="mt-[30px] sm:mt-1">
        <AppraisalValue
          text={general?.gfx_appraisal_value ? `${general.gfx_appraisal_value} SOL` : null}
          label={general?.gfx_appraisal_value ? 'Appraisal Value' : 'Appraisal Not Supported'}
          width={360}
        />
      </div>
      <div className="vContainer">
        <div className="maxBid" tw="mt-6 sm:mt-[12px]">
          Enter Maximum Bid
        </div>
      </div>
      <div className="vContainer">
        <input
          className="enterBid"
          placeholder="0.0"
          type="number"
          ref={inputRef}
          value={curBid >= 0 ? curBid : undefined}
          onChange={(e) => updateBidValue(e)}
        />
        <img src="/img/crypto/SOL.svg" tw="w-8 h-8 mt-3 ml-[-30px] sm:mt-0 " />
      </div>
      <div tw=" flex items-center justify-center mt-2 text-red-2">{displayErrorMsg}</div>
      <div
        className="vContainer"
        tw="mt-[40px] sm:mt-[30px] flex items-center !absolute bottom-[120px] sm:bottom-[100px]
         !justify-between ml-1.5 sm:ml-1 w-[calc(100% - 60px)] sm:w-[calc(100% - 56px)]"
      >
        <div
          className={selectedBtn === 0 ? 'bidButtonSelected' : 'bidButton'}
          onClick={() => handleSetCurBid(formatSOLDisplay(userBidPrice * PERCENT_80), 0)}
        >
          {formatSOLDisplay(userBidPrice * PERCENT_80)}
        </div>
        <div
          className={selectedBtn === 1 ? 'bidButtonSelected' : 'bidButton'}
          onClick={() => handleSetCurBid(formatSOLDisplay(userBidPrice * PERCENT_90), 1)}
        >
          {formatSOLDisplay(userBidPrice * PERCENT_90)}
        </div>
        {!checkMobile() && (
          <div
            className={selectedBtn === 2 ? 'bidButtonSelected' : 'bidButton'}
            onClick={() => handleSetCurBid(formatSOLDisplay(userBidPrice * PERCENT_100), 2)}
          >
            {formatSOLDisplay(userBidPrice * PERCENT_100)}
          </div>
        )}
      </div>
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
      <BorderBottom />
      <div className="buyBtnContainer">
        <Button
          className="buyButton"
          disabled={curBid <= 0 || (displayErrorMsg ? true : false) || notEnough}
          onClick={() => setReviewClicked(true)}
        >
          <div>{notEnough ? 'Insufficient SOL' : `Review Offer`}</div>
        </Button>
      </div>
    </REVIEW_MODAL>
  )
}
