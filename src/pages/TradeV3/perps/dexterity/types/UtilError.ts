import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface AccountAlreadyInitializedJSON {
  kind: "AccountAlreadyInitialized"
}

export class AccountAlreadyInitialized {
  static readonly discriminator = 0
  static readonly kind = "AccountAlreadyInitialized"
  readonly discriminator = 0
  readonly kind = "AccountAlreadyInitialized"

  toJSON(): AccountAlreadyInitializedJSON {
    return {
      kind: "AccountAlreadyInitialized",
    }
  }

  toEncodable() {
    return {
      AccountAlreadyInitialized: {},
    }
  }
}

export interface AccountUninitializedJSON {
  kind: "AccountUninitialized"
}

export class AccountUninitialized {
  static readonly discriminator = 1
  static readonly kind = "AccountUninitialized"
  readonly discriminator = 1
  readonly kind = "AccountUninitialized"

  toJSON(): AccountUninitializedJSON {
    return {
      kind: "AccountUninitialized",
    }
  }

  toEncodable() {
    return {
      AccountUninitialized: {},
    }
  }
}

export interface DuplicateProductKeyJSON {
  kind: "DuplicateProductKey"
}

export class DuplicateProductKey {
  static readonly discriminator = 2
  static readonly kind = "DuplicateProductKey"
  readonly discriminator = 2
  readonly kind = "DuplicateProductKey"

  toJSON(): DuplicateProductKeyJSON {
    return {
      kind: "DuplicateProductKey",
    }
  }

  toEncodable() {
    return {
      DuplicateProductKey: {},
    }
  }
}

export interface PublicKeyMismatchJSON {
  kind: "PublicKeyMismatch"
}

export class PublicKeyMismatch {
  static readonly discriminator = 3
  static readonly kind = "PublicKeyMismatch"
  readonly discriminator = 3
  readonly kind = "PublicKeyMismatch"

  toJSON(): PublicKeyMismatchJSON {
    return {
      kind: "PublicKeyMismatch",
    }
  }

  toEncodable() {
    return {
      PublicKeyMismatch: {},
    }
  }
}

export interface AssertionErrorJSON {
  kind: "AssertionError"
}

export class AssertionError {
  static readonly discriminator = 4
  static readonly kind = "AssertionError"
  readonly discriminator = 4
  readonly kind = "AssertionError"

  toJSON(): AssertionErrorJSON {
    return {
      kind: "AssertionError",
    }
  }

  toEncodable() {
    return {
      AssertionError: {},
    }
  }
}

export interface InvalidMintAuthorityJSON {
  kind: "InvalidMintAuthority"
}

export class InvalidMintAuthority {
  static readonly discriminator = 5
  static readonly kind = "InvalidMintAuthority"
  readonly discriminator = 5
  readonly kind = "InvalidMintAuthority"

  toJSON(): InvalidMintAuthorityJSON {
    return {
      kind: "InvalidMintAuthority",
    }
  }

  toEncodable() {
    return {
      InvalidMintAuthority: {},
    }
  }
}

export interface IncorrectOwnerJSON {
  kind: "IncorrectOwner"
}

export class IncorrectOwner {
  static readonly discriminator = 6
  static readonly kind = "IncorrectOwner"
  readonly discriminator = 6
  readonly kind = "IncorrectOwner"

  toJSON(): IncorrectOwnerJSON {
    return {
      kind: "IncorrectOwner",
    }
  }

  toEncodable() {
    return {
      IncorrectOwner: {},
    }
  }
}

export interface PublicKeysShouldBeUniqueJSON {
  kind: "PublicKeysShouldBeUnique"
}

export class PublicKeysShouldBeUnique {
  static readonly discriminator = 7
  static readonly kind = "PublicKeysShouldBeUnique"
  readonly discriminator = 7
  readonly kind = "PublicKeysShouldBeUnique"

  toJSON(): PublicKeysShouldBeUniqueJSON {
    return {
      kind: "PublicKeysShouldBeUnique",
    }
  }

  toEncodable() {
    return {
      PublicKeysShouldBeUnique: {},
    }
  }
}

export interface NotRentExemptJSON {
  kind: "NotRentExempt"
}

export class NotRentExempt {
  static readonly discriminator = 8
  static readonly kind = "NotRentExempt"
  readonly discriminator = 8
  readonly kind = "NotRentExempt"

  toJSON(): NotRentExemptJSON {
    return {
      kind: "NotRentExempt",
    }
  }

