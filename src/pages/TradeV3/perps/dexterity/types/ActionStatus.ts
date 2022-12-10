import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface ApprovedJSON {
  kind: "Approved"
}

export class Approved {
  static readonly discriminator = 0
  static readonly kind = "Approved"
  readonly discriminator = 0
  readonly kind = "Approved"

  toJSON(): ApprovedJSON {
    return {
      kind: "Approved",
    }
  }

  toEncodable() {
    return {
      Approved: {},
    }
  }
}

export interface NotApprovedJSON {
  kind: "NotApproved"
}

export class NotApproved {
  static readonly discriminator = 1
  static readonly kind = "NotApproved"
  readonly discriminator = 1
  readonly kind = "NotApproved"

  toJSON(): NotApprovedJSON {
    return {
      kind: "NotApproved",
    }
  }

  toEncodable() {
    return {
      NotApproved: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.ActionStatusKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("Approved" in obj) {
    return new Approved()
  }
  if ("NotApproved" in obj) {
    return new NotApproved()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(obj: types.ActionStatusJSON): types.ActionStatusKind {
  switch (obj.kind) {
    case "Approved": {
      return new Approved()
    }
    case "NotApproved": {
      return new NotApproved()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "Approved"),
    borsh.struct([], "NotApproved"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
