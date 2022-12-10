import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface ConsumeOrderbookEventsParamsFields {
  maxIterations: BN
}

export interface ConsumeOrderbookEventsParamsJSON {
  maxIterations: string
}

export class ConsumeOrderbookEventsParams {
  readonly maxIterations: BN

  constructor(fields: ConsumeOrderbookEventsParamsFields) {
    this.maxIterations = fields.maxIterations
  }

  static layout(property?: string) {
    return borsh.struct([borsh.u64("maxIterations")], property)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new ConsumeOrderbookEventsParams({
      maxIterations: obj.maxIterations,
    })
  }

  static toEncodable(fields: ConsumeOrderbookEventsParamsFields) {
    return {
      maxIterations: fields.maxIterations,
    }
  }

  toJSON(): ConsumeOrderbookEventsParamsJSON {
    return {
      maxIterations: this.maxIterations.toString(),
    }
  }

  static fromJSON(
    obj: ConsumeOrderbookEventsParamsJSON
  ): ConsumeOrderbookEventsParams {
    return new ConsumeOrderbookEventsParams({
      maxIterations: new BN(obj.maxIterations),
    })
  }

  toEncodable() {
    return ConsumeOrderbookEventsParams.toEncodable(this)
  }
}
