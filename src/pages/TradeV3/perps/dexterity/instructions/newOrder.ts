import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js'
import BN from 'bn.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types' // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId'

export interface NewOrderArgs {
  params: types.NewOrderParamsFields
}

export interface NewOrderAccounts {
  user: PublicKey
  traderRiskGroup: PublicKey
  marketProductGroup: PublicKey
  product: PublicKey
  aaobProgram: PublicKey
  orderbook: PublicKey
  marketSigner: PublicKey
  eventQueue: PublicKey
  bids: PublicKey
  asks: PublicKey
  systemProgram: PublicKey
  feeModelProgram: PublicKey
  feeModelConfigurationAcct: PublicKey
  traderFeeStateAcct: PublicKey
  feeOutputRegister: PublicKey
  riskEngineProgram: PublicKey
  riskModelConfigurationAcct: PublicKey
  riskOutputRegister: PublicKey
  traderRiskStateAcct: PublicKey
  riskAndFeeSigner: PublicKey
}

export const layout = borsh.struct([types.NewOrderParams.layout('params')])

export function newOrder(args: NewOrderArgs, accounts: NewOrderAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.user, isSigner: true, isWritable: true },
    { pubkey: accounts.traderRiskGroup, isSigner: false, isWritable: true },
    { pubkey: accounts.marketProductGroup, isSigner: false, isWritable: true },
    { pubkey: accounts.product, isSigner: false, isWritable: false },
    { pubkey: accounts.aaobProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.orderbook, isSigner: false, isWritable: true },
    { pubkey: accounts.marketSigner, isSigner: false, isWritable: false },
    { pubkey: accounts.eventQueue, isSigner: false, isWritable: true },
    { pubkey: accounts.bids, isSigner: false, isWritable: true },
    { pubkey: accounts.asks, isSigner: false, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.feeModelProgram, isSigner: false, isWritable: false },
    {
      pubkey: accounts.feeModelConfigurationAcct,
      isSigner: false,
      isWritable: false
    },
    { pubkey: accounts.traderFeeStateAcct, isSigner: false, isWritable: true },
    { pubkey: accounts.feeOutputRegister, isSigner: false, isWritable: true },
    { pubkey: accounts.riskEngineProgram, isSigner: false, isWritable: false },
    {
      pubkey: accounts.riskModelConfigurationAcct,
      isSigner: false,
      isWritable: false
    },
    { pubkey: accounts.riskOutputRegister, isSigner: false, isWritable: true },
    { pubkey: accounts.traderRiskStateAcct, isSigner: false, isWritable: true },
    { pubkey: accounts.riskAndFeeSigner, isSigner: false, isWritable: false }
  ]
  const identifier = Buffer.from([153, 0, 116, 34, 241, 46, 40, 139])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      params: types.NewOrderParams.toEncodable(args.params)
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
