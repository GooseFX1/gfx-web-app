import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface PriceEwmaFields {
  ewmaBid: Array<types.FractionalFields>
  ewmaAsk: Array<types.FractionalFields>
  bid: types.FractionalFields
  ask: types.FractionalFields
  slot: BN
  prevBid: types.FractionalFields
  prevAsk: types.FractionalFields
}

export interface PriceEwmaJSON {
  ewmaBid: Array<types.FractionalJSON>
  ewmaAsk: Array<types.FractionalJSON>
  bid: types.FractionalJSON
  ask: types.FractionalJSON
  slot: string
  prevBid: types.FractionalJSON
  prevAsk: types.FractionalJSON
}

export class PriceEwma {
  readonly ewmaBid: Array<types.Fractional>
  readonly ewmaAsk: Array<types.Fractional>
  readonly bid: types.Fractional
  readonly ask: types.Fractional
  readonly slot: BN
  readonly prevBid: types.Fractional
  readonly prevAsk: types.Fractional

  constructor(fields: PriceEwmaFields) {
    this.ewmaBid = fields.ewmaBid.map(
      (item) => new types.Fractional({ ...item })
    )
    this.ewmaAsk = fields.ewmaAsk.map(
      (item) => new types.Fractional({ ...item })
    )
    this.bid = new types.Fractional({ ...fields.bid })
    this.ask = new types.Fractional({ ...fields.ask })
    this.slot = fields.slot
    this.prevBid = new types.Fractional({ ...fields.prevBid })
    this.prevAsk = new types.Fractional({ ...fields.prevAsk })
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.array(types.Fractional.layout(), 4, "ewmaBid"),
        borsh.array(types.Fractional.layout(), 4, "ewmaAsk"),
        types.Fractional.layout("bid"),
        types.Fractional.layout("ask"),
        borsh.u64("slot"),
        types.Fractional.layout("prevBid"),
        types.Fractional.layout("prevAsk"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new PriceEwma({
      ewmaBid: obj.ewmaBid.map(
        (
          item: any /* eslint-disable-line @typescript-eslint/no-explicit-any */
        ) => types.Fractional.fromDecoded(item)
      ),
      ewmaAsk: obj.ewmaAsk.map(
        (
          item: any /* eslint-disable-line @typescript-eslint/no-explicit-any */
        ) => types.Fractional.fromDecoded(item)
      ),
      bid: types.Fractional.fromDecoded(obj.bid),
      ask: types.Fractional.fromDecoded(obj.ask),
      slot: obj.slot,
      prevBid: types.Fractional.fromDecoded(obj.prevBid),
      prevAsk: types.Fractional.fromDecoded(obj.prevAsk),
    })
  }

  static toEncodable(fields: PriceEwmaFields) {
    return {
      ewmaBid: fields.ewmaBid.map((item) => types.Fractional.toEncodable(item)),
      ewmaAsk: fields.ewmaAsk.map((item) => types.Fractional.toEncodable(item)),
      bid: types.Fractional.toEncodable(fields.bid),
      ask: types.Fractional.toEncodable(fields.ask),
      slot: fields.slot,
      prevBid: types.Fractional.toEncodable(fields.prevBid),
      prevAsk: types.Fractional.toEncodable(fields.prevAsk),
    }
  }

  toJSON(): PriceEwmaJSON {
    return {
      ewmaBid: this.ewmaBid.map((item) => item.toJSON()),
      ewmaAsk: this.ewmaAsk.map((item) => item.toJSON()),
      bid: this.bid.toJSON(),
      ask: this.ask.toJSON(),
      slot: this.slot.toString(),
      prevBid: this.prevBid.toJSON(),
      prevAsk: this.prevAsk.toJSON(),
    }
  }

  static fromJSON(obj: PriceEwmaJSON): PriceEwma {
    return new PriceEwma({
      ewmaBid: obj.ewmaBid.map((item) => types.Fractional.fromJSON(item)),
      ewmaAsk: obj.ewmaAsk.map((item) => types.Fractional.fromJSON(item)),
      bid: types.Fractional.fromJSON(obj.bid),
      ask: types.Fractional.fromJSON(obj.ask),
      slot: new BN(obj.slot),
      prevBid: types.Fractional.fromJSON(obj.prevBid),
      prevAsk: types.Fractional.fromJSON(obj.prevAsk),
    })
  }

  toEncodable() {
    return PriceEwma.toEncodable(this)
  }
}
