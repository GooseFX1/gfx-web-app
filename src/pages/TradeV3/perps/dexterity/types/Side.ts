import { PublicKey } from '@solana/web3.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh'

export interface BidJSON {
  kind: 'Bid'
}

export class Bid {
  static readonly discriminator = 0
  static readonly kind = 'Bid'
  readonly discriminator = 0
  readonly kind = 'Bid'

  toJSON(): BidJSON {
    return {
      kind: 'Bid'
    }
  }

  toEncodable() {
    return {
      bid: {}
    }
  }
}

export interface AskJSON {
  kind: 'Ask'
}

export class Ask {
  static readonly discriminator = 1
  static readonly kind = 'Ask'
  readonly discriminator = 1
  readonly kind = 'Ask'

  toJSON(): AskJSON {
    return {
      kind: 'Ask'
    }
  }

  toEncodable() {
    return {
      ask: {}
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.SideKind {
  if (typeof obj !== 'object') {
    throw new Error('Invalid enum object')
  }

  if ('Bid' in obj) {
    return new Bid()
  }
  if ('Ask' in obj) {
    return new Ask()
  }

  throw new Error('Invalid enum object')
}

export function fromJSON(obj: types.SideJSON): types.SideKind {
  switch (obj.kind) {
    case 'Bid': {
      return new Bid()
    }
    case 'Ask': {
      return new Ask()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([borsh.struct([], 'Bid'), borsh.struct([], 'Ask')])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
