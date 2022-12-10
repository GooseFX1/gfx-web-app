import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface ClearExpiredOrderbookParamsFields {
  numOrdersToCancel: number
}

export interface ClearExpiredOrderbookParamsJSON {
  numOrdersToCancel: number
}

export class ClearExpiredOrderbookParams {
  readonly numOrdersToCancel: number

  constructor(fields: ClearExpiredOrderbookParamsFields) {
    this.numOrdersToCancel = fields.numOrdersToCancel
  }

  static layout(property?: string) {
    return borsh.struct([borsh.u8("numOrdersToCancel")], property)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new ClearExpiredOrderbookParams({
      numOrdersToCancel: obj.numOrdersToCancel,
    })
  }

  static toEncodable(fields: ClearExpiredOrderbookParamsFields) {
    return {
      numOrdersToCancel: fields.numOrdersToCancel,
    }
  }

  toJSON(): ClearExpiredOrderbookParamsJSON {
    return {
      numOrdersToCancel: this.numOrdersToCancel,
    }
  }

  static fromJSON(
    obj: ClearExpiredOrderbookParamsJSON
  ): ClearExpiredOrderbookParams {
    return new ClearExpiredOrderbookParams({
      numOrdersToCancel: obj.numOrdersToCancel,
    })
  }

  toEncodable() {
    return ClearExpiredOrderbookParams.toEncodable(this)
  }
}
