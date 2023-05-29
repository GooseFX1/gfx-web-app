import { useWallet } from '@solana/wallet-adapter-react'
import React, { ReactElement, useEffect, useMemo, useState } from 'react'
import { Button } from '../../../components/Button'
import { useConnectionConfig, useNFTAggregator, useNFTDetails } from '../../../context'
/* eslint-disable @typescript-eslint/no-unused-vars */
// import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { checkMobile, formatSOLDisplay, formatSOLNumber, notify } from '../../../utils'
import { GenericTooltip } from '../../../utils/GenericDegsin'
import { minimizeTheString } from '../../../web3/nfts/utils'
import { TermsTextNFT } from './AcceptBidModal'
import { STYLED_POPUP_BUY_MODAL } from './BuyNFTModal'
import { LAMPORTS_PER_SOL, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js'
import {
  AH_FEE_ACCT,
  AUCTION_HOUSE,
  AUCTION_HOUSE_AUTHORITY,
  AUCTION_HOUSE_PREFIX,
  AUCTION_HOUSE_PROGRAM_ID,
  bnTo8,
  CancelInstructionAccounts,
  CancelInstructionArgs,
  confirmTransaction,
  createCancelInstruction,
  createWithdrawInstruction,
  SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  toPublicKey,
  TREASURY_MINT,
  TREASURY_PREFIX
} from '../../../web3'
import { callWithdrawInstruction, tokenSize, tradeStatePDA } from '../actions'
import BN from 'bn.js'
import { LAMPORTS_PER_SOL_NUMBER } from '../../../constants'
import { successBidRemovedMsg } from './AggModals/AggNotifications'

const CancelBidModal = (): ReactElement => {
  const { general, ask, bids, nftMetadata } = useNFTDetails()
  const { wallet, sendTransaction } = useWallet()
  const { connection } = useConnectionConfig()
  const [userEscrowBalance, setUserEscrowBalance] = useState<number>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { setCancelBidClicked, cancelBidClicked, setRefreshClicked, setOpenJustModal } = useNFTAggregator()

  const [escrowPaymentAccount, setEscrowPaymentAccount] = useState<[PublicKey, number]>()

  const publicKey = useMemo(
    () => wallet?.adapter?.publicKey,
    [wallet?.adapter?.publicKey, wallet?.adapter?.publicKey]
  )

  const myBid = useMemo(() => {
    if (bids.length > 0) {
      return bids.filter((bid) => bid.wallet_key === publicKey.toString())
    }
    return null
  }, [bids])

  const myBidPrice = useMemo(() => (myBid.length > 0 ? formatSOLNumber(myBid[0].buyer_price) : 0), [myBid])
  const askPrice = useMemo(() => (ask ? formatSOLNumber(ask?.buyer_price) : 0), [ask])
  const closeTheModal = () => {
    if (!isLoading) setCancelBidClicked(undefined)
  }
  useEffect(() => {
    fetchEscrowPayment().then((escrowBalance: number | undefined) => setUserEscrowBalance(escrowBalance))
  }, [wallet?.adapter?.publicKey, publicKey])

  useEffect(
    () => () => {
      setOpenJustModal(false)
    },
    []
  )

  const fetchEscrowPayment = async (): Promise<number | undefined> => {
    try {
      const escrowAccount: [PublicKey, number] = await PublicKey.findProgramAddress(
        [Buffer.from(AUCTION_HOUSE_PREFIX), toPublicKey(AUCTION_HOUSE).toBuffer(), publicKey.toBuffer()],
        toPublicKey(AUCTION_HOUSE_PROGRAM_ID)
      )
      setEscrowPaymentAccount(escrowAccount)
      const balance = await connection.getBalance(escrowAccount[0])
      return balance / LAMPORTS_PER_SOL
    } catch (error) {
      return undefined
    }
  }
  const derivePDAsForInstruction = async () => {
    const buyerPriceInLamports = parseFloat(myBid[0].buyer_price)
    const buyerPrice: BN = new BN(buyerPriceInLamports)

    const buyerTradeState: [PublicKey, number] = await tradeStatePDA(
      publicKey,
      AUCTION_HOUSE,
      general.token_account,
      general.mint_address,
      TREASURY_MINT,
      bnTo8(buyerPrice)
    )

    if (!buyerTradeState) {
      return {
        buyerTradeState: undefined,
        buyerPrice: undefined
      }
    }

    console.log(buyerTradeState)
    return {
      buyerTradeState,
      buyerPrice
    }
  }
  const callAuctionHouseWithdraw = async (amount: BN) => {
    if (escrowPaymentAccount === undefined) return

    const { withdrawInstructionAccounts, withdrawInstructionArgs } = await callWithdrawInstruction(
      publicKey,
      escrowPaymentAccount,
      amount
    )

    const withdrawIX: TransactionInstruction = await createWithdrawInstruction(
      withdrawInstructionAccounts,
      withdrawInstructionArgs
    )

    return withdrawIX
  }
  const callCancelInstruction = async () => {
    try {
      setIsLoading(true)
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
      if (userEscrowBalance >= formatSOLNumber(myBid[0].buyer_price)) {
        transaction.add(await callAuctionHouseWithdraw(new BN(parseFloat(myBid[0].buyer_price))))
      }
      const signature = await sendTransaction(transaction, connection)
      console.log(signature)
      const confirm = await await confirmTransaction(connection, signature, 'finalized')
      if (confirm.value.err === null) {
        notify(successBidRemovedMsg(signature, nftMetadata, myBidPrice.toFixed(2)))
        setUserEscrowBalance(userEscrowBalance - myBidPrice)
        setIsLoading(false)
        setTimeout(() => {
          // refresh so that sync with database
          setRefreshClicked((prev) => prev + 1)
        }, 3000)
        setCancelBidClicked(undefined)
      }
    } catch (err) {
      setCancelBidClicked(undefined)
      setIsLoading(false)
      console.log(err)
      notify({
        type: 'error',
        message: err.message
      })
    }
  }
  return (
    <STYLED_POPUP_BUY_MODAL
      lockModal={isLoading}
      height={checkMobile() ? '460px' : '393px'}
      width={checkMobile() ? '100%' : '580px'}
      title={null}
      centered={checkMobile() ? false : true}
      visible={cancelBidClicked ? true : false}
      onCancel={!isLoading && closeTheModal}
      footer={null}
    >
      <div tw="flex flex-col items-center">
        <div className="delistText" tw="!text-[20px] sm:!text-[15px] !font-semibold">
          Are you sure you want to Remove <br /> the bid{' '}
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

        <div className="feesContainer" tw="!bottom-[250px]">
          <div className="rowContainer">
            <div className="leftAlign">Buy Now Price</div>
            <div className="rightAlign"> {askPrice} SOL</div>
          </div>
          <div className="rowContainer">
            <div className="leftAlign">Your Bid</div>
            <div className="rightAlign">{myBidPrice.toFixed(2)} SOL</div>
          </div>
        </div>

        <Button
          onClick={callCancelInstruction}
          className={'sellButton'}
          tw="!bottom-[100px]     absolute sm:!bottom-[60px]"
          loading={isLoading}
        >
          <span tw="font-semibold text-[20px] sm:text-[16px] ">Remove Bid</span>
        </Button>
        <div className="cancelText" tw="!bottom-[58px] sm:!bottom-[20px] " onClick={closeTheModal}>
          {!isLoading && `Cancel`}
        </div>
        {<TermsTextNFT string="Remove" />}
      </div>
    </STYLED_POPUP_BUY_MODAL>
  )
}

export default CancelBidModal
