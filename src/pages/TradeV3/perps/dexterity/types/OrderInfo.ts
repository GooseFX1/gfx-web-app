import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface OrderInfoFields {
  totalOrderQty: types.FractionalFields
  matchedOrderQty: types.FractionalFields
  orderSide: types.SideKind
  isCombo: boolean
  productIndex: types.usizeFields
  operationType: types.OperationTypeKind
  oldAskQtyInBook: types.FractionalFields
  oldBidQtyInBook: types.FractionalFields
}

export interface OrderInfoJSON {
  totalOrderQty: types.FractionalJSON
  matchedOrderQty: types.FractionalJSON
  orderSide: types.SideJSON
  isCombo: boolean
  productIndex: types.usizeJSON
  operationType: types.OperationTypeJSON
  oldAskQtyInBook: types.FractionalJSON
  oldBidQtyInBook: types.FractionalJSON
}

export class OrderInfo {
  readonly totalOrderQty: types.Fractional
  readonly matchedOrderQty: types.Fractional
  readonly orderSide: types.SideKind
  readonly isCombo: boolean
  readonly productIndex: types.usize
  readonly operationType: types.OperationTypeKind
  readonly oldAskQtyInBook: types.Fractional
  readonly oldBidQtyInBook: types.Fractional

  constructor(fields: OrderInfoFields) {
    this.totalOrderQty = new types.Fractional({ ...fields.totalOrderQty })
    this.matchedOrderQty = new types.Fractional({ ...fields.matchedOrderQty })
    this.orderSide = fields.orderSide
    this.isCombo = fields.isCombo
    this.productIndex = new types.usize({ ...fields.productIndex })
    this.operationType = fields.operationType
    this.oldAskQtyInBook = new types.Fractional({ ...fields.oldAskQtyInBook })
    this.oldBidQtyInBook = new types.Fractional({ ...fields.oldBidQtyInBook })
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        types.Fractional.layout("totalOrderQty"),
        types.Fractional.layout("matchedOrderQty"),
        types.Side.layout("orderSide"),
        borsh.bool("isCombo"),
        types.usize.layout("productIndex"),
        types.OperationType.layout("operationType"),
        types.Fractional.layout("oldAskQtyInBook"),
        types.Fractional.layout("oldBidQtyInBook"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new OrderInfo({
      totalOrderQty: types.Fractional.fromDecoded(obj.totalOrderQty),
      matchedOrderQty: types.Fractional.fromDecoded(obj.matchedOrderQty),
      orderSide: types.Side.fromDecoded(obj.orderSide),
      isCombo: obj.isCombo,
      productIndex: types.usize.fromDecoded(obj.productIndex),
      operationType: types.OperationType.fromDecoded(obj.operationType),
      oldAskQtyInBook: types.Fractional.fromDecoded(obj.oldAskQtyInBook),
      oldBidQtyInBook: types.Fractional.fromDecoded(obj.oldBidQtyInBook),
    })
  }

  static toEncodable(fields: OrderInfoFields) {
    return {
      totalOrderQty: types.Fractional.toEncodable(fields.totalOrderQty),
      matchedOrderQty: types.Fractional.toEncodable(fields.matchedOrderQty),
      orderSide: fields.orderSide.toEncodable(),
      isCombo: fields.isCombo,
      productIndex: types.usize.toEncodable(fields.productIndex),
      operationType: fields.operationType.toEncodable(),
      oldAskQtyInBook: types.Fractional.toEncodable(fields.oldAskQtyInBook),
      oldBidQtyInBook: types.Fractional.toEncodable(fields.oldBidQtyInBook),
    }
  }

  toJSON(): OrderInfoJSON {
    return {
      totalOrderQty: this.totalOrderQty.toJSON(),
      matchedOrderQty: this.matchedOrderQty.toJSON(),
      orderSide: this.orderSide.toJSON(),
      isCombo: this.isCombo,
      productIndex: this.productIndex.toJSON(),
      operationType: this.operationType.toJSON(),
      oldAskQtyInBook: this.oldAskQtyInBook.toJSON(),
      oldBidQtyInBook: this.oldBidQtyInBook.toJSON(),
    }
  }

  static fromJSON(obj: OrderInfoJSON): OrderInfo {
    return new OrderInfo({
      totalOrderQty: types.Fractional.fromJSON(obj.totalOrderQty),
      matchedOrderQty: types.Fractional.fromJSON(obj.matchedOrderQty),
      orderSide: types.Side.fromJSON(obj.orderSide),
      isCombo: obj.isCombo,
      productIndex: types.usize.fromJSON(obj.productIndex),
      operationType: types.OperationType.fromJSON(obj.operationType),
      oldAskQtyInBook: types.Fractional.fromJSON(obj.oldAskQtyInBook),
      oldBidQtyInBook: types.Fractional.fromJSON(obj.oldBidQtyInBook),
    })
  }

  toEncodable() {
    return OrderInfo.toEncodable(this)
  }
}
