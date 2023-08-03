import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types' // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId'

export interface SweepFeesAccounts {
  marketProductGroup: PublicKey
  feeCollector: PublicKey
  marketProductGroupVault: PublicKey
  feeCollectorTokenAccount: PublicKey
  tokenProgram: PublicKey
}

export function sweepFees(accounts: SweepFeesAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.marketProductGroup, isSigner: false, isWritable: true },
    { pubkey: accounts.feeCollector, isSigner: false, isWritable: false },
    {
      pubkey: accounts.marketProductGroupVault,
      isSigner: false,
      isWritable: true
    },
    {
      pubkey: accounts.feeCollectorTokenAccount,
      isSigner: false,
      isWritable: true
    },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false }
  ]
  const identifier = Buffer.from([175, 225, 98, 71, 118, 66, 34, 148])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
