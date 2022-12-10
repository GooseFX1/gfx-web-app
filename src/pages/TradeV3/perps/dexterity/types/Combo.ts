import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface ComboFields {
  metadata: types.ProductMetadataFields
  numLegs: types.usizeFields
  legs: Array<types.LegFields>
}

export interface ComboJSON {
  metadata: types.ProductMetadataJSON
  numLegs: types.usizeJSON
  legs: Array<types.LegJSON>
}

export class Combo {
  readonly metadata: types.ProductMetadata
  readonly numLegs: types.usize
  readonly legs: Array<types.Leg>

  constructor(fields: ComboFields) {
    this.metadata = new types.ProductMetadata({ ...fields.metadata })
    this.numLegs = new types.usize({ ...fields.numLegs })
    this.legs = fields.legs.map((item) => new types.Leg({ ...item }))
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        types.ProductMetadata.layout("metadata"),
        types.usize.layout("numLegs"),
        borsh.array(types.Leg.layout(), 4, "legs"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new Combo({
      metadata: types.ProductMetadata.fromDecoded(obj.metadata),
      numLegs: types.usize.fromDecoded(obj.numLegs),
      legs: obj.legs.map(
        (
          item: any /* eslint-disable-line @typescript-eslint/no-explicit-any */
        ) => types.Leg.fromDecoded(item)
      ),
    })
  }

  static toEncodable(fields: ComboFields) {
    return {
      metadata: types.ProductMetadata.toEncodable(fields.metadata),
      numLegs: types.usize.toEncodable(fields.numLegs),
      legs: fields.legs.map((item) => types.Leg.toEncodable(item)),
    }
  }

  toJSON(): ComboJSON {
    return {
      metadata: this.metadata.toJSON(),
      numLegs: this.numLegs.toJSON(),
      legs: this.legs.map((item) => item.toJSON()),
    }
  }

  static fromJSON(obj: ComboJSON): Combo {
    return new Combo({
      metadata: types.ProductMetadata.fromJSON(obj.metadata),
      numLegs: types.usize.fromJSON(obj.numLegs),
      legs: obj.legs.map((item) => types.Leg.fromJSON(item)),
    })
  }

  toEncodable() {
    return Combo.toEncodable(this)
  }
}
