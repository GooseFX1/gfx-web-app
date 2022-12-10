import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js'
import BN from 'bn.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types' // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId'

export interface ClearExpiredOrderbookArgs {
  params: types.ClearExpiredOrderbookParamsFields
}

export interface ClearExpiredOrderbookAccounts {
  marketProductGroup: PublicKey
  product: PublicKey
  aaobProgram: PublicKey
  orderbook: PublicKey
  marketSigner: PublicKey
  eventQueue: PublicKey
  bids: PublicKey
  asks: PublicKey
}

export const layout = borsh.struct([types.ClearExpiredOrderbookParams.layout('params')])

export function clearExpiredOrderbook(args: ClearExpiredOrderbookArgs, accounts: ClearExpiredOrderbookAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.marketProductGroup, isSigner: false, isWritable: false },
    { pubkey: accounts.product, isSigner: false, isWritable: false },
    { pubkey: accounts.aaobProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.orderbook, isSigner: false, isWritable: true },
    { pubkey: accounts.marketSigner, isSigner: false, isWritable: false },
    { pubkey: accounts.eventQueue, isSigner: false, isWritable: true },
    { pubkey: accounts.bids, isSigner: false, isWritable: true },
    { pubkey: accounts.asks, isSigner: false, isWritable: true }
  ]
  const identifier = Buffer.from([84, 101, 137, 18, 60, 191, 169, 5])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      params: types.ClearExpiredOrderbookParams.toEncodable(args.params)
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
