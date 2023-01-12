import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface AveragePositionFields {
  qty: types.FractionalFields
  price: types.FractionalFields
}

export interface AveragePositionJSON {
  qty: types.FractionalJSON
  price: types.FractionalJSON
}

export class AveragePosition {
  readonly qty: types.Fractional
  readonly price: types.Fractional

  constructor(fields: AveragePositionFields) {
    this.qty = new types.Fractional({ ...fields.qty })
    this.price = new types.Fractional({ ...fields.price })
  }

  static layout(property?: string) {
    return borsh.struct(
      [types.Fractional.layout("qty"), types.Fractional.layout("price")],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new AveragePosition({
      qty: types.Fractional.fromDecoded(obj.qty),
      price: types.Fractional.fromDecoded(obj.price),
    })
  }

  static toEncodable(fields: AveragePositionFields) {
    return {
      qty: types.Fractional.toEncodable(fields.qty),
      price: types.Fractional.toEncodable(fields.price),
    }
  }

  toJSON(): AveragePositionJSON {
    return {
      qty: this.qty.toJSON(),
      price: this.price.toJSON(),
    }
  }

  static fromJSON(obj: AveragePositionJSON): AveragePosition {
    return new AveragePosition({
      qty: types.Fractional.fromJSON(obj.qty),
      price: types.Fractional.fromJSON(obj.price),
    })
  }

  toEncodable() {
    return AveragePosition.toEncodable(this)
  }
}
