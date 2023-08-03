import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types' // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId'

export interface TransferFullPositionAccounts {
  liquidator: PublicKey
  marketProductGroup: PublicKey
  liquidateeRiskGroup: PublicKey
  liquidatorRiskGroup: PublicKey
  riskEngineProgram: PublicKey
  riskModelConfigurationAcct: PublicKey
  riskOutputRegister: PublicKey
  liquidatorRiskStateAccountInfo: PublicKey
  liquidateeRiskStateAccountInfo: PublicKey
  riskSigner: PublicKey
}

export function transferFullPosition(accounts: TransferFullPositionAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.liquidator, isSigner: true, isWritable: false },
    { pubkey: accounts.marketProductGroup, isSigner: false, isWritable: true },
    { pubkey: accounts.liquidateeRiskGroup, isSigner: false, isWritable: true },
    { pubkey: accounts.liquidatorRiskGroup, isSigner: false, isWritable: true },
    { pubkey: accounts.riskEngineProgram, isSigner: false, isWritable: false },
    {
      pubkey: accounts.riskModelConfigurationAcct,
      isSigner: false,
      isWritable: false
    },
    { pubkey: accounts.riskOutputRegister, isSigner: false, isWritable: true },
    {
      pubkey: accounts.liquidatorRiskStateAccountInfo,
      isSigner: false,
      isWritable: true
    },
    {
      pubkey: accounts.liquidateeRiskStateAccountInfo,
      isSigner: false,
      isWritable: true
    },
    { pubkey: accounts.riskSigner, isSigner: false, isWritable: false }
  ]
  const identifier = Buffer.from([51, 40, 183, 130, 57, 159, 227, 11])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
