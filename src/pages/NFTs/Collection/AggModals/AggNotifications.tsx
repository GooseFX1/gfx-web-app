import { Col, Row } from 'antd'
import styled from 'styled-components'
import { SuccessfulListingMsg, SuccessfulListingMsgAMM, TransactionErrorMsg } from '../../../../components'
import { INFTMetadata } from '../../../../types/nft_details'
import { checkMobile, notify } from '../../../../utils'

const NETWORK_MSG = 'Changes will reflect after Solana network confirmation. Please try reloading.'
export const MESSAGE = styled.div`
  margin: -12px 0;
  font-size: 12px;
  font-weight: 700;

  .m-title {
    margin-bottom: 16px;
  }

  .m-icon {
    width: 20.5px;
    height: 20px;
  }
`
export const successfulListingMsg = (
  message: string,
  signature: string,
  nftMetadata: INFTMetadata | any,
  price: string
): any => ({
  message: (
    <SuccessfulListingMsg
      title={`Successfully ${message} ${nftMetadata.name}!`}
      itemName={nftMetadata?.name}
      supportText={`My price: ${price}`}
      additionalText={NETWORK_MSG}
      tx_url={`https://solscan.io/tx/${signature}`}
    />
  )
})
export const pleaseTryAgain = (isBuyingNow = false, message: string): any => {
  notify({
    type: 'error',
    message: (
      <MESSAGE>
        <Row justify="space-between" align="middle">
          <Col>NFT {isBuyingNow ? 'Buying' : 'Biding'} error!</Col>
          <Col>
            <img className="mIcon" src={`/img/assets/close-white-icon.svg`} alt="" />
          </Col>
        </Row>
        <div>{message}</div>
        <div>Please try again, if the error persists please contact support.</div>
      </MESSAGE>
    )
  })
}
export const pleaseTryAgainAMM = (message: string): any => {
  notify({
    type: 'error',
    message: (
      <MESSAGE>
        <Row justify="space-between" align="middle">
          <Col>NFT error!</Col>
          <Col>
            <img className="mIcon" src={`/img/assets/close-white-icon.svg`} alt="" />
          </Col>
        </Row>
        <div>{message}</div>
        <div>Please try again, if the error persists please contact support.</div>
      </MESSAGE>
    )
  })
}
export const didNotModifyPrice = (message: string): void => {
  notify({
    type: 'error',
    message: (
      <MESSAGE>
        <Row justify="space-between" align="middle">
          <Col>Did not modify price!</Col>
          <Col>
            <img className="mIcon" src={`/img/assets/close-white-icon.svg`} alt="" />
          </Col>
        </Row>
        <div>{message}</div>
        <div>Please try again, if the error persists please contact support.</div>
      </MESSAGE>
    )
  })
}

export const couldNotFetchNFTMetaData = (): any =>
  notify({
    type: 'error',
    message: (
      <MESSAGE>
        <Row className="m-title" justify="space-between" align="middle">
          <Col>Buy error!</Col>
          <Col>
            <img className="m-icon" src={`/img/assets/close-white-icon.svg`} alt="" />
          </Col>
        </Row>
        <div>Could not fetch NFT metadata for buy instructions</div>
      </MESSAGE>
    )
  })
export const couldNotDeriveValueForBuyInstruction = (): any =>
  notify({
    type: 'error',
    message: (
      <MESSAGE>
        <Row className="m-title" justify="space-between" align="middle">
          <Col>Open bid error!</Col>
          <Col>
            <img className="m-icon" src={`/img/assets/close-white-icon.svg`} alt="" />
          </Col>
        </Row>
        <div>Could not derive values for buy instructions</div>
      </MESSAGE>
    )
  })

export const TransactionSignatureErrorNotify = (nftName: string, customMsg?: string): void => {
  notify({
    type: 'error',
    message: (
      <TransactionErrorMsg
        title={`Transaction Error`}
        itemName={nftName}
        supportText={customMsg ? customMsg : `Instruction or transaction has thrown and error`}
      />
    )
  })
}
export const couldNotFetchUserData = (): any =>
  notify({
    type: 'error',
    message: (
      <MESSAGE>
        <div>Couldn't fetch user data, please refresh this page.</div>
      </MESSAGE>
    )
  })

export const successfulCancelBidMessage = (signature: string, nftMetadata: string): any => ({
  message: (
    <SuccessfulListingMsg
      title={`Successfully Canceled bid on ${nftMetadata}!`}
      itemName={nftMetadata}
      additionalText={NETWORK_MSG}
      tx_url={`https://solscan.io/tx/${signature}`}
    />
  )
})
export const successfulListingMessage = (signature: string, nftMetadata: INFTMetadata, price: string): any => ({
  notificationDuration: checkMobile() ? 3000 : 10000,
  message: (
    <SuccessfulListingMsg
      title={`Successfully placed a bid on ${nftMetadata?.name}!`}
      itemName={nftMetadata.name}
      supportText={`Bid of: ${price}`}
      additionalText={NETWORK_MSG}
      tx_url={`https://solscan.io/tx/${signature}`}
    />
  )
})

