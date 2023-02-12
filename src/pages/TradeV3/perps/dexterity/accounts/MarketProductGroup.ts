import { PublicKey, Connection } from '@solana/web3.js'
import BN from 'bn.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types' // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId'

export interface MarketProductGroupFields {
  tag: types.AccountTag
  name: Array<number>
  authority: PublicKey
  successor: PublicKey
  vaultMint: PublicKey
  collectedFees: types.FractionalFields
  feeCollector: PublicKey
  decimals: BN
  riskEngineProgramId: PublicKey
  feeModelProgramId: PublicKey
  feeModelConfigurationAcct: PublicKey
  riskModelConfigurationAcct: PublicKey
  activeFlagsProducts: types.BitsetFields
  ewmaWindows: Array<BN>
  marketProducts: types.ProductArrayFields
  vaultBump: number
  riskAndFeeBump: number
  findFeesDiscriminantLen: number
  validateAccountDiscriminantLen: number
  findFeesDiscriminant: Array<number>
  validateAccountHealthDiscriminant: Array<number>
  validateAccountLiquidationDiscriminant: Array<number>
  createRiskStateAccountDiscriminant: Array<number>
  maxMakerFeeBps: number
  minMakerFeeBps: number
  maxTakerFeeBps: number
  minTakerFeeBps: number
  feeOutputRegister: PublicKey
  riskOutputRegister: PublicKey
  sequenceNumber: BN
}

export interface MarketProductGroupJSON {
  tag: types.AccountTagJSON
  name: Array<number>
  authority: string
  successor: string
  vaultMint: string
  collectedFees: types.FractionalJSON
  feeCollector: string
  decimals: string
  riskEngineProgramId: string
  feeModelProgramId: string
  feeModelConfigurationAcct: string
  riskModelConfigurationAcct: string
  activeFlagsProducts: types.BitsetJSON
  ewmaWindows: Array<string>
  marketProducts: types.ProductArrayJSON
  vaultBump: number
  riskAndFeeBump: number
  findFeesDiscriminantLen: number
  validateAccountDiscriminantLen: number
  findFeesDiscriminant: Array<number>
  validateAccountHealthDiscriminant: Array<number>
  validateAccountLiquidationDiscriminant: Array<number>
  createRiskStateAccountDiscriminant: Array<number>
  maxMakerFeeBps: number
  minMakerFeeBps: number
  maxTakerFeeBps: number
  minTakerFeeBps: number
  feeOutputRegister: string
  riskOutputRegister: string
  sequenceNumber: string
}

export class MarketProductGroup {
  readonly tag: types.AccountTag
  readonly name: Array<number>
  readonly authority: PublicKey
  readonly successor: PublicKey
  readonly vaultMint: PublicKey
  readonly collectedFees: types.Fractional
  readonly feeCollector: PublicKey
  readonly decimals: BN
  readonly riskEngineProgramId: PublicKey
  readonly feeModelProgramId: PublicKey
  readonly feeModelConfigurationAcct: PublicKey
  readonly riskModelConfigurationAcct: PublicKey
  readonly activeFlagsProducts: types.Bitset
  readonly ewmaWindows: Array<BN>
  readonly marketProducts: types.ProductArray
  readonly vaultBump: number
  readonly riskAndFeeBump: number
  readonly findFeesDiscriminantLen: number
  readonly validateAccountDiscriminantLen: number
  readonly findFeesDiscriminant: Array<number>
  readonly validateAccountHealthDiscriminant: Array<number>
  readonly validateAccountLiquidationDiscriminant: Array<number>
  readonly createRiskStateAccountDiscriminant: Array<number>
  readonly maxMakerFeeBps: number
  readonly minMakerFeeBps: number
  readonly maxTakerFeeBps: number
  readonly minTakerFeeBps: number
  readonly feeOutputRegister: PublicKey
  readonly riskOutputRegister: PublicKey
  readonly sequenceNumber: BN

  static readonly discriminator = Buffer.from([22, 77, 255, 134, 163, 41, 57, 134])

  static readonly layout = borsh.struct([
    types.AccountTag.layout('tag'),
    borsh.array(borsh.u8(), 16, 'name'),
    borsh.publicKey('authority'),
    borsh.publicKey('successor'),
    borsh.publicKey('vaultMint'),
    types.Fractional.layout('collectedFees'),
    borsh.publicKey('feeCollector'),
    borsh.u64('decimals'),
    borsh.publicKey('riskEngineProgramId'),
    borsh.publicKey('feeModelProgramId'),
    borsh.publicKey('feeModelConfigurationAcct'),
    borsh.publicKey('riskModelConfigurationAcct'),
    types.Bitset.layout('activeFlagsProducts'),
    borsh.array(borsh.u64(), 4, 'ewmaWindows'),
    types.ProductArray.layout('marketProducts'),
    borsh.u16('vaultBump'),
    borsh.u16('riskAndFeeBump'),
    borsh.u16('findFeesDiscriminantLen'),
    borsh.u16('validateAccountDiscriminantLen'),
    borsh.array(borsh.u8(), 8, 'findFeesDiscriminant'),
    borsh.array(borsh.u8(), 8, 'validateAccountHealthDiscriminant'),
    borsh.array(borsh.u8(), 8, 'validateAccountLiquidationDiscriminant'),
    borsh.array(borsh.u8(), 8, 'createRiskStateAccountDiscriminant'),
    borsh.i16('maxMakerFeeBps'),
    borsh.i16('minMakerFeeBps'),
    borsh.i16('maxTakerFeeBps'),
    borsh.i16('minTakerFeeBps'),
    borsh.publicKey('feeOutputRegister'),
    borsh.publicKey('riskOutputRegister'),
    borsh.u128('sequenceNumber')
  ])

