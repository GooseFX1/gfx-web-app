import { PublicKey } from '@solana/web3.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh'

export interface TraderPositionFields {
  tag: types.AccountTag
  productKey: PublicKey
  position: types.FractionalFields
  pendingPosition: types.FractionalFields
  productIndex: types.usizeFields
  lastCumFundingSnapshot: types.FractionalFields
  lastSocialLossSnapshot: types.FractionalFields
}

export interface TraderPositionJSON {
  tag: types.AccountTagJSON
  productKey: string
  position: types.FractionalJSON
  pendingPosition: types.FractionalJSON
  productIndex: types.usizeJSON
  lastCumFundingSnapshot: types.FractionalJSON
  lastSocialLossSnapshot: types.FractionalJSON
}

export class TraderPosition {
  readonly tag: types.AccountTag
  readonly productKey: PublicKey
  readonly position: types.Fractional
  readonly pendingPosition: types.Fractional
  readonly productIndex: types.usize
  readonly lastCumFundingSnapshot: types.Fractional
  readonly lastSocialLossSnapshot: types.Fractional

  constructor(fields: TraderPositionFields) {
    this.tag = fields.tag
    this.productKey = fields.productKey
    this.position = new types.Fractional({ ...fields.position })
    this.pendingPosition = new types.Fractional({ ...fields.pendingPosition })
    this.productIndex = new types.usize({ ...fields.productIndex })
    this.lastCumFundingSnapshot = new types.Fractional({
      ...fields.lastCumFundingSnapshot
    })
    this.lastSocialLossSnapshot = new types.Fractional({
      ...fields.lastSocialLossSnapshot
    })
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        types.AccountTag.layout('tag'),
        borsh.publicKey('productKey'),
        types.Fractional.layout('position'),
        types.Fractional.layout('pendingPosition'),
        types.usize.layout('productIndex'),
        types.Fractional.layout('lastCumFundingSnapshot'),
        types.Fractional.layout('lastSocialLossSnapshot')
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new TraderPosition({
      tag: types.AccountTag.fromDecoded(obj.tag),
      productKey: obj.productKey,
      position: types.Fractional.fromDecoded(obj.position),
      pendingPosition: types.Fractional.fromDecoded(obj.pendingPosition),
      productIndex: types.usize.fromDecoded(obj.productIndex),
      lastCumFundingSnapshot: types.Fractional.fromDecoded(obj.lastCumFundingSnapshot),
      lastSocialLossSnapshot: types.Fractional.fromDecoded(obj.lastSocialLossSnapshot)
    })
  }

  static toEncodable(fields: TraderPositionFields) {
    return {
      tag: fields.tag.toEncodable(),
      productKey: fields.productKey,
      position: types.Fractional.toEncodable(fields.position),
      pendingPosition: types.Fractional.toEncodable(fields.pendingPosition),
      productIndex: types.usize.toEncodable(fields.productIndex),
      lastCumFundingSnapshot: types.Fractional.toEncodable(fields.lastCumFundingSnapshot),
      lastSocialLossSnapshot: types.Fractional.toEncodable(fields.lastSocialLossSnapshot)
    }
  }

  toJSON(): TraderPositionJSON {
    return {
      tag: this.tag.toJSON(),
      productKey: this.productKey.toString(),
      position: this.position.toJSON(),
      pendingPosition: this.pendingPosition.toJSON(),
      productIndex: this.productIndex.toJSON(),
      lastCumFundingSnapshot: this.lastCumFundingSnapshot.toJSON(),
      lastSocialLossSnapshot: this.lastSocialLossSnapshot.toJSON()
    }
  }

  static fromJSON(obj: TraderPositionJSON): TraderPosition {
    return new TraderPosition({
      tag: types.AccountTag.fromJSON(obj.tag),
      productKey: new PublicKey(obj.productKey),
      position: types.Fractional.fromJSON(obj.position),
      pendingPosition: types.Fractional.fromJSON(obj.pendingPosition),
      productIndex: types.usize.fromJSON(obj.productIndex),
      lastCumFundingSnapshot: types.Fractional.fromJSON(obj.lastCumFundingSnapshot),
      lastSocialLossSnapshot: types.Fractional.fromJSON(obj.lastSocialLossSnapshot)
    })
  }

  toEncodable() {
    return TraderPosition.toEncodable(this)
  }
}
