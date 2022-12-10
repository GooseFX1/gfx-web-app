import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface ContractIsExpiredJSON {
  kind: "ContractIsExpired"
}

export class ContractIsExpired {
  static readonly discriminator = 0
  static readonly kind = "ContractIsExpired"
  readonly discriminator = 0
  readonly kind = "ContractIsExpired"

  toJSON(): ContractIsExpiredJSON {
    return {
      kind: "ContractIsExpired",
    }
  }

  toEncodable() {
    return {
      ContractIsExpired: {},
    }
  }
}

export interface ContractIsNotExpiredJSON {
  kind: "ContractIsNotExpired"
}

export class ContractIsNotExpired {
  static readonly discriminator = 1
  static readonly kind = "ContractIsNotExpired"
  readonly discriminator = 1
  readonly kind = "ContractIsNotExpired"

  toJSON(): ContractIsNotExpiredJSON {
    return {
      kind: "ContractIsNotExpired",
    }
  }

  toEncodable() {
    return {
      ContractIsNotExpired: {},
    }
  }
}

export interface InvalidSystemProgramAccountJSON {
  kind: "InvalidSystemProgramAccount"
}

export class InvalidSystemProgramAccount {
  static readonly discriminator = 2
  static readonly kind = "InvalidSystemProgramAccount"
  readonly discriminator = 2
  readonly kind = "InvalidSystemProgramAccount"

  toJSON(): InvalidSystemProgramAccountJSON {
    return {
      kind: "InvalidSystemProgramAccount",
    }
  }

  toEncodable() {
    return {
      InvalidSystemProgramAccount: {},
    }
  }
}

export interface InvalidAobProgramAccountJSON {
  kind: "InvalidAobProgramAccount"
}

export class InvalidAobProgramAccount {
  static readonly discriminator = 3
  static readonly kind = "InvalidAobProgramAccount"
  readonly discriminator = 3
  readonly kind = "InvalidAobProgramAccount"

  toJSON(): InvalidAobProgramAccountJSON {
    return {
      kind: "InvalidAobProgramAccount",
    }
  }

  toEncodable() {
    return {
      InvalidAobProgramAccount: {},
    }
  }
}

export interface InvalidStateAccountOwnerJSON {
  kind: "InvalidStateAccountOwner"
}

export class InvalidStateAccountOwner {
  static readonly discriminator = 4
  static readonly kind = "InvalidStateAccountOwner"
  readonly discriminator = 4
  readonly kind = "InvalidStateAccountOwner"

  toJSON(): InvalidStateAccountOwnerJSON {
    return {
      kind: "InvalidStateAccountOwner",
    }
  }

  toEncodable() {
    return {
      InvalidStateAccountOwner: {},
    }
  }
}

export interface InvalidOrderIndexJSON {
  kind: "InvalidOrderIndex"
}

export class InvalidOrderIndex {
  static readonly discriminator = 5
  static readonly kind = "InvalidOrderIndex"
  readonly discriminator = 5
  readonly kind = "InvalidOrderIndex"

  toJSON(): InvalidOrderIndexJSON {
    return {
      kind: "InvalidOrderIndex",
    }
  }

  toEncodable() {
    return {
      InvalidOrderIndex: {},
    }
  }
}

export interface UserAccountFullJSON {
  kind: "UserAccountFull"
}

export class UserAccountFull {
  static readonly discriminator = 6
  static readonly kind = "UserAccountFull"
  readonly discriminator = 6
  readonly kind = "UserAccountFull"

  toJSON(): UserAccountFullJSON {
    return {
      kind: "UserAccountFull",
    }
  }

  toEncodable() {
    return {
      UserAccountFull: {},
    }
  }
}

export interface TransactionAbortedJSON {
  kind: "TransactionAborted"
}

export class TransactionAborted {
  static readonly discriminator = 7
  static readonly kind = "TransactionAborted"
  readonly discriminator = 7
  readonly kind = "TransactionAborted"

  toJSON(): TransactionAbortedJSON {
    return {
      kind: "TransactionAborted",
    }
  }

