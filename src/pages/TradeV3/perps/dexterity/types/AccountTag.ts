import { PublicKey } from '@solana/web3.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh'

export interface AccountTagField {
  accountKind: BN
}

export interface AccountTagJSON {
  accountKind: string
}

export class AccountTag {
  readonly accountKind: BN

  constructor(fields: AccountTagField) {
    this.accountKind = fields.accountKind
  }

  static layout(property?: string) {
    return borsh.struct([borsh.i64('accountKind')], property)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new AccountTag({
      accountKind: obj.accountKind
    })
  }

  static toEncodable(fields: AccountTagField) {
    return {
      accountKind: fields.accountKind
    }
  }

  toJSON(): AccountTagJSON {
    return {
      accountKind: this.accountKind.toString()
    }
  }

  static fromJSON(obj: AccountTagJSON): AccountTag {
    return new AccountTag({
      accountKind: new BN(obj.accountKind)
    })
  }

  toEncodable() {
    return AccountTag.toEncodable(this)
  }
}
