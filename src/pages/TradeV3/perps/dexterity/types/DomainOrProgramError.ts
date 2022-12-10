import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export type DexErrFields = [types.DexErrorKind]
export type DexErrValue = [types.DexErrorKind]

export interface DexErrJSON {
  kind: "DexErr"
  value: [types.DexErrorJSON]
}

export class DexErr {
  static readonly discriminator = 0
  static readonly kind = "DexErr"
  readonly discriminator = 0
  readonly kind = "DexErr"
  readonly value: DexErrValue

  constructor(value: DexErrFields) {
    this.value = [value[0]]
  }

  toJSON(): DexErrJSON {
    return {
      kind: "DexErr",
      value: [this.value[0].toJSON()],
    }
  }

  toEncodable() {
    return {
      DexErr: {
        _0: this.value[0].toEncodable(),
      },
    }
  }
}

export type UtilErrFields = [types.UtilErrorKind]
export type UtilErrValue = [types.UtilErrorKind]

export interface UtilErrJSON {
  kind: "UtilErr"
  value: [types.UtilErrorJSON]
}

export class UtilErr {
  static readonly discriminator = 1
  static readonly kind = "UtilErr"
  readonly discriminator = 1
  readonly kind = "UtilErr"
  readonly value: UtilErrValue

  constructor(value: UtilErrFields) {
    this.value = [value[0]]
  }

  toJSON(): UtilErrJSON {
    return {
      kind: "UtilErr",
      value: [this.value[0].toJSON()],
    }
  }

  toEncodable() {
    return {
      UtilErr: {
        _0: this.value[0].toEncodable(),
      },
    }
  }
}

export type ProgramErrFields = [types.ProgramErrorFields]
export type ProgramErrValue = [types.ProgramError]

export interface ProgramErrJSON {
  kind: "ProgramErr"
  value: [types.ProgramErrorJSON]
}

export class ProgramErr {
  static readonly discriminator = 2
  static readonly kind = "ProgramErr"
  readonly discriminator = 2
  readonly kind = "ProgramErr"
  readonly value: ProgramErrValue

  constructor(value: ProgramErrFields) {
    this.value = [new types.ProgramError({ ...value[0] })]
  }

  toJSON(): ProgramErrJSON {
    return {
      kind: "ProgramErr",
      value: [this.value[0].toJSON()],
    }
  }

  toEncodable() {
    return {
      ProgramErr: {
        _0: types.ProgramError.toEncodable(this.value[0]),
      },
    }
  }
}

export type OtherFields = {
  code: number
  msg: string
}
export type OtherValue = {
  code: number
  msg: string
}

export interface OtherJSON {
  kind: "Other"
  value: {
    code: number
    msg: string
  }
}

export class Other {
  static readonly discriminator = 3
  static readonly kind = "Other"
  readonly discriminator = 3
  readonly kind = "Other"
  readonly value: OtherValue

  constructor(value: OtherFields) {
    this.value = {
      code: value.code,
      msg: value.msg,
    }
  }

  toJSON(): OtherJSON {
    return {
      kind: "Other",
      value: {
        code: this.value.code,
        msg: this.value.msg,
      },
    }
  }

  toEncodable() {
    return {
      Other: {
        code: this.value.code,
        msg: this.value.msg,
      },
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.DomainOrProgramErrorKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("DexErr" in obj) {
    const val = obj["DexErr"]
    return new DexErr([types.DexError.fromDecoded(val["_0"])])
  }
  if ("UtilErr" in obj) {
    const val = obj["UtilErr"]
    return new UtilErr([types.UtilError.fromDecoded(val["_0"])])
  }
  if ("ProgramErr" in obj) {
    const val = obj["ProgramErr"]
    return new ProgramErr([types.ProgramError.fromDecoded(val["_0"])])
  }
  if ("Other" in obj) {
    const val = obj["Other"]
    return new Other({
      code: val["code"],
      msg: val["msg"],
    })
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(
  obj: types.DomainOrProgramErrorJSON
): types.DomainOrProgramErrorKind {
  switch (obj.kind) {
    case "DexErr": {
      return new DexErr([types.DexError.fromJSON(obj.value[0])])
    }
    case "UtilErr": {
      return new UtilErr([types.UtilError.fromJSON(obj.value[0])])
    }
    case "ProgramErr": {
      return new ProgramErr([types.ProgramError.fromJSON(obj.value[0])])
    }
    case "Other": {
      return new Other({
        code: obj.value.code,
        msg: obj.value.msg,
      })
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([types.DexError.layout("_0")], "DexErr"),
    borsh.struct([types.UtilError.layout("_0")], "UtilErr"),
    borsh.struct([types.ProgramError.layout("_0")], "ProgramErr"),
    borsh.struct([borsh.u32("code"), borsh.str("msg")], "Other"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