  toEncodable() {
    return {
      TransactionAborted: {},
    }
  }
}

export interface MissingUserAccountJSON {
  kind: "MissingUserAccount"
}

export class MissingUserAccount {
  static readonly discriminator = 8
  static readonly kind = "MissingUserAccount"
  readonly discriminator = 8
  readonly kind = "MissingUserAccount"

  toJSON(): MissingUserAccountJSON {
    return {
      kind: "MissingUserAccount",
    }
  }

  toEncodable() {
    return {
      MissingUserAccount: {},
    }
  }
}

export interface OrderNotFoundJSON {
  kind: "OrderNotFound"
}

export class OrderNotFound {
  static readonly discriminator = 9
  static readonly kind = "OrderNotFound"
  readonly discriminator = 9
  readonly kind = "OrderNotFound"

  toJSON(): OrderNotFoundJSON {
    return {
      kind: "OrderNotFound",
    }
  }

  toEncodable() {
    return {
      OrderNotFound: {},
    }
  }
}

export interface NoOpJSON {
  kind: "NoOp"
}

export class NoOp {
  static readonly discriminator = 10
  static readonly kind = "NoOp"
  readonly discriminator = 10
  readonly kind = "NoOp"

  toJSON(): NoOpJSON {
    return {
      kind: "NoOp",
    }
  }

  toEncodable() {
    return {
      NoOp: {},
    }
  }
}

export interface OutofFundsJSON {
  kind: "OutofFunds"
}

export class OutofFunds {
  static readonly discriminator = 11
  static readonly kind = "OutofFunds"
  readonly discriminator = 11
  readonly kind = "OutofFunds"

  toJSON(): OutofFundsJSON {
    return {
      kind: "OutofFunds",
    }
  }

  toEncodable() {
    return {
      OutofFunds: {},
    }
  }
}

export interface UserAccountStillActiveJSON {
  kind: "UserAccountStillActive"
}

export class UserAccountStillActive {
  static readonly discriminator = 12
  static readonly kind = "UserAccountStillActive"
  readonly discriminator = 12
  readonly kind = "UserAccountStillActive"

  toJSON(): UserAccountStillActiveJSON {
    return {
      kind: "UserAccountStillActive",
    }
  }

  toEncodable() {
    return {
      UserAccountStillActive: {},
    }
  }
}

export interface MarketStillActiveJSON {
  kind: "MarketStillActive"
}

export class MarketStillActive {
  static readonly discriminator = 13
  static readonly kind = "MarketStillActive"
  readonly discriminator = 13
  readonly kind = "MarketStillActive"

  toJSON(): MarketStillActiveJSON {
    return {
      kind: "MarketStillActive",
    }
  }

  toEncodable() {
    return {
      MarketStillActive: {},
    }
  }
}

export interface InvalidMarketSignerAccountJSON {
  kind: "InvalidMarketSignerAccount"
}

export class InvalidMarketSignerAccount {
  static readonly discriminator = 14
  static readonly kind = "InvalidMarketSignerAccount"
  readonly discriminator = 14
  readonly kind = "InvalidMarketSignerAccount"

  toJSON(): InvalidMarketSignerAccountJSON {
    return {
      kind: "InvalidMarketSignerAccount",
    }
  }

  toEncodable() {
    return {
      InvalidMarketSignerAccount: {},
    }
  }
}

export interface InvalidOrderbookAccountJSON {
  kind: "InvalidOrderbookAccount"
}

export class InvalidOrderbookAccount {
  static readonly discriminator = 15
  static readonly kind = "InvalidOrderbookAccount"
  readonly discriminator = 15
  readonly kind = "InvalidOrderbookAccount"

  toJSON(): InvalidOrderbookAccountJSON {
    return {
      kind: "InvalidOrderbookAccount",
    }
  }

  toEncodable() {
    return {
      InvalidOrderbookAccount: {},
    }
  }
}

export interface InvalidMarketAdminAccountJSON {
  kind: "InvalidMarketAdminAccount"
}

