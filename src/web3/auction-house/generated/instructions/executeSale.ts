import * as splToken from '@solana/spl-token-v2'
import * as beet from '@metaplex-foundation/beet'
import * as web3 from '@solana/web3.js'
import { AUCTION_HOUSE_PROGRAM_ID } from '../../../ids'

export type ExecuteSaleInstructionArgs = {
  escrowPaymentBump: number
  freeTradeStateBump: number
  programAsSignerBump: number
  buyerPrice: beet.bignum
  tokenSize: beet.bignum
}
const executeSaleStruct = new beet.BeetArgsStruct<
  ExecuteSaleInstructionArgs & {
    instructionDiscriminator: number[]
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['escrowPaymentBump', beet.u8],
    ['freeTradeStateBump', beet.u8],
    ['programAsSignerBump', beet.u8],
    ['buyerPrice', beet.u64],
    ['tokenSize', beet.u64]
  ],
  'ExecuteSaleInstructionArgs'
)
export type ExecuteSaleInstructionAccounts = {
  buyer: web3.PublicKey
  seller: web3.PublicKey
  tokenAccount: web3.PublicKey
  tokenMint: web3.PublicKey
  metadata: web3.PublicKey
  treasuryMint: web3.PublicKey
  escrowPaymentAccount: web3.PublicKey
  sellerPaymentReceiptAccount: web3.PublicKey
  buyerReceiptTokenAccount: web3.PublicKey
  authority: web3.PublicKey
  auctionHouse: web3.PublicKey
  auctionHouseFeeAccount: web3.PublicKey
  auctionHouseTreasury: web3.PublicKey
  buyerTradeState: web3.PublicKey
  sellerTradeState: web3.PublicKey
  freeTradeState: web3.PublicKey
  programAsSigner: web3.PublicKey
}

const executeSaleInstructionDiscriminator = [37, 74, 217, 157, 79, 49, 35, 6]

/**
 * Creates a _ExecuteSale_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 */
export function createExecuteSaleInstruction(
  accounts: ExecuteSaleInstructionAccounts,
  args: ExecuteSaleInstructionArgs
) {
  const {
    buyer,
    seller,
    tokenAccount,
    tokenMint,
    metadata,
    treasuryMint,
    escrowPaymentAccount,
    sellerPaymentReceiptAccount,
    buyerReceiptTokenAccount,
    authority,
    auctionHouse,
    auctionHouseFeeAccount,
    auctionHouseTreasury,
    buyerTradeState,
    sellerTradeState,
    freeTradeState,
    programAsSigner
  } = accounts

  const [data] = executeSaleStruct.serialize({
    instructionDiscriminator: executeSaleInstructionDiscriminator,
    ...args
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: buyer,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: seller,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: tokenAccount,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: tokenMint,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: metadata,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: treasuryMint,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: escrowPaymentAccount,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: sellerPaymentReceiptAccount,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: buyerReceiptTokenAccount,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: authority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: auctionHouse,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: auctionHouseFeeAccount,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: auctionHouseTreasury,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: buyerTradeState,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: sellerTradeState,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: freeTradeState,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: splToken.TOKEN_PROGRAM_ID,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: web3.SystemProgram.programId,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: programAsSigner,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: web3.SYSVAR_RENT_PUBKEY,
      isWritable: false,
      isSigner: false
    }
  ]

  const ix = new web3.TransactionInstruction({
    programId: new web3.PublicKey(AUCTION_HOUSE_PROGRAM_ID),
    keys,
    data
  })
  return ix
}
