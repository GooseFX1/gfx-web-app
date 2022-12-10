import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface LegFields {
  productIndex: types.usizeFields
  productKey: PublicKey
  ratio: BN
}

export interface LegJSON {
  productIndex: types.usizeJSON
  productKey: string
  ratio: string
}

export class Leg {
  readonly productIndex: types.usize
  readonly productKey: PublicKey
  readonly ratio: BN

  constructor(fields: LegFields) {
    this.productIndex = new types.usize({ ...fields.productIndex })
    this.productKey = fields.productKey
    this.ratio = fields.ratio
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        types.usize.layout("productIndex"),
        borsh.publicKey("productKey"),
        borsh.i64("ratio"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new Leg({
      productIndex: types.usize.fromDecoded(obj.productIndex),
      productKey: obj.productKey,
      ratio: obj.ratio,
    })
  }

  static toEncodable(fields: LegFields) {
    return {
      productIndex: types.usize.toEncodable(fields.productIndex),
      productKey: fields.productKey,
      ratio: fields.ratio,
    }
  }

  toJSON(): LegJSON {
    return {
      productIndex: this.productIndex.toJSON(),
      productKey: this.productKey.toString(),
      ratio: this.ratio.toString(),
    }
  }

  static fromJSON(obj: LegJSON): Leg {
    return new Leg({
      productIndex: types.usize.fromJSON(obj.productIndex),
      productKey: new PublicKey(obj.productKey),
      ratio: new BN(obj.ratio),
    })
  }

  toEncodable() {
    return Leg.toEncodable(this)
  }
}
