import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface ProductMetadataFields {
  bump: BN
  productKey: PublicKey
  name: Array<number>
  orderbook: PublicKey
  tickSize: types.FractionalFields
  baseDecimals: BN
  priceOffset: types.FractionalFields
  contractVolume: types.FractionalFields
  prices: types.PriceEwmaFields
}

export interface ProductMetadataJSON {
  bump: string
  productKey: string
  name: Array<number>
  orderbook: string
  tickSize: types.FractionalJSON
  baseDecimals: string
  priceOffset: types.FractionalJSON
  contractVolume: types.FractionalJSON
  prices: types.PriceEwmaJSON
}

export class ProductMetadata {
  readonly bump: BN
  readonly productKey: PublicKey
  readonly name: Array<number>
  readonly orderbook: PublicKey
  readonly tickSize: types.Fractional
  readonly baseDecimals: BN
  readonly priceOffset: types.Fractional
  readonly contractVolume: types.Fractional
  readonly prices: types.PriceEwma

  constructor(fields: ProductMetadataFields) {
    this.bump = fields.bump
    this.productKey = fields.productKey
    this.name = fields.name
    this.orderbook = fields.orderbook
    this.tickSize = new types.Fractional({ ...fields.tickSize })
    this.baseDecimals = fields.baseDecimals
    this.priceOffset = new types.Fractional({ ...fields.priceOffset })
    this.contractVolume = new types.Fractional({ ...fields.contractVolume })
    this.prices = new types.PriceEwma({ ...fields.prices })
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.u64("bump"),
        borsh.publicKey("productKey"),
        borsh.array(borsh.u8(), 16, "name"),
        borsh.publicKey("orderbook"),
        types.Fractional.layout("tickSize"),
        borsh.u64("baseDecimals"),
        types.Fractional.layout("priceOffset"),
        types.Fractional.layout("contractVolume"),
        types.PriceEwma.layout("prices"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new ProductMetadata({
      bump: obj.bump,
      productKey: obj.productKey,
      name: obj.name,
      orderbook: obj.orderbook,
      tickSize: types.Fractional.fromDecoded(obj.tickSize),
      baseDecimals: obj.baseDecimals,
      priceOffset: types.Fractional.fromDecoded(obj.priceOffset),
      contractVolume: types.Fractional.fromDecoded(obj.contractVolume),
      prices: types.PriceEwma.fromDecoded(obj.prices),
    })
  }

  static toEncodable(fields: ProductMetadataFields) {
    return {
      bump: fields.bump,
      productKey: fields.productKey,
      name: fields.name,
      orderbook: fields.orderbook,
      tickSize: types.Fractional.toEncodable(fields.tickSize),
      baseDecimals: fields.baseDecimals,
      priceOffset: types.Fractional.toEncodable(fields.priceOffset),
      contractVolume: types.Fractional.toEncodable(fields.contractVolume),
      prices: types.PriceEwma.toEncodable(fields.prices),
    }
  }

  toJSON(): ProductMetadataJSON {
    return {
      bump: this.bump.toString(),
      productKey: this.productKey.toString(),
      name: this.name,
      orderbook: this.orderbook.toString(),
      tickSize: this.tickSize.toJSON(),
      baseDecimals: this.baseDecimals.toString(),
      priceOffset: this.priceOffset.toJSON(),
      contractVolume: this.contractVolume.toJSON(),
      prices: this.prices.toJSON(),
    }
  }

  static fromJSON(obj: ProductMetadataJSON): ProductMetadata {
    return new ProductMetadata({
      bump: new BN(obj.bump),
      productKey: new PublicKey(obj.productKey),
      name: obj.name,
      orderbook: new PublicKey(obj.orderbook),
      tickSize: types.Fractional.fromJSON(obj.tickSize),
      baseDecimals: new BN(obj.baseDecimals),
      priceOffset: types.Fractional.fromJSON(obj.priceOffset),
      contractVolume: types.Fractional.fromJSON(obj.contractVolume),
      prices: types.PriceEwma.fromJSON(obj.prices),
    })
  }

  toEncodable() {
    return ProductMetadata.toEncodable(this)
  }
}