export class InvalidMarketAdminAccount {
  static readonly discriminator = 16
  static readonly kind = "InvalidMarketAdminAccount"
  readonly discriminator = 16
  readonly kind = "InvalidMarketAdminAccount"

  toJSON(): InvalidMarketAdminAccountJSON {
    return {
      kind: "InvalidMarketAdminAccount",
    }
  }

  toEncodable() {
    return {
      InvalidMarketAdminAccount: {},
    }
  }
}

export interface InvalidBaseVaultAccountJSON {
  kind: "InvalidBaseVaultAccount"
}

export class InvalidBaseVaultAccount {
  static readonly discriminator = 17
  static readonly kind = "InvalidBaseVaultAccount"
  readonly discriminator = 17
  readonly kind = "InvalidBaseVaultAccount"

  toJSON(): InvalidBaseVaultAccountJSON {
    return {
      kind: "InvalidBaseVaultAccount",
    }
  }

  toEncodable() {
    return {
      InvalidBaseVaultAccount: {},
    }
  }
}

export interface InvalidQuoteVaultAccountJSON {
  kind: "InvalidQuoteVaultAccount"
}

export class InvalidQuoteVaultAccount {
  static readonly discriminator = 18
  static readonly kind = "InvalidQuoteVaultAccount"
  readonly discriminator = 18
  readonly kind = "InvalidQuoteVaultAccount"

  toJSON(): InvalidQuoteVaultAccountJSON {
    return {
      kind: "InvalidQuoteVaultAccount",
    }
  }

  toEncodable() {
    return {
      InvalidQuoteVaultAccount: {},
    }
  }
}

export interface FullMarketProductGroupJSON {
  kind: "FullMarketProductGroup"
}

export class FullMarketProductGroup {
  static readonly discriminator = 19
  static readonly kind = "FullMarketProductGroup"
  readonly discriminator = 19
  readonly kind = "FullMarketProductGroup"

  toJSON(): FullMarketProductGroupJSON {
    return {
      kind: "FullMarketProductGroup",
    }
  }

  toEncodable() {
    return {
      FullMarketProductGroup: {},
    }
  }
}

export interface MissingMarketProductJSON {
  kind: "MissingMarketProduct"
}

export class MissingMarketProduct {
  static readonly discriminator = 20
  static readonly kind = "MissingMarketProduct"
  readonly discriminator = 20
  readonly kind = "MissingMarketProduct"

  toJSON(): MissingMarketProductJSON {
    return {
      kind: "MissingMarketProduct",
    }
  }

  toEncodable() {
    return {
      MissingMarketProduct: {},
    }
  }
}

export interface InvalidWithdrawalAmountJSON {
  kind: "InvalidWithdrawalAmount"
}

export class InvalidWithdrawalAmount {
  static readonly discriminator = 21
  static readonly kind = "InvalidWithdrawalAmount"
  readonly discriminator = 21
  readonly kind = "InvalidWithdrawalAmount"

  toJSON(): InvalidWithdrawalAmountJSON {
    return {
      kind: "InvalidWithdrawalAmount",
    }
  }

  toEncodable() {
    return {
      InvalidWithdrawalAmount: {},
    }
  }
}

export interface InvalidTakerTraderJSON {
  kind: "InvalidTakerTrader"
}

export class InvalidTakerTrader {
  static readonly discriminator = 22
  static readonly kind = "InvalidTakerTrader"
  readonly discriminator = 22
  readonly kind = "InvalidTakerTrader"

  toJSON(): InvalidTakerTraderJSON {
    return {
      kind: "InvalidTakerTrader",
    }
  }

  toEncodable() {
    return {
      InvalidTakerTrader: {},
    }
  }
}

export interface FundsErrorJSON {
  kind: "FundsError"
}

export class FundsError {
  static readonly discriminator = 23
  static readonly kind = "FundsError"
  readonly discriminator = 23
  readonly kind = "FundsError"

  toJSON(): FundsErrorJSON {
    return {
      kind: "FundsError",
    }
  }

