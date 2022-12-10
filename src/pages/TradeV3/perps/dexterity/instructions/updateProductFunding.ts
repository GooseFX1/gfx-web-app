import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface UpdateProductFundingArgs {
  params: types.UpdateProductFundingParamsFields
}

export interface UpdateProductFundingAccounts {
  marketProductGroup: PublicKey
  product: PublicKey
}

export const layout = borsh.struct([
  types.UpdateProductFundingParams.layout("params"),
])

export function updateProductFunding(
  args: UpdateProductFundingArgs,
  accounts: UpdateProductFundingAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.marketProductGroup, isSigner: false, isWritable: true },
    { pubkey: accounts.product, isSigner: true, isWritable: false },
  ]
  const identifier = Buffer.from([169, 234, 204, 38, 136, 120, 2, 235])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      params: types.UpdateProductFundingParams.toEncodable(args.params),
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
