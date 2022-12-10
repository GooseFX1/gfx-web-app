import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface InitializeComboParamsFields {
  name: Array<number>
  tickSize: types.FractionalFields
  priceOffset: types.FractionalFields
  baseDecimals: BN
  ratios: Array<number>
}

export interface InitializeComboParamsJSON {
  name: Array<number>
  tickSize: types.FractionalJSON
  priceOffset: types.FractionalJSON
  baseDecimals: string
  ratios: Array<number>
}

export class InitializeComboParams {
  readonly name: Array<number>
  readonly tickSize: types.Fractional
  readonly priceOffset: types.Fractional
  readonly baseDecimals: BN
  readonly ratios: Array<number>

  constructor(fields: InitializeComboParamsFields) {
    this.name = fields.name
    this.tickSize = new types.Fractional({ ...fields.tickSize })
    this.priceOffset = new types.Fractional({ ...fields.priceOffset })
    this.baseDecimals = fields.baseDecimals
    this.ratios = fields.ratios
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.array(borsh.u8(), 16, "name"),
        types.Fractional.layout("tickSize"),
        types.Fractional.layout("priceOffset"),
        borsh.u64("baseDecimals"),
        borsh.vec(borsh.i8(), "ratios"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new InitializeComboParams({
      name: obj.name,
      tickSize: types.Fractional.fromDecoded(obj.tickSize),
      priceOffset: types.Fractional.fromDecoded(obj.priceOffset),
      baseDecimals: obj.baseDecimals,
      ratios: obj.ratios,
    })
  }

  static toEncodable(fields: InitializeComboParamsFields) {
    return {
      name: fields.name,
      tickSize: types.Fractional.toEncodable(fields.tickSize),
      priceOffset: types.Fractional.toEncodable(fields.priceOffset),
      baseDecimals: fields.baseDecimals,
      ratios: fields.ratios,
    }
  }

  toJSON(): InitializeComboParamsJSON {
    return {
      name: this.name,
      tickSize: this.tickSize.toJSON(),
      priceOffset: this.priceOffset.toJSON(),
      baseDecimals: this.baseDecimals.toString(),
      ratios: this.ratios,
    }
  }

  static fromJSON(obj: InitializeComboParamsJSON): InitializeComboParams {
    return new InitializeComboParams({
      name: obj.name,
      tickSize: types.Fractional.fromJSON(obj.tickSize),
      priceOffset: types.Fractional.fromJSON(obj.priceOffset),
      baseDecimals: new BN(obj.baseDecimals),
      ratios: obj.ratios,
    })
  }

  toEncodable() {
    return InitializeComboParams.toEncodable(this)
  }
}
