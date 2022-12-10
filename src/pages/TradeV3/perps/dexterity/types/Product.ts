import { PublicKey } from '@solana/web3.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh'

export type OutrightFields = {
  outright: types.OutrightFields
}
export type OutrightValue = {
  outright: types.Outright
}

export interface OutrightJSON {
  kind: 'Outright'
  value: {
    outright: types.OutrightJSON
  }
}

export class Outright {
  static readonly discriminator = 0
  static readonly kind = 'Outright'
  readonly discriminator = 0
  readonly kind = 'Outright'
  readonly value: OutrightValue

  constructor(value: OutrightFields) {
    this.value = {
      outright: new types.Outright({ ...value.outright })
    }
  }

  toJSON(): OutrightJSON {
    return {
      kind: 'Outright',
      value: {
        outright: this.value.outright.toJSON()
      }
    }
  }

  toEncodable() {
    return {
      Outright: {
        outright: types.Outright.toEncodable(this.value.outright)
      }
    }
  }
}

export type ComboFields = {
  combo: types.ComboFields
}
export type ComboValue = {
  combo: types.Combo
}

export interface ComboJSON {
  kind: 'Combo'
  value: {
    combo: types.ComboJSON
  }
}

export class Combo {
  static readonly discriminator = 1
  static readonly kind = 'Combo'
  readonly discriminator = 1
  readonly kind = 'Combo'
  readonly value: ComboValue

  constructor(value: ComboFields) {
    this.value = {
      combo: new types.Combo({ ...value.combo })
    }
  }

  toJSON(): ComboJSON {
    return {
      kind: 'Combo',
      value: {
        combo: this.value.combo.toJSON()
      }
    }
  }

  toEncodable() {
    return {
      Combo: {
        combo: types.Combo.toEncodable(this.value.combo)
      }
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.ProductKind {
  if (typeof obj !== 'object') {
    throw new Error('Invalid enum object')
  }

  if ('Outright' in obj) {
    const val = obj['Outright']
    return new Outright({
      outright: types.Outright.fromDecoded(val['outright'])
    })
  }

  throw new Error('Invalid enum object')
}

export function fromJSON(obj: types.ProductJSON): types.ProductKind {
  switch (obj.kind) {
    case 'Outright': {
      return new Outright({
        outright: types.Outright.fromJSON(obj.value.outright)
      })
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([types.Outright.layout('outright')], 'Outright'),
    borsh.struct([types.Combo.layout('combo')], 'Combo')
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
