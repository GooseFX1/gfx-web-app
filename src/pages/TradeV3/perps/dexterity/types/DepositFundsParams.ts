import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface DepositFundsParamsFields {
  quantity: types.FractionalFields
}

export interface DepositFundsParamsJSON {
  quantity: types.FractionalJSON
}

export class DepositFundsParams {
  readonly quantity: types.Fractional

  constructor(fields: DepositFundsParamsFields) {
    this.quantity = new types.Fractional({ ...fields.quantity })
  }

  static layout(property?: string) {
    return borsh.struct([types.Fractional.layout("quantity")], property)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new DepositFundsParams({
      quantity: types.Fractional.fromDecoded(obj.quantity),
    })
  }

  static toEncodable(fields: DepositFundsParamsFields) {
    return {
      quantity: types.Fractional.toEncodable(fields.quantity),
    }
  }

  toJSON(): DepositFundsParamsJSON {
    return {
      quantity: this.quantity.toJSON(),
    }
  }

  static fromJSON(obj: DepositFundsParamsJSON): DepositFundsParams {
    return new DepositFundsParams({
      quantity: types.Fractional.fromJSON(obj.quantity),
    })
  }

  toEncodable() {
    return DepositFundsParams.toEncodable(this)
  }
}
