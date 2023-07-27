import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js'
import BN from 'bn.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types' // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId'

export interface WithdrawFundsArgs {
  params: types.WithdrawFundsParamsFields
}

export interface WithdrawFundsAccounts {
  tokenProgram: PublicKey
  user: PublicKey
  userTokenAccount: PublicKey
  traderRiskGroup: PublicKey
  marketProductGroup: PublicKey
  marketProductGroupVault: PublicKey
  riskEngineProgram: PublicKey
  riskModelConfigurationAcct: PublicKey
  riskOutputRegister: PublicKey
  traderRiskStateAcct: PublicKey
  riskSigner: PublicKey
}

export const layout = borsh.struct([types.WithdrawFundsParams.layout('params')])

export function withdrawFunds(args: WithdrawFundsArgs, accounts: WithdrawFundsAccounts) {
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
    },
    { pubkey: accounts.riskEngineProgram, isSigner: false, isWritable: false },
    {
      pubkey: accounts.riskModelConfigurationAcct,
      isSigner: false,
      isWritable: false
    },
    { pubkey: accounts.riskOutputRegister, isSigner: false, isWritable: true },
    { pubkey: accounts.traderRiskStateAcct, isSigner: false, isWritable: true },
    { pubkey: accounts.riskSigner, isSigner: false, isWritable: false }
  ]
  const identifier = Buffer.from([241, 36, 29, 111, 208, 31, 104, 217])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      params: types.WithdrawFundsParams.toEncodable(args.params)
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
