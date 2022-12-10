import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js'
import BN from 'bn.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types' // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId'

export interface InitializeMarketProductArgs {
  params: types.InitializeMarketProductParamsFields
}

export interface InitializeMarketProductAccounts {
  authority: PublicKey
  marketProductGroup: PublicKey
  product: PublicKey
  orderbook: PublicKey
}

export const layout = borsh.struct([types.InitializeMarketProductParams.layout('params')])

export function initializeMarketProduct(
  args: InitializeMarketProductArgs,
  accounts: InitializeMarketProductAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
    { pubkey: accounts.marketProductGroup, isSigner: false, isWritable: true },
    { pubkey: accounts.product, isSigner: false, isWritable: false },
    { pubkey: accounts.orderbook, isSigner: false, isWritable: false }
  ]
  const identifier = Buffer.from([129, 185, 94, 198, 22, 151, 184, 131])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      params: types.InitializeMarketProductParams.toEncodable(args.params)
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
