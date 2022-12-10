import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface OpenOrdersMetadataFields {
  askQtyInBook: types.FractionalFields
  bidQtyInBook: types.FractionalFields
  headIndex: types.usizeFields
  numOpenOrders: BN
}

export interface OpenOrdersMetadataJSON {
  askQtyInBook: types.FractionalJSON
  bidQtyInBook: types.FractionalJSON
  headIndex: types.usizeJSON
  numOpenOrders: string
}

export class OpenOrdersMetadata {
  readonly askQtyInBook: types.Fractional
  readonly bidQtyInBook: types.Fractional
  readonly headIndex: types.usize
  readonly numOpenOrders: BN

  constructor(fields: OpenOrdersMetadataFields) {
    this.askQtyInBook = new types.Fractional({ ...fields.askQtyInBook })
    this.bidQtyInBook = new types.Fractional({ ...fields.bidQtyInBook })
    this.headIndex = new types.usize({ ...fields.headIndex })
    this.numOpenOrders = fields.numOpenOrders
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        types.Fractional.layout("askQtyInBook"),
        types.Fractional.layout("bidQtyInBook"),
        types.usize.layout("headIndex"),
        borsh.u64("numOpenOrders"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new OpenOrdersMetadata({
      askQtyInBook: types.Fractional.fromDecoded(obj.askQtyInBook),
      bidQtyInBook: types.Fractional.fromDecoded(obj.bidQtyInBook),
      headIndex: types.usize.fromDecoded(obj.headIndex),
      numOpenOrders: obj.numOpenOrders,
    })
  }

  static toEncodable(fields: OpenOrdersMetadataFields) {
    return {
      askQtyInBook: types.Fractional.toEncodable(fields.askQtyInBook),
      bidQtyInBook: types.Fractional.toEncodable(fields.bidQtyInBook),
      headIndex: types.usize.toEncodable(fields.headIndex),
      numOpenOrders: fields.numOpenOrders,
    }
  }

  toJSON(): OpenOrdersMetadataJSON {
    return {
      askQtyInBook: this.askQtyInBook.toJSON(),
      bidQtyInBook: this.bidQtyInBook.toJSON(),
      headIndex: this.headIndex.toJSON(),
      numOpenOrders: this.numOpenOrders.toString(),
    }
  }

  static fromJSON(obj: OpenOrdersMetadataJSON): OpenOrdersMetadata {
    return new OpenOrdersMetadata({
      askQtyInBook: types.Fractional.fromJSON(obj.askQtyInBook),
      bidQtyInBook: types.Fractional.fromJSON(obj.bidQtyInBook),
      headIndex: types.usize.fromJSON(obj.headIndex),
      numOpenOrders: new BN(obj.numOpenOrders),
    })
  }

  toEncodable() {
    return OpenOrdersMetadata.toEncodable(this)
  }
}
