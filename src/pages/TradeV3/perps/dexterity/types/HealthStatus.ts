import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface HealthyJSON {
  kind: "Healthy"
}

export class Healthy {
  static readonly discriminator = 0
  static readonly kind = "Healthy"
  readonly discriminator = 0
  readonly kind = "Healthy"

  toJSON(): HealthyJSON {
    return {
      kind: "Healthy",
    }
  }

  toEncodable() {
    return {
      Healthy: {},
    }
  }
}

export interface UnhealthyJSON {
  kind: "Unhealthy"
}

export class Unhealthy {
  static readonly discriminator = 1
  static readonly kind = "Unhealthy"
  readonly discriminator = 1
  readonly kind = "Unhealthy"

  toJSON(): UnhealthyJSON {
    return {
      kind: "Unhealthy",
    }
  }

  toEncodable() {
    return {
      Unhealthy: {},
    }
  }
}

export interface LiquidatableJSON {
  kind: "Liquidatable"
}

export class Liquidatable {
  static readonly discriminator = 2
  static readonly kind = "Liquidatable"
  readonly discriminator = 2
  readonly kind = "Liquidatable"

  toJSON(): LiquidatableJSON {
    return {
      kind: "Liquidatable",
    }
  }

  toEncodable() {
    return {
      Liquidatable: {},
    }
  }
}

export interface NotLiquidatableJSON {
  kind: "NotLiquidatable"
}

export class NotLiquidatable {
  static readonly discriminator = 3
  static readonly kind = "NotLiquidatable"
  readonly discriminator = 3
  readonly kind = "NotLiquidatable"

  toJSON(): NotLiquidatableJSON {
    return {
      kind: "NotLiquidatable",
    }
  }

  toEncodable() {
    return {
      NotLiquidatable: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.HealthStatusKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("Healthy" in obj) {
    return new Healthy()
  }
  if ("Unhealthy" in obj) {
    return new Unhealthy()
  }
  if ("Liquidatable" in obj) {
    return new Liquidatable()
  }
  if ("NotLiquidatable" in obj) {
    return new NotLiquidatable()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(obj: types.HealthStatusJSON): types.HealthStatusKind {
  switch (obj.kind) {
    case "Healthy": {
      return new Healthy()
    }
    case "Unhealthy": {
      return new Unhealthy()
    }
    case "Liquidatable": {
      return new Liquidatable()
    }
    case "NotLiquidatable": {
      return new NotLiquidatable()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "Healthy"),
    borsh.struct([], "Unhealthy"),
    borsh.struct([], "Liquidatable"),
    borsh.struct([], "NotLiquidatable"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
