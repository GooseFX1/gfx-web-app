import * as splToken from '@solana/spl-token-v2'
import * as beet from '@metaplex-foundation/beet'
import * as web3 from '@solana/web3.js'
import { AUCTION_HOUSE_PROGRAM_ID } from '../../../ids'

export type BuyInstructionArgs = {
  tradeStateBump: number
  escrowPaymentBump: number
  buyerPrice: beet.bignum
  tokenSize: beet.bignum
}
const buyStruct = new beet.BeetArgsStruct<
  BuyInstructionArgs & {
    instructionDiscriminator: number[]
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['tradeStateBump', beet.u8],
    ['escrowPaymentBump', beet.u8],
    ['buyerPrice', beet.u64],
    ['tokenSize', beet.u64]
  ],
  'BuyInstructionArgs'
)
export type BuyInstructionAccounts = {
  wallet: web3.PublicKey
  paymentAccount: web3.PublicKey
  transferAuthority: web3.PublicKey
  treasuryMint: web3.PublicKey
  tokenAccount: web3.PublicKey
  metadata: web3.PublicKey
  escrowPaymentAccount: web3.PublicKey
  authority: web3.PublicKey
  auctionHouse: web3.PublicKey
  auctionHouseFeeAccount: web3.PublicKey
  buyerTradeState: web3.PublicKey
}

const buyInstructionDiscriminator = [102, 6, 61, 18, 1, 218, 235, 234]

/**
 * Creates a _Buy_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 */
export function createBuyInstruction(accounts: BuyInstructionAccounts, args: BuyInstructionArgs) {
  const {
    wallet,
    paymentAccount,
    transferAuthority,
    treasuryMint,
    tokenAccount,
    metadata,
    escrowPaymentAccount,
    authority,
    auctionHouse,
    auctionHouseFeeAccount,
    buyerTradeState
  } = accounts

  const [data] = buyStruct.serialize({
    instructionDiscriminator: buyInstructionDiscriminator,
    ...args
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: wallet,
      isWritable: false,
      isSigner: true
    },
    {
      pubkey: paymentAccount,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: transferAuthority,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: treasuryMint,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: tokenAccount,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: metadata,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: escrowPaymentAccount,
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
      pubkey: buyerTradeState,
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
