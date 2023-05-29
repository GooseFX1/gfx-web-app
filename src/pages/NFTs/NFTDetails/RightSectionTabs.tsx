/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, FC, useMemo, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { PublicKey, TransactionInstruction, LAMPORTS_PER_SOL, Transaction } from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'
import styled, { css } from 'styled-components'
import { Col, Row, Tabs } from 'antd'
import { SpaceBetweenDiv } from '../../../styles'
import { useNFTDetails, useNFTProfile, useConnectionConfig } from '../../../context'
import { MintItemViewStatus, INFTBid } from '../../../types/nft_details'
import RemoveModalContent from './RemoveModalContent'
import { Modal, SuccessfulListingMsg } from '../../../components'
import { NFT_MARKET_TRANSACTION_FEE } from '../../../constants'
import { notify, truncateAddress } from '../../../utils'
import { tradeStatePDA, callCancelInstruction, callWithdrawInstruction, tokenSize } from '../actions'
import { removeNonCollectionListing } from '../../../api/NFTs'
import { BidModal } from './BidModal'
import {
  AUCTION_HOUSE,
  AUCTION_HOUSE_PREFIX,
  AUCTION_HOUSE_AUTHORITY,
  AUCTION_HOUSE_PROGRAM_ID,
  TREASURY_MINT,
  AH_FEE_ACCT,
  CancelInstructionArgs,
  CancelInstructionAccounts,
  createCancelInstruction,
  createWithdrawInstruction,
  toPublicKey,
  bnTo8,
  confirmTransaction
} from '../../../web3'
import BN from 'bn.js'
import tw from 'twin.macro'
import { NFTTabSections } from '../Collection/DetailViewNFTDrawer'

const { TabPane } = Tabs

//#region styles

export const DETAILS_TAB_CONTENT = styled.div`
  ${({ theme }) => css`
    height: 100%;
    padding: ${theme.margin(0.5)} ${theme.margin(3)};
    color: ${theme.white};

    .dtc-item {
      margin-bottom: 15px;
      font-size: 16px;
      font-weight: 500;

      .dtc-item-value {
        ${tw`text-tiny`}
        color: ${theme.text4};
      }
      .dtc-item-title {
        ${tw`text-tiny`}
        color: ${theme.text11};
      }
    }
  `}
`

const REMOVE_MODAL = styled(Modal)`
  &.ant-modal {
    width: 501px !important;
    border-radius: 15px;
  }

  .ant-modal-body {
    padding: ${({ theme }) => theme.margin(4.5)};
  }

  .modal-close-icon {
    width: 22px;
    height: 22px;
  }

  .bm-title {
    color: ${({ theme }) => theme.text1};
    font-size: 20px;
    font-weight: 500;
    text-align: center;
  }

  .bm-title-bold {
    font-weight: 600;
  }
`
//#endregion

