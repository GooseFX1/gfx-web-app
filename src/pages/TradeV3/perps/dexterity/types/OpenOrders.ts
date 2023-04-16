import { PublicKey } from '@solana/web3.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh'

export interface OpenOrdersFields {
  freeListHead: types.usizeFields
  totalOpenOrders: BN
  products: Array<types.OpenOrdersMetadataFields>
  orders: Array<types.OpenOrdersNodeFields>
}

export interface OpenOrdersJSON {
  freeListHead: types.usizeJSON
  totalOpenOrders: string
  products: Array<types.OpenOrdersMetadataJSON>
  orders: Array<types.OpenOrdersNodeJSON>
}

export class OpenOrders {
  readonly freeListHead: types.usize
  readonly totalOpenOrders: BN
  readonly products: Array<types.OpenOrdersMetadata>
  readonly orders: Array<types.OpenOrdersNode>

  constructor(fields: OpenOrdersFields) {
    this.freeListHead = new types.usize({ ...fields.freeListHead })
    this.totalOpenOrders = fields.totalOpenOrders
    this.products = fields.products.map((item) => new types.OpenOrdersMetadata({ ...item }))
    this.orders = fields.orders.map((item) => new types.OpenOrdersNode({ ...item }))
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        types.usize.layout('freeListHead'),
        borsh.u64('totalOpenOrders'),
        borsh.array(types.OpenOrdersMetadata.layout(), 16, 'products'),
        borsh.array(types.OpenOrdersNode.layout(), 128, 'orders')
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new OpenOrders({
      freeListHead: types.usize.fromDecoded(obj.freeListHead),
      totalOpenOrders: obj.totalOpenOrders,
      products: obj.products.map((item: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) =>
        types.OpenOrdersMetadata.fromDecoded(item)
      ),
      orders: obj.orders.map((item: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) =>
        types.OpenOrdersNode.fromDecoded(item)
      )
    })
  }

  static toEncodable(fields: OpenOrdersFields) {
    return {
      freeListHead: types.usize.toEncodable(fields.freeListHead),
      totalOpenOrders: fields.totalOpenOrders,
      products: fields.products.map((item) => types.OpenOrdersMetadata.toEncodable(item)),
      orders: fields.orders.map((item) => types.OpenOrdersNode.toEncodable(item))
    }
  }

  toJSON(): OpenOrdersJSON {
    return {
      freeListHead: this.freeListHead.toJSON(),
      totalOpenOrders: this.totalOpenOrders.toString(),
      products: this.products.map((item) => item.toJSON()),
      orders: this.orders.map((item) => item.toJSON())
    }
  }

  static fromJSON(obj: OpenOrdersJSON): OpenOrders {
    return new OpenOrders({
      freeListHead: types.usize.fromJSON(obj.freeListHead),
      totalOpenOrders: new BN(obj.totalOpenOrders),
      products: obj.products.map((item) => types.OpenOrdersMetadata.fromJSON(item)),
      orders: obj.orders.map((item) => types.OpenOrdersNode.fromJSON(item))
    })
  }

  toEncodable() {
    return OpenOrders.toEncodable(this)
  }
}
