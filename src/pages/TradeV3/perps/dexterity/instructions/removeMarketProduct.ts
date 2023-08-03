import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types' // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId'

export interface RemoveMarketProductAccounts {
  authority: PublicKey
  marketProductGroup: PublicKey
  product: PublicKey
  aaobProgram: PublicKey
  orderbook: PublicKey
  marketSigner: PublicKey
  eventQueue: PublicKey
  bids: PublicKey
  asks: PublicKey
}

export function removeMarketProduct(accounts: RemoveMarketProductAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
    { pubkey: accounts.marketProductGroup, isSigner: false, isWritable: true },
    { pubkey: accounts.product, isSigner: false, isWritable: false },
    { pubkey: accounts.aaobProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.orderbook, isSigner: false, isWritable: true },
    { pubkey: accounts.marketSigner, isSigner: false, isWritable: false },
    { pubkey: accounts.eventQueue, isSigner: false, isWritable: true },
    { pubkey: accounts.bids, isSigner: false, isWritable: true },
    { pubkey: accounts.asks, isSigner: false, isWritable: true }
  ]
  const identifier = Buffer.from([81, 42, 176, 121, 47, 126, 150, 219])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
