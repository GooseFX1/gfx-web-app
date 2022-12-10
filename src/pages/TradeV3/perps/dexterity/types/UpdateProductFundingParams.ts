import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface UpdateProductFundingParamsFields {
  amount: types.FractionalFields
  expired: boolean
}

export interface UpdateProductFundingParamsJSON {
  amount: types.FractionalJSON
  expired: boolean
}

export class UpdateProductFundingParams {
  readonly amount: types.Fractional
  readonly expired: boolean

  constructor(fields: UpdateProductFundingParamsFields) {
    this.amount = new types.Fractional({ ...fields.amount })
    this.expired = fields.expired
  }

  static layout(property?: string) {
    return borsh.struct(
      [types.Fractional.layout("amount"), borsh.bool("expired")],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new UpdateProductFundingParams({
      amount: types.Fractional.fromDecoded(obj.amount),
      expired: obj.expired,
    })
  }

  static toEncodable(fields: UpdateProductFundingParamsFields) {
    return {
      amount: types.Fractional.toEncodable(fields.amount),
      expired: fields.expired,
    }
  }

  toJSON(): UpdateProductFundingParamsJSON {
    return {
      amount: this.amount.toJSON(),
      expired: this.expired,
    }
  }

  static fromJSON(
    obj: UpdateProductFundingParamsJSON
  ): UpdateProductFundingParams {
    return new UpdateProductFundingParams({
      amount: types.Fractional.fromJSON(obj.amount),
      expired: obj.expired,
    })
  }

  toEncodable() {
    return UpdateProductFundingParams.toEncodable(this)
  }
}
