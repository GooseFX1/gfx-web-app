import { PublicKey, Connection } from '@solana/web3.js'
import BN from 'bn.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types' // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId'

export interface TraderRiskGroupFields {
  tag: types.AccountTag
  marketProductGroup: PublicKey
  owner: PublicKey
  activeProducts: Array<number>
  totalDeposited: types.FractionalFields
  totalWithdrawn: types.FractionalFields
  cashBalance: types.FractionalFields
  pendingCashBalance: types.FractionalFields
  pendingFees: types.FractionalFields
  validUntil: BN
  makerFeeBps: number
  takerFeeBps: number
  traderPositions: Array<types.TraderPositionFields>
  riskStateAccount: PublicKey
  feeStateAccount: PublicKey
  clientOrderId: BN
  openOrders: types.OpenOrdersFields
  tradeHistory: Array<types.TradeHistoryFields>
  fundingBalance: types.FractionalFields
  referral: PublicKey
  pendingRewardBalance: types.FractionalFields
  padding: Array<number>
  avgPosition: Array<types.AveragePositionFields>
  totalTradedVolume: types.FractionalFields
}

export interface TraderRiskGroupJSON {
  tag: types.AccountTagJSON
  marketProductGroup: string
  owner: string
  activeProducts: Array<number>
  totalDeposited: types.FractionalJSON
  totalWithdrawn: types.FractionalJSON
  cashBalance: types.FractionalJSON
  pendingCashBalance: types.FractionalJSON
  pendingFees: types.FractionalJSON
  validUntil: string
  makerFeeBps: number
  takerFeeBps: number
  traderPositions: Array<types.TraderPositionJSON>
  riskStateAccount: string
  feeStateAccount: string
  clientOrderId: string
  openOrders: types.OpenOrdersJSON
  tradeHistory: Array<types.TradeHistoryJSON>
  fundingBalance: types.FractionalJSON
  referral: string
  pendingRewardBalance: types.FractionalJSON
  padding: Array<number>
  avgPosition: Array<types.AveragePositionJSON>
  totalTradedVolume: types.FractionalJSON
}

export class TraderRiskGroup {
  readonly tag: types.AccountTag
  readonly marketProductGroup: PublicKey
  readonly owner: PublicKey
  readonly activeProducts: Array<number>
  readonly totalDeposited: types.Fractional
  readonly totalWithdrawn: types.Fractional
  readonly cashBalance: types.Fractional
  readonly pendingCashBalance: types.Fractional
  readonly pendingFees: types.Fractional
  readonly validUntil: BN
  readonly makerFeeBps: number
  readonly takerFeeBps: number
  readonly traderPositions: Array<types.TraderPosition>
  readonly riskStateAccount: PublicKey
  readonly feeStateAccount: PublicKey
  readonly clientOrderId: BN
  readonly openOrders: types.OpenOrders
  readonly tradeHistory: Array<types.TradeHistory>
  readonly fundingBalance: types.Fractional
  readonly referral: PublicKey
  readonly pendingRewardBalance: types.Fractional
  readonly padding: Array<number>
  readonly avgPosition: Array<types.AveragePosition>
  readonly totalTradedVolume: types.Fractional

  static readonly discriminator = Buffer.from([121, 228, 110, 56, 254, 207, 245, 168])

  static readonly layout = borsh.struct([
    types.AccountTag.layout('tag'),
    borsh.publicKey('marketProductGroup'),
    borsh.publicKey('owner'),
    borsh.array(borsh.u8(), 16, 'activeProducts'),
    types.Fractional.layout('totalDeposited'),
    types.Fractional.layout('totalWithdrawn'),
    types.Fractional.layout('cashBalance'),
    types.Fractional.layout('pendingCashBalance'),
    types.Fractional.layout('pendingFees'),
    borsh.i64('validUntil'),
    borsh.i32('makerFeeBps'),
    borsh.i32('takerFeeBps'),
    borsh.array(types.TraderPosition.layout(), 16, 'traderPositions'),
    borsh.publicKey('riskStateAccount'),
    borsh.publicKey('feeStateAccount'),
    borsh.u128('clientOrderId'),
    types.OpenOrders.layout('openOrders'),
    borsh.array(types.TradeHistory.layout(), 14, 'tradeHistory'),
    types.Fractional.layout('fundingBalance'),
    borsh.publicKey('referral'),
    types.Fractional.layout('pendingRewardBalance'),
    borsh.array(borsh.u8(), 464, 'padding'),
    borsh.array(types.AveragePosition.layout(), 16, 'avgPosition'),
    types.Fractional.layout('totalTradedVolume')
  ])

