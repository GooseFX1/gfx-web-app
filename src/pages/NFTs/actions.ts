import { PublicKey } from '@solana/web3.js'
import {
  AUCTION_HOUSE_PREFIX,
  AUCTION_HOUSE,
  AUCTION_HOUSE_AUTHORITY,
  AUCTION_HOUSE_PROGRAM_ID,
  TREASURY_MINT,
  TREASURY_ACCT,
  AH_FEE_ACCT,
  toPublicKey,
  ExecuteSaleInstructionAccounts,
  SellInstructionAccounts,
  BuyInstructionAccounts,
  StringPublicKey,
  bnTo8
} from '../../web3'
import { ISingleNFT } from '../../types/nft_details.d'
import BN from 'bn.js'

export const tokenSize: BN = new BN(1)

export const tradeStatePDA = async (
  publicKey: PublicKey,
  general: ISingleNFT,
  buyerPrice: Uint8Array
): Promise<undefined | [PublicKey, number]> => {
  try {
    const pda = await PublicKey.findProgramAddress(
      [
        Buffer.from(AUCTION_HOUSE_PREFIX),
        publicKey.toBuffer(),
        toPublicKey(AUCTION_HOUSE).toBuffer(),
        toPublicKey(general.token_account).toBuffer(),
        toPublicKey(TREASURY_MINT).toBuffer(),
        toPublicKey(general.mint_address).toBuffer(),
        buyerPrice,
        bnTo8(tokenSize)
      ],
      toPublicKey(AUCTION_HOUSE_PROGRAM_ID)
    )
    return pda
  } catch (err) {
    return undefined
  }
}

export const freeSellerTradeStatePDA = async (
  publicKey: PublicKey,
  general: ISingleNFT
): Promise<undefined | [PublicKey, number]> => {
  try {
    const pda = await PublicKey.findProgramAddress(
      [
        Buffer.from(AUCTION_HOUSE_PREFIX),
        publicKey.toBuffer(),
        toPublicKey(AUCTION_HOUSE).toBuffer(),
        toPublicKey(general.token_account).toBuffer(),
        toPublicKey(TREASURY_MINT).toBuffer(),
        toPublicKey(general.mint_address).toBuffer(),
        bnTo8(new BN(0)),
        bnTo8(tokenSize)
      ],
      toPublicKey(AUCTION_HOUSE_PROGRAM_ID)
    )

    return pda
  } catch (err) {
    return undefined
  }
}

export const getSellInstructionAccounts = (
  publicKey: PublicKey,
  general: ISingleNFT,
  metaDataAccount: StringPublicKey,
  sTradeState: PublicKey,
  fsTradeState: PublicKey,
  programAsSignerPDA: PublicKey
): SellInstructionAccounts => ({
  wallet: publicKey,
  tokenAccount: new PublicKey(general.token_account),
  metadata: new PublicKey(metaDataAccount),
  authority: new PublicKey(AUCTION_HOUSE_AUTHORITY),
  auctionHouse: new PublicKey(AUCTION_HOUSE),
  auctionHouseFeeAccount: new PublicKey(AH_FEE_ACCT),
  sellerTradeState: sTradeState,
  freeSellerTradeState: fsTradeState,
  programAsSigner: programAsSignerPDA
})

export const getBuyInstructionAccounts = (
  publicKey: PublicKey,
  general: ISingleNFT,
  metaDataAccount: StringPublicKey,
  escrowPaymentAccount: PublicKey,
  buyerTradeState: PublicKey
): BuyInstructionAccounts => ({
  wallet: publicKey,
  paymentAccount: publicKey,
  transferAuthority: publicKey,
  treasuryMint: new PublicKey(TREASURY_MINT),
  tokenAccount: new PublicKey(general.token_account),
  metadata: new PublicKey(metaDataAccount),
  escrowPaymentAccount: escrowPaymentAccount,
  authority: new PublicKey(AUCTION_HOUSE_AUTHORITY),
  auctionHouse: new PublicKey(AUCTION_HOUSE),
  auctionHouseFeeAccount: new PublicKey(AH_FEE_ACCT),
  buyerTradeState: buyerTradeState
})

export const getExecuteSaleInstructionAccounts = (
  buyerPublicKey: PublicKey,
  sellerPublicKey: PublicKey,
  general: ISingleNFT,
  metaDataAccount: StringPublicKey,
  escrowPaymentAccount: PublicKey,
  buyerReceiptTokenAccount: PublicKey,
  buyerTradeState: PublicKey,
  sellerTradeState: PublicKey,
  freeTradeState: PublicKey,
  programAsSignerPDA: PublicKey
): ExecuteSaleInstructionAccounts => ({
  buyer: buyerPublicKey,
  seller: sellerPublicKey,
  tokenAccount: new PublicKey(general.token_account),
  tokenMint: new PublicKey(general.mint_address),
  metadata: new PublicKey(metaDataAccount),
  treasuryMint: new PublicKey(TREASURY_MINT),
  escrowPaymentAccount: escrowPaymentAccount,
  sellerPaymentReceiptAccount: sellerPublicKey,
  buyerReceiptTokenAccount: buyerReceiptTokenAccount,
  authority: new PublicKey(AUCTION_HOUSE_AUTHORITY),
  auctionHouse: new PublicKey(AUCTION_HOUSE),
  auctionHouseFeeAccount: new PublicKey(AH_FEE_ACCT),
  auctionHouseTreasury: new PublicKey(TREASURY_ACCT),
  buyerTradeState: buyerTradeState,
  sellerTradeState: sellerTradeState,
  freeTradeState: freeTradeState,
  programAsSigner: programAsSignerPDA
})
