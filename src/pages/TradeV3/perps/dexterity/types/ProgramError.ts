import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface ProgramErrorFields {
  userAccount: number
}

export interface ProgramErrorJSON {
  userAccount: number
}

export class ProgramError {
  readonly userAccount: number

  constructor(fields: ProgramErrorFields) {
    this.userAccount = fields.userAccount
  }

  static layout(property?: string) {
    return borsh.struct([borsh.i32("userAccount")], property)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new ProgramError({
      userAccount: obj.userAccount,
    })
  }

  static toEncodable(fields: ProgramErrorFields) {
    return {
      userAccount: fields.userAccount,
    }
  }

  toJSON(): ProgramErrorJSON {
    return {
      userAccount: this.userAccount,
    }
  }

  static fromJSON(obj: ProgramErrorJSON): ProgramError {
    return new ProgramError({
      userAccount: obj.userAccount,
    })
  }

  toEncodable() {
    return ProgramError.toEncodable(this)
  }
}
