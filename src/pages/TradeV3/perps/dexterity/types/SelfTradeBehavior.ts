import { PublicKey } from '@solana/web3.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh'

export interface DecrementTakeJSON {
  kind: 'DecrementTake'
}

export class DecrementTake {
  static readonly discriminator = 0
  static readonly kind = 'DecrementTake'
  readonly discriminator = 0
  readonly kind = 'DecrementTake'

  toJSON(): DecrementTakeJSON {
    return {
      kind: 'DecrementTake'
    }
  }

  toEncodable() {
    return {
      decrementTake: {}
    }
  }
}

export interface CancelProvideJSON {
  kind: 'CancelProvide'
}

export class CancelProvide {
  static readonly discriminator = 1
  static readonly kind = 'CancelProvide'
  readonly discriminator = 1
  readonly kind = 'CancelProvide'

  toJSON(): CancelProvideJSON {
    return {
      kind: 'CancelProvide'
    }
  }

  toEncodable() {
    return {
      cancelProvide: {}
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.SelfTradeBehaviorKind {
  if (typeof obj !== 'object') {
    throw new Error('Invalid enum object')
  }

  if ('DecrementTake' in obj) {
    return new DecrementTake()
  }
  if ('CancelProvide' in obj) {
    return new CancelProvide()
  }

  throw new Error('Invalid enum object')
}

export function fromJSON(obj: types.SelfTradeBehaviorJSON): types.SelfTradeBehaviorKind {
  switch (obj.kind) {
    case 'DecrementTake': {
      return new DecrementTake()
    }
    case 'CancelProvide': {
      return new CancelProvide()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([borsh.struct([], 'DecrementTake'), borsh.struct([], 'CancelProvide')])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