  constructor(fields: MarketProductGroupFields) {
    this.tag = fields.tag
    this.name = fields.name
    this.authority = fields.authority
    this.successor = fields.successor
    this.vaultMint = fields.vaultMint
    this.collectedFees = new types.Fractional({ ...fields.collectedFees })
    this.feeCollector = fields.feeCollector
    this.decimals = fields.decimals
    this.riskEngineProgramId = fields.riskEngineProgramId
    this.feeModelProgramId = fields.feeModelProgramId
    this.feeModelConfigurationAcct = fields.feeModelConfigurationAcct
    this.riskModelConfigurationAcct = fields.riskModelConfigurationAcct
    this.activeFlagsProducts = new types.Bitset({
      ...fields.activeFlagsProducts
    })
    this.ewmaWindows = fields.ewmaWindows
    this.marketProducts = new types.ProductArray({ ...fields.marketProducts })
    this.vaultBump = fields.vaultBump
    this.riskAndFeeBump = fields.riskAndFeeBump
    this.findFeesDiscriminantLen = fields.findFeesDiscriminantLen
    this.validateAccountDiscriminantLen = fields.validateAccountDiscriminantLen
    this.findFeesDiscriminant = fields.findFeesDiscriminant
    this.validateAccountHealthDiscriminant = fields.validateAccountHealthDiscriminant
    this.validateAccountLiquidationDiscriminant = fields.validateAccountLiquidationDiscriminant
    this.createRiskStateAccountDiscriminant = fields.createRiskStateAccountDiscriminant
    this.maxMakerFeeBps = fields.maxMakerFeeBps
    this.minMakerFeeBps = fields.minMakerFeeBps
    this.maxTakerFeeBps = fields.maxTakerFeeBps
    this.minTakerFeeBps = fields.minTakerFeeBps
    this.feeOutputRegister = fields.feeOutputRegister
    this.riskOutputRegister = fields.riskOutputRegister
    this.sequenceNumber = fields.sequenceNumber
  }

  static async fetch(c: Connection, address: PublicKey): Promise<[MarketProductGroup, any] | null> {
    const info = await c.getAccountInfo(address)

    if (info === null) {
      return null
    }
    if (!info.owner.equals(PROGRAM_ID)) {
      throw new Error("account doesn't belong to this program")
    }

    return [this.decode(info.data), info]
  }

  static async fetchMultiple(c: Connection, addresses: PublicKey[]): Promise<Array<MarketProductGroup | null>> {
    const infos = await c.getMultipleAccountsInfo(addresses)

    return infos.map((info) => {
      if (info === null) {
        return null
      }
      if (!info.owner.equals(PROGRAM_ID)) {
        throw new Error("account doesn't belong to this program")
      }

      return this.decode(info.data)
    })
  }

  static decode(data: Buffer): MarketProductGroup {
    if (!data.slice(0, 8).equals(MarketProductGroup.discriminator)) {
      throw new Error('invalid account discriminator')
    }

    const dec = MarketProductGroup.layout.decode(data.slice(8))

    return new MarketProductGroup({
      tag: types.AccountTag.fromDecoded(dec.tag),
      name: dec.name,
      authority: dec.authority,
      successor: dec.successor,
      vaultMint: dec.vaultMint,
      collectedFees: types.Fractional.fromDecoded(dec.collectedFees),
      feeCollector: dec.feeCollector,
      decimals: dec.decimals,
      riskEngineProgramId: dec.riskEngineProgramId,
      feeModelProgramId: dec.feeModelProgramId,
      feeModelConfigurationAcct: dec.feeModelConfigurationAcct,
      riskModelConfigurationAcct: dec.riskModelConfigurationAcct,
      activeFlagsProducts: types.Bitset.fromDecoded(dec.activeFlagsProducts),
      ewmaWindows: dec.ewmaWindows,
      marketProducts: types.ProductArray.fromDecoded(dec.marketProducts),
      vaultBump: dec.vaultBump,
      riskAndFeeBump: dec.riskAndFeeBump,
      findFeesDiscriminantLen: dec.findFeesDiscriminantLen,
      validateAccountDiscriminantLen: dec.validateAccountDiscriminantLen,
      findFeesDiscriminant: dec.findFeesDiscriminant,
      validateAccountHealthDiscriminant: dec.validateAccountHealthDiscriminant,
      validateAccountLiquidationDiscriminant: dec.validateAccountLiquidationDiscriminant,
      createRiskStateAccountDiscriminant: dec.createRiskStateAccountDiscriminant,
      maxMakerFeeBps: dec.maxMakerFeeBps,
      minMakerFeeBps: dec.minMakerFeeBps,
      maxTakerFeeBps: dec.maxTakerFeeBps,
      minTakerFeeBps: dec.minTakerFeeBps,
      feeOutputRegister: dec.feeOutputRegister,
      riskOutputRegister: dec.riskOutputRegister,
      sequenceNumber: dec.sequenceNumber
    })
  }

