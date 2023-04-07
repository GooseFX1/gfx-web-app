/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { ReactElement, useState, FC, useMemo, useEffect } from 'react'
import { Col, Row } from 'antd'
import {
  useAccounts,
  useConnectionConfig,
  useNFTCollections,
  useNFTAggregator,
  useNFTDetails,
  useNFTProfile,
  usePriceFeedFarm
} from '../../../context'
import { SuccessfulListingMsg } from '../../../components'

import { checkMobile, notify, truncateAddress } from '../../../utils'
import { AppraisalValue } from '../../../utils/GenericDegsin'
import { PopupCustom } from '../Popup/PopupCustom'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { PublicKey, TransactionInstruction, Transaction } from '@solana/web3.js'
import { tradeStatePDA, getBuyInstructionAccounts, tokenSize } from '../actions'

import { LAMPORTS_PER_SOL_NUMBER, NFT_MARKET_TRANSACTION_FEE } from '../../../constants'
import { useHistory } from 'react-router-dom'
import { useWallet } from '@solana/wallet-adapter-react'
import { MESSAGE } from '../NFTDetails/BidModal'
import BN from 'bn.js'
import {
  AUCTION_HOUSE_PREFIX,
  AUCTION_HOUSE_PROGRAM_ID,
  TREASURY_MINT,
  AUCTION_HOUSE_AUTHORITY,
  AUCTION_HOUSE,
  AH_FEE_ACCT,
  WRAPPED_SOL_MINT,
  BuyInstructionArgs,
  getMetadata,
  BuyInstructionAccounts,
  createBuyInstruction,
  createCancelInstruction,
  CancelInstructionArgs,
  CancelInstructionAccounts,
  StringPublicKey,
  toPublicKey,
  bnTo8
} from '../../../web3'
import { Button } from '../../../components/Button'
import { GFX_LINK } from '../../../styles'
const TEN_MILLION = 10000000

