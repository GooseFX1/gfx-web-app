import { Button } from 'antd'
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { ReactElement, useState, FC, useMemo } from 'react'
import {
  // useAccounts,
  useConnectionConfig,
  useNFTDetails
  // useNFTProfile
  // usePriceFeedFarm
} from '../../../context'
// import { INFTAsk } from '../../../types/nft_details.d'
import { SuccessfulListingMsg, TransactionErrorMsg } from '../../../components'
import { registerSingleNFT } from '../../../api/NFTs'
import { checkMobile, notify } from '../../../utils'
import { AppraisalValue } from '../../../utils/GenericDegsin'
import { PublicKey, TransactionInstruction, Transaction } from '@solana/web3.js'
import {
  tradeStatePDA,
  // getBuyInstructionAccounts,
  tokenSize,
  // callCancelInstruction,
  freeSellerTradeStatePDA,
  getSellInstructionAccounts
} from '../actions'
import { LAMPORTS_PER_SOL_NUMBER, NFT_MARKET_TRANSACTION_FEE } from '../../../constants'
// import { useHistory } from 'react-router-dom'
import { useWallet } from '@solana/wallet-adapter-react'
import BN from 'bn.js'
import {
  // signAndSendRawTransaction,
  AH_FEE_ACCT,
  AUCTION_HOUSE_PREFIX,
  AUCTION_HOUSE,
  AUCTION_HOUSE_PROGRAM_ID,
  AUCTION_HOUSE_AUTHORITY,
  // TREASURY_MINT,
  toPublicKey,
  createSellInstruction,
  SellInstructionArgs,
  SellInstructionAccounts,
  createCancelInstruction,
  CancelInstructionArgs,
  CancelInstructionAccounts,
  getMetadata,
  StringPublicKey,
  bnTo8
} from '../../../web3'
import { GFX_LINK } from '../../../styles'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import tw from 'twin.macro'
import 'styled-components/macro'

const TEN_MILLION = 10000000

import { STYLED_POPUP } from '../Collection/BuyNFTModal'

