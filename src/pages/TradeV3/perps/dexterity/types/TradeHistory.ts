import { PublicKey } from '@solana/web3.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh'

export interface TradeHistoryFields {
  qty: Array<types.FractionalFields>
  price: Array<types.FractionalFields>
  latestIdx: types.usizeFields
}

export interface TradeHistoryJSON {
  qty: Array<types.FractionalJSON>
  price: Array<types.FractionalJSON>
  latestIdx: types.usizeJSON
}

export class TradeHistory {
  readonly qty: Array<types.Fractional>
  readonly price: Array<types.Fractional>
  readonly latestIdx: types.usize

  constructor(fields: TradeHistoryFields) {
    this.qty = fields.qty.map((item) => new types.Fractional({ ...item }))
    this.price = fields.price.map((item) => new types.Fractional({ ...item }))
    this.latestIdx = new types.usize({ ...fields.latestIdx })
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.array(types.Fractional.layout(), 8, 'qty'),
        borsh.array(types.Fractional.layout(), 8, 'price'),
        types.usize.layout('latestIdx')
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new TradeHistory({
      qty: obj.qty.map((item: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) =>
        types.Fractional.fromDecoded(item)
      ),
      price: obj.price.map((item: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) =>
        types.Fractional.fromDecoded(item)
      ),
      latestIdx: types.usize.fromDecoded(obj.latestIdx)
    })
  }

  static toEncodable(fields: TradeHistoryFields) {
    return {
      qty: fields.qty.map((item) => types.Fractional.toEncodable(item)),
      price: fields.price.map((item) => types.Fractional.toEncodable(item)),
      latestIdx: types.usize.toEncodable(fields.latestIdx)
    }
  }

  toJSON(): TradeHistoryJSON {
    return {
      qty: this.qty.map((item) => item.toJSON()),
      price: this.price.map((item) => item.toJSON()),
      latestIdx: this.latestIdx.toJSON()
    }
  }

  static fromJSON(obj: TradeHistoryJSON): TradeHistory {
    return new TradeHistory({
      qty: obj.qty.map((item) => types.Fractional.fromJSON(item)),
      price: obj.price.map((item) => types.Fractional.fromJSON(item)),
      latestIdx: types.usize.fromJSON(obj.latestIdx)
    })
  }

  toEncodable() {
    return TradeHistory.toEncodable(this)
  }
}