  toEncodable() {
    return {
      FundsError: {},
    }
  }
}

export interface InactiveProductErrorJSON {
  kind: "InactiveProductError"
}

export class InactiveProductError {
  static readonly discriminator = 24
  static readonly kind = "InactiveProductError"
  readonly discriminator = 24
  readonly kind = "InactiveProductError"

  toJSON(): InactiveProductErrorJSON {
    return {
      kind: "InactiveProductError",
    }
  }

  toEncodable() {
    return {
      InactiveProductError: {},
    }
  }
}

export interface TooManyOpenOrdersErrorJSON {
  kind: "TooManyOpenOrdersError"
}

export class TooManyOpenOrdersError {
  static readonly discriminator = 25
  static readonly kind = "TooManyOpenOrdersError"
  readonly discriminator = 25
  readonly kind = "TooManyOpenOrdersError"

  toJSON(): TooManyOpenOrdersErrorJSON {
    return {
      kind: "TooManyOpenOrdersError",
    }
  }

  toEncodable() {
    return {
      TooManyOpenOrdersError: {},
    }
  }
}

export interface NoMoreOpenOrdersErrorJSON {
  kind: "NoMoreOpenOrdersError"
}

export class NoMoreOpenOrdersError {
  static readonly discriminator = 26
  static readonly kind = "NoMoreOpenOrdersError"
  readonly discriminator = 26
  readonly kind = "NoMoreOpenOrdersError"

  toJSON(): NoMoreOpenOrdersErrorJSON {
    return {
      kind: "NoMoreOpenOrdersError",
    }
  }

  toEncodable() {
    return {
      NoMoreOpenOrdersError: {},
    }
  }
}

export interface NonZeroPriceTickExponentErrorJSON {
  kind: "NonZeroPriceTickExponentError"
}

export class NonZeroPriceTickExponentError {
  static readonly discriminator = 27
  static readonly kind = "NonZeroPriceTickExponentError"
  readonly discriminator = 27
  readonly kind = "NonZeroPriceTickExponentError"

  toJSON(): NonZeroPriceTickExponentErrorJSON {
    return {
      kind: "NonZeroPriceTickExponentError",
    }
  }

  toEncodable() {
    return {
      NonZeroPriceTickExponentError: {},
    }
  }
}

export interface DuplicateProductNameErrorJSON {
  kind: "DuplicateProductNameError"
}

export class DuplicateProductNameError {
  static readonly discriminator = 28
  static readonly kind = "DuplicateProductNameError"
  readonly discriminator = 28
  readonly kind = "DuplicateProductNameError"

  toJSON(): DuplicateProductNameErrorJSON {
    return {
      kind: "DuplicateProductNameError",
    }
  }

  toEncodable() {
    return {
      DuplicateProductNameError: {},
    }
  }
}

export interface InvalidRiskResponseErrorJSON {
  kind: "InvalidRiskResponseError"
}

export class InvalidRiskResponseError {
  static readonly discriminator = 29
  static readonly kind = "InvalidRiskResponseError"
  readonly discriminator = 29
  readonly kind = "InvalidRiskResponseError"

  toJSON(): InvalidRiskResponseErrorJSON {
    return {
      kind: "InvalidRiskResponseError",
    }
  }

  toEncodable() {
    return {
      InvalidRiskResponseError: {},
    }
  }
}

export interface InvalidAccountHealthErrorJSON {
  kind: "InvalidAccountHealthError"
}

export class InvalidAccountHealthError {
  static readonly discriminator = 30
  static readonly kind = "InvalidAccountHealthError"
  readonly discriminator = 30
  readonly kind = "InvalidAccountHealthError"

  toJSON(): InvalidAccountHealthErrorJSON {
    return {
      kind: "InvalidAccountHealthError",
    }
  }

  toEncodable() {
    return {
      InvalidAccountHealthError: {},
    }
  }
}

export interface OrderbookIsEmptyErrorJSON {
  kind: "OrderbookIsEmptyError"
}