  toEncodable() {
    return {
      NotRentExempt: {},
    }
  }
}

export interface NumericalOverflowJSON {
  kind: "NumericalOverflow"
}

export class NumericalOverflow {
  static readonly discriminator = 9
  static readonly kind = "NumericalOverflow"
  readonly discriminator = 9
  readonly kind = "NumericalOverflow"

  toJSON(): NumericalOverflowJSON {
    return {
      kind: "NumericalOverflow",
    }
  }

  toEncodable() {
    return {
      NumericalOverflow: {},
    }
  }
}

export interface RoundErrorJSON {
  kind: "RoundError"
}

export class RoundError {
  static readonly discriminator = 10
  static readonly kind = "RoundError"
  readonly discriminator = 10
  readonly kind = "RoundError"

  toJSON(): RoundErrorJSON {
    return {
      kind: "RoundError",
    }
  }

  toEncodable() {
    return {
      RoundError: {},
    }
  }
}

export interface DivisionbyZeroJSON {
  kind: "DivisionbyZero"
}

export class DivisionbyZero {
  static readonly discriminator = 11
  static readonly kind = "DivisionbyZero"
  readonly discriminator = 11
  readonly kind = "DivisionbyZero"

  toJSON(): DivisionbyZeroJSON {
    return {
      kind: "DivisionbyZero",
    }
  }

  toEncodable() {
    return {
      DivisionbyZero: {},
    }
  }
}

export interface InvalidReturnValueJSON {
  kind: "InvalidReturnValue"
}

export class InvalidReturnValue {
  static readonly discriminator = 12
  static readonly kind = "InvalidReturnValue"
  readonly discriminator = 12
  readonly kind = "InvalidReturnValue"

  toJSON(): InvalidReturnValueJSON {
    return {
      kind: "InvalidReturnValue",
    }
  }

  toEncodable() {
    return {
      InvalidReturnValue: {},
    }
  }
}

export interface SqrtRootErrorJSON {
  kind: "SqrtRootError"
}

export class SqrtRootError {
  static readonly discriminator = 13
  static readonly kind = "SqrtRootError"
  readonly discriminator = 13
  readonly kind = "SqrtRootError"

  toJSON(): SqrtRootErrorJSON {
    return {
      kind: "SqrtRootError",
    }
  }

  toEncodable() {
    return {
      SqrtRootError: {},
    }
  }
}

export interface ZeroPriceErrorJSON {
  kind: "ZeroPriceError"
}

export class ZeroPriceError {
  static readonly discriminator = 14
  static readonly kind = "ZeroPriceError"
  readonly discriminator = 14
  readonly kind = "ZeroPriceError"

  toJSON(): ZeroPriceErrorJSON {
    return {
      kind: "ZeroPriceError",
    }
  }

  toEncodable() {
    return {
      ZeroPriceError: {},
    }
  }
}

export interface ZeroQuantityErrorJSON {
  kind: "ZeroQuantityError"
}

export class ZeroQuantityError {
  static readonly discriminator = 15
  static readonly kind = "ZeroQuantityError"
  readonly discriminator = 15
  readonly kind = "ZeroQuantityError"

  toJSON(): ZeroQuantityErrorJSON {
    return {
      kind: "ZeroQuantityError",
    }
  }

  toEncodable() {
    return {
      ZeroQuantityError: {},
    }
  }
}

export interface SerializeErrorJSON {
  kind: "SerializeError"
}

export class SerializeError {
  static readonly discriminator = 16
  static readonly kind = "SerializeError"
  readonly discriminator = 16
  readonly kind = "SerializeError"

  toJSON(): SerializeErrorJSON {
    return {
      kind: "SerializeError",
    }
  }

  toEncodable() {
    return {
      SerializeError: {},
    }
  }
}

export interface DeserializeErrorJSON {
  kind: "DeserializeError"
}

export class DeserializeError {
  static readonly discriminator = 17
  static readonly kind = "DeserializeError"
  readonly discriminator = 17
  readonly kind = "DeserializeError"

  toJSON(): DeserializeErrorJSON {
    return {
      kind: "DeserializeError",
    }
  }

  toEncodable() {
    return {
      DeserializeError: {},
    }
  }
}

export interface InvalidBitsetIndexJSON {
  kind: "InvalidBitsetIndex"
}

export class InvalidBitsetIndex {
  static readonly discriminator = 18
  static readonly kind = "InvalidBitsetIndex"
  readonly discriminator = 18
  readonly kind = "InvalidBitsetIndex"

