import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface ProductArrayFields {
  array: Array<types.ProductKind>
}

export interface ProductArrayJSON {
  array: Array<types.ProductJSON>
}

export class ProductArray {
  readonly array: Array<types.ProductKind>

  constructor(fields: ProductArrayFields) {
    this.array = fields.array
  }

  static layout(property?: string) {
    return borsh.struct(
      [borsh.array(types.Product.layout(), 256, "array")],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new ProductArray({
      array: obj.array.map(
        (
          item: any /* eslint-disable-line @typescript-eslint/no-explicit-any */
        ) => types.Product.fromDecoded(item)
      ),
    })
  }

  static toEncodable(fields: ProductArrayFields) {
    return {
      array: fields.array.map((item) => item.toEncodable()),
    }
  }

  toJSON(): ProductArrayJSON {
    return {
      array: this.array.map((item) => item.toJSON()),
    }
  }

  static fromJSON(obj: ProductArrayJSON): ProductArray {
    return new ProductArray({
      array: obj.array.map((item) => types.Product.fromJSON(item)),
    })
  }

  toEncodable() {
    return ProductArray.toEncodable(this)
  }
}
