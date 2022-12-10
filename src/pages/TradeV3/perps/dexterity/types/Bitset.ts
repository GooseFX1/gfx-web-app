import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface BitsetFields {
  inner: Array<BN>
}

export interface BitsetJSON {
  inner: Array<string>
}

export class Bitset {
  readonly inner: Array<BN>

  constructor(fields: BitsetFields) {
    this.inner = fields.inner
  }

  static layout(property?: string) {
    return borsh.struct([borsh.array(borsh.u128(), 2, "inner")], property)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new Bitset({
      inner: obj.inner,
    })
  }

  static toEncodable(fields: BitsetFields) {
    return {
      inner: fields.inner,
    }
  }

  toJSON(): BitsetJSON {
    return {
      inner: this.inner.map((item) => item.toString()),
    }
  }

  static fromJSON(obj: BitsetJSON): Bitset {
    return new Bitset({
      inner: obj.inner.map((item) => new BN(item)),
    })
  }

  toEncodable() {
    return Bitset.toEncodable(this)
  }
}
