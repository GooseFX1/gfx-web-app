import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface FractionalFields {
  m: BN
  exp: BN
}

export interface FractionalJSON {
  m: string
  exp: string
}

export class Fractional {
  readonly m: BN
  readonly exp: BN

  constructor(fields: FractionalFields) {
    this.m = fields.m
    this.exp = fields.exp
  }

  static layout(property?: string) {
    return borsh.struct([borsh.i64("m"), borsh.u64("exp")], property)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new Fractional({
      m: obj.m,
      exp: obj.exp,
    })
  }

  static toEncodable(fields: FractionalFields) {
    return {
      m: fields.m,
      exp: fields.exp,
    }
  }

  toJSON(): FractionalJSON {
    return {
      m: this.m.toString(),
      exp: this.exp.toString(),
    }
  }

  static fromJSON(obj: FractionalJSON): Fractional {
    return new Fractional({
      m: new BN(obj.m),
      exp: new BN(obj.exp),
    })
  }

  toEncodable() {
    return Fractional.toEncodable(this)
  }
}
