/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  AuctionHouseClient,
  Metaplex,
  SplTokenAmount,
  SplTokenCurrency,
  lamports,
  toBigNumber,
  toPublicKey,
  token,
  walletAdapterIdentity
} from '@metaplex-foundation/js'
import { Connection, PublicKey, SYSVAR_INSTRUCTIONS_PUBKEY, TransactionInstruction } from '@solana/web3.js'
import { AUCTION_HOUSE, AUCTION_HOUSE_AUTHORITY } from '../ids'
import { WalletContextState, useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL_NUMBER } from '../../constants'
import {
  createSellInstruction,
  createPrintListingReceiptInstruction
} from '@metaplex-foundation/mpl-auction-house'

export const currency: SplTokenCurrency = {
  symbol: 'SOL',
  decimals: 9,
  namespace: 'spl-token'
}

export const tokenSizeSDK = token(1, 0)
export const constructListInstruction = async (
  connection: Connection,
  wallet: WalletContextState,
  mintAccount: PublicKey,
  tokenAccount: PublicKey,
  amount: number,
  printReceipt: boolean
): Promise<TransactionInstruction[]> => {
  const price: SplTokenAmount = {
    basisPoints: toBigNumber(amount * LAMPORTS_PER_SOL_NUMBER),
    currency
  }

  const seller = wallet?.wallet?.adapter?.publicKey
  const metaplex: Metaplex = new Metaplex(connection).use(walletAdapterIdentity(wallet))

  const findOurAuctionHouse = async (): Promise<any> =>
    metaplex.auctionHouse().findByAddress({ address: toPublicKey(AUCTION_HOUSE) })

  const metadata = metaplex.nfts().pdas().metadata({
    mint: mintAccount
  })

  // const tokenAccount = metaplex.tokens().pdas().associatedTokenAccount({
  //   mint: mintAccount,
  //   owner: wallet?.wallet?.adapter?.publicKey
  // })
  const auctionHouse = await findOurAuctionHouse()
  const sellerTradeState = metaplex.auctionHouse().pdas().tradeState({
    auctionHouse: auctionHouse.address,
    wallet: wallet?.wallet?.adapter?.publicKey,
    treasuryMint: auctionHouse.treasuryMint.address,
    tokenMint: mintAccount,
    price: price.basisPoints,
    tokenSize: tokenSizeSDK.basisPoints,
    tokenAccount
  })

  const freeSellerTradeState = metaplex
    .auctionHouse()
    .pdas()
    .tradeState({
      auctionHouse: auctionHouse.address,
      wallet: wallet?.wallet?.adapter?.publicKey,
      treasuryMint: auctionHouse.treasuryMint.address,
      tokenMint: mintAccount,
      price: lamports(0).basisPoints,
      tokenSize: tokenSizeSDK.basisPoints,
      tokenAccount
    })

  const programAsSigner = metaplex.auctionHouse().pdas().programAsSigner()

  const accounts = {
    wallet: seller,
    tokenAccount,
    metadata,
    authority: toPublicKey(AUCTION_HOUSE_AUTHORITY),
    auctionHouse: auctionHouse.address,
    auctionHouseFeeAccount: auctionHouse.feeAccountAddress,
    sellerTradeState,
    freeSellerTradeState,
    programAsSigner
  }

  const args = {
    tradeStateBump: sellerTradeState.bump,
    freeTradeStateBump: freeSellerTradeState.bump,
    programAsSignerBump: programAsSigner.bump,
    buyerPrice: price.basisPoints,
    tokenSize: tokenSizeSDK.basisPoints
  }
  const instructions: TransactionInstruction[] = []

  // Sell Instruction.
  const sellInstruction = createSellInstruction(accounts, args)

  // Make seller as signer since createSellInstruction don't assign a signer
  const signerKeyIndex = sellInstruction.keys.findIndex((key) => key.pubkey.equals(seller))
  sellInstruction.keys[signerKeyIndex].isSigner = true
  sellInstruction.keys[signerKeyIndex].isWritable = true

  instructions.push(sellInstruction)

  if (printReceipt) {
    const receipt = metaplex.auctionHouse().pdas().listingReceipt({
      tradeState: sellerTradeState
    })

    instructions.push(
      createPrintListingReceiptInstruction(
        {
          receipt,
          bookkeeper: seller,
          instruction: SYSVAR_INSTRUCTIONS_PUBKEY
        },
        { receiptBump: receipt.bump }
      )
    )
  }

  return instructions
}
// export const listNFT = async (
//   amount: number,
//   tokenAccount: string,
//   mintAccount: string,
//   connection: Connection,
//   wallet: WalletContextState
// ): Promise<void> => {
//   const auctionHouseClient: AuctionHouseClient = new Metaplex(connection)
//     .use(walletAdapterIdentity(wallet))
//     .auctionHouse()
//   // const metaplex = new Metaplex(connection).use(walletAdapterIdentity(wallet))

//   const auctionHouse = await auctionHouseClient.findByAddress({
//     address: new PublicKey(AUCTION_HOUSE)
//   })
//   const currency: SplTokenCurrency = {
//     symbol: 'SOL',
//     decimals: 9,
//     namespace: 'spl-token'
//   }

//   const price: SplTokenAmount = {
//     basisPoints: toBigNumber(amount * LAMPORTS_PER_SOL_NUMBER),
//     currency
//   }

//   // const {listing} = await auctionHouseClient.list({
//   //   auctionHouse,
//   //   seller: sellerWallet,
//   //   mintAccount: nftAddress,
//   //   price: price,
//   // });

//   try {
//     const { listing, sellerTradeState } = await auctionHouseClient.list({
//       auctionHouse: auctionHouse, //auctionHouse
//       tokenAccount: toPublicKey(tokenAccount),
//       mintAccount: toPublicKey(mintAccount),
//       price: price
//     })
//     console.log('listing', listing)
//     console.log('sellerTradeState', sellerTradeState)
//   } catch (err) {
//     console.log(err)
//   }
// }
