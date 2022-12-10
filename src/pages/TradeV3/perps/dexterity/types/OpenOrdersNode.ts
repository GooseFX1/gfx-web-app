import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface OpenOrdersNodeFields {
  id: BN
  clientId: BN
  prev: types.usizeFields
  next: types.usizeFields
}

export interface OpenOrdersNodeJSON {
  id: string
  clientId: string
  prev: types.usizeJSON
  next: types.usizeJSON
}

export class OpenOrdersNode {
  readonly id: BN
  readonly clientId: BN
  readonly prev: types.usize
  readonly next: types.usize

  constructor(fields: OpenOrdersNodeFields) {
    this.id = fields.id
    this.clientId = fields.clientId
    this.prev = new types.usize({ ...fields.prev })
    this.next = new types.usize({ ...fields.next })
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.u128("id"),
        borsh.u128("clientId"),
        types.usize.layout("prev"),
        types.usize.layout("next"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new OpenOrdersNode({
      id: obj.id,
      clientId: obj.clientId,
      prev: types.usize.fromDecoded(obj.prev),
      next: types.usize.fromDecoded(obj.next),
    })
  }

  static toEncodable(fields: OpenOrdersNodeFields) {
    return {
      id: fields.id,
      clientId: fields.clientId,
      prev: types.usize.toEncodable(fields.prev),
      next: types.usize.toEncodable(fields.next),
    }
  }

  toJSON(): OpenOrdersNodeJSON {
    return {
      id: this.id.toString(),
      clientId: this.clientId.toString(),
      prev: this.prev.toJSON(),
      next: this.next.toJSON(),
    }
  }

  static fromJSON(obj: OpenOrdersNodeJSON): OpenOrdersNode {
    return new OpenOrdersNode({
      id: new BN(obj.id),
      clientId: new BN(obj.clientId),
      prev: types.usize.fromJSON(obj.prev),
      next: types.usize.fromJSON(obj.next),
    })
  }

  toEncodable() {
    return OpenOrdersNode.toEncodable(this)
  }
}
