import { PublicKey } from '@solana/web3.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh'

export interface LimitJSON {
  kind: 'Limit'
}

export class Limit {
  static readonly discriminator = 0
  static readonly kind = 'Limit'
  readonly discriminator = 0
  readonly kind = 'Limit'

  toJSON(): LimitJSON {
    return {
      kind: 'Limit'
    }
  }

  toEncodable() {
    return {
      limit: {}
    }
  }
}

export interface ImmediateOrCancelJSON {
  kind: 'ImmediateOrCancel'
}

export class ImmediateOrCancel {
  static readonly discriminator = 1
  static readonly kind = 'ImmediateOrCancel'
  readonly discriminator = 1
  readonly kind = 'ImmediateOrCancel'

  toJSON(): ImmediateOrCancelJSON {
    return {
      kind: 'ImmediateOrCancel'
    }
  }

  toEncodable() {
    return {
      immediateOrCancel: {}
    }
  }
}

export interface FillOrKillJSON {
  kind: 'FillOrKill'
}

export class FillOrKill {
  static readonly discriminator = 2
  static readonly kind = 'FillOrKill'
  readonly discriminator = 2
  readonly kind = 'FillOrKill'

  toJSON(): FillOrKillJSON {
    return {
      kind: 'FillOrKill'
    }
  }

  toEncodable() {
    return {
      fillOrKill: {}
    }
  }
}

export interface PostOnlyJSON {
  kind: 'PostOnly'
}

export class PostOnly {
  static readonly discriminator = 3
  static readonly kind = 'PostOnly'
  readonly discriminator = 3
  readonly kind = 'PostOnly'

  toJSON(): PostOnlyJSON {
    return {
      kind: 'PostOnly'
    }
  }

  toEncodable() {
    return {
      postOnly: {}
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.OrderTypeKind {
  if (typeof obj !== 'object') {
    throw new Error('Invalid enum object')
  }

  if ('Limit' in obj) {
    return new Limit()
  }
  if ('ImmediateOrCancel' in obj) {
    return new ImmediateOrCancel()
  }
  if ('FillOrKill' in obj) {
    return new FillOrKill()
  }
  if ('PostOnly' in obj) {
    return new PostOnly()
  }

  throw new Error('Invalid enum object')
}

export function fromJSON(obj: types.OrderTypeJSON): types.OrderTypeKind {
  switch (obj.kind) {
    case 'Limit': {
      return new Limit()
    }
    case 'ImmediateOrCancel': {
      return new ImmediateOrCancel()
    }
    case 'FillOrKill': {
      return new FillOrKill()
    }
    case 'PostOnly': {
      return new PostOnly()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], 'Limit'),
    borsh.struct([], 'ImmediateOrCancel'),
    borsh.struct([], 'FillOrKill'),
    borsh.struct([], 'PostOnly')
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
