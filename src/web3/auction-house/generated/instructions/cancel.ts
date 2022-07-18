import * as splToken from '@solana/spl-token-v2'
import * as beet from '@metaplex-foundation/beet'
import * as web3 from '@solana/web3.js'
import { AUCTION_HOUSE_PROGRAM_ID } from '../../../ids'

export type CancelInstructionArgs = {
  buyerPrice: beet.bignum
  tokenSize: beet.bignum
}
const cancelStruct = new beet.BeetArgsStruct<
  CancelInstructionArgs & {
    instructionDiscriminator: number[]
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['buyerPrice', beet.u64],
    ['tokenSize', beet.u64]
  ],
  'CancelInstructionArgs'
)
export type CancelInstructionAccounts = {
  wallet: web3.PublicKey
  tokenAccount: web3.PublicKey
  tokenMint: web3.PublicKey
  authority: web3.PublicKey
  auctionHouse: web3.PublicKey
  auctionHouseFeeAccount: web3.PublicKey
  tradeState: web3.PublicKey
}

const cancelInstructionDiscriminator = [232, 219, 223, 41, 219, 236, 220, 190]

/**
 * Creates a _Cancel_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 */
export function createCancelInstruction(accounts: CancelInstructionAccounts, args: CancelInstructionArgs) {
  const { wallet, tokenAccount, tokenMint, authority, auctionHouse, auctionHouseFeeAccount, tradeState } = accounts

  const [data] = cancelStruct.serialize({
    instructionDiscriminator: cancelInstructionDiscriminator,
    ...args
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: wallet,
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
      pubkey: tradeState,
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: splToken.TOKEN_PROGRAM_ID,
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
