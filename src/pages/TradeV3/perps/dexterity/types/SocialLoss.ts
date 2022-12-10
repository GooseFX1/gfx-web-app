import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface SocialLossFields {
  productIndex: types.usizeFields
  amount: types.FractionalFields
}

export interface SocialLossJSON {
  productIndex: types.usizeJSON
  amount: types.FractionalJSON
}

export class SocialLoss {
  readonly productIndex: types.usize
  readonly amount: types.Fractional

  constructor(fields: SocialLossFields) {
    this.productIndex = new types.usize({ ...fields.productIndex })
    this.amount = new types.Fractional({ ...fields.amount })
  }

  static layout(property?: string) {
    return borsh.struct(
      [types.usize.layout("productIndex"), types.Fractional.layout("amount")],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new SocialLoss({
      productIndex: types.usize.fromDecoded(obj.productIndex),
      amount: types.Fractional.fromDecoded(obj.amount),
    })
  }

  static toEncodable(fields: SocialLossFields) {
    return {
      productIndex: types.usize.toEncodable(fields.productIndex),
      amount: types.Fractional.toEncodable(fields.amount),
    }
  }

  toJSON(): SocialLossJSON {
    return {
      productIndex: this.productIndex.toJSON(),
      amount: this.amount.toJSON(),
    }
  }

  static fromJSON(obj: SocialLossJSON): SocialLoss {
    return new SocialLoss({
      productIndex: types.usize.fromJSON(obj.productIndex),
      amount: types.Fractional.fromJSON(obj.amount),
    })
  }

  toEncodable() {
    return SocialLoss.toEncodable(this)
  }
}