export const RightSectionTabs: FC<{
  status: MintItemViewStatus
}> = ({ ...rest }) => {
  const history = useHistory()
  const [activeTab, setActiveTab] = useState('1')
  const { general, nftMetadata, ask, bids, removeNFTListing, removeBidOnSingleNFT, setAsk } = useNFTDetails()
  const { sessionUser } = useNFTProfile()
  const { connection, network } = useConnectionConfig()
  const wal = useWallet()
  const { wallet } = wal
  const [bidModal, setBidModal] = useState<boolean>(false)
  const [isBuying, setIsBuying] = useState<string>()
  const [removeAskModal, setRemoveAskModal] = useState<boolean>(false)
  const [removeBidModal, setRemoveBidModal] = useState<boolean>(false)
  const [pendingTxSig, setPendingTxSig] = useState<string>()

  const isLoading = general === null || nftMetadata === null

  enum NFT_ACTIONS {
    BID = 'bid',
    BUY = 'buy',
    CANCEL_BID = 'cancel-bid'
  }

  const publicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet])

  const userRecentBid: INFTBid | undefined = useMemo(() => {
    if (bids.length === 0 || !publicKey) return undefined

    const usersBids = bids.filter((bid: INFTBid) => bid.wallet_key === publicKey.toBase58())
    if (usersBids.length === 1) return usersBids[0]

    let delta = Infinity
    let res: INFTBid | undefined
    usersBids.forEach((bid: INFTBid) => {
      const curDelta = new Date().getTime() - parseInt(bid.clock)
      if (curDelta < delta) {
        delta = curDelta
        res = bid
      }
    })
    return res
  }, [bids, publicKey])

  const derivePDAsForInstruction = async () => {
    const buyerPrice: BN = new BN(ask.buyer_price)

    const tradeState: [PublicKey, number] = await tradeStatePDA(
      publicKey,
      isBuying ? ask?.auction_house_key : AUCTION_HOUSE,
      general.token_account,
      general.mint_address,
      isBuying ? ask?.auction_house_treasury_mint_key : TREASURY_MINT,
      bnTo8(buyerPrice)
    )

    if (!tradeState) {
      throw Error(`Could not derive values for instructions`)
    }

    return {
      tradeState,
      buyerPrice
    }
  }

  const handleRemoveAsk = async (e) => {
    e.preventDefault()

    const { tradeState, buyerPrice } = await derivePDAsForInstruction()

    try {
      const { signature, confirm } = await callCancelInstruction(wal, connection, general, tradeState, buyerPrice)
      setPendingTxSig(signature)
      if (confirm.value.err === null) {
        setRemoveAskModal(false)
        notify(successfulRemoveAskMsg(signature, nftMetadata, ask.buyer_price))
        postCancelAskToAPI(ask.uuid).then((res) => {
          console.log(res)
          setPendingTxSig(undefined)
        })
      }
    } catch (error) {
      notify({
        type: 'error',
        message: error.message
      })
      setRemoveAskModal(false)
    }
  }

  const postCancelAskToAPI = async (askUUID: string): Promise<any> => {
    // asserts the nft does not belong to a collection; is a single listing item
    if (general.collection_id === null) {
      const removedSingleListingAsk = await removeNonCollectionListing(general.mint_address)
      console.log('single item removed')
      if (removedSingleListingAsk === true) setAsk(undefined)
      return removedSingleListingAsk
    } else {
      const removedCollectionItemAsk = await removeNFTListing(askUUID)
      console.log('collection item removed')
      return removedCollectionItemAsk
    }
  }

  const successfulRemoveAskMsg = (signature: any, nftMetadata: any, price: string) => ({
    message: (
      <SuccessfulListingMsg
        title={`Successfully removed ask for ${nftMetadata.name}!`}
        itemName={nftMetadata.name}
        supportText={`Removed asking price: ${price}`}
        tx_url={`https://solscan.io/tx/${signature}?cluster=${network}`}
      />
    )
  })

  const handleUpdateAsk = (action: string) => {
    action === 'remove' ? setRemoveAskModal(true) : history.push(`/nfts/sell/${general.mint_address}`)
  }

  const handleSetBid = (type: string) => {
    switch (type) {
      case NFT_ACTIONS.BID:
        setBidModal(true)
        setIsBuying(undefined)
        break
      case NFT_ACTIONS.BUY:
        setBidModal(true)
        setIsBuying(ask.buyer_price)
        break
      case NFT_ACTIONS.CANCEL_BID:
        setRemoveBidModal(true)
        break
      default:
        return null
    }
  }

  const handleRemoveBid = async (e: any) => {
    e.preventDefault()
    console.log(userRecentBid)
    if (userRecentBid === undefined || userRecentBid.uuid == undefined) {
      notify({
        type: 'error',
        message: 'Error getting bid info. Reload and try again'
      })
      return
    }

    const buyerPrice: BN = new BN(userRecentBid.buyer_price)
    console.log(buyerPrice)
    const tradeState: [PublicKey, number] = await tradeStatePDA(
      publicKey,
      isBuying ? ask?.auction_house_key : AUCTION_HOUSE,
      general.token_account,
      general.mint_address,
      isBuying ? ask?.auction_house_treasury_mint_key : TREASURY_MINT,
      bnTo8(buyerPrice)
    )

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
      tradeState: tradeState[0]
    }

    const cancelIX: TransactionInstruction = await createCancelInstruction(
      cancelInstructionAccounts,
      cancelInstructionArgs
    )

    const transaction = new Transaction().add(cancelIX)
    const signature = await wal.sendTransaction(transaction, connection)
    console.log(signature)
    setPendingTxSig(signature)

    const confirm = await confirmTransaction(connection, signature, 'confirmed')
    console.log(confirm)

    if (confirm.value.err === null) {
      removeBidOnSingleNFT(userRecentBid.uuid)
        .then((res) => {
          console.log(res)
          if (res.data) {
            callAuctionHouseWithdraw(buyerPrice)
            setPendingTxSig(undefined)
          }
        })
        .catch((err) => {
          console.error(err)
          throw new Error('Error syncing transaction with GFX apis')
        })
    }
  }

  const callAuctionHouseWithdraw = async (amount: BN) => {
    const escrowPaymentAccount: [PublicKey, number] = await PublicKey.findProgramAddress(
      [Buffer.from(AUCTION_HOUSE_PREFIX), toPublicKey(AUCTION_HOUSE).toBuffer(), publicKey.toBuffer()],
      toPublicKey(AUCTION_HOUSE_PROGRAM_ID)
    )

    const { withdrawInstructionAccounts, withdrawInstructionArgs } = await callWithdrawInstruction(
      publicKey,
      escrowPaymentAccount,
      amount
    )

    const withdrawIX: TransactionInstruction = await createWithdrawInstruction(
      withdrawInstructionAccounts,
      withdrawInstructionArgs
    )

    const transaction = new Transaction().add(withdrawIX)
    try {
      const signature = await wal.sendTransaction(transaction, connection)
      console.log(signature)

      const confirm = await confirmTransaction(connection, signature, 'confirmed')
      console.log(confirm)

      if (confirm.value.err === null) {
        notify(successfulRemoveBidMsg(signature, nftMetadata, amount.toString()))
        setRemoveBidModal(false)
      }
    } catch (error) {
      notify({
        type: 'error',
        message: error.message
      })
    }
  }

  const successfulRemoveBidMsg = (signature: any, nftMetadata: any, price: string) => ({
    message: (
      <SuccessfulListingMsg
        title={`Successfully removed bid for ${nftMetadata.name}!`}
        itemName={nftMetadata.name}
        supportText={`Removed bid price: ${price} SOL`}
        tx_url={`https://solscan.io/tx/${signature}?cluster=${network}`}
      />
    )
  })

  const handleModal = useCallback(() => {
    if (removeAskModal) {
      return (
        <REMOVE_MODAL
          visible={removeAskModal}
          setVisible={setRemoveAskModal}
          title=""
          onCancel={() => console.log('cancel')}
        >
          <RemoveModalContent
            title={'Remove Ask'}
            caption={'Removing the asking price will move the state of the NFT into Open Bid.'}
            removeFunction={handleRemoveAsk}
            pendingTxSig={pendingTxSig}
            network={network}
          />
        </REMOVE_MODAL>
      )
    } else if (userRecentBid !== undefined && removeBidModal) {
      return (
        <REMOVE_MODAL visible={removeBidModal} setVisible={setRemoveBidModal}>
          <RemoveModalContent
            title={'Remove most recent bid'}
            caption={`This action will cancel your most recent bid of ${
              parseInt(userRecentBid.buyer_price) / LAMPORTS_PER_SOL
            } SOL on ${general.nft_name}`}
            removeFunction={handleRemoveBid}
            pendingTxSig={pendingTxSig}
            network={network}
          />
        </REMOVE_MODAL>
      )
    } else if (bidModal) {
      return <BidModal visible={bidModal} setVisible={setBidModal} purchasePrice={isBuying} />
    }
  }, [pendingTxSig, removeAskModal, userRecentBid, removeBidModal, bidModal])

  return isLoading ? <div></div> : <NFTTabSections activeTab={activeTab} setActiveTab={setActiveTab} />
}
