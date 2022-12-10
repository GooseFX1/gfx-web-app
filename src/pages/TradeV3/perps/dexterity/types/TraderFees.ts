import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface TraderFeesFields {
  validUntil: BN
  makerFeeBps: number
  takerFeeBps: number
}

export interface TraderFeesJSON {
  validUntil: string
  makerFeeBps: number
  takerFeeBps: number
}

export class TraderFees {
  readonly validUntil: BN
  readonly makerFeeBps: number
  readonly takerFeeBps: number

  constructor(fields: TraderFeesFields) {
    this.validUntil = fields.validUntil
    this.makerFeeBps = fields.makerFeeBps
    this.takerFeeBps = fields.takerFeeBps
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.i64("validUntil"),
        borsh.i32("makerFeeBps"),
        borsh.i32("takerFeeBps"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new TraderFees({
      validUntil: obj.validUntil,
      makerFeeBps: obj.makerFeeBps,
      takerFeeBps: obj.takerFeeBps,
    })
  }

  static toEncodable(fields: TraderFeesFields) {
    return {
      validUntil: fields.validUntil,
      makerFeeBps: fields.makerFeeBps,
      takerFeeBps: fields.takerFeeBps,
    }
  }

  toJSON(): TraderFeesJSON {
    return {
      validUntil: this.validUntil.toString(),
      makerFeeBps: this.makerFeeBps,
      takerFeeBps: this.takerFeeBps,
    }
  }

  static fromJSON(obj: TraderFeesJSON): TraderFees {
    return new TraderFees({
      validUntil: new BN(obj.validUntil),
      makerFeeBps: obj.makerFeeBps,
      takerFeeBps: obj.takerFeeBps,
    })
  }

  toEncodable() {
    return TraderFees.toEncodable(this)
  }
}
