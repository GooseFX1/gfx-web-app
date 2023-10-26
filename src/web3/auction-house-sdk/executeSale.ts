import BN from 'bn.js'
import { INFTAsk, ISingleNFT } from '../../types/nft_details'
import { Metaplex, PublicKey, walletAdapterIdentity } from '@metaplex-foundation/js'
import {
  AH_FEE_ACCT,
  AUCTION_HOUSE,
  AUCTION_HOUSE_AUTHORITY,
  AUCTION_HOUSE_PREFIX,
  AUCTION_HOUSE_PROGRAM_ID,
  SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  TREASURY_MINT,
  TREASURY_PREFIX,
  toPublicKey
} from '../ids'
import { StringPublicKey } from '@metaplex-foundation/mpl-core'
import { getMetadata } from '../nfts/metadata'
import {
  BuyInstructionAccounts,
  BuyInstructionArgs,
  createBuyInstruction
} from '../auction-house/generated/instructions/buy'
import { freeSellerTradeStatePDAAgg, tokenSize, tradeStatePDA } from '../../pages/NFTs/actions'
import {
  couldNotDeriveValueForBuyInstruction,
  couldNotFetchNFTMetaData
} from '../../pages/NFTs/Collection/AggModals/AggNotifications'
import { AccountMeta, Connection, SystemProgram, Transaction, TransactionInstruction } from '@solana/web3.js'
import { getNFTMetadata } from '../nfts/utils'
import { web3 } from '@project-serum/anchor'
import {
  ExecuteSaleInstructionAccounts,
  ExecuteSaleInstructionArgs,
  createExecuteSaleInstruction
} from '../auction-house/generated/instructions'
import { bnTo8 } from '../utils'
import { WalletContextState } from '@solana/wallet-adapter-react'
import { derivePNFTAccounts } from './list'

const derivePDAsForInstruction = async (
  ask: INFTAsk | any,
  general: ISingleNFT | any,
  publicKey: PublicKey,
  isBuyingNow: boolean
) => {
  const buyerPriceInLamports = parseFloat(ask.buyer_price)
  const buyerPrice: BN = new BN(buyerPriceInLamports)
  const buyerReceiptTokenAccount: [PublicKey, number] = await PublicKey.findProgramAddress(
    [publicKey.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), toPublicKey(general.mint_address).toBuffer()],
    SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
  )
  const auctionHouseTreasuryAddress: [PublicKey, number] = await PublicKey.findProgramAddress(
    [
      Buffer.from(AUCTION_HOUSE_PREFIX),
      toPublicKey(isBuyingNow ? ask?.auction_house_key : AUCTION_HOUSE).toBuffer(),
      Buffer.from(TREASURY_PREFIX)
    ],
    toPublicKey(AUCTION_HOUSE_PROGRAM_ID)
  )

  const metaDataAccount: StringPublicKey = await getMetadata(general.mint_address)
  const escrowPaymentAccount: [PublicKey, number] = await PublicKey.findProgramAddress(
    [
      Buffer.from(AUCTION_HOUSE_PREFIX),
      toPublicKey(isBuyingNow ? ask?.auction_house_key : AUCTION_HOUSE).toBuffer(),
      publicKey.toBuffer()
    ],
    toPublicKey(AUCTION_HOUSE_PROGRAM_ID)
  )

  const buyerTradeState: [PublicKey, number] = await tradeStatePDA(
    publicKey,
    isBuyingNow ? ask?.auction_house_key : AUCTION_HOUSE,
    general.token_account,
    general.mint_address,
    isBuyingNow ? ask?.auction_house_treasury_mint_key : TREASURY_MINT,
    bnTo8(buyerPrice)
  )

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
    buyerPrice,
    buyerReceiptTokenAccount,
    auctionHouseTreasuryAddress
  }
}

const derivePDAForExecuteSale = async (ask: INFTAsk, general: ISingleNFT, isBuyingNow: boolean) => {
  const programAsSignerPDA: [PublicKey, number] = await PublicKey.findProgramAddress(
    [Buffer.from(AUCTION_HOUSE_PREFIX), Buffer.from('signer')],
    toPublicKey(AUCTION_HOUSE_PROGRAM_ID)
  )
  const freeTradeStateAgg: [PublicKey, number] = await freeSellerTradeStatePDAAgg(
    new PublicKey(ask?.wallet_key),
    isBuyingNow ? ask?.auction_house_key : AUCTION_HOUSE,
    general.token_account,
    general.mint_address
  )
  return {
    freeTradeStateAgg,
    programAsSignerPDA
  }
}

