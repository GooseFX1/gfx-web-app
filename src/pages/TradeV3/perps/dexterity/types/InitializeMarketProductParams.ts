import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface InitializeMarketProductParamsFields {
  name: Array<number>
  tickSize: types.FractionalFields
  baseDecimals: BN
  priceOffset: types.FractionalFields
}

export interface InitializeMarketProductParamsJSON {
  name: Array<number>
  tickSize: types.FractionalJSON
  baseDecimals: string
  priceOffset: types.FractionalJSON
}

export class InitializeMarketProductParams {
  readonly name: Array<number>
  readonly tickSize: types.Fractional
  readonly baseDecimals: BN
  readonly priceOffset: types.Fractional

  constructor(fields: InitializeMarketProductParamsFields) {
    this.name = fields.name
    this.tickSize = new types.Fractional({ ...fields.tickSize })
    this.baseDecimals = fields.baseDecimals
    this.priceOffset = new types.Fractional({ ...fields.priceOffset })
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.array(borsh.u8(), 16, "name"),
        types.Fractional.layout("tickSize"),
        borsh.u64("baseDecimals"),
        types.Fractional.layout("priceOffset"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new InitializeMarketProductParams({
      name: obj.name,
      tickSize: types.Fractional.fromDecoded(obj.tickSize),
      baseDecimals: obj.baseDecimals,
      priceOffset: types.Fractional.fromDecoded(obj.priceOffset),
    })
  }

  static toEncodable(fields: InitializeMarketProductParamsFields) {
    return {
      name: fields.name,
      tickSize: types.Fractional.toEncodable(fields.tickSize),
      baseDecimals: fields.baseDecimals,
      priceOffset: types.Fractional.toEncodable(fields.priceOffset),
    }
  }

  toJSON(): InitializeMarketProductParamsJSON {
    return {
      name: this.name,
      tickSize: this.tickSize.toJSON(),
      baseDecimals: this.baseDecimals.toString(),
      priceOffset: this.priceOffset.toJSON(),
    }
  }

  static fromJSON(
    obj: InitializeMarketProductParamsJSON
  ): InitializeMarketProductParams {
    return new InitializeMarketProductParams({
      name: obj.name,
      tickSize: types.Fractional.fromJSON(obj.tickSize),
      baseDecimals: new BN(obj.baseDecimals),
      priceOffset: types.Fractional.fromJSON(obj.priceOffset),
    })
  }

  toEncodable() {
    return InitializeMarketProductParams.toEncodable(this)
  }
}
