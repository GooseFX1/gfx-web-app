import * as splToken from '@solana/spl-token-v2'
import * as beet from '@metaplex-foundation/beet'
import { PublicKey, AccountMeta, SystemProgram, SYSVAR_RENT_PUBKEY, TransactionInstruction } from '@solana/web3.js'
import { AUCTION_HOUSE_PROGRAM_ID } from '../../../ids'

export type SellInstructionArgs = {
  tradeStateBump: number
  freeTradeStateBump: number
  programAsSignerBump: number
  buyerPrice: beet.bignum
  tokenSize: beet.bignum
}
const sellStruct = new beet.BeetArgsStruct<
  SellInstructionArgs & {
    instructionDiscriminator: number[]
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['tradeStateBump', beet.u8],
    ['freeTradeStateBump', beet.u8],
    ['programAsSignerBump', beet.u8],
    ['buyerPrice', beet.u64],
    ['tokenSize', beet.u64]
  ],
  'SellInstructionArgs'
)
export type SellInstructionAccounts = {
  wallet: PublicKey
  tokenAccount: PublicKey
  metadata: PublicKey
  authority: PublicKey
  auctionHouse: PublicKey
  auctionHouseFeeAccount: PublicKey
  sellerTradeState: PublicKey
  freeSellerTradeState: PublicKey
  programAsSigner: PublicKey
}

const sellInstructionDiscriminator = [51, 230, 133, 164, 1, 127, 131, 173]

/**
 * Creates a _Sell_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 */
export function createSellInstruction(accounts: SellInstructionAccounts, args: SellInstructionArgs) {
  const {
    wallet,
    tokenAccount,
    metadata,
    authority,
    auctionHouse,
    auctionHouseFeeAccount,
    sellerTradeState,
    freeSellerTradeState,
    programAsSigner
  } = accounts

  const [data] = sellStruct.serialize({
    instructionDiscriminator: sellInstructionDiscriminator,
    ...args
  })
  const keys: AccountMeta[] = [
    {
      pubkey: wallet,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: tokenAccount,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: metadata,
      isWritable: false,
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
      pubkey: sellerTradeState,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: freeSellerTradeState,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: splToken.TOKEN_PROGRAM_ID,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: SystemProgram.programId,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: programAsSigner,
      isWritable: false,
      isSigner: false
    },
    {
      pubkey: SYSVAR_RENT_PUBKEY,
      isWritable: false,
      isSigner: false
    }
  ]

  const ix = new TransactionInstruction({
    programId: new PublicKey(AUCTION_HOUSE_PROGRAM_ID),
    keys,
    data
  })
  return ix
}
