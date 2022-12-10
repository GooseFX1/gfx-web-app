import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface InitializeMarketProductGroupParamsFields {
  name: Array<number>
  validateAccountDiscriminantLen: BN
  findFeesDiscriminantLen: BN
  validateAccountHealthDiscriminant: Array<number>
  validateAccountLiquidationDiscriminant: Array<number>
  createRiskStateAccountDiscriminant: Array<number>
  findFeesDiscriminant: Array<number>
  maxMakerFeeBps: number
  minMakerFeeBps: number
  maxTakerFeeBps: number
  minTakerFeeBps: number
}

export interface InitializeMarketProductGroupParamsJSON {
  name: Array<number>
  validateAccountDiscriminantLen: string
  findFeesDiscriminantLen: string
  validateAccountHealthDiscriminant: Array<number>
  validateAccountLiquidationDiscriminant: Array<number>
  createRiskStateAccountDiscriminant: Array<number>
  findFeesDiscriminant: Array<number>
  maxMakerFeeBps: number
  minMakerFeeBps: number
  maxTakerFeeBps: number
  minTakerFeeBps: number
}

export class InitializeMarketProductGroupParams {
  readonly name: Array<number>
  readonly validateAccountDiscriminantLen: BN
  readonly findFeesDiscriminantLen: BN
  readonly validateAccountHealthDiscriminant: Array<number>
  readonly validateAccountLiquidationDiscriminant: Array<number>
  readonly createRiskStateAccountDiscriminant: Array<number>
  readonly findFeesDiscriminant: Array<number>
  readonly maxMakerFeeBps: number
  readonly minMakerFeeBps: number
  readonly maxTakerFeeBps: number
  readonly minTakerFeeBps: number

  constructor(fields: InitializeMarketProductGroupParamsFields) {
    this.name = fields.name
    this.validateAccountDiscriminantLen = fields.validateAccountDiscriminantLen
    this.findFeesDiscriminantLen = fields.findFeesDiscriminantLen
    this.validateAccountHealthDiscriminant =
      fields.validateAccountHealthDiscriminant
    this.validateAccountLiquidationDiscriminant =
      fields.validateAccountLiquidationDiscriminant
    this.createRiskStateAccountDiscriminant =
      fields.createRiskStateAccountDiscriminant
    this.findFeesDiscriminant = fields.findFeesDiscriminant
    this.maxMakerFeeBps = fields.maxMakerFeeBps
    this.minMakerFeeBps = fields.minMakerFeeBps
    this.maxTakerFeeBps = fields.maxTakerFeeBps
    this.minTakerFeeBps = fields.minTakerFeeBps
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.array(borsh.u8(), 16, "name"),
        borsh.u64("validateAccountDiscriminantLen"),
        borsh.u64("findFeesDiscriminantLen"),
        borsh.array(borsh.u8(), 8, "validateAccountHealthDiscriminant"),
        borsh.array(borsh.u8(), 8, "validateAccountLiquidationDiscriminant"),
        borsh.array(borsh.u8(), 8, "createRiskStateAccountDiscriminant"),
        borsh.array(borsh.u8(), 8, "findFeesDiscriminant"),
        borsh.i16("maxMakerFeeBps"),
        borsh.i16("minMakerFeeBps"),
        borsh.i16("maxTakerFeeBps"),
        borsh.i16("minTakerFeeBps"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new InitializeMarketProductGroupParams({
      name: obj.name,
      validateAccountDiscriminantLen: obj.validateAccountDiscriminantLen,
      findFeesDiscriminantLen: obj.findFeesDiscriminantLen,
      validateAccountHealthDiscriminant: obj.validateAccountHealthDiscriminant,
      validateAccountLiquidationDiscriminant:
        obj.validateAccountLiquidationDiscriminant,
      createRiskStateAccountDiscriminant:
        obj.createRiskStateAccountDiscriminant,
      findFeesDiscriminant: obj.findFeesDiscriminant,
      maxMakerFeeBps: obj.maxMakerFeeBps,
      minMakerFeeBps: obj.minMakerFeeBps,
      maxTakerFeeBps: obj.maxTakerFeeBps,
      minTakerFeeBps: obj.minTakerFeeBps,
    })
  }

  static toEncodable(fields: InitializeMarketProductGroupParamsFields) {
    return {
      name: fields.name,
      validateAccountDiscriminantLen: fields.validateAccountDiscriminantLen,
      findFeesDiscriminantLen: fields.findFeesDiscriminantLen,
      validateAccountHealthDiscriminant:
        fields.validateAccountHealthDiscriminant,
      validateAccountLiquidationDiscriminant:
        fields.validateAccountLiquidationDiscriminant,
      createRiskStateAccountDiscriminant:
        fields.createRiskStateAccountDiscriminant,
      findFeesDiscriminant: fields.findFeesDiscriminant,
      maxMakerFeeBps: fields.maxMakerFeeBps,
      minMakerFeeBps: fields.minMakerFeeBps,
      maxTakerFeeBps: fields.maxTakerFeeBps,
      minTakerFeeBps: fields.minTakerFeeBps,
    }
  }

  toJSON(): InitializeMarketProductGroupParamsJSON {
    return {
      name: this.name,
      validateAccountDiscriminantLen:
        this.validateAccountDiscriminantLen.toString(),
      findFeesDiscriminantLen: this.findFeesDiscriminantLen.toString(),
      validateAccountHealthDiscriminant: this.validateAccountHealthDiscriminant,
      validateAccountLiquidationDiscriminant:
        this.validateAccountLiquidationDiscriminant,
      createRiskStateAccountDiscriminant:
        this.createRiskStateAccountDiscriminant,
      findFeesDiscriminant: this.findFeesDiscriminant,
      maxMakerFeeBps: this.maxMakerFeeBps,
      minMakerFeeBps: this.minMakerFeeBps,
      maxTakerFeeBps: this.maxTakerFeeBps,
      minTakerFeeBps: this.minTakerFeeBps,
    }
  }

  static fromJSON(
    obj: InitializeMarketProductGroupParamsJSON
  ): InitializeMarketProductGroupParams {
    return new InitializeMarketProductGroupParams({
      name: obj.name,
      validateAccountDiscriminantLen: new BN(
        obj.validateAccountDiscriminantLen
      ),
      findFeesDiscriminantLen: new BN(obj.findFeesDiscriminantLen),
      validateAccountHealthDiscriminant: obj.validateAccountHealthDiscriminant,
      validateAccountLiquidationDiscriminant:
        obj.validateAccountLiquidationDiscriminant,
      createRiskStateAccountDiscriminant:
        obj.createRiskStateAccountDiscriminant,
      findFeesDiscriminant: obj.findFeesDiscriminant,
      maxMakerFeeBps: obj.maxMakerFeeBps,
      minMakerFeeBps: obj.minMakerFeeBps,
      maxTakerFeeBps: obj.maxTakerFeeBps,
      minTakerFeeBps: obj.minTakerFeeBps,
    })
  }

  toEncodable() {
    return InitializeMarketProductGroupParams.toEncodable(this)
  }
}
