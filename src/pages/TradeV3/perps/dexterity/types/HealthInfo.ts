import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface HealthInfoFields {
  health: types.HealthStatusKind
  action: types.ActionStatusKind
}

export interface HealthInfoJSON {
  health: types.HealthStatusJSON
  action: types.ActionStatusJSON
}

export class HealthInfo {
  readonly health: types.HealthStatusKind
  readonly action: types.ActionStatusKind

  constructor(fields: HealthInfoFields) {
    this.health = fields.health
    this.action = fields.action
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        types.HealthStatus.layout("health"),
        types.ActionStatus.layout("action"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new HealthInfo({
      health: types.HealthStatus.fromDecoded(obj.health),
      action: types.ActionStatus.fromDecoded(obj.action),
    })
  }

  static toEncodable(fields: HealthInfoFields) {
    return {
      health: fields.health.toEncodable(),
      action: fields.action.toEncodable(),
    }
  }

  toJSON(): HealthInfoJSON {
    return {
      health: this.health.toJSON(),
      action: this.action.toJSON(),
    }
  }

  static fromJSON(obj: HealthInfoJSON): HealthInfo {
    return new HealthInfo({
      health: types.HealthStatus.fromJSON(obj.health),
      action: types.ActionStatus.fromJSON(obj.action),
    })
  }

  toEncodable() {
    return HealthInfo.toEncodable(this)
  }
}
