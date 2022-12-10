import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface NewOrderParamsFields {
  side: types.SideKind
  maxBaseQty: types.FractionalFields
  orderType: types.OrderTypeKind
  selfTradeBehavior: types.SelfTradeBehaviorKind
  matchLimit: BN
  limitPrice: types.FractionalFields
}

export interface NewOrderParamsJSON {
  side: types.SideJSON
  maxBaseQty: types.FractionalJSON
  orderType: types.OrderTypeJSON
  selfTradeBehavior: types.SelfTradeBehaviorJSON
  matchLimit: string
  limitPrice: types.FractionalJSON
}

export class NewOrderParams {
  readonly side: types.SideKind
  readonly maxBaseQty: types.Fractional
  readonly orderType: types.OrderTypeKind
  readonly selfTradeBehavior: types.SelfTradeBehaviorKind
  readonly matchLimit: BN
  readonly limitPrice: types.Fractional

  constructor(fields: NewOrderParamsFields) {
    this.side = fields.side
    this.maxBaseQty = new types.Fractional({ ...fields.maxBaseQty })
    this.orderType = fields.orderType
    this.selfTradeBehavior = fields.selfTradeBehavior
    this.matchLimit = fields.matchLimit
    this.limitPrice = new types.Fractional({ ...fields.limitPrice })
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        types.Side.layout("side"),
        types.Fractional.layout("maxBaseQty"),
        types.OrderType.layout("orderType"),
        types.SelfTradeBehavior.layout("selfTradeBehavior"),
        borsh.u64("matchLimit"),
        types.Fractional.layout("limitPrice"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new NewOrderParams({
      side: types.Side.fromDecoded(obj.side),
      maxBaseQty: types.Fractional.fromDecoded(obj.maxBaseQty),
      orderType: types.OrderType.fromDecoded(obj.orderType),
      selfTradeBehavior: types.SelfTradeBehavior.fromDecoded(
        obj.selfTradeBehavior
      ),
      matchLimit: obj.matchLimit,
      limitPrice: types.Fractional.fromDecoded(obj.limitPrice),
    })
  }

  static toEncodable(fields: NewOrderParamsFields) {
    return {
      side: fields.side.toEncodable(),
      maxBaseQty: types.Fractional.toEncodable(fields.maxBaseQty),
      orderType: fields.orderType.toEncodable(),
      selfTradeBehavior: fields.selfTradeBehavior.toEncodable(),
      matchLimit: fields.matchLimit,
      limitPrice: types.Fractional.toEncodable(fields.limitPrice),
    }
  }

  toJSON(): NewOrderParamsJSON {
    return {
      side: this.side.toJSON(),
      maxBaseQty: this.maxBaseQty.toJSON(),
      orderType: this.orderType.toJSON(),
      selfTradeBehavior: this.selfTradeBehavior.toJSON(),
      matchLimit: this.matchLimit.toString(),
      limitPrice: this.limitPrice.toJSON(),
    }
  }

  static fromJSON(obj: NewOrderParamsJSON): NewOrderParams {
    return new NewOrderParams({
      side: types.Side.fromJSON(obj.side),
      maxBaseQty: types.Fractional.fromJSON(obj.maxBaseQty),
      orderType: types.OrderType.fromJSON(obj.orderType),
      selfTradeBehavior: types.SelfTradeBehavior.fromJSON(
        obj.selfTradeBehavior
      ),
      matchLimit: new BN(obj.matchLimit),
      limitPrice: types.Fractional.fromJSON(obj.limitPrice),
    })
  }

  toEncodable() {
    return NewOrderParams.toEncodable(this)
  }
}
