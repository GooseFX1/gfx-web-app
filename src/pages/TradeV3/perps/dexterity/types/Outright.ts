import { PublicKey } from '@solana/web3.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh'

export interface OutrightFields {
  metadata: types.ProductMetadataFields
  numQueueEvents: types.usizeFields
  productStatus: types.ProductStatusKind
  dust: types.FractionalFields
  cumFundingPerShare: types.FractionalFields
  cumSocialLossPerShare: types.FractionalFields
  openLongInterest: types.FractionalFields
  openShortInterest: types.FractionalFields
  padding: Array<BN>
}

export interface OutrightJSON {
  metadata: types.ProductMetadataJSON
  numQueueEvents: types.usizeJSON
  productStatus: types.ProductStatusJSON
  dust: types.FractionalJSON
  cumFundingPerShare: types.FractionalJSON
  cumSocialLossPerShare: types.FractionalJSON
  openLongInterest: types.FractionalJSON
  openShortInterest: types.FractionalJSON
  padding: Array<string>
}

export class Outright {
  readonly metadata: types.ProductMetadata
  readonly numQueueEvents: types.usize
  readonly productStatus: types.ProductStatusKind
  readonly dust: types.Fractional
  readonly cumFundingPerShare: types.Fractional
  readonly cumSocialLossPerShare: types.Fractional
  readonly openLongInterest: types.Fractional
  readonly openShortInterest: types.Fractional
  readonly padding: Array<BN>

  constructor(fields: OutrightFields) {
    this.metadata = new types.ProductMetadata({ ...fields.metadata })
    this.numQueueEvents = new types.usize({ ...fields.numQueueEvents })
    this.productStatus = fields.productStatus
    this.dust = new types.Fractional({ ...fields.dust })
    this.cumFundingPerShare = new types.Fractional({
      ...fields.cumFundingPerShare
    })
    this.cumSocialLossPerShare = new types.Fractional({
      ...fields.cumSocialLossPerShare
    })
    this.openLongInterest = new types.Fractional({ ...fields.openLongInterest })
    this.openShortInterest = new types.Fractional({
      ...fields.openShortInterest
    })
    this.padding = fields.padding
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.u32('padding1'),
        borsh.u16('padding1'),
        borsh.u8('padding1'),
        types.ProductMetadata.layout('metadata'),
        types.usize.layout('numQueueEvents'),
        borsh.u32('padding2'),
        borsh.u16('padding3'),
        borsh.u8('padding4'),
        types.ProductStatus.layout('productStatus'),
        types.Fractional.layout('dust'),
        types.Fractional.layout('cumFundingPerShare'),
        types.Fractional.layout('cumSocialLossPerShare'),
        types.Fractional.layout('openLongInterest'),
        types.Fractional.layout('openShortInterest'),
        borsh.array(borsh.u64(), 14, 'padding')
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new Outright({
      metadata: types.ProductMetadata.fromDecoded(obj.metadata),
      numQueueEvents: types.usize.fromDecoded(obj.numQueueEvents),
      productStatus: types.ProductStatus.fromDecoded(obj.productStatus),
      dust: types.Fractional.fromDecoded(obj.dust),
      cumFundingPerShare: types.Fractional.fromDecoded(obj.cumFundingPerShare),
      cumSocialLossPerShare: types.Fractional.fromDecoded(obj.cumSocialLossPerShare),
      openLongInterest: types.Fractional.fromDecoded(obj.openLongInterest),
      openShortInterest: types.Fractional.fromDecoded(obj.openShortInterest),
      padding: obj.padding
    })
  }

  static toEncodable(fields: OutrightFields) {
    return {
      metadata: types.ProductMetadata.toEncodable(fields.metadata),
      numQueueEvents: types.usize.toEncodable(fields.numQueueEvents),
      productStatus: fields.productStatus.toEncodable(),
      dust: types.Fractional.toEncodable(fields.dust),
      cumFundingPerShare: types.Fractional.toEncodable(fields.cumFundingPerShare),
      cumSocialLossPerShare: types.Fractional.toEncodable(fields.cumSocialLossPerShare),
      openLongInterest: types.Fractional.toEncodable(fields.openLongInterest),
      openShortInterest: types.Fractional.toEncodable(fields.openShortInterest),
      padding: fields.padding
    }
  }

  toJSON(): OutrightJSON {
    return {
      metadata: this.metadata.toJSON(),
      numQueueEvents: this.numQueueEvents.toJSON(),
      productStatus: this.productStatus.toJSON(),
      dust: this.dust.toJSON(),
      cumFundingPerShare: this.cumFundingPerShare.toJSON(),
      cumSocialLossPerShare: this.cumSocialLossPerShare.toJSON(),
      openLongInterest: this.openLongInterest.toJSON(),
      openShortInterest: this.openShortInterest.toJSON(),
      padding: this.padding.map((item) => item.toString())
    }
  }

  static fromJSON(obj: OutrightJSON): Outright {
    return new Outright({
      metadata: types.ProductMetadata.fromJSON(obj.metadata),
      numQueueEvents: types.usize.fromJSON(obj.numQueueEvents),
      productStatus: types.ProductStatus.fromJSON(obj.productStatus),
      dust: types.Fractional.fromJSON(obj.dust),
      cumFundingPerShare: types.Fractional.fromJSON(obj.cumFundingPerShare),
      cumSocialLossPerShare: types.Fractional.fromJSON(obj.cumSocialLossPerShare),
      openLongInterest: types.Fractional.fromJSON(obj.openLongInterest),
      openShortInterest: types.Fractional.fromJSON(obj.openShortInterest),
      padding: obj.padding.map((item) => new BN(item))
    })
  }

  toEncodable() {
    return Outright.toEncodable(this)
  }
}
