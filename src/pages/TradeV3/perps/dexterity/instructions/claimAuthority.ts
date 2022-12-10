import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js'
import BN from 'bn.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types' // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId'

export interface ClaimAuthorityAccounts {
  marketProductGroup: PublicKey
  newAuthority: PublicKey
}

export function claimAuthority(accounts: ClaimAuthorityAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.marketProductGroup, isSigner: false, isWritable: true },
    { pubkey: accounts.newAuthority, isSigner: true, isWritable: false }
  ]
  const identifier = Buffer.from([222, 132, 185, 123, 127, 107, 6, 31])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
