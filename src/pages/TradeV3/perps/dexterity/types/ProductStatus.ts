import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface UninitializedJSON {
  kind: "Uninitialized"
}

export class Uninitialized {
  static readonly discriminator = 0
  static readonly kind = "Uninitialized"
  readonly discriminator = 0
  readonly kind = "Uninitialized"

  toJSON(): UninitializedJSON {
    return {
      kind: "Uninitialized",
    }
  }

  toEncodable() {
    return {
      Uninitialized: {},
    }
  }
}

export interface InitializedJSON {
  kind: "Initialized"
}

export class Initialized {
  static readonly discriminator = 1
  static readonly kind = "Initialized"
  readonly discriminator = 1
  readonly kind = "Initialized"

  toJSON(): InitializedJSON {
    return {
      kind: "Initialized",
    }
  }

  toEncodable() {
    return {
      Initialized: {},
    }
  }
}

export interface ExpiredJSON {
  kind: "Expired"
}

export class Expired {
  static readonly discriminator = 2
  static readonly kind = "Expired"
  readonly discriminator = 2
  readonly kind = "Expired"

  toJSON(): ExpiredJSON {
    return {
      kind: "Expired",
    }
  }

  toEncodable() {
    return {
      Expired: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.ProductStatusKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("Uninitialized" in obj) {
    return new Uninitialized()
  }
  if ("Initialized" in obj) {
    return new Initialized()
  }
  if ("Expired" in obj) {
    return new Expired()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(
  obj: types.ProductStatusJSON
): types.ProductStatusKind {
  switch (obj.kind) {
    case "Uninitialized": {
      return new Uninitialized()
    }
    case "Initialized": {
      return new Initialized()
    }
    case "Expired": {
      return new Expired()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "Uninitialized"),
    borsh.struct([], "Initialized"),
    borsh.struct([], "Expired"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
