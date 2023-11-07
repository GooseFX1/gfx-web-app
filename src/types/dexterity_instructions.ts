import { PublicKey, Keypair } from '@solana/web3.js'
import BN from 'bn.js'
import { Fractional } from '../pages/TradeV3/perps/dexterity/types'
import { Accounts, Address } from '@project-serum/anchor'
import { IdlAccountItem } from '@project-serum/anchor/dist/esm/idl'

export interface IInitializeMarketProductGroupAccounts {
  authority: PublicKey
  marketProductGroup: Keypair
  marketProductGroupVault?: PublicKey
  vaultMint: PublicKey
  feeCollector: PublicKey
  feeModelProgram: PublicKey
  feeModelConfigurationAcct?: PublicKey
  riskModelConfigurationAcct: PublicKey
  riskEngineProgram: PublicKey
  sysvarRent: PublicKey
  systemProgram: Accounts<IdlAccountItem> | Address
  tokenProgram: Accounts<IdlAccountItem> | Address
  feeOutputRegister: Keypair
  riskOutputRegister: Keypair
}

export interface IInitializeMarketProductGroupParams {
  name: Buffer
  validateAccountDiscriminantLen: BN
  findFeesDiscriminantLen: BN
  validateAccountHealthDiscriminant: Uint8Array
  validateAccountLiquidationDiscriminant: Uint8Array
  createRiskStateAccountDiscriminant: Uint8Array
  findFeesDiscriminant: Uint8Array
  maxMakerFeeBps: number
  minMakerFeeBps: number
  maxTakerFeeBps: number
  minTakerFeeBps: number
}

export interface IInitializeTraderRiskGroupAccounts {
  owner: PublicKey
  traderRiskGroup: Keypair
  marketProductGroup: PublicKey
  riskSigner: PublicKey
  traderRiskStateAcct: Keypair
  traderFeeStateAcct: PublicKey
  riskEngineProgram: PublicKey
  systemProgram: PublicKey
}

export interface IInitializeMarketProductAccounts {
  authority: PublicKey
  marketProductGroup: PublicKey
  product: PublicKey
  orderbook: PublicKey
}

export interface IInitializeMarketProductParams {
  name: any
  tickSize: Fractional //TODO: Change to fractional
  baseDecimals: BN
  priceOffset: Fractional //TODO: Change to fractional
}

export interface IInitializeComboAccounts {
  authority: PublicKey
  marketProductGroup: PublicKey
  orderbook: PublicKey
}

export interface IInitializeComboParams {
  name: string
  tickSize: Fractional //TODO: Change to fractional
  priceOffset: Fractional //TODO: Change to fractional
  baseDecimals: number
  ratios: number
}

export interface INewOrderAccounts {
  user: PublicKey
  traderRiskGroup: PublicKey
  marketProductGroup: PublicKey
  product: PublicKey
  aaobProgram: PublicKey
  orderbook: PublicKey
  marketSigner: PublicKey
  eventQueue: PublicKey
  bids: PublicKey
  asks: PublicKey
  systemProgram: PublicKey
  feeModelProgram: PublicKey
  feeModelConfigurationAcct: PublicKey
  traderFeeStateAcct: PublicKey
  feeOutputRegister: PublicKey
  riskEngineProgram: PublicKey
  riskModelConfigurationAcct: PublicKey
  riskOutputRegister: PublicKey
  traderRiskStateAcct: PublicKey
  riskAndFeeSigner?: PublicKey
}

export interface ICancelOrderAccounts {
  user: PublicKey
  traderRiskGroup: PublicKey
  marketProductGroup: PublicKey
  product: PublicKey
  aaobProgram: PublicKey
  orderbook: PublicKey
  marketSigner: PublicKey
  eventQueue: PublicKey
  bids: PublicKey
  asks: PublicKey
  systemProgram: PublicKey
  riskEngineProgram: PublicKey
  riskModelConfigurationAcct: PublicKey
  riskOutputRegister: PublicKey
  traderRiskStateAcct: PublicKey
  riskAndFeeSigner?: PublicKey
}

enum Side {
  'Bid',
  'Ask'
}

enum OrderType {
  'Limit',
  'ImmediateOrCancel',
  'FillOrKill',
  'PostOnly'
}
enum SelfTradeBehavior {
  'DecrementTake',
  'CancelProvide',
  'AbortTransaction'
}