export class OrderbookIsEmptyError {
  static readonly discriminator = 31
  static readonly kind = "OrderbookIsEmptyError"
  readonly discriminator = 31
  readonly kind = "OrderbookIsEmptyError"

  toJSON(): OrderbookIsEmptyErrorJSON {
    return {
      kind: "OrderbookIsEmptyError",
    }
  }

  toEncodable() {
    return {
      OrderbookIsEmptyError: {},
    }
  }
}

export interface CombosNotRemovedJSON {
  kind: "CombosNotRemoved"
}

export class CombosNotRemoved {
  static readonly discriminator = 32
  static readonly kind = "CombosNotRemoved"
  readonly discriminator = 32
  readonly kind = "CombosNotRemoved"

  toJSON(): CombosNotRemovedJSON {
    return {
      kind: "CombosNotRemoved",
    }
  }

  toEncodable() {
    return {
      CombosNotRemoved: {},
    }
  }
}

export interface AccountNotLiquidableJSON {
  kind: "AccountNotLiquidable"
}

export class AccountNotLiquidable {
  static readonly discriminator = 33
  static readonly kind = "AccountNotLiquidable"
  readonly discriminator = 33
  readonly kind = "AccountNotLiquidable"

  toJSON(): AccountNotLiquidableJSON {
    return {
      kind: "AccountNotLiquidable",
    }
  }

  toEncodable() {
    return {
      AccountNotLiquidable: {},
    }
  }
}

export interface FundingPrecisionErrorJSON {
  kind: "FundingPrecisionError"
}

export class FundingPrecisionError {
  static readonly discriminator = 34
  static readonly kind = "FundingPrecisionError"
  readonly discriminator = 34
  readonly kind = "FundingPrecisionError"

  toJSON(): FundingPrecisionErrorJSON {
    return {
      kind: "FundingPrecisionError",
    }
  }

  toEncodable() {
    return {
      FundingPrecisionError: {},
    }
  }
}

export interface ProductDecimalPrecisionErrorJSON {
  kind: "ProductDecimalPrecisionError"
}

export class ProductDecimalPrecisionError {
  static readonly discriminator = 35
  static readonly kind = "ProductDecimalPrecisionError"
  readonly discriminator = 35
  readonly kind = "ProductDecimalPrecisionError"

  toJSON(): ProductDecimalPrecisionErrorJSON {
    return {
      kind: "ProductDecimalPrecisionError",
    }
  }

  toEncodable() {
    return {
      ProductDecimalPrecisionError: {},
    }
  }
}

export interface ProductNotOutrightJSON {
  kind: "ProductNotOutright"
}

export class ProductNotOutright {
  static readonly discriminator = 36
  static readonly kind = "ProductNotOutright"
  readonly discriminator = 36
  readonly kind = "ProductNotOutright"

  toJSON(): ProductNotOutrightJSON {
    return {
      kind: "ProductNotOutright",
    }
  }

  toEncodable() {
    return {
      ProductNotOutright: {},
    }
  }
}

export interface ProductNotComboJSON {
  kind: "ProductNotCombo"
}

export class ProductNotCombo {
  static readonly discriminator = 37
  static readonly kind = "ProductNotCombo"
  readonly discriminator = 37
  readonly kind = "ProductNotCombo"

  toJSON(): ProductNotComboJSON {
    return {
      kind: "ProductNotCombo",
    }
  }

  toEncodable() {
    return {
      ProductNotCombo: {},
    }
  }
}

export interface InvalidSocialLossCalculationJSON {
  kind: "InvalidSocialLossCalculation"
}

export class InvalidSocialLossCalculation {
  static readonly discriminator = 38
  static readonly kind = "InvalidSocialLossCalculation"
  readonly discriminator = 38
  readonly kind = "InvalidSocialLossCalculation"

  toJSON(): InvalidSocialLossCalculationJSON {
    return {
      kind: "InvalidSocialLossCalculation",
    }
  }

  toEncodable() {
    return {
      InvalidSocialLossCalculation: {},
    }
  }
}

