import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface NewOrderJSON {
  kind: "NewOrder"
}

export class NewOrder {
  static readonly discriminator = 0
  static readonly kind = "NewOrder"
  readonly discriminator = 0
  readonly kind = "NewOrder"

  toJSON(): NewOrderJSON {
    return {
      kind: "NewOrder",
    }
  }

  toEncodable() {
    return {
      NewOrder: {},
    }
  }
}

export interface CancelOrderJSON {
  kind: "CancelOrder"
}

export class CancelOrder {
  static readonly discriminator = 1
  static readonly kind = "CancelOrder"
  readonly discriminator = 1
  readonly kind = "CancelOrder"

  toJSON(): CancelOrderJSON {
    return {
      kind: "CancelOrder",
    }
  }

  toEncodable() {
    return {
      CancelOrder: {},
    }
  }
}

export interface CheckHealthJSON {
  kind: "CheckHealth"
}

export class CheckHealth {
  static readonly discriminator = 2
  static readonly kind = "CheckHealth"
  readonly discriminator = 2
  readonly kind = "CheckHealth"

  toJSON(): CheckHealthJSON {
    return {
      kind: "CheckHealth",
    }
  }

  toEncodable() {
    return {
      CheckHealth: {},
    }
  }
}

export interface PositionTransferJSON {
  kind: "PositionTransfer"
}

export class PositionTransfer {
  static readonly discriminator = 3
  static readonly kind = "PositionTransfer"
  readonly discriminator = 3
  readonly kind = "PositionTransfer"

  toJSON(): PositionTransferJSON {
    return {
      kind: "PositionTransfer",
    }
  }

  toEncodable() {
    return {
      PositionTransfer: {},
    }
  }
}

export interface ConsumeEventsJSON {
  kind: "ConsumeEvents"
}

export class ConsumeEvents {
  static readonly discriminator = 4
  static readonly kind = "ConsumeEvents"
  readonly discriminator = 4
  readonly kind = "ConsumeEvents"

  toJSON(): ConsumeEventsJSON {
    return {
      kind: "ConsumeEvents",
    }
  }

  toEncodable() {
    return {
      ConsumeEvents: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.OperationTypeKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("NewOrder" in obj) {
    return new NewOrder()
  }
  if ("CancelOrder" in obj) {
    return new CancelOrder()
  }
  if ("CheckHealth" in obj) {
    return new CheckHealth()
  }
  if ("PositionTransfer" in obj) {
    return new PositionTransfer()
  }
  if ("ConsumeEvents" in obj) {
    return new ConsumeEvents()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(
  obj: types.OperationTypeJSON
): types.OperationTypeKind {
  switch (obj.kind) {
    case "NewOrder": {
      return new NewOrder()
    }
    case "CancelOrder": {
      return new CancelOrder()
    }
    case "CheckHealth": {
      return new CheckHealth()
    }
    case "PositionTransfer": {
      return new PositionTransfer()
    }
    case "ConsumeEvents": {
      return new ConsumeEvents()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "NewOrder"),
    borsh.struct([], "CancelOrder"),
    borsh.struct([], "CheckHealth"),
    borsh.struct([], "PositionTransfer"),
    borsh.struct([], "ConsumeEvents"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
