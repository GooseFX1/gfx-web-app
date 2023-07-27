import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js'
import BN from 'bn.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types' // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId'

export interface InitializeComboArgs {
  params: types.InitializeComboParamsFields
}

export interface InitializeComboAccounts {
  authority: PublicKey
  marketProductGroup: PublicKey
  orderbook: PublicKey
}

export const layout = borsh.struct([types.InitializeComboParams.layout('params')])

export function initializeCombo(args: InitializeComboArgs, accounts: InitializeComboAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
    { pubkey: accounts.marketProductGroup, isSigner: false, isWritable: true },
    { pubkey: accounts.orderbook, isSigner: false, isWritable: false }
  ]
  const identifier = Buffer.from([84, 20, 231, 12, 5, 14, 184, 26])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      params: types.InitializeComboParams.toEncodable(args.params)
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
