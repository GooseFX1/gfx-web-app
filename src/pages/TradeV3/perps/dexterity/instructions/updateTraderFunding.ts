import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types' // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId'

export interface UpdateTraderFundingAccounts {
  marketProductGroup: PublicKey
  traderRiskGroup: PublicKey
}

export function updateTraderFunding(accounts: UpdateTraderFundingAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.marketProductGroup, isSigner: false, isWritable: true },
    { pubkey: accounts.traderRiskGroup, isSigner: false, isWritable: true }
  ]
  const identifier = Buffer.from([169, 208, 109, 105, 69, 105, 3, 131])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