export const callExecuteSaleInstruction = async (
  ask: INFTAsk | any,
  general: ISingleNFT | any,
  publicKey: PublicKey,
  isBuyingNow: boolean,
  connection: Connection,
  wallet: WalletContextState,
  isPnft?: boolean
): Promise<Transaction> => {
  const {
    metaDataAccount,
    escrowPaymentAccount,
    buyerTradeState,
    buyerPrice,
    buyerReceiptTokenAccount,
    auctionHouseTreasuryAddress
  } = await derivePDAsForInstruction(ask, general, publicKey, isBuyingNow)
  if (!metaDataAccount || !escrowPaymentAccount || !buyerTradeState) {
    couldNotDeriveValueForBuyInstruction()
    return
  }

  const metaplex: Metaplex = new Metaplex(connection).use(walletAdapterIdentity(wallet))
  const programAsSigner = metaplex.auctionHouse().pdas().programAsSigner()
  const mintAddress = new PublicKey(ask?.token_account_mint_key)
  const seller = new PublicKey(ask?.wallet_key)

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
    treasuryMint: new PublicKey(isBuyingNow ? ask?.auction_house_treasury_mint_key : TREASURY_MINT),
    tokenAccount: new PublicKey(general.token_account),
    metadata: new PublicKey(metaDataAccount),
    escrowPaymentAccount: escrowPaymentAccount[0],
    authority: new PublicKey(
      isBuyingNow ? ask?.auction_house_authority ?? AUCTION_HOUSE_AUTHORITY : AUCTION_HOUSE_AUTHORITY
    ),
    auctionHouse: new PublicKey(isBuyingNow ? ask?.auction_house_key : AUCTION_HOUSE),
    auctionHouseFeeAccount: new PublicKey(isBuyingNow ? ask?.auction_house_fee_account : AH_FEE_ACCT),
    buyerTradeState: buyerTradeState[0]
  }

  const buyIX: TransactionInstruction = await createBuyInstruction(buyInstructionAccounts, buyInstructionArgs)

  const transaction = new Transaction()
  transaction.add(buyIX)
  if (isBuyingNow) {
    const { freeTradeStateAgg, programAsSignerPDA } = await derivePDAForExecuteSale(ask, general, isBuyingNow)

    const onChainNFTMetadata = await getNFTMetadata(metaDataAccount, connection)
    if (!onChainNFTMetadata) {
      couldNotFetchNFTMetaData()
      return
    }

    const pnftAccounts = await derivePNFTAccounts(connection, publicKey, programAsSigner, mintAddress, seller)

    const executeSaleAnchorRemainingAccounts: AccountMeta[] = [
      pnftAccounts.metadataProgram,
      pnftAccounts.edition,
      pnftAccounts.sellerTokenRecord,
      pnftAccounts.tokenRecord,
      pnftAccounts.authRulesProgram,
      pnftAccounts.authRules,
      pnftAccounts.sysvarInstructions
    ]

    const creatorAccounts: web3.AccountMeta[] = onChainNFTMetadata.data.creators.map((creator) => ({
      pubkey: new PublicKey(creator.address),
      isWritable: true,
      isSigner: false
    }))

    const executeSaleInstructionArgs: ExecuteSaleInstructionArgs = {
      escrowPaymentBump: escrowPaymentAccount[1],
      freeTradeStateBump: freeTradeStateAgg[1],
      programAsSignerBump: programAsSignerPDA[1],
      buyerPrice: buyerPrice,
      tokenSize: tokenSize
    }

    let remainingAccounts: AccountMeta[] = []

    remainingAccounts = remainingAccounts.concat(...creatorAccounts)

    if (isPnft) remainingAccounts = remainingAccounts.concat(...executeSaleAnchorRemainingAccounts)

    const executeSaleInstructionAccounts: ExecuteSaleInstructionAccounts = {
      buyer: publicKey,
      seller: new PublicKey(ask?.wallet_key),
      tokenAccount: new PublicKey(ask?.token_account_key),
      tokenMint: new PublicKey(ask?.token_account_mint_key),
      metadata: new PublicKey(metaDataAccount),
      treasuryMint: new PublicKey(isBuyingNow ? ask?.auction_house_treasury_mint_key : TREASURY_MINT),
      escrowPaymentAccount: escrowPaymentAccount[0],
      sellerPaymentReceiptAccount: new PublicKey(ask?.wallet_key),
      buyerReceiptTokenAccount: buyerReceiptTokenAccount[0],
      authority: new PublicKey(isBuyingNow ? ask?.auction_house_authority : AUCTION_HOUSE_AUTHORITY),
      auctionHouse: new PublicKey(isBuyingNow ? ask?.auction_house_key : AUCTION_HOUSE),
      auctionHouseFeeAccount: new PublicKey(isBuyingNow ? ask?.auction_house_fee_account : AH_FEE_ACCT),
      auctionHouseTreasury: auctionHouseTreasuryAddress[0],
      buyerTradeState: buyerTradeState[0],
      sellerTradeState: new PublicKey(ask?.seller_trade_state),
      freeTradeState: freeTradeStateAgg[0],
      systemProgram: SystemProgram.programId,
      programAsSigner: programAsSignerPDA[0],
      rent: new PublicKey('SysvarRent111111111111111111111111111111111'),
      ataProgram: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
      anchorRemainingAccounts: remainingAccounts
    }

    const executeSaleIX: TransactionInstruction = await createExecuteSaleInstruction(
      executeSaleInstructionAccounts,
      executeSaleInstructionArgs
    )

    // executeSaleIX.keys.at(4).isWritable = true
    // executeSaleIX.keys.at(9).isSigner = true
    // executeSaleIX.keys.at(9).isWritable = true

    transaction.add(executeSaleIX)
  }
  return transaction
}
