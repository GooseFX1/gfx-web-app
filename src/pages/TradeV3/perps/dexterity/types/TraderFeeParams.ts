import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface TraderFeeParamsFields {
  side: types.SideKind
  isAggressor: boolean
  matchedQuoteQty: types.FractionalFields
  matchedBaseQty: types.FractionalFields
  product: PublicKey
}

export interface TraderFeeParamsJSON {
  side: types.SideJSON
  isAggressor: boolean
  matchedQuoteQty: types.FractionalJSON
  matchedBaseQty: types.FractionalJSON
  product: string
}

export class TraderFeeParams {
  readonly side: types.SideKind
  readonly isAggressor: boolean
  readonly matchedQuoteQty: types.Fractional
  readonly matchedBaseQty: types.Fractional
  readonly product: PublicKey

  constructor(fields: TraderFeeParamsFields) {
    this.side = fields.side
    this.isAggressor = fields.isAggressor
    this.matchedQuoteQty = new types.Fractional({ ...fields.matchedQuoteQty })
    this.matchedBaseQty = new types.Fractional({ ...fields.matchedBaseQty })
    this.product = fields.product
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        types.Side.layout("side"),
        borsh.bool("isAggressor"),
        types.Fractional.layout("matchedQuoteQty"),
        types.Fractional.layout("matchedBaseQty"),
        borsh.publicKey("product"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new TraderFeeParams({
      side: types.Side.fromDecoded(obj.side),
      isAggressor: obj.isAggressor,
      matchedQuoteQty: types.Fractional.fromDecoded(obj.matchedQuoteQty),
      matchedBaseQty: types.Fractional.fromDecoded(obj.matchedBaseQty),
      product: obj.product,
    })
  }

  static toEncodable(fields: TraderFeeParamsFields) {
    return {
      side: fields.side.toEncodable(),
      isAggressor: fields.isAggressor,
      matchedQuoteQty: types.Fractional.toEncodable(fields.matchedQuoteQty),
      matchedBaseQty: types.Fractional.toEncodable(fields.matchedBaseQty),
      product: fields.product,
    }
  }

  toJSON(): TraderFeeParamsJSON {
    return {
      side: this.side.toJSON(),
      isAggressor: this.isAggressor,
      matchedQuoteQty: this.matchedQuoteQty.toJSON(),
      matchedBaseQty: this.matchedBaseQty.toJSON(),
      product: this.product.toString(),
    }
  }

  static fromJSON(obj: TraderFeeParamsJSON): TraderFeeParams {
    return new TraderFeeParams({
      side: types.Side.fromJSON(obj.side),
      isAggressor: obj.isAggressor,
      matchedQuoteQty: types.Fractional.fromJSON(obj.matchedQuoteQty),
      matchedBaseQty: types.Fractional.fromJSON(obj.matchedBaseQty),
      product: new PublicKey(obj.product),
    })
  }

  toEncodable() {
    return TraderFeeParams.toEncodable(this)
  }
}