export const STYLED_POPUP = styled(PopupCustom)`
  ${tw`flex flex-col `}
  .ant-modal-close-x {
    img {
      ${tw`w-5 h-5 mt-[-5px] ml-2`}
    }
  }
  &.ant-modal {
    ${tw`max-w-full sm:bottom-[-10px] sm:mt-auto sm:absolute sm:h-[600px]`}
    background-color: ${({ theme }) => theme.bg26};
  }
  color: ${({ theme }) => theme.text20};

  .buyTitle {
    ${tw`text-[25px] sm:ml-[140px] sm:mt-1 sm:text-[15px] sm:pt-2 font-medium text-center sm:text-left `}
    color: ${({ theme }) => theme.text20};

    strong {
      ${tw`sm:text-[20px] font-bold sm:mt-[-10px] leading-6`}
      color: ${({ theme }) => theme.text32};
    }
  }
  .verifiedText {
    ${tw`font-semibold text-[16px] text-[#fff] sm:text-[15px] mt-4
        sm:text-left sm:ml-[140px] sm:mt-[5px]`}
  }
  .hContainer {
    ${tw`flex flex-col items-center justify-center`}
  }
  .vContainer {
    ${tw`flex items-center justify-center relative`}
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    /* Firefox */
    input[type='number'] {
      -moz-appearance: textfield;
    }
  }
  .bidButton {
    ${tw`w-[160px] h-[60px] sm:h-[50px] rounded-[50px] items-center cursor-pointer
    justify-center flex mr-4 text-[20px] font-semibold`}
    background: ${({ theme }) => theme.bg22};
  }
  .bidButtonSelected {
    ${tw`w-[160px] h-[60px] sm:h-[50px] rounded-[50px] items-center cursor-pointer bg-[#5858ff] text-[#fff]
    justify-center flex mr-4 text-[20px] font-semibold`}
  }
  .verifiedImg {
    ${tw`h-[35px] sm:w-[18px]  sm:h-[18px] w-[35px] mr-2 sm:mt-0 sm:ml-2`}
  }
  .rowContainer {
    ${tw`flex items-center justify-between w-[90%]`}
  }
  .leftAlign {
    ${tw`text-[17px] font-semibold mt-1`}
  }
  .rightAlign {
    ${tw`text-[17px] text-white font-semibold`}
  }

  .nftImg {
    ${tw`w-[165px] h-[165px] sm:mt-[150px] mt-[25px] rounded-[5px] sm:h-[125px] sm:w-[125px] sm:left-0 sm:absolute`}
  }
  .currentBid {
    ${tw`text-[25px] font-semibold ml-4 sm:mt-[10px] text-[#636363] `}
  }
  .maxBid {
    ${tw`text-[25px] sm:text-[20px] font-semibold leading-7 sm:mt-[20px]	`}
    color: ${({ theme }) => theme.text20}
  }
  .enterBid {
    ${tw`h-12 mt-4  w-[220px] bg-none sm:h-[48px]
    sm:mt-0 border-none text-center rounded-[25px] text-[40px]  font-semibold`}
    background: ${({ theme }) => theme.bg26};
    color: ${({ theme }) => theme.text30};
  }
  .nftImgBid {
    ${tw`w-[165px] h-[165px] sm:mt-[150px] rounded-[10px]
     left-0 mt-[25px] sm:mt-2 sm:h-[125px] sm:w-[125px] sm:left-0 `}
  }

  .priceText {
    ${tw`text-[25px] font-semibold mt-[15px]`}
    color: ${({ theme }) => theme.text12};
  }
  .sellButton {
    ${tw`w-[520px] sm:h-[50px] sm:text-[15px]  cursor-pointer text-[#EEEEEE] rounded-[50px] border-none
     h-[60px] text-white text-[20px] font-semibold flex items-center bg-[#F24244] justify-center`}
    :disabled {
      ${tw`text-[#636363] cursor-not-allowed`}
      background: ${({ theme }) => theme.bg22} !important;
    }
  }

  .buyButton {
    ${tw`w-[520px] sm:h-[50px] sm:text-[15px]  cursor-pointer rounded-[50px] border-none
     h-[60px] text-white text-[20px] font-semibold flex items-center justify-center`}

    background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);

    &:disabled {
      cursor: not-allowed;
      ${tw`text-[#636363]`}
      background: ${({ theme }) => theme.bg22};
    }
  }
  .priceNumber {
    ${tw`text-[40px] font-semibold flex items-center mt-[-12px] justify-center `}
    color: ${({ theme }) => theme.text7};
    img {
      ${tw`h-[25px] w-[25px] ml-3`}
    }
  }
  .drawLine {
    background: ${({ theme }) => theme.tokenBorder};
    ${tw`h-[2px] w-[100vw] `}
  }
  .buyBtnContainer {
    ${tw`flex items-center justify-center mt-0 sm:mt-[20px] `}
  }

  .bm-title {
    padding-top: 12px;
    font-size: 20px;
    font-weight: 500;
    text-align: center;
  }
`

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const BuyNFTModal = (): ReactElement => {
  const { buyNowClicked, setBuyNow } = useNFTAggregator()
  const { ask } = useNFTDetails()
  const sellerPrice: number = parseFloat(ask?.buyer_price) / LAMPORTS_PER_SOL_NUMBER

  return (
    <STYLED_POPUP
      height={checkMobile() ? '655px' : '780px'}
      width={checkMobile() ? '100%' : '580px'}
      title={null}
      visible={buyNowClicked ? true : false}
      onCancel={() => setBuyNow(undefined)}
      footer={null}
    >
      <FinalPlaceBid curBid={sellerPrice} />
    </STYLED_POPUP>
  )
}
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const BidNFTModal = (): ReactElement => {
  const { ask } = useNFTDetails()
  const { bidNowClicked, setBidNow } = useNFTAggregator()
  const [selectedBtn, setSelectedBtn] = useState<number | undefined>(undefined)
  const [reviewBtnClicked, setReviewClicked] = useState<boolean>(false)
  const purchasePrice = useMemo(() => parseFloat(ask ? ask?.buyer_price : '0') / LAMPORTS_PER_SOL_NUMBER, [ask])
  const [curBid, setCurBid] = useState<number | undefined>(purchasePrice ? purchasePrice : 0)

  const updateBidValue = (e) => {
    if (parseFloat(e.target.value) < TEN_MILLION) setCurBid(e.target.value)
    handleSetCurBid(e.target.value, -1)
  }

  const handleSetCurBid = (value: number, index: number) => {
    setCurBid(value)
    setSelectedBtn(index)
  }

  return (
    <STYLED_POPUP
      height={checkMobile() ? '600px' : '780px'}
      width={checkMobile() ? '100%' : '580px'}
      title={null}
      visible={bidNowClicked ? true : false}
      onCancel={() => setBidNow(false)}
      footer={null}
    >
      {reviewBtnClicked ? (
        <FinalPlaceBid curBid={curBid} />
      ) : (
        <ReviewBid
          curBid={curBid}
          selectedBtn={selectedBtn}
          updateBidValue={updateBidValue}
          handleSetCurBid={handleSetCurBid}
          setReviewClicked={setReviewClicked}
        />
      )}
    </STYLED_POPUP>
  )
}

const ReviewBid: FC<{
  curBid: number
  updateBidValue: any
  handleSetCurBid: any
  selectedBtn: number
  setReviewClicked: any
}> = ({ curBid, updateBidValue, handleSetCurBid, selectedBtn, setReviewClicked }) => {
  const { singleCollection } = useNFTCollections()
  const { general, ask, bids } = useNFTDetails()
  const buyerPrice = parseFloat(ask?.buyer_price ? ask?.buyer_price : '0') / LAMPORTS_PER_SOL_NUMBER
  const highestBid: number = useMemo(
    () =>
      bids.length > 0 ? Math.max(...bids.map((b) => parseFloat(b.buyer_price) / LAMPORTS_PER_SOL_NUMBER)) : 0,
    [bids]
  )

  return (
    <div>
      {checkMobile() && <img className="nftImgBid" src={general.image_url} alt="" />}
      <div tw="flex flex-col sm:mt-[-135px] sm:items-start items-center">
        <div className="buyTitle">
          You are about to bid for:
          <br />
          <strong>{general.nft_name} </strong> {checkMobile() ? <br /> : 'by'}
          <strong> {general?.collection_name}</strong>
        </div>
        {singleCollection && singleCollection?.collection[0].is_verified && (
          <div className="verifiedText">
            {!checkMobile() && (
              <img className="verifiedImg" src={`/img/assets/Aggregator/verifiedNFT.svg`} alt="" />
            )}
            This is a verified {checkMobile() && <br />} Creator
            {checkMobile() && (
              <img className="verifiedImg" src={`/img/assets/Aggregator/verifiedNFT.svg`} alt="" />
            )}
          </div>
        )}
      </div>
      <div className="vContainer" tw="flex">
        {!checkMobile() && <img className="nftImgBid" src={general.image_url} alt="" />}
        <div tw="flex flex-col">
          <div className="currentBid">Current Bid</div>
          <div className="priceNumber" tw="ml-4 mt-2 flex items-center">
            {highestBid}
            <img src={`/img/crypto/SOL.svg`} />
          </div>
        </div>
      </div>

      <div tw="mt-[30px]">
        <AppraisalValue
          text={general.gfx_appraisal_value ? `${general.gfx_appraisal_value} SOL` : null}
          label={general.gfx_appraisal_value ? 'Apprasial Value' : 'Apprasial Not Supported'}
          width={360}
        />
      </div>
      <div className="vContainer">
        <div className="maxBid" tw="mt-4 sm:mt-[20px]">
          Enter Maxium Bid
        </div>
      </div>
      <div className="vContainer">
        <input
          className="enterBid"
          placeholder="0.0"
          type="number"
          value={curBid}
          onChange={(e) => updateBidValue(e)}
        />
        <img src="/img/crypto/SOL.svg" tw="w-8 h-8 mt-3 ml-[-30px] sm:mt-0 " />
      </div>
      <div className="vContainer" tw="mt-[40px] sm:mt-[30px]">
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

      <div className="buyBtnContainer" tw="!mt-12">
        <Button className="buyButton" disabled={curBid <= 0} onClick={() => setReviewClicked(true)}>
          Review Offer
        </Button>
      </div>
    </div>
  )
}

const FinalPlaceBid: FC<{ curBid: number }> = ({ curBid }) => {
  const { bidNowClicked } = useNFTAggregator()
  const { prices } = usePriceFeedFarm()
  const { getUIAmount } = useAccounts()
  const history = useHistory()
  const { sessionUser, fetchSessionUser } = useNFTProfile()
  const { connected, wallet, sendTransaction } = useWallet()
  const { connection, network } = useConnectionConfig()
  const { general, nftMetadata, bidOnSingleNFT, ask } = useNFTDetails()

  const [mode, setMode] = useState<string>(curBid ? 'review' : 'bid')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [pendingTxSig, setPendingTxSig] = useState<string | null>(null)

  const publicKey: PublicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet])

  const isBuyingNow: boolean = useMemo(
    () => parseFloat(ask.buyer_price) / LAMPORTS_PER_SOL_NUMBER === curBid,
    [curBid]
  )

  const servicePriceCalc: number = useMemo(
    () => (curBid ? parseFloat(((NFT_MARKET_TRANSACTION_FEE / 100) * curBid).toFixed(3)) : 0),
    [curBid]
  )
  const orderTotal: number = useMemo(() => Number(curBid) + Number(servicePriceCalc), [curBid])

  const marketData = useMemo(() => prices['SOL/USDC'], [prices])
  const fiatCalc: string = useMemo(
    () => `${marketData && curBid ? (marketData.current * curBid).toFixed(3) : ''}`,
    [marketData, curBid]
  )

  const notEnough: boolean = useMemo(
    () => (orderTotal >= getUIAmount(WRAPPED_SOL_MINT.toBase58()) ? true : false),
    [curBid]
  )

  useEffect(
    () => () => {
      setMode('bid')
      setIsLoading(false)
    },
    []
  )

  useEffect(() => {
    if (wallet?.adapter?.connected && publicKey) {
      if (!sessionUser || sessionUser.pubkey !== publicKey.toBase58()) {
        fetchUser(publicKey.toBase58())
      }
      setIsLoading(false)
    } else {
      setIsLoading(false)
    }

    return null
  }, [publicKey, wallet?.adapter?.connected])

  const fetchUser = (curPubKey: string) => {
    fetchSessionUser('address', curPubKey, connection).then((res) => {
      if (!res || (res.response && res.response.status !== 200) || res.isAxiosError) {
        notify({
          type: 'error',
          message: (
            <MESSAGE>
              <div>Couldn't fetch user data, please refresh this page.</div>
            </MESSAGE>
          )
        })
      }
    })
  }

  const derivePDAsForInstruction = async () => {
    const buyerPriceInLamports = orderTotal * LAMPORTS_PER_SOL_NUMBER
    const buyerPrice: BN = new BN(buyerPriceInLamports)

    const metaDataAccount: StringPublicKey = await getMetadata(general.mint_address)

    const escrowPaymentAccount: [PublicKey, number] = await PublicKey.findProgramAddress(
      [
        Buffer.from(AUCTION_HOUSE_PREFIX),
        toPublicKey(isBuyingNow ? ask.auction_house_key : AUCTION_HOUSE).toBuffer(),
        publicKey.toBuffer()
      ],
      toPublicKey(AUCTION_HOUSE_PROGRAM_ID)
    )

    const buyerTradeState: [PublicKey, number] = await tradeStatePDA(publicKey, general, bnTo8(buyerPrice))

    if (!metaDataAccount || !escrowPaymentAccount || !buyerTradeState) {
      return {
        metaDataAccount: undefined,
        escrowPaymentAccount: undefined,
        buyerTradeState: undefined,
        buyerPrice: undefined
      }
    }

    return {
      metaDataAccount,
      escrowPaymentAccount,
      buyerTradeState,
      buyerPrice
    }
  }

  const callBuyInstruction = async (e: any) => {
    e.preventDefault()
    setIsLoading(true)

    const { metaDataAccount, escrowPaymentAccount, buyerTradeState, buyerPrice } = await derivePDAsForInstruction()

    if (!metaDataAccount || !escrowPaymentAccount || !buyerTradeState) {
      notify({
        type: 'error',
        message: (
          <MESSAGE>
            <Row justify="space-between" align="middle">
              <Col>Open bid error!</Col>
              <Col>
                <img className="mIcon" src={`/img/assets/close-white-icon.svg`} alt="" />
              </Col>
            </Row>
            <div>Could not derive values for buy instructions</div>
          </MESSAGE>
        )
      })

      // setTimeout(() => setVisible(false), 1000)
      return
    }

    const buyInstructionArgs: BuyInstructionArgs = {
      tradeStateBump: buyerTradeState[1],
      escrowPaymentBump: escrowPaymentAccount[1],
      buyerPrice: buyerPrice,
      tokenSize: tokenSize
    }

    // All bids will be placed on GFX AH Instance - Buys will be built with "ask" payload
    const buyInstructionAccounts: BuyInstructionAccounts = {
      wallet: publicKey,
      paymentAccount: publicKey,
      transferAuthority: publicKey,
      treasuryMint: new PublicKey(isBuyingNow ? ask.auction_house_treasury_mint_key : TREASURY_MINT),
      tokenAccount: new PublicKey(general.token_account),
      metadata: new PublicKey(metaDataAccount),
      escrowPaymentAccount: escrowPaymentAccount[0],
      authority: new PublicKey(isBuyingNow ? ask.auction_house_authority : AUCTION_HOUSE_AUTHORITY),
      auctionHouse: new PublicKey(isBuyingNow ? ask.auction_house_key : AUCTION_HOUSE),
      auctionHouseFeeAccount: new PublicKey(isBuyingNow ? ask.auction_house_fee_account : AH_FEE_ACCT),
      buyerTradeState: buyerTradeState[0]
    }

    const buyIX: TransactionInstruction = await createBuyInstruction(buyInstructionAccounts, buyInstructionArgs)
    console.log(buyIX)

    const transaction = new Transaction().add(buyIX)
    try {
      const signature = await sendTransaction(transaction, connection)
      console.log(signature)
      setPendingTxSig(signature)

      const confirm = await connection.confirmTransaction(signature, 'finalized')
      console.log(confirm)

      if (confirm.value.err === null) {
        postBidToAPI(signature, buyerPrice, tokenSize).then((res) => {
          console.log(res)

          notify(successfulListingMessage(signature, nftMetadata, curBid.toString()))

          if (res === 'Error') {
            callCancelInstruction()
            setIsLoading(false)
          } else if (res.data.bid_matched && res.data.tx_sig) {
            fetchUser(publicKey.toBase58())
            notify(successBidMatchedMessage(res.data.tx_sig, nftMetadata, curBid.toString()))
            setTimeout(() => history.push(`/NFTs/profile/${publicKey.toBase58()}`), 2000)
          }
        })
      }
    } catch (error) {
      setIsLoading(false)
      notify({
        type: 'error',
        message: (
          <MESSAGE>
            <Row justify="space-between" align="middle">
              <Col>NFT Biding error!</Col>
              <Col>
                <img className="mIcon" src={`/img/assets/close-white-icon.svg`} alt="" />
              </Col>
            </Row>
            <div>{error.message}</div>
            <div>Please try again, if the error persists please contact support.</div>
          </MESSAGE>
        )
      })
    }
  }

  const postBidToAPI = async (txSig: any, buyerPrice: BN, tokenSize: BN) => {
    const bidObject = {
      clock: Date.now().toString(),
      tx_sig: txSig,
      wallet_key: publicKey.toBase58(),
      auction_house_key: isBuyingNow ? ask.auction_house_key : AUCTION_HOUSE,
      token_account_key: general.token_account,
      auction_house_treasury_mint_key: isBuyingNow ? ask.auction_house_treasury_mint_key : TREASURY_MINT,
      token_account_mint_key: general.mint_address,
      buyer_price: buyerPrice.toString(),
      token_size: tokenSize.toString(),
      non_fungible_id: general.non_fungible_id,
      collection_id: general.collection_id,
      user_id: sessionUser.user_id
    }

    try {
      const res = await bidOnSingleNFT(bidObject)
      if (res.isAxiosError) {
        notify({
          type: 'error',
          message: (
            <MESSAGE>
              <Row justify="space-between" align="middle">
                <Col>NFT Biding error!</Col>
                <Col>
                  <img className="mIcon" src={`/img/assets/close-white-icon.svg`} alt="" />
                </Col>
              </Row>
              <div>Please try again, if the error persists please contact support.</div>
            </MESSAGE>
          )
        })
        return 'Error'
      } else {
        setMode('bid')
        return res
      }
    } catch (error) {
      console.dir(error)
      setIsLoading(false)
      return 'Error'
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

    const transaction = new Transaction().add(cancelIX)
    const signature = await sendTransaction(transaction, connection)
    console.log(signature)
    const confirm = await connection.confirmTransaction(signature, 'finalized')
    console.log(confirm)
  }

  const successfulListingMessage = (signature: any, nftMetadata: any, price: string) => ({
    message: (
      <SuccessfulListingMsg
        title={`Successfully placed a bid on ${nftMetadata?.name}!`}
        itemName={nftMetadata.name}
        supportText={`Bid of: ${price}`}
        tx_url={`https://solscan.io/tx/${signature}?cluster=${network}`}
      />
    )
  })

  const successBidMatchedMessage = (signature: any, nftMetadata: any, price: string) => ({
    message: (
      <SuccessfulListingMsg
        title={`Your bid matched!`}
        itemName={nftMetadata.name}
        supportText={`You have just acquired ${nftMetadata.name} for ${price} SOL!`}
        tx_url={`https://solscan.io/tx/${signature}?cluster=${network}`}
      />
    )
  })

  return (
    <>
      <div tw="flex flex-col items-center justify-center">
        <div className="buyTitle">
          You are about to {isBuyingNow ? 'buy' : 'bid for'}: <br />
          <strong>{general.nft_name} </strong> {checkMobile() ? <br /> : 'by'}
          <strong> {general.collection_name}</strong>
        </div>
        <div className="verifiedText">
          {!checkMobile() && <img className="verifiedImg" src={`/img/assets/Aggregator/verifiedNFT.svg`} alt="" />}
          This is a verified {checkMobile() && <br />} Creator
          {checkMobile() && <img className="verifiedImg" src={`/img/assets/Aggregator/verifiedNFT.svg`} alt="" />}
        </div>
      </div>

      <div className="vContainer">
        <img className="nftImg" src={general.image_url} alt="" />
      </div>

      <div className="vContainer">
        <div className="priceText">Price</div>
      </div>

      <div className="vContainer">
        <div className="priceNumber">
          {curBid} <img src={`/img/crypto/SOL.svg`} />
        </div>
      </div>

      <div tw="mt-4">
        <AppraisalValue
          text={general.gfx_appraisal_value ? `${general.gfx_appraisal_value} SOL` : null}
          label={general.gfx_appraisal_value ? 'Apprasial Value' : 'Apprasial Not Supported'}
          width={360}
        />
      </div>
      {pendingTxSig && (
        <div className="bm-title">
          <span>
            <img
              style={{ height: '26px', marginRight: '6px' }}
              src={`/img/assets/solscan.png`}
              alt="solscan-icon"
            />
          </span>
          <GFX_LINK
            href={`https://solscan.io/tx/${pendingTxSig}?cluster=${network}`}
            target={'_blank'}
            rel="noreferrer"
          >
            View Transaction
          </GFX_LINK>
        </div>
      )}

      <div className="hContainer" style={{ height: 150 }}>
        <div className="rowContainer">
          <div className="leftAlign">My Bid</div>
          <div className="rightAlign">{curBid} SOL</div>
        </div>
        <div className="rowContainer">
          <div className="leftAlign">Service Fee</div>
          <div className="rightAlign"> {servicePriceCalc} SOL</div>
        </div>
        <div className="rowContainer">
          <div className="leftAlign">Total Price</div>
          <div className="rightAlign">{orderTotal} SOL</div>
        </div>
      </div>
      <div className="buyBtnContainer">
        <Button className="buyButton" disabled={notEnough} onClick={callBuyInstruction} loading={isLoading}>
          {notEnough ? 'Insufficient SOL' : isBuyingNow ? 'Buy Now' : 'Place Bid'}
        </Button>
      </div>
    </>
  )
}
