import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export type HealthFields = {
  healthInfo: types.HealthInfoFields
}
export type HealthValue = {
  healthInfo: types.HealthInfo
}

export interface HealthJSON {
  kind: "Health"
  value: {
    healthInfo: types.HealthInfoJSON
  }
}

export class Health {
  static readonly discriminator = 0
  static readonly kind = "Health"
  readonly discriminator = 0
  readonly kind = "Health"
  readonly value: HealthValue

  constructor(value: HealthFields) {
    this.value = {
      healthInfo: new types.HealthInfo({ ...value.healthInfo }),
    }
  }

  toJSON(): HealthJSON {
    return {
      kind: "Health",
      value: {
        healthInfo: this.value.healthInfo.toJSON(),
      },
    }
  }

  toEncodable() {
    return {
      Health: {
        health_info: types.HealthInfo.toEncodable(this.value.healthInfo),
      },
    }
  }
}

export type LiquidationFields = {
  liquidationInfo: types.LiquidationInfoFields
}
export type LiquidationValue = {
  liquidationInfo: types.LiquidationInfo
}

export interface LiquidationJSON {
  kind: "Liquidation"
  value: {
    liquidationInfo: types.LiquidationInfoJSON
  }
}

export class Liquidation {
  static readonly discriminator = 1
  static readonly kind = "Liquidation"
  readonly discriminator = 1
  readonly kind = "Liquidation"
  readonly value: LiquidationValue

  constructor(value: LiquidationFields) {
    this.value = {
      liquidationInfo: new types.LiquidationInfo({ ...value.liquidationInfo }),
    }
  }

  toJSON(): LiquidationJSON {
    return {
      kind: "Liquidation",
      value: {
        liquidationInfo: this.value.liquidationInfo.toJSON(),
      },
    }
  }

  toEncodable() {
    return {
      Liquidation: {
        liquidation_info: types.LiquidationInfo.toEncodable(
          this.value.liquidationInfo
        ),
      },
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.HealthResultKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("Health" in obj) {
    const val = obj["Health"]
    return new Health({
      healthInfo: types.HealthInfo.fromDecoded(val["health_info"]),
    })
  }
  if ("Liquidation" in obj) {
    const val = obj["Liquidation"]
    return new Liquidation({
      liquidationInfo: types.LiquidationInfo.fromDecoded(
        val["liquidation_info"]
      ),
    })
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(obj: types.HealthResultJSON): types.HealthResultKind {
  switch (obj.kind) {
    case "Health": {
      return new Health({
        healthInfo: types.HealthInfo.fromJSON(obj.value.healthInfo),
      })
    }
    case "Liquidation": {
      return new Liquidation({
        liquidationInfo: types.LiquidationInfo.fromJSON(
          obj.value.liquidationInfo
        ),
      })
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([types.HealthInfo.layout("health_info")], "Health"),
    borsh.struct(
      [types.LiquidationInfo.layout("liquidation_info")],
      "Liquidation"
    ),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
