import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface ParamsFields {
  quantity: types.FractionalFields
}

export interface ParamsJSON {
  quantity: types.FractionalJSON
}

export class Params {
  readonly quantity: types.Fractional

  constructor(fields: ParamsFields) {
    this.quantity = new types.Fractional({ ...fields.quantity })
  }

  static layout(property?: string) {
    return borsh.struct([types.Fractional.layout("quantity")], property)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new Params({
      quantity: types.Fractional.fromDecoded(obj.quantity),
    })
  }

  static toEncodable(fields: ParamsFields) {
    return {
      quantity: types.Fractional.toEncodable(fields.quantity),
    }
  }

  toJSON(): ParamsJSON {
    return {
      quantity: this.quantity.toJSON(),
    }
  }

  static fromJSON(obj: ParamsJSON): Params {
    return new Params({
      quantity: types.Fractional.fromJSON(obj.quantity),
    })
  }

  toEncodable() {
    return Params.toEncodable(this)
  }
}