export const successBidAMMMessage = (collectionName: string): any => ({
  notificationDuration: checkMobile() ? 3000 : 10000,
  message: (
    <SuccessfulListingMsgAMM
      title={`Success!`}
      itemName={collectionName}
      supportText={`Congratulations! 🎉 Your bid for ${collectionName} has been 
      successfully placed. Good luck in the auction!`}
    />
  )
})
export const successCancelBidAMMMessage = (collectionName: string): any => ({
  notificationDuration: checkMobile() ? 3000 : 10000,
  message: (
    <SuccessfulListingMsgAMM
      title={`Success!`}
      itemName={collectionName}
      supportText={`Your bid for ${collectionName} has been 
      successfully Cancelled. Good luck in the auction!`}
    />
  )
})
export const successSaleAMMMessage = (collectionName: string): any => ({
  notificationDuration: checkMobile() ? 3000 : 10000,
  message: (
    <SuccessfulListingMsgAMM
      title={`NFT purchased Successfully!`}
      itemName={collectionName}
      supportText={`Congratulations! 🎉 Your bid for ${collectionName} has been 
      successfully placed. Good luck in the auction!`}
    />
  )
})
export const successBidMatchedMessage = (signature: string, nftMetadata: INFTMetadata, price: string): any => ({
  notificationDuration: checkMobile() ? 3000 : 10000,
  message: (
    <SuccessfulListingMsg
      title={`NFT purchased Successfully!`}
      itemName={nftMetadata.name}
      supportText={`You have just acquired ${nftMetadata?.name} for ${price} SOL!`}
      additionalText={NETWORK_MSG}
      tx_url={`https://solscan.io/tx/${signature} `}
    />
  )
})
export const successfulNFTPurchaseMsg = (signature: string, nftMetadata: string, price?: string): any => ({
  notificationDuration: checkMobile() ? 3000 : 10000,
  message: (
    <SuccessfulListingMsg
      title={`NFT purchased Successfully!`}
      itemName={nftMetadata}
      supportText={`You have just acquired ${nftMetadata} ${price ? `for ${price} SOL` : ``} !`}
      additionalText={NETWORK_MSG}
      tx_url={`https://solscan.io/tx/${signature} `}
    />
  )
})
export const successBidRemovedMsg = (signature: string, nftMetadata: INFTMetadata, price: string): any => ({
  message: (
    <SuccessfulListingMsg
      title={`Bid Removed Successfully!`}
      itemName={nftMetadata.name}
      supportText={`You have just acquired ${nftMetadata.name} for ${price} SOL!`}
      additionalText={NETWORK_MSG}
      tx_url={`https://solscan.io/tx/${signature} `}
    />
  )
})

// saving here for future reference
// const postBidToAPI = async (txSig: any, buyerPrice: BN, tokenSize: BN) => {
//   const bidObject = {
//     clock: Date.now().toString(),
//     tx_sig: txSig,
//     wallet_key: publicKey.toBase58(),
//     auction_house_key: isBuyingNow ? ask?.auction_house_key : AUCTION_HOUSE,
//     token_account_key: general.token_account,
//     auction_house_treasury_mint_key: isBuyingNow ? ask?.auction_house_treasury_mint_key : TREASURY_MINT,
//     token_account_mint_key: general.mint_address,
//     buyer_price: buyerPrice.toString(),
//     token_size: tokenSize.toString(),
//     non_fungible_id: general.non_fungible_id,
//     collection_id: general.collection_id,
//     user_id: sessionUser.user_id
//   }

//   try {
//     const res = await bidOnSingleNFT(bidObject)
//     if (res.isAxiosError) {
//       notify({
//         type: 'error',
//         message: (
//           <MESSAGE>
//             <Row justify="space-between" align="middle">
//               <Col>NFT Biding error!</Col>
//               <Col>
//                 <img className="mIcon" src={`/img/assets/close-white-icon.svg`} alt="" />
//               </Col>
//             </Row>
//             <div>Please try again, if the error persists please contact support.</div>
//           </MESSAGE>
//         )
//       })
//       return 'Error'
//     } else {
//       setMode('bid')
//       return res
//     }
//   } catch (error) {
//     console.dir(error)
//     setIsLoading(false)
//     return 'Error'
//   }
// }

// const callCancelInstruction = async () => {
//   const { buyerTradeState, buyerPrice } = await derivePDAsForInstruction()

//   const cancelInstructionArgs: CancelInstructionArgs = {
//     buyerPrice: buyerPrice,
//     tokenSize: tokenSize
//   }

//   const cancelInstructionAccounts: CancelInstructionAccounts = {
//     wallet: publicKey,
//     tokenAccount: new PublicKey(general.token_account),
//     tokenMint: new PublicKey(general.mint_address),
//     authority: new PublicKey(isBuyingNow ? ask?.auction_house_authority : AUCTION_HOUSE_AUTHORITY),
//     auctionHouse: new PublicKey(isBuyingNow ? ask?.auction_house_key : AUCTION_HOUSE),
//     auctionHouseFeeAccount: new PublicKey(isBuyingNow ? ask?.auction_house_fee_account : AH_FEE_ACCT),
//     tradeState: buyerTradeState[0]
//   }

//   const cancelIX: TransactionInstruction = await createCancelInstruction(
//     cancelInstructionAccounts,
//     cancelInstructionArgs
//   )

//   const transaction = new Transaction().add(cancelIX)
//   const signature = await sendTransaction(transaction, connection)
//   console.log(signature)
//   const confirm = await confirmTransaction(connection, signature, 'confirmed')
//   console.log(confirm)
// }