export const SellNFTModal: FC<{ visible: boolean; handleClose: any }> = ({
  visible,
  handleClose
}): ReactElement => {
  // const history = useHistory()
  const { connection, network } = useConnectionConfig()
  // const { sessionUser } = useNFTProfile()
  const {
    general,
    setGeneral,
    ask,
    nftMetadata
    // updateUserInput,
    // sellNFT
    // patchNFTAsk
  } = useNFTDetails()
  const wal = useWallet()
  const { wallet, signTransaction } = wal
  const [askPrice, setAskPrice] = useState<number | null>(
    ask ? parseFloat(ask.buyer_price) / LAMPORTS_PER_SOL_NUMBER : null
  )
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [pendingTxSig, setPendingTxSig] = useState<any>(null)

  const totalToReceive = useMemo(() => (askPrice ? askPrice : 0.0) - NFT_MARKET_TRANSACTION_FEE / 100, [askPrice])

  const handleTxError = (itemName: string, error: string) => {
    setPendingTxSig(null)
    setIsLoading(false)
    notify({
      type: 'error',
      message: <TransactionErrorMsg title={`NFT Listing error!`} itemName={itemName} supportText={error} />
    })
  }

  // const postAskToAPI = async (txSig: any, buyerPrice: BN, tokenSize: BN, ask: INFTAsk | undefined) => {
  //   console.log(ask)

  //   const sellObject = {
  //     ask_id: null,
  //     clock: Date.now().toString(),
  //     tx_sig: txSig,
  //     wallet_key: wallet?.adapter?.publicKey.toBase58(),
  //     auction_house_key: AUCTION_HOUSE,
  //     token_account_key: general.token_account,
  //     auction_house_treasury_mint_key: TREASURY_MINT,
  //     token_account_mint_key: general.mint_address,
  //     buyer_price: buyerPrice.toString(),
  //     token_size: tokenSize.toString(),
  //     non_fungible_id: general.non_fungible_id,
  //     collection_id: general.collection_id,
  //     user_id: sessionUser.user_id
  //   }

  //   try {
  //     const res = await sellNFT(sellObject)

  //     if (res.isAxiosError) {
  //       notify({
  //         type: 'error',
  //         message: (
  //           <TransactionErrorMsg
  //             title={`NFT Listing error!`}
  //             itemName={nftMetadata.name}
  //             supportText={`Please try again, if the error persists please contact support.`}
  //           />
  //         )
  //       })
  //       return false
  //     } else {
  //       return true
  //     }
  //   } catch (error) {
  //     console.error(error)
  //     return false
  //   }
  // }

  const successfulListingMsg = (signature: any, nftMetadata: any, price: string) => ({
    message: (
      <SuccessfulListingMsg
        title={`Successfully listed ${nftMetadata.name}!`}
        itemName={nftMetadata.name}
        supportText={`My price: ${price}`}
        tx_url={`https://solscan.io/tx/${signature}?cluster=${network}`}
      />
    )
  })

  const attemptConfirmTransaction = async (
    buyerPrice: BN,
    tradeState: [PublicKey, number],
    signature: any
  ): Promise<void> => {
    try {
      const confirm = await connection.confirmTransaction(signature, 'finalized')
      console.log(confirm)
      // successfully list nft
      if (confirm.value.err === null) {
        setIsLoading(false)
        notify(successfulListingMsg(signature, nftMetadata, askPrice.toFixed(2)))
        setTimeout(() => handleClose(false), 1000)

        // history.push(`/NFTs/profile/${wallet?.adapter?.publicKey.toBase58()}`)
        // create asking price
        // postAskToAPI(signature, buyerPrice, tokenSize, ask).then((res) => {
        //   console.log('Ask data synced: ', res)
        //   if (!res) {
        //     handleTxError(nftMetadata.name, 'Listing has been canceled. Please try againg')
        //     callCancelInstruction(wal, connection, general, tradeState, buyerPrice)
        //   }
        // })

        // unsuccessfully list nft
      } else {
        handleTxError(nftMetadata.name, '')
      }
    } catch (error) {
      handleTxError(nftMetadata.name, error.message)
    }
  }

  const derivePDAsForInstruction = async () => {
    const buyerPriceInLamports = askPrice * LAMPORTS_PER_SOL_NUMBER
    const buyerPrice: BN = new BN(buyerPriceInLamports)

    const metaDataAccount: StringPublicKey = await getMetadata(general.mint_address)
    const tradeState: [PublicKey, number] = await tradeStatePDA(
      wallet?.adapter?.publicKey,
      general,
      bnTo8(buyerPrice)
    )
    const freeTradeState: [PublicKey, number] = await freeSellerTradeStatePDA(wallet?.adapter?.publicKey, general)
    const programAsSignerPDA: [PublicKey, number] = await PublicKey.findProgramAddress(
      [Buffer.from(AUCTION_HOUSE_PREFIX), Buffer.from('signer')],
      toPublicKey(AUCTION_HOUSE_PROGRAM_ID)
    )

    if (!tradeState || !freeTradeState || !programAsSignerPDA || !metaDataAccount) {
      throw Error(`Could not derive values for sell instructions`)
    }

    return {
      metaDataAccount,
      tradeState,
      freeTradeState,
      programAsSignerPDA,
      buyerPrice
    }
  }

  const callSellInstruction = async (e: any) => {
    e.preventDefault()
    if (parseFloat(ask?.buyer_price) / LAMPORTS_PER_SOL_NUMBER === askPrice) {
      notify({
        type: 'error',
        message: (
          <TransactionErrorMsg
            title={`Did not modify price!`}
            itemName={nftMetadata.name}
            supportText={`Please make sure the price is changing from current price.`}
          />
        )
      })
      return
    }

    setIsLoading(true)

    // asserts current NFT does not belong to collection, is one-off
    if (general.uuid === null) {
      try {
        const registeredNFT = await registerSingleNFT({
          nft_name: general.nft_name,
          nft_description: general.nft_description,
          mint_address: general.mint_address,
          metadata_url: general.metadata_url,
          image_url: general.image_url,
          animation_url: general.animation_url
        })

        setGeneral({
          uuid: registeredNFT.data.uuid,
          non_fungible_id: registeredNFT.data.non_fungible_id,
          ...general
        })
      } catch (error) {
        notify({
          type: 'error',
          message: (
            <TransactionErrorMsg
              title={`Error Registering NFT!`}
              itemName={nftMetadata.name}
              supportText={`Please try again, if the error persists please contact support.`}
            />
          )
        })

        return
      }
    }

    const { metaDataAccount, tradeState, freeTradeState, programAsSignerPDA, buyerPrice } =
      await derivePDAsForInstruction()

    console.log(metaDataAccount, tradeState, freeTradeState, programAsSignerPDA, buyerPrice.toString())

    const sellInstructionArgs: SellInstructionArgs = {
      tradeStateBump: tradeState[1],
      freeTradeStateBump: freeTradeState[1],
      programAsSignerBump: programAsSignerPDA[1],
      buyerPrice: buyerPrice,
      tokenSize: tokenSize
    }

    const sellInstructionAccounts: SellInstructionAccounts = getSellInstructionAccounts(
      wallet?.adapter?.publicKey,
      general,
      metaDataAccount,
      tradeState[0],
      freeTradeState[0],
      programAsSignerPDA[0]
    )

    const sellIX: TransactionInstruction = createSellInstruction(sellInstructionAccounts, sellInstructionArgs)

    const transaction = new Transaction()

    let removeAskIX: TransactionInstruction | undefined = undefined
    // if ask exists
    if (ask !== null) {
      // make web3 cancel
      removeAskIX = await createRemoveAskIX()
    }

    // adds ixs to tx
    console.log(`Updating ask: ${removeAskIX !== undefined}`)
    if (ask && removeAskIX) transaction.add(removeAskIX)
    transaction.add(sellIX)

    try {
      const signature = await wal.sendTransaction(transaction, connection)
      console.log(signature)
      setPendingTxSig(signature)
      attemptConfirmTransaction(buyerPrice, tradeState, signature)
        .then((res) => console.log('TX Confirmed', res))
        .catch((err) => console.error(err))
    } catch (error) {
      console.log('User exited signing transaction to list fixed price')
      notify({
        type: 'error',
        message: (
          <TransactionErrorMsg
            title={`Transaction Signature Error`}
            itemName={nftMetadata.name}
            supportText={`User exited signing transaction to list or modify price`}
          />
        )
      })
      setIsLoading(false)
    }
  }

  const createRemoveAskIX = async (): Promise<TransactionInstruction> => {
    const usrAddr: PublicKey = wallet?.adapter?.publicKey
    if (!usrAddr) {
      console.log('no public key connected')
      return
    }

    const curAskingPrice: BN = new BN(parseFloat(ask.buyer_price))
    console.log(curAskingPrice)
    const tradeState: [PublicKey, number] = await tradeStatePDA(usrAddr, general, bnTo8(curAskingPrice))
    const cancelInstructionArgs: CancelInstructionArgs = {
      buyerPrice: curAskingPrice,
      tokenSize: tokenSize
    }

    const cancelInstructionAccounts: CancelInstructionAccounts = {
      wallet: wallet?.adapter?.publicKey,
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
    return cancelIX
  }

  const updateAskPrice = (e) => {
    if (e.target.value === '') setAskPrice(null)
    else if (parseFloat(e.target.value) < TEN_MILLION) {
      setAskPrice(parseFloat(e.target.value))
    }
  }

  return (
    <STYLED_POPUP
      height={checkMobile() ? '655px' : '780px'}
      width={checkMobile() ? '100%' : '580px'}
      title={null}
      visible={visible}
      onCancel={handleClose}
      footer={null}
    >
      <>
        <div tw="flex flex-col items-center justify-center">
          <div className="buyTitle">
            You are about to sell <br />
            <strong>{general?.nft_name} </strong> {checkMobile() && <br />}
            {/* <strong> {general?.nft_name}</strong> */}
          </div>
          <div className="verifiedText">
            {!checkMobile() && (
              <img className="verifiedImg" src={`/img/assets/Aggregator/verifiedNFT.svg`} alt="" />
            )}
            This is a verified {checkMobile() && <br />} Creator
            {checkMobile() && (
              <img className="verifiedImg" src={`/img/assets/Aggregator/verifiedNFT.svg`} alt="" />
            )}
          </div>
        </div>
        <div className="vContainer">
          <img className="nftImg" src={general?.image_url} alt="" />
        </div>

        <div className="vContainer">
          <div className="priceText">Price</div>
        </div>
        <div className="vContainer">
          <input
            className="enterBid"
            placeholder="0.0"
            type="number"
            value={askPrice}
            onChange={(e) => updateAskPrice(e)}
          />
          <img src="/img/crypto/SOL.svg" tw="w-8 h-8 mt-3 ml-[-30px] sm:mt-0 " />
        </div>

        <div tw="mt-6">
          <AppraisalValue
            text={general.gfx_appraisal_value ? `${general.gfx_appraisal_value} SOL` : null}
            label={general.gfx_appraisal_value ? 'Apprasial Value' : 'Apprasial Not Supported'}
            width={360}
          />
        </div>

        {pendingTxSig && (
          <div tw="mt-3 text-center">
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

        <div className="hContainer" style={{ height: 118 }}>
          <div className="rowContainer">
            <div className="leftAlign">Price</div>
            <div className="rightAlign">{askPrice >= 0 ? askPrice : 0} SOL</div>
          </div>
          <div className="rowContainer">
            <div className="leftAlign">Service Fee</div>
            <div className="rightAlign"> {NFT_MARKET_TRANSACTION_FEE / 100} SOL</div>
          </div>
          <div className="rowContainer">
            <div className="leftAlign">Total amount to receive</div>
            <div className="rightAlign"> {totalToReceive} SOL</div>
          </div>
        </div>
        <div className="buyBtnContainer">
          <Button
            disabled={
              askPrice <= 0 ||
              askPrice === null ||
              parseFloat(ask?.buyer_price) / LAMPORTS_PER_SOL_NUMBER === askPrice
            }
            onClick={callSellInstruction}
            className="sellButton"
            loading={isLoading}
          >
            <span tw="font-semibold">{ask ? 'Modify Price' : 'Sell'}</span>
          </Button>
        </div>
      </>
    </STYLED_POPUP>
  )
}