  constructor(fields: TraderRiskGroupFields) {
    this.tag = fields.tag
    this.marketProductGroup = fields.marketProductGroup
    this.owner = fields.owner
    this.activeProducts = fields.activeProducts
    this.totalDeposited = new types.Fractional({ ...fields.totalDeposited })
    this.totalWithdrawn = new types.Fractional({ ...fields.totalWithdrawn })
    this.cashBalance = new types.Fractional({ ...fields.cashBalance })
    this.pendingCashBalance = new types.Fractional({
      ...fields.pendingCashBalance
    })
    this.pendingFees = new types.Fractional({ ...fields.pendingFees })
    this.validUntil = fields.validUntil
    this.makerFeeBps = fields.makerFeeBps
    this.takerFeeBps = fields.takerFeeBps
    this.traderPositions = fields.traderPositions.map((item) => new types.TraderPosition({ ...item }))
    this.riskStateAccount = fields.riskStateAccount
    this.feeStateAccount = fields.feeStateAccount
    this.clientOrderId = fields.clientOrderId
    this.openOrders = new types.OpenOrders({ ...fields.openOrders })
    this.tradeHistory = fields.tradeHistory.map((item) => new types.TradeHistory({ ...item }))
    this.fundingBalance = new types.Fractional({ ...fields.fundingBalance })
    this.referral = fields.referral
    this.pendingRewardBalance = new types.Fractional({ ...fields.pendingRewardBalance })
    this.padding = fields.padding
    this.avgPosition = fields.avgPosition.map((item) => new types.AveragePosition({ ...item }))
    this.totalTradedVolume = new types.Fractional({
      ...fields.totalTradedVolume
    })
  }

  static async fetch(c: Connection, address: PublicKey): Promise<[TraderRiskGroup, any] | null> {
    const info = await c.getAccountInfo(address, 'processed')

    if (info === null) {
      return null
    }
    if (!info.owner.equals(PROGRAM_ID)) {
      throw new Error("account doesn't belong to this program")
    }

    return [this.decode(info.data), info]
  }