  toJSON(): InvalidBitsetIndexJSON {
    return {
      kind: "InvalidBitsetIndex",
    }
  }

  toEncodable() {
    return {
      InvalidBitsetIndex: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.UtilErrorKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("AccountAlreadyInitialized" in obj) {
    return new AccountAlreadyInitialized()
  }
  if ("AccountUninitialized" in obj) {
    return new AccountUninitialized()
  }
  if ("DuplicateProductKey" in obj) {
    return new DuplicateProductKey()
  }
  if ("PublicKeyMismatch" in obj) {
    return new PublicKeyMismatch()
  }
  if ("AssertionError" in obj) {
    return new AssertionError()
  }
  if ("InvalidMintAuthority" in obj) {
    return new InvalidMintAuthority()
  }
  if ("IncorrectOwner" in obj) {
    return new IncorrectOwner()
  }
  if ("PublicKeysShouldBeUnique" in obj) {
    return new PublicKeysShouldBeUnique()
  }
  if ("NotRentExempt" in obj) {
    return new NotRentExempt()
  }
  if ("NumericalOverflow" in obj) {
    return new NumericalOverflow()
  }
  if ("RoundError" in obj) {
    return new RoundError()
  }
  if ("DivisionbyZero" in obj) {
    return new DivisionbyZero()
  }
  if ("InvalidReturnValue" in obj) {
    return new InvalidReturnValue()
  }
  if ("SqrtRootError" in obj) {
    return new SqrtRootError()
  }
  if ("ZeroPriceError" in obj) {
    return new ZeroPriceError()
  }
  if ("ZeroQuantityError" in obj) {
    return new ZeroQuantityError()
  }
  if ("SerializeError" in obj) {
    return new SerializeError()
  }
  if ("DeserializeError" in obj) {
    return new DeserializeError()
  }
  if ("InvalidBitsetIndex" in obj) {
    return new InvalidBitsetIndex()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(obj: types.UtilErrorJSON): types.UtilErrorKind {
  switch (obj.kind) {
    case "AccountAlreadyInitialized": {
      return new AccountAlreadyInitialized()
    }
    case "AccountUninitialized": {
      return new AccountUninitialized()
    }
    case "DuplicateProductKey": {
      return new DuplicateProductKey()
    }
    case "PublicKeyMismatch": {
      return new PublicKeyMismatch()
    }
    case "AssertionError": {
      return new AssertionError()
    }
    case "InvalidMintAuthority": {
      return new InvalidMintAuthority()
    }
    case "IncorrectOwner": {
      return new IncorrectOwner()
    }
    case "PublicKeysShouldBeUnique": {
      return new PublicKeysShouldBeUnique()
    }
    case "NotRentExempt": {
      return new NotRentExempt()
    }
    case "NumericalOverflow": {
      return new NumericalOverflow()
    }
    case "RoundError": {
      return new RoundError()
    }
    case "DivisionbyZero": {
      return new DivisionbyZero()
    }
    case "InvalidReturnValue": {
      return new InvalidReturnValue()
    }
    case "SqrtRootError": {
      return new SqrtRootError()
    }
    case "ZeroPriceError": {
      return new ZeroPriceError()
    }
    case "ZeroQuantityError": {
      return new ZeroQuantityError()
    }
    case "SerializeError": {
      return new SerializeError()
    }
    case "DeserializeError": {
      return new DeserializeError()
    }
    case "InvalidBitsetIndex": {
      return new InvalidBitsetIndex()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "AccountAlreadyInitialized"),
    borsh.struct([], "AccountUninitialized"),
    borsh.struct([], "DuplicateProductKey"),
    borsh.struct([], "PublicKeyMismatch"),
    borsh.struct([], "AssertionError"),
    borsh.struct([], "InvalidMintAuthority"),
    borsh.struct([], "IncorrectOwner"),
    borsh.struct([], "PublicKeysShouldBeUnique"),
    borsh.struct([], "NotRentExempt"),
    borsh.struct([], "NumericalOverflow"),
    borsh.struct([], "RoundError"),
    borsh.struct([], "DivisionbyZero"),
    borsh.struct([], "InvalidReturnValue"),
    borsh.struct([], "SqrtRootError"),
    borsh.struct([], "ZeroPriceError"),
    borsh.struct([], "ZeroQuantityError"),
    borsh.struct([], "SerializeError"),
    borsh.struct([], "DeserializeError"),
    borsh.struct([], "InvalidBitsetIndex"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
