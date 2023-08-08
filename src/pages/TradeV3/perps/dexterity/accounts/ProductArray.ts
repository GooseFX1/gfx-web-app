import { PublicKey, Connection } from '@solana/web3.js'
import * as borsh from '@project-serum/borsh' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types' // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId'

export interface ProductArrayFields {
  array: Array<types.ProductKind>
}

export interface ProductArrayJSON {
  array: Array<types.ProductJSON>
}

export class ProductArray {
  readonly array: Array<types.ProductKind>

  static readonly discriminator = Buffer.from([25, 31, 203, 155, 193, 95, 75, 111])

  static readonly layout = borsh.struct([borsh.array(types.Product.layout(), 256, 'array')])

  constructor(fields: ProductArrayFields) {
    this.array = fields.array
  }

  static async fetch(c: Connection, address: PublicKey): Promise<ProductArray | null> {
    const info = await c.getAccountInfo(address)

    if (info === null) {
      return null
    }
    if (!info.owner.equals(PROGRAM_ID)) {
      throw new Error("account doesn't belong to this program")
    }

    return this.decode(info.data)
  }

  static async fetchMultiple(c: Connection, addresses: PublicKey[]): Promise<Array<ProductArray | null>> {
    const infos = await c.getMultipleAccountsInfo(addresses)

    return infos.map((info) => {
      if (info === null) {
        return null
      }
      if (!info.owner.equals(PROGRAM_ID)) {
        throw new Error("account doesn't belong to this program")
      }

      return this.decode(info.data)
    })
  }

  static decode(data: Buffer): ProductArray {
    if (!data.slice(0, 8).equals(ProductArray.discriminator)) {
      throw new Error('invalid account discriminator')
    }

    const dec = ProductArray.layout.decode(data.slice(8))

    return new ProductArray({
      array: dec.array.map((item: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) =>
        types.Product.fromDecoded(item)
      )
    })
  }

  toJSON(): ProductArrayJSON {
    return {
      array: this.array.map((item) => item.toJSON())
    }
  }

  static fromJSON(obj: ProductArrayJSON): ProductArray {
    return new ProductArray({
      array: obj.array.map((item) => types.Product.fromJSON(item))
    })
  }
}
