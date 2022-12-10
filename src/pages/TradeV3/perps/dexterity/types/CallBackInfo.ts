import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface CallBackInfoFields {
  userAccount: PublicKey
  openOrdersIdx: BN
}

export interface CallBackInfoJSON {
  userAccount: string
  openOrdersIdx: string
}

export class CallBackInfo {
  readonly userAccount: PublicKey
  readonly openOrdersIdx: BN

  constructor(fields: CallBackInfoFields) {
    this.userAccount = fields.userAccount
    this.openOrdersIdx = fields.openOrdersIdx
  }

  static layout(property?: string) {
    return borsh.struct(
      [borsh.publicKey("userAccount"), borsh.u64("openOrdersIdx")],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new CallBackInfo({
      userAccount: obj.userAccount,
      openOrdersIdx: obj.openOrdersIdx,
    })
  }

  static toEncodable(fields: CallBackInfoFields) {
    return {
      userAccount: fields.userAccount,
      openOrdersIdx: fields.openOrdersIdx,
    }
  }

  toJSON(): CallBackInfoJSON {
    return {
      userAccount: this.userAccount.toString(),
      openOrdersIdx: this.openOrdersIdx.toString(),
    }
  }

  static fromJSON(obj: CallBackInfoJSON): CallBackInfo {
    return new CallBackInfo({
      userAccount: new PublicKey(obj.userAccount),
      openOrdersIdx: new BN(obj.openOrdersIdx),
    })
  }

  toEncodable() {
    return CallBackInfo.toEncodable(this)
  }
}
