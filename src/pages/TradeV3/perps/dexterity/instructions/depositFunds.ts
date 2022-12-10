import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js'
import BN from 'bn.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types' // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId'

export interface DepositFundsArgs {
  params: types.DepositFundsParamsFields
}

export interface DepositFundsAccounts {
  tokenProgram: PublicKey
  user: PublicKey
  userTokenAccount: PublicKey
  traderRiskGroup: PublicKey
  marketProductGroup: PublicKey
  marketProductGroupVault: PublicKey
}

export const layout = borsh.struct([types.DepositFundsParams.layout('params')])

export function depositFunds(args: DepositFundsArgs, accounts: DepositFundsAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.user, isSigner: true, isWritable: false },
    { pubkey: accounts.userTokenAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.traderRiskGroup, isSigner: false, isWritable: true },
    { pubkey: accounts.marketProductGroup, isSigner: false, isWritable: false },
    {
      pubkey: accounts.marketProductGroupVault,
      isSigner: false,
      isWritable: true
    }
  ]
  const identifier = Buffer.from([202, 39, 52, 211, 53, 20, 250, 88])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      params: types.DepositFundsParams.toEncodable(args.params)
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
