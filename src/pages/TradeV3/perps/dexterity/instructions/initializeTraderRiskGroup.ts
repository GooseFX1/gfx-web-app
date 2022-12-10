import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js'
import BN from 'bn.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types' // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId'

export interface InitializeTraderRiskGroupAccounts {
  owner: PublicKey
  traderRiskGroup: PublicKey
  marketProductGroup: PublicKey
  riskSigner: PublicKey
  traderRiskStateAcct: PublicKey
  traderFeeStateAcct: PublicKey
  riskEngineProgram: PublicKey
  systemProgram: PublicKey
}

export function initializeTraderRiskGroup(accounts: InitializeTraderRiskGroupAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.owner, isSigner: true, isWritable: true },
    { pubkey: accounts.traderRiskGroup, isSigner: false, isWritable: true },
    { pubkey: accounts.marketProductGroup, isSigner: false, isWritable: false },
    { pubkey: accounts.riskSigner, isSigner: false, isWritable: false },
    { pubkey: accounts.traderRiskStateAcct, isSigner: true, isWritable: true },
    { pubkey: accounts.traderFeeStateAcct, isSigner: false, isWritable: false },
    { pubkey: accounts.riskEngineProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false }
  ]
  const identifier = Buffer.from([67, 2, 57, 43, 64, 121, 163, 59])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
