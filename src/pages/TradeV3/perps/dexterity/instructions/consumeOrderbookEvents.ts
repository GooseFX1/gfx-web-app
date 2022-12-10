import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js'
import BN from 'bn.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types' // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId'

export interface ConsumeOrderbookEventsArgs {
  params: types.ConsumeOrderbookEventsParamsFields
}

export interface ConsumeOrderbookEventsAccounts {
  aaobProgram: PublicKey
  marketProductGroup: PublicKey
  product: PublicKey
  marketSigner: PublicKey
  orderbook: PublicKey
  eventQueue: PublicKey
  rewardTarget: PublicKey
  feeModelProgram: PublicKey
  feeModelConfigurationAcct: PublicKey
  feeOutputRegister: PublicKey
  riskAndFeeSigner: PublicKey
}

export const layout = borsh.struct([types.ConsumeOrderbookEventsParams.layout('params')])

export function consumeOrderbookEvents(
  args: ConsumeOrderbookEventsArgs,
  accounts: ConsumeOrderbookEventsAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.aaobProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.marketProductGroup, isSigner: false, isWritable: true },
    { pubkey: accounts.product, isSigner: false, isWritable: false },
    { pubkey: accounts.marketSigner, isSigner: false, isWritable: false },
    { pubkey: accounts.orderbook, isSigner: false, isWritable: true },
    { pubkey: accounts.eventQueue, isSigner: false, isWritable: true },
    { pubkey: accounts.rewardTarget, isSigner: true, isWritable: true },
    { pubkey: accounts.feeModelProgram, isSigner: false, isWritable: false },
    {
      pubkey: accounts.feeModelConfigurationAcct,
      isSigner: false,
      isWritable: false
    },
    { pubkey: accounts.feeOutputRegister, isSigner: false, isWritable: true },
    { pubkey: accounts.riskAndFeeSigner, isSigner: false, isWritable: false }
  ]
  const identifier = Buffer.from([120, 196, 162, 196, 108, 131, 233, 235])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      params: types.ConsumeOrderbookEventsParams.toEncodable(args.params)
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
