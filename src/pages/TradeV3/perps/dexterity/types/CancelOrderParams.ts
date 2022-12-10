import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface CancelOrderParamsFields {
  orderId: BN
}

export interface CancelOrderParamsJSON {
  orderId: string
}

export class CancelOrderParams {
  readonly orderId: BN

  constructor(fields: CancelOrderParamsFields) {
    this.orderId = fields.orderId
  }

  static layout(property?: string) {
    return borsh.struct([borsh.u128("orderId")], property)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new CancelOrderParams({
      orderId: obj.orderId,
    })
  }

  static toEncodable(fields: CancelOrderParamsFields) {
    return {
      orderId: fields.orderId,
    }
  }

  toJSON(): CancelOrderParamsJSON {
    return {
      orderId: this.orderId.toString(),
    }
  }

  static fromJSON(obj: CancelOrderParamsJSON): CancelOrderParams {
    return new CancelOrderParams({
      orderId: new BN(obj.orderId),
    })
  }

  toEncodable() {
    return CancelOrderParams.toEncodable(this)
  }
}