  static async fetchMultiple(c: Connection, addresses: PublicKey[]): Promise<Array<TraderRiskGroup | null>> {
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

  static decode(data: Buffer): TraderRiskGroup {
    if (!data.slice(0, 8).equals(TraderRiskGroup.discriminator)) {
      throw new Error('invalid account discriminator')
    }

    const dec = TraderRiskGroup.layout.decode(data.slice(8))

    return new TraderRiskGroup({
      tag: types.AccountTag.fromDecoded(dec.tag),
      marketProductGroup: dec.marketProductGroup,
      owner: dec.owner,
      activeProducts: dec.activeProducts,
      totalDeposited: types.Fractional.fromDecoded(dec.totalDeposited),
      totalWithdrawn: types.Fractional.fromDecoded(dec.totalWithdrawn),
      cashBalance: types.Fractional.fromDecoded(dec.cashBalance),
      pendingCashBalance: types.Fractional.fromDecoded(dec.pendingCashBalance),
      pendingFees: types.Fractional.fromDecoded(dec.pendingFees),
      validUntil: dec.validUntil,
      makerFeeBps: dec.makerFeeBps,
      takerFeeBps: dec.takerFeeBps,
      traderPositions: dec.traderPositions.map(
        (item: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) =>
          types.TraderPosition.fromDecoded(item)
      ),
      riskStateAccount: dec.riskStateAccount,
      feeStateAccount: dec.feeStateAccount,
      clientOrderId: dec.clientOrderId,
      openOrders: types.OpenOrders.fromDecoded(dec.openOrders),
      tradeHistory: dec.tradeHistory.map(
        (item: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) =>
          types.TradeHistory.fromDecoded(item)
      ),
      fundingBalance: types.Fractional.fromDecoded(dec.fundingBalance),
      referral: dec.referral,
      pendingRewardBalance: types.Fractional.fromDecoded(dec.pendingRewardBalance),
      padding: dec.padding,
      avgPosition: dec.avgPosition.map((item: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) =>
        types.AveragePosition.fromDecoded(item)
      ),
      totalTradedVolume: types.Fractional.fromDecoded(dec.totalTradedVolume)
    })
  }

  toJSON(): TraderRiskGroupJSON {
    return {
      tag: this.tag.toJSON(),
      marketProductGroup: this.marketProductGroup.toString(),
      owner: this.owner.toString(),
      activeProducts: this.activeProducts,
      totalDeposited: this.totalDeposited.toJSON(),
      totalWithdrawn: this.totalWithdrawn.toJSON(),
      cashBalance: this.cashBalance.toJSON(),
      pendingCashBalance: this.pendingCashBalance.toJSON(),
      pendingFees: this.pendingFees.toJSON(),
      validUntil: this.validUntil.toString(),
      makerFeeBps: this.makerFeeBps,
      takerFeeBps: this.takerFeeBps,
      traderPositions: this.traderPositions.map((item) => item.toJSON()),
      riskStateAccount: this.riskStateAccount.toString(),
      feeStateAccount: this.feeStateAccount.toString(),
      clientOrderId: this.clientOrderId.toString(),
      openOrders: this.openOrders.toJSON(),
      tradeHistory: this.tradeHistory.map((item) => item.toJSON()),
      fundingBalance: this.fundingBalance.toJSON(),
      referral: this.referral.toString(),
      pendingRewardBalance: this.pendingRewardBalance.toJSON(),
      padding: this.padding,
      avgPosition: this.avgPosition.map((item) => item.toJSON()),
      totalTradedVolume: this.totalTradedVolume.toJSON()
    }
  }

  static fromJSON(obj: TraderRiskGroupJSON): TraderRiskGroup {
    return new TraderRiskGroup({
      tag: types.AccountTag.fromJSON(obj.tag),
      marketProductGroup: new PublicKey(obj.marketProductGroup),
      owner: new PublicKey(obj.owner),
      activeProducts: obj.activeProducts,
      totalDeposited: types.Fractional.fromJSON(obj.totalDeposited),
      totalWithdrawn: types.Fractional.fromJSON(obj.totalWithdrawn),
      cashBalance: types.Fractional.fromJSON(obj.cashBalance),
      pendingCashBalance: types.Fractional.fromJSON(obj.pendingCashBalance),
      pendingFees: types.Fractional.fromJSON(obj.pendingFees),
      validUntil: new BN(obj.validUntil),
      makerFeeBps: obj.makerFeeBps,
      takerFeeBps: obj.takerFeeBps,
      traderPositions: obj.traderPositions.map((item) => types.TraderPosition.fromJSON(item)),
      riskStateAccount: new PublicKey(obj.riskStateAccount),
      feeStateAccount: new PublicKey(obj.feeStateAccount),
      clientOrderId: new BN(obj.clientOrderId),
      openOrders: types.OpenOrders.fromJSON(obj.openOrders),
      tradeHistory: obj.tradeHistory.map((item) => types.TradeHistory.fromJSON(item)),
      fundingBalance: types.Fractional.fromJSON(obj.fundingBalance),
      referral: new PublicKey(obj.referral),
      pendingRewardBalance: types.Fractional.fromJSON(obj.pendingRewardBalance),
      padding: obj.padding,
      avgPosition: obj.avgPosition.map((item) => types.AveragePosition.fromJSON(item)),
      totalTradedVolume: types.Fractional.fromJSON(obj.totalTradedVolume)
    })
  }
}
