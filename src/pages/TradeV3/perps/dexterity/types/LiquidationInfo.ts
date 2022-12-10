import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface LiquidationInfoFields {
  health: types.HealthStatusKind
  action: types.ActionStatusKind
  totalSocialLoss: types.FractionalFields
  liquidationPrice: types.FractionalFields
  socialLosses: Array<types.SocialLossFields>
}

export interface LiquidationInfoJSON {
  health: types.HealthStatusJSON
  action: types.ActionStatusJSON
  totalSocialLoss: types.FractionalJSON
  liquidationPrice: types.FractionalJSON
  socialLosses: Array<types.SocialLossJSON>
}

export class LiquidationInfo {
  readonly health: types.HealthStatusKind
  readonly action: types.ActionStatusKind
  readonly totalSocialLoss: types.Fractional
  readonly liquidationPrice: types.Fractional
  readonly socialLosses: Array<types.SocialLoss>

  constructor(fields: LiquidationInfoFields) {
    this.health = fields.health
    this.action = fields.action
    this.totalSocialLoss = new types.Fractional({ ...fields.totalSocialLoss })
    this.liquidationPrice = new types.Fractional({ ...fields.liquidationPrice })
    this.socialLosses = fields.socialLosses.map(
      (item) => new types.SocialLoss({ ...item })
    )
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        types.HealthStatus.layout("health"),
        types.ActionStatus.layout("action"),
        types.Fractional.layout("totalSocialLoss"),
        types.Fractional.layout("liquidationPrice"),
        borsh.array(types.SocialLoss.layout(), 16, "socialLosses"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new LiquidationInfo({
      health: types.HealthStatus.fromDecoded(obj.health),
      action: types.ActionStatus.fromDecoded(obj.action),
      totalSocialLoss: types.Fractional.fromDecoded(obj.totalSocialLoss),
      liquidationPrice: types.Fractional.fromDecoded(obj.liquidationPrice),
      socialLosses: obj.socialLosses.map(
        (
          item: any /* eslint-disable-line @typescript-eslint/no-explicit-any */
        ) => types.SocialLoss.fromDecoded(item)
      ),
    })
  }

  static toEncodable(fields: LiquidationInfoFields) {
    return {
      health: fields.health.toEncodable(),
      action: fields.action.toEncodable(),
      totalSocialLoss: types.Fractional.toEncodable(fields.totalSocialLoss),
      liquidationPrice: types.Fractional.toEncodable(fields.liquidationPrice),
      socialLosses: fields.socialLosses.map((item) =>
        types.SocialLoss.toEncodable(item)
      ),
    }
  }

  toJSON(): LiquidationInfoJSON {
    return {
      health: this.health.toJSON(),
      action: this.action.toJSON(),
      totalSocialLoss: this.totalSocialLoss.toJSON(),
      liquidationPrice: this.liquidationPrice.toJSON(),
      socialLosses: this.socialLosses.map((item) => item.toJSON()),
    }
  }

  static fromJSON(obj: LiquidationInfoJSON): LiquidationInfo {
    return new LiquidationInfo({
      health: types.HealthStatus.fromJSON(obj.health),
      action: types.ActionStatus.fromJSON(obj.action),
      totalSocialLoss: types.Fractional.fromJSON(obj.totalSocialLoss),
      liquidationPrice: types.Fractional.fromJSON(obj.liquidationPrice),
      socialLosses: obj.socialLosses.map((item) =>
        types.SocialLoss.fromJSON(item)
      ),
    })
  }

  toEncodable() {
    return LiquidationInfo.toEncodable(this)
  }
}
