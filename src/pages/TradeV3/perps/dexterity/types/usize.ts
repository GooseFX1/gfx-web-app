import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface usizeFields {
  userAccount: BN
}

export interface usizeJSON {
  userAccount: string
}

export class usize {
  readonly userAccount: BN

  constructor(fields: usizeFields) {
    this.userAccount = fields.userAccount
  }

  static layout(property?: string) {
    return borsh.struct([borsh.i64("userAccount")], property)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new usize({
      userAccount: obj.userAccount,
    })
  }

  static toEncodable(fields: usizeFields) {
    return {
      userAccount: fields.userAccount,
    }
  }

  toJSON(): usizeJSON {
    return {
      userAccount: this.userAccount.toString(),
    }
  }

  static fromJSON(obj: usizeJSON): usize {
    return new usize({
      userAccount: new BN(obj.userAccount),
    })
  }

  toEncodable() {
    return usize.toEncodable(this)
  }
}