export interface ProductIndexMismatchJSON {
  kind: "ProductIndexMismatch"
}

export class ProductIndexMismatch {
  static readonly discriminator = 39
  static readonly kind = "ProductIndexMismatch"
  readonly discriminator = 39
  readonly kind = "ProductIndexMismatch"

  toJSON(): ProductIndexMismatchJSON {
    return {
      kind: "ProductIndexMismatch",
    }
  }

  toEncodable() {
    return {
      ProductIndexMismatch: {},
    }
  }
}

export interface InvalidOrderIDJSON {
  kind: "InvalidOrderID"
}

export class InvalidOrderID {
  static readonly discriminator = 40
  static readonly kind = "InvalidOrderID"
  readonly discriminator = 40
  readonly kind = "InvalidOrderID"

  toJSON(): InvalidOrderIDJSON {
    return {
      kind: "InvalidOrderID",
    }
  }

  toEncodable() {
    return {
      InvalidOrderID: {},
    }
  }
}

export interface InvalidBytesForZeroCopyDeserializationJSON {
  kind: "InvalidBytesForZeroCopyDeserialization"
}

export class InvalidBytesForZeroCopyDeserialization {
  static readonly discriminator = 41
  static readonly kind = "InvalidBytesForZeroCopyDeserialization"
  readonly discriminator = 41
  readonly kind = "InvalidBytesForZeroCopyDeserialization"

  toJSON(): InvalidBytesForZeroCopyDeserializationJSON {
    return {
      kind: "InvalidBytesForZeroCopyDeserialization",
    }
  }