export interface INewOrderParams {
  side: Side
  maxBaseQty: Fractional //TODO: fractional
  orderType: OrderType
  selfTradeBehavior: SelfTradeBehavior
  matchLimit: number
  limitPrice: Fractional //TODO: fractional
}

export interface IDepositFundsAccounts {
  tokenProgram?: PublicKey
  user?: PublicKey
  userTokenAccount: PublicKey
  traderRiskGroup: PublicKey
  marketProductGroup: PublicKey
  marketProductGroupVault: PublicKey
}

export interface IDepositFundsParams {
  quantity: Fractional //TODO: fractional
}

export interface IWithdrawFundsAccounts {
  tokenProgram?: PublicKey
  user?: PublicKey
  userTokenAccount: PublicKey
  traderRiskGroup: PublicKey
  marketProductGroup: PublicKey
  marketProductGroupVault: PublicKey
  riskEngineProgram: PublicKey
  riskModelConfigurationAcct: PublicKey
  riskOutputRegister: PublicKey
  traderRiskStateAcct: PublicKey
  riskSigner: PublicKey
}

export interface IWithdrawFundsParams {
  quantity: Fractional //TODO: fractional
}

export interface IUpdateProductFundingAccounts {
  marketProductGroup: PublicKey
  product: PublicKey
}

export interface IUpdateProductFundingParams {
  amount: Fractional //TODO: fractional
  expired: boolean
}

export interface ITransferFullPositionAccounts {
  liquidator: PublicKey
  marketProductGroup: PublicKey
  liquidateeRiskGroup: PublicKey
  liquidatorRiskGroup: PublicKey
  riskEngineProgram: PublicKey
  riskModelConfigurationAcct: PublicKey
  riskOutputRegister: PublicKey
  liquidatorRiskStateAccountInfo: PublicKey
  liquidateeRiskStateAccountInfo: PublicKey
  riskSigner: PublicKey
}

export interface IUpdateTraderFundingAccounts {
  marketProductGroup: PublicKey
  traderRiskGroup: PublicKey
}

export interface IClearExpiredOrderbookAccounts {
  marketProductGroup: PublicKey
  product: PublicKey
  aaobProgram: PublicKey
  orderbook: PublicKey
  marketSigner: PublicKey
  eventQueue: PublicKey
  bids: PublicKey
  asks: PublicKey
}

export interface IClearExpiredOrderbookParams {
  numOrdersToCancel: number
}

export interface ISweepFeesAccounts {
  marketProductGroup: PublicKey
  feeCollector: PublicKey
  marketProductGroupVault: PublicKey
  feeCollectorTokenAccount: PublicKey
  tokenProgram: PublicKey
}

export interface IChooseSuccessorAccounts {
  marketProductGroup: PublicKey
  authority: PublicKey
  newAuthority: PublicKey
}

export interface IClaimAuthorityAccounts {
  marketProductGroup: PublicKey
  newAuthority: PublicKey
}

export enum InstrumentType {
  Uninitialized,
  RecurringCall,
  RecurringPut,
  ExpiringCall,
  ExpiringPut
}

export enum OracleType {
  Uninitialized,
  Pyth,
  Dummy
}

export interface IGetDerivativeKey {
  priceOracle: PublicKey
  marketProductGroup: PublicKey
  instrumentType: InstrumentType
  strike: Fractional
  fullFundingPeriod: number
  minimumFundingPeriod: number
  initializationTime: number
}

export interface IInitializeDerivativeAccounts {
  derivativeMetadata?: PublicKey
  priceOracle: PublicKey
  marketProductGroup: PublicKey
  payer: PublicKey
  systemProgram: PublicKey
  clock: PublicKey
}

export interface IInitializeDerivativeParams {
  instrumentType: InstrumentType | any
  strike: Fractional
  fullFundingPeriod: BN
  minimumFundingPeriod: BN
  initializationTime: BN
  closeAuthority?: PublicKey
  oracleType: OracleType | any
}

export interface IConsumeOB {
  aaobProgram?: PublicKey
  marketProductGroup: PublicKey
  product: PublicKey
  marketSigner: PublicKey
  orderbook: PublicKey
  eventQueue: PublicKey
  rewardTarget: PublicKey
  feeModelProgram: PublicKey
  feeModelConfigurationAcct: PublicKey
  feeOutputRegister: PublicKey
  riskAndFeeSigner: PublicKey
}

export interface ITraderBalances {
  balance: string
  productKey: PublicKey
  balanceFractional?: Fractional
}