  toJSON(): MarketProductGroupJSON {
    return {
      tag: this.tag.toJSON(),
      name: this.name,
      authority: this.authority.toString(),
      successor: this.successor.toString(),
      vaultMint: this.vaultMint.toString(),
      collectedFees: this.collectedFees.toJSON(),
      feeCollector: this.feeCollector.toString(),
      decimals: this.decimals.toString(),
      riskEngineProgramId: this.riskEngineProgramId.toString(),
      feeModelProgramId: this.feeModelProgramId.toString(),
      feeModelConfigurationAcct: this.feeModelConfigurationAcct.toString(),
      riskModelConfigurationAcct: this.riskModelConfigurationAcct.toString(),
      activeFlagsProducts: this.activeFlagsProducts.toJSON(),
      ewmaWindows: this.ewmaWindows.map((item) => item.toString()),
      marketProducts: this.marketProducts.toJSON(),
      vaultBump: this.vaultBump,
      riskAndFeeBump: this.riskAndFeeBump,
      findFeesDiscriminantLen: this.findFeesDiscriminantLen,
      validateAccountDiscriminantLen: this.validateAccountDiscriminantLen,
      findFeesDiscriminant: this.findFeesDiscriminant,
      validateAccountHealthDiscriminant: this.validateAccountHealthDiscriminant,
      validateAccountLiquidationDiscriminant: this.validateAccountLiquidationDiscriminant,
      createRiskStateAccountDiscriminant: this.createRiskStateAccountDiscriminant,
      maxMakerFeeBps: this.maxMakerFeeBps,
      minMakerFeeBps: this.minMakerFeeBps,
      maxTakerFeeBps: this.maxTakerFeeBps,
      minTakerFeeBps: this.minTakerFeeBps,
      feeOutputRegister: this.feeOutputRegister.toString(),
      riskOutputRegister: this.riskOutputRegister.toString(),
      sequenceNumber: this.sequenceNumber.toString()
    }
  }

  static fromJSON(obj: MarketProductGroupJSON): MarketProductGroup {
    return new MarketProductGroup({
      tag: types.AccountTag.fromJSON(obj.tag),
      name: obj.name,
      authority: new PublicKey(obj.authority),
      successor: new PublicKey(obj.successor),
      vaultMint: new PublicKey(obj.vaultMint),
      collectedFees: types.Fractional.fromJSON(obj.collectedFees),
      feeCollector: new PublicKey(obj.feeCollector),
      decimals: new BN(obj.decimals),
      riskEngineProgramId: new PublicKey(obj.riskEngineProgramId),
      feeModelProgramId: new PublicKey(obj.feeModelProgramId),
      feeModelConfigurationAcct: new PublicKey(obj.feeModelConfigurationAcct),
      riskModelConfigurationAcct: new PublicKey(obj.riskModelConfigurationAcct),
      activeFlagsProducts: types.Bitset.fromJSON(obj.activeFlagsProducts),
      ewmaWindows: obj.ewmaWindows.map((item) => new BN(item)),
      marketProducts: types.ProductArray.fromJSON(obj.marketProducts),
      vaultBump: obj.vaultBump,
      riskAndFeeBump: obj.riskAndFeeBump,
      findFeesDiscriminantLen: obj.findFeesDiscriminantLen,
      validateAccountDiscriminantLen: obj.validateAccountDiscriminantLen,
      findFeesDiscriminant: obj.findFeesDiscriminant,
      validateAccountHealthDiscriminant: obj.validateAccountHealthDiscriminant,
      validateAccountLiquidationDiscriminant: obj.validateAccountLiquidationDiscriminant,
      createRiskStateAccountDiscriminant: obj.createRiskStateAccountDiscriminant,
      maxMakerFeeBps: obj.maxMakerFeeBps,
      minMakerFeeBps: obj.minMakerFeeBps,
      maxTakerFeeBps: obj.maxTakerFeeBps,
      minTakerFeeBps: obj.minTakerFeeBps,
      feeOutputRegister: new PublicKey(obj.feeOutputRegister),
      riskOutputRegister: new PublicKey(obj.riskOutputRegister),
      sequenceNumber: new BN(obj.sequenceNumber)
    })
  }
}
