import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js'
import BN from 'bn.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types' // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId'

export interface InitializeMarketProductGroupArgs {
  params: types.InitializeMarketProductGroupParamsFields
}

export interface InitializeMarketProductGroupAccounts {
  authority: PublicKey
  marketProductGroup: PublicKey
  marketProductGroupVault: PublicKey
  vaultMint: PublicKey
  feeCollector: PublicKey
  feeModelProgram: PublicKey
  feeModelConfigurationAcct: PublicKey
  riskModelConfigurationAcct: PublicKey
  riskEngineProgram: PublicKey
  sysvarRent: PublicKey
  systemProgram: PublicKey
  tokenProgram: PublicKey
  feeOutputRegister: PublicKey
  riskOutputRegister: PublicKey
}

export const layout = borsh.struct([types.InitializeMarketProductGroupParams.layout('params')])

export function initializeMarketProductGroup(
  args: InitializeMarketProductGroupArgs,
  accounts: InitializeMarketProductGroupAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
    { pubkey: accounts.marketProductGroup, isSigner: false, isWritable: true },
    {
      pubkey: accounts.marketProductGroupVault,
      isSigner: false,
      isWritable: true
    },
    { pubkey: accounts.vaultMint, isSigner: false, isWritable: false },
    { pubkey: accounts.feeCollector, isSigner: false, isWritable: false },
    { pubkey: accounts.feeModelProgram, isSigner: false, isWritable: false },
    {
      pubkey: accounts.feeModelConfigurationAcct,
      isSigner: false,
      isWritable: false
    },
    {
      pubkey: accounts.riskModelConfigurationAcct,
      isSigner: false,
      isWritable: false
    },
    { pubkey: accounts.riskEngineProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.sysvarRent, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.feeOutputRegister, isSigner: false, isWritable: false },
    { pubkey: accounts.riskOutputRegister, isSigner: false, isWritable: false }
  ]
  const identifier = Buffer.from([205, 63, 153, 255, 211, 98, 105, 230])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      params: types.InitializeMarketProductGroupParams.toEncodable(args.params)
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