  toEncodable() {
    return {
      InvalidBytesForZeroCopyDeserialization: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.DexErrorKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("ContractIsExpired" in obj) {
    return new ContractIsExpired()
  }
  if ("ContractIsNotExpired" in obj) {
    return new ContractIsNotExpired()
  }
  if ("InvalidSystemProgramAccount" in obj) {
    return new InvalidSystemProgramAccount()
  }
  if ("InvalidAobProgramAccount" in obj) {
    return new InvalidAobProgramAccount()
  }
  if ("InvalidStateAccountOwner" in obj) {
    return new InvalidStateAccountOwner()
  }
  if ("InvalidOrderIndex" in obj) {
    return new InvalidOrderIndex()
  }
  if ("UserAccountFull" in obj) {
    return new UserAccountFull()
  }
  if ("TransactionAborted" in obj) {
    return new TransactionAborted()
  }
  if ("MissingUserAccount" in obj) {
    return new MissingUserAccount()
  }
  if ("OrderNotFound" in obj) {
    return new OrderNotFound()
  }
  if ("NoOp" in obj) {
    return new NoOp()
  }
  if ("OutofFunds" in obj) {
    return new OutofFunds()
  }
  if ("UserAccountStillActive" in obj) {
    return new UserAccountStillActive()
  }
  if ("MarketStillActive" in obj) {
    return new MarketStillActive()
  }
  if ("InvalidMarketSignerAccount" in obj) {
    return new InvalidMarketSignerAccount()
  }
  if ("InvalidOrderbookAccount" in obj) {
    return new InvalidOrderbookAccount()
  }
  if ("InvalidMarketAdminAccount" in obj) {
    return new InvalidMarketAdminAccount()
  }
  if ("InvalidBaseVaultAccount" in obj) {
    return new InvalidBaseVaultAccount()
  }
  if ("InvalidQuoteVaultAccount" in obj) {
    return new InvalidQuoteVaultAccount()
  }
  if ("FullMarketProductGroup" in obj) {
    return new FullMarketProductGroup()
  }
  if ("MissingMarketProduct" in obj) {
    return new MissingMarketProduct()
  }
  if ("InvalidWithdrawalAmount" in obj) {
    return new InvalidWithdrawalAmount()
  }
  if ("InvalidTakerTrader" in obj) {
    return new InvalidTakerTrader()
  }
  if ("FundsError" in obj) {
    return new FundsError()
  }
  if ("InactiveProductError" in obj) {
    return new InactiveProductError()
  }
  if ("TooManyOpenOrdersError" in obj) {
    return new TooManyOpenOrdersError()
  }
  if ("NoMoreOpenOrdersError" in obj) {
    return new NoMoreOpenOrdersError()
  }
  if ("NonZeroPriceTickExponentError" in obj) {
    return new NonZeroPriceTickExponentError()
  }
  if ("DuplicateProductNameError" in obj) {
    return new DuplicateProductNameError()
  }
  if ("InvalidRiskResponseError" in obj) {
    return new InvalidRiskResponseError()
  }
  if ("InvalidAccountHealthError" in obj) {
    return new InvalidAccountHealthError()
  }
  if ("OrderbookIsEmptyError" in obj) {
    return new OrderbookIsEmptyError()
  }
  if ("CombosNotRemoved" in obj) {
    return new CombosNotRemoved()
  }
  if ("AccountNotLiquidable" in obj) {
    return new AccountNotLiquidable()
  }
  if ("FundingPrecisionError" in obj) {
    return new FundingPrecisionError()
  }
  if ("ProductDecimalPrecisionError" in obj) {
    return new ProductDecimalPrecisionError()
  }
  if ("ProductNotOutright" in obj) {
    return new ProductNotOutright()
  }
  if ("ProductNotCombo" in obj) {
    return new ProductNotCombo()
  }
  if ("InvalidSocialLossCalculation" in obj) {
    return new InvalidSocialLossCalculation()
  }
  if ("ProductIndexMismatch" in obj) {
    return new ProductIndexMismatch()
  }
  if ("InvalidOrderID" in obj) {
    return new InvalidOrderID()
  }
  if ("InvalidBytesForZeroCopyDeserialization" in obj) {
    return new InvalidBytesForZeroCopyDeserialization()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(obj: types.DexErrorJSON): types.DexErrorKind {
  switch (obj.kind) {
    case "ContractIsExpired": {
      return new ContractIsExpired()
    }
    case "ContractIsNotExpired": {
      return new ContractIsNotExpired()
    }
    case "InvalidSystemProgramAccount": {
      return new InvalidSystemProgramAccount()
    }
    case "InvalidAobProgramAccount": {
      return new InvalidAobProgramAccount()
    }
    case "InvalidStateAccountOwner": {
      return new InvalidStateAccountOwner()
    }
    case "InvalidOrderIndex": {
      return new InvalidOrderIndex()
    }
    case "UserAccountFull": {
      return new UserAccountFull()
    }
    case "TransactionAborted": {
      return new TransactionAborted()
    }
    case "MissingUserAccount": {
      return new MissingUserAccount()
    }
    case "OrderNotFound": {
      return new OrderNotFound()
    }
    case "NoOp": {
      return new NoOp()
    }
    case "OutofFunds": {
      return new OutofFunds()
    }
    case "UserAccountStillActive": {
      return new UserAccountStillActive()
    }
    case "MarketStillActive": {
      return new MarketStillActive()
    }
    case "InvalidMarketSignerAccount": {
      return new InvalidMarketSignerAccount()
    }
    case "InvalidOrderbookAccount": {
      return new InvalidOrderbookAccount()
    }
    case "InvalidMarketAdminAccount": {
      return new InvalidMarketAdminAccount()
    }
    case "InvalidBaseVaultAccount": {
      return new InvalidBaseVaultAccount()
    }
    case "InvalidQuoteVaultAccount": {
      return new InvalidQuoteVaultAccount()
    }
    case "FullMarketProductGroup": {
      return new FullMarketProductGroup()
    }
    case "MissingMarketProduct": {
      return new MissingMarketProduct()
    }
    case "InvalidWithdrawalAmount": {
      return new InvalidWithdrawalAmount()
    }
    case "InvalidTakerTrader": {
      return new InvalidTakerTrader()
    }
    case "FundsError": {
      return new FundsError()
    }
    case "InactiveProductError": {
      return new InactiveProductError()
    }
    case "TooManyOpenOrdersError": {
      return new TooManyOpenOrdersError()
    }
    case "NoMoreOpenOrdersError": {
      return new NoMoreOpenOrdersError()
    }
    case "NonZeroPriceTickExponentError": {
      return new NonZeroPriceTickExponentError()
    }
    case "DuplicateProductNameError": {
      return new DuplicateProductNameError()
    }
    case "InvalidRiskResponseError": {
      return new InvalidRiskResponseError()
    }
    case "InvalidAccountHealthError": {
      return new InvalidAccountHealthError()
    }
    case "OrderbookIsEmptyError": {
      return new OrderbookIsEmptyError()
    }
    case "CombosNotRemoved": {
      return new CombosNotRemoved()
    }
    case "AccountNotLiquidable": {
      return new AccountNotLiquidable()
    }
    case "FundingPrecisionError": {
      return new FundingPrecisionError()
    }
    case "ProductDecimalPrecisionError": {
      return new ProductDecimalPrecisionError()
    }
    case "ProductNotOutright": {
      return new ProductNotOutright()
    }
    case "ProductNotCombo": {
      return new ProductNotCombo()
    }
    case "InvalidSocialLossCalculation": {
      return new InvalidSocialLossCalculation()
    }
    case "ProductIndexMismatch": {
      return new ProductIndexMismatch()
    }
    case "InvalidOrderID": {
      return new InvalidOrderID()
    }
    case "InvalidBytesForZeroCopyDeserialization": {
      return new InvalidBytesForZeroCopyDeserialization()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "ContractIsExpired"),
    borsh.struct([], "ContractIsNotExpired"),
    borsh.struct([], "InvalidSystemProgramAccount"),
    borsh.struct([], "InvalidAobProgramAccount"),
    borsh.struct([], "InvalidStateAccountOwner"),
    borsh.struct([], "InvalidOrderIndex"),
    borsh.struct([], "UserAccountFull"),
    borsh.struct([], "TransactionAborted"),
    borsh.struct([], "MissingUserAccount"),
    borsh.struct([], "OrderNotFound"),
    borsh.struct([], "NoOp"),
    borsh.struct([], "OutofFunds"),
    borsh.struct([], "UserAccountStillActive"),
    borsh.struct([], "MarketStillActive"),
    borsh.struct([], "InvalidMarketSignerAccount"),
    borsh.struct([], "InvalidOrderbookAccount"),
    borsh.struct([], "InvalidMarketAdminAccount"),
    borsh.struct([], "InvalidBaseVaultAccount"),
    borsh.struct([], "InvalidQuoteVaultAccount"),
    borsh.struct([], "FullMarketProductGroup"),
    borsh.struct([], "MissingMarketProduct"),
    borsh.struct([], "InvalidWithdrawalAmount"),
    borsh.struct([], "InvalidTakerTrader"),
    borsh.struct([], "FundsError"),
    borsh.struct([], "InactiveProductError"),
    borsh.struct([], "TooManyOpenOrdersError"),
    borsh.struct([], "NoMoreOpenOrdersError"),
    borsh.struct([], "NonZeroPriceTickExponentError"),
    borsh.struct([], "DuplicateProductNameError"),
    borsh.struct([], "InvalidRiskResponseError"),
    borsh.struct([], "InvalidAccountHealthError"),
    borsh.struct([], "OrderbookIsEmptyError"),
    borsh.struct([], "CombosNotRemoved"),
    borsh.struct([], "AccountNotLiquidable"),
    borsh.struct([], "FundingPrecisionError"),
    borsh.struct([], "ProductDecimalPrecisionError"),
    borsh.struct([], "ProductNotOutright"),
    borsh.struct([], "ProductNotCombo"),
    borsh.struct([], "InvalidSocialLossCalculation"),
    borsh.struct([], "ProductIndexMismatch"),
    borsh.struct([], "InvalidOrderID"),
    borsh.struct([], "InvalidBytesForZeroCopyDeserialization"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
