import * as Side from './Side'
import * as SelfTradeBehavior from './SelfTradeBehavior'
import * as DomainOrProgramError from './DomainOrProgramError'
import * as UtilError from './UtilError'
import * as DexError from './DexError'
import * as ProductStatus from './ProductStatus'
import * as OrderType from './OrderType'
import * as Product from './Product'
import * as OperationType from './OperationType'
import * as HealthResult from './HealthResult'
import * as HealthStatus from './HealthStatus'
import * as ActionStatus from './ActionStatus'

export { Side }

export type SideKind = Side.Bid | Side.Ask
export type SideJSON = Side.BidJSON | Side.AskJSON

export { usize } from './usize'
export type { usizeFields, usizeJSON } from './usize'
export { SelfTradeBehavior }

export type SelfTradeBehaviorKind = SelfTradeBehavior.DecrementTake | SelfTradeBehavior.CancelProvide
export type SelfTradeBehaviorJSON = SelfTradeBehavior.DecrementTakeJSON | SelfTradeBehavior.CancelProvideJSON

export { ProductArray } from './ProductArray'
export type { ProductArrayFields, ProductArrayJSON } from './ProductArray'
export { ProgramError } from './ProgramError'
export type { ProgramErrorFields, ProgramErrorJSON } from './ProgramError'
export { Params } from './Params'
export type { ParamsFields, ParamsJSON } from './Params'
export { CallBackInfo } from './CallBackInfo'
export type { CallBackInfoFields, CallBackInfoJSON } from './CallBackInfo'
export { TraderFees } from './TraderFees'
export type { TraderFeesFields, TraderFeesJSON } from './TraderFees'
export { TraderFeeParams } from './TraderFeeParams'
export type { TraderFeeParamsFields, TraderFeeParamsJSON } from './TraderFeeParams'
export { PriceEwma } from './PriceEwma'
export type { PriceEwmaFields, PriceEwmaJSON } from './PriceEwma'
export { OpenOrdersMetadata } from './OpenOrdersMetadata'
export type { OpenOrdersMetadataFields, OpenOrdersMetadataJSON } from './OpenOrdersMetadata'
export { OpenOrders } from './OpenOrders'
export type { OpenOrdersFields, OpenOrdersJSON } from './OpenOrders'
export { OpenOrdersNode } from './OpenOrdersNode'
export type { OpenOrdersNodeFields, OpenOrdersNodeJSON } from './OpenOrdersNode'
export { Outright } from './Outright'
export type { OutrightFields, OutrightJSON } from './Outright'
export { ProductMetadata } from './ProductMetadata'
export type { ProductMetadataFields, ProductMetadataJSON } from './ProductMetadata'
export { Combo } from './Combo'
export type { ComboFields, ComboJSON } from './Combo'
export { Leg } from './Leg'
export type { LegFields, LegJSON } from './Leg'
export { HealthInfo } from './HealthInfo'
export type { HealthInfoFields, HealthInfoJSON } from './HealthInfo'
export { LiquidationInfo } from './LiquidationInfo'
export type { LiquidationInfoFields, LiquidationInfoJSON } from './LiquidationInfo'
export { SocialLoss } from './SocialLoss'
export type { SocialLossFields, SocialLossJSON } from './SocialLoss'
export { OrderInfo } from './OrderInfo'
export type { OrderInfoFields, OrderInfoJSON } from './OrderInfo'
export { TradeHistory } from "./TradeHistory"
export type { TradeHistoryFields, TradeHistoryJSON } from "./TradeHistory"
export { AveragePosition } from "./AveragePosition"
export type {
  AveragePositionFields,
  AveragePositionJSON,
} from "./AveragePosition"
export { TraderPosition } from './TraderPosition'
export type { TraderPositionFields, TraderPositionJSON } from './TraderPosition'
export { Bitset } from './Bitset'
export type { BitsetFields, BitsetJSON } from './Bitset'
export { Fractional } from './Fractional'
export type { FractionalFields, FractionalJSON } from './Fractional'
export { AccountTag } from './AccountTag'
export type { AccountTagField, AccountTagJSON } from './AccountTag'
export { InitializeMarketProductGroupParams } from './InitializeMarketProductGroupParams'
export type {
  InitializeMarketProductGroupParamsFields,
  InitializeMarketProductGroupParamsJSON
} from './InitializeMarketProductGroupParams'
export { InitializeMarketProductParams } from './InitializeMarketProductParams'
export type {
  InitializeMarketProductParamsFields,
  InitializeMarketProductParamsJSON
} from './InitializeMarketProductParams'
export { NewOrderParams } from './NewOrderParams'
export type { NewOrderParamsFields, NewOrderParamsJSON } from './NewOrderParams'
export { ConsumeOrderbookEventsParams } from './ConsumeOrderbookEventsParams'
export type {
  ConsumeOrderbookEventsParamsFields,
  ConsumeOrderbookEventsParamsJSON
} from './ConsumeOrderbookEventsParams'
export { CancelOrderParams } from './CancelOrderParams'
export type { CancelOrderParamsFields, CancelOrderParamsJSON } from './CancelOrderParams'
export { DepositFundsParams } from './DepositFundsParams'
export type { DepositFundsParamsFields, DepositFundsParamsJSON } from './DepositFundsParams'
export { WithdrawFundsParams } from './WithdrawFundsParams'
export type { WithdrawFundsParamsFields, WithdrawFundsParamsJSON } from './WithdrawFundsParams'
export { UpdateProductFundingParams } from './UpdateProductFundingParams'
export type {
  UpdateProductFundingParamsFields,
  UpdateProductFundingParamsJSON
} from './UpdateProductFundingParams'
export { InitializeComboParams } from './InitializeComboParams'
export type { InitializeComboParamsFields, InitializeComboParamsJSON } from './InitializeComboParams'
export { ClearExpiredOrderbookParams } from './ClearExpiredOrderbookParams'
export type {
  ClearExpiredOrderbookParamsFields,
  ClearExpiredOrderbookParamsJSON
} from './ClearExpiredOrderbookParams'
export { DomainOrProgramError }

export type DomainOrProgramErrorKind =
  | DomainOrProgramError.DexErr
  | DomainOrProgramError.UtilErr
  | DomainOrProgramError.ProgramErr
  | DomainOrProgramError.Other
export type DomainOrProgramErrorJSON =
  | DomainOrProgramError.DexErrJSON
  | DomainOrProgramError.UtilErrJSON
  | DomainOrProgramError.ProgramErrJSON
  | DomainOrProgramError.OtherJSON

export { UtilError }

export type UtilErrorKind =
  | UtilError.AccountAlreadyInitialized
  | UtilError.AccountUninitialized
  | UtilError.DuplicateProductKey
  | UtilError.PublicKeyMismatch
  | UtilError.AssertionError
  | UtilError.InvalidMintAuthority
  | UtilError.IncorrectOwner
  | UtilError.PublicKeysShouldBeUnique
  | UtilError.NotRentExempt
  | UtilError.NumericalOverflow
  | UtilError.RoundError
  | UtilError.DivisionbyZero
  | UtilError.InvalidReturnValue
  | UtilError.SqrtRootError
  | UtilError.ZeroPriceError
  | UtilError.ZeroQuantityError
  | UtilError.SerializeError
  | UtilError.DeserializeError
  | UtilError.InvalidBitsetIndex
export type UtilErrorJSON =
  | UtilError.AccountAlreadyInitializedJSON
  | UtilError.AccountUninitializedJSON
  | UtilError.DuplicateProductKeyJSON
  | UtilError.PublicKeyMismatchJSON
  | UtilError.AssertionErrorJSON
  | UtilError.InvalidMintAuthorityJSON
  | UtilError.IncorrectOwnerJSON
  | UtilError.PublicKeysShouldBeUniqueJSON
  | UtilError.NotRentExemptJSON
  | UtilError.NumericalOverflowJSON
  | UtilError.RoundErrorJSON
  | UtilError.DivisionbyZeroJSON
  | UtilError.InvalidReturnValueJSON
  | UtilError.SqrtRootErrorJSON
  | UtilError.ZeroPriceErrorJSON
  | UtilError.ZeroQuantityErrorJSON
  | UtilError.SerializeErrorJSON
  | UtilError.DeserializeErrorJSON
  | UtilError.InvalidBitsetIndexJSON

export { DexError }

export type DexErrorKind =
  | DexError.ContractIsExpired
  | DexError.ContractIsNotExpired
  | DexError.InvalidSystemProgramAccount
  | DexError.InvalidAobProgramAccount
  | DexError.InvalidStateAccountOwner
  | DexError.InvalidOrderIndex
  | DexError.UserAccountFull
  | DexError.TransactionAborted
  | DexError.MissingUserAccount
  | DexError.OrderNotFound
  | DexError.NoOp
  | DexError.OutofFunds
  | DexError.UserAccountStillActive
  | DexError.MarketStillActive
  | DexError.InvalidMarketSignerAccount
  | DexError.InvalidOrderbookAccount
  | DexError.InvalidMarketAdminAccount
  | DexError.InvalidBaseVaultAccount
  | DexError.InvalidQuoteVaultAccount
  | DexError.FullMarketProductGroup
  | DexError.MissingMarketProduct
  | DexError.InvalidWithdrawalAmount
  | DexError.InvalidTakerTrader
  | DexError.FundsError
  | DexError.InactiveProductError
  | DexError.TooManyOpenOrdersError
  | DexError.NoMoreOpenOrdersError
  | DexError.NonZeroPriceTickExponentError
  | DexError.DuplicateProductNameError
  | DexError.InvalidRiskResponseError
  | DexError.InvalidAccountHealthError
  | DexError.OrderbookIsEmptyError
  | DexError.CombosNotRemoved
  | DexError.AccountNotLiquidable
  | DexError.FundingPrecisionError
  | DexError.ProductDecimalPrecisionError
  | DexError.ProductNotOutright
  | DexError.ProductNotCombo
  | DexError.InvalidSocialLossCalculation
  | DexError.ProductIndexMismatch
  | DexError.InvalidOrderID
  | DexError.InvalidBytesForZeroCopyDeserialization
export type DexErrorJSON =
  | DexError.ContractIsExpiredJSON
  | DexError.ContractIsNotExpiredJSON
  | DexError.InvalidSystemProgramAccountJSON
  | DexError.InvalidAobProgramAccountJSON
  | DexError.InvalidStateAccountOwnerJSON
  | DexError.InvalidOrderIndexJSON
  | DexError.UserAccountFullJSON
  | DexError.TransactionAbortedJSON
  | DexError.MissingUserAccountJSON
  | DexError.OrderNotFoundJSON
  | DexError.NoOpJSON
  | DexError.OutofFundsJSON
  | DexError.UserAccountStillActiveJSON
  | DexError.MarketStillActiveJSON
  | DexError.InvalidMarketSignerAccountJSON
  | DexError.InvalidOrderbookAccountJSON
  | DexError.InvalidMarketAdminAccountJSON
  | DexError.InvalidBaseVaultAccountJSON
  | DexError.InvalidQuoteVaultAccountJSON
  | DexError.FullMarketProductGroupJSON
  | DexError.MissingMarketProductJSON
  | DexError.InvalidWithdrawalAmountJSON
  | DexError.InvalidTakerTraderJSON
  | DexError.FundsErrorJSON
  | DexError.InactiveProductErrorJSON
  | DexError.TooManyOpenOrdersErrorJSON
  | DexError.NoMoreOpenOrdersErrorJSON
  | DexError.NonZeroPriceTickExponentErrorJSON
  | DexError.DuplicateProductNameErrorJSON
  | DexError.InvalidRiskResponseErrorJSON
  | DexError.InvalidAccountHealthErrorJSON
  | DexError.OrderbookIsEmptyErrorJSON
  | DexError.CombosNotRemovedJSON
  | DexError.AccountNotLiquidableJSON
  | DexError.FundingPrecisionErrorJSON
  | DexError.ProductDecimalPrecisionErrorJSON
  | DexError.ProductNotOutrightJSON
  | DexError.ProductNotComboJSON
  | DexError.InvalidSocialLossCalculationJSON
  | DexError.ProductIndexMismatchJSON
  | DexError.InvalidOrderIDJSON
  | DexError.InvalidBytesForZeroCopyDeserializationJSON

export { ProductStatus }

export type ProductStatusKind = ProductStatus.Uninitialized | ProductStatus.Initialized | ProductStatus.Expired
export type ProductStatusJSON =
  | ProductStatus.UninitializedJSON
  | ProductStatus.InitializedJSON
  | ProductStatus.ExpiredJSON

export { OrderType }

export type OrderTypeKind =
  | OrderType.Limit
  | OrderType.ImmediateOrCancel
  | OrderType.FillOrKill
  | OrderType.PostOnly
export type OrderTypeJSON =
  | OrderType.LimitJSON
  | OrderType.ImmediateOrCancelJSON
  | OrderType.FillOrKillJSON
  | OrderType.PostOnlyJSON

export { Product }

export type ProductKind = Product.Outright
export type ProductJSON = Product.OutrightJSON

export { OperationType }

export type OperationTypeKind =
  | OperationType.NewOrder
  | OperationType.CancelOrder
  | OperationType.CheckHealth
  | OperationType.PositionTransfer
  | OperationType.ConsumeEvents
export type OperationTypeJSON =
  | OperationType.NewOrderJSON
  | OperationType.CancelOrderJSON
  | OperationType.CheckHealthJSON
  | OperationType.PositionTransferJSON
  | OperationType.ConsumeEventsJSON

export { HealthResult }

export type HealthResultKind = HealthResult.Health | HealthResult.Liquidation
export type HealthResultJSON = HealthResult.HealthJSON | HealthResult.LiquidationJSON

export { HealthStatus }

export type HealthStatusKind =
  | HealthStatus.Healthy
  | HealthStatus.Unhealthy
  | HealthStatus.Liquidatable
  | HealthStatus.NotLiquidatable
export type HealthStatusJSON =
  | HealthStatus.HealthyJSON
  | HealthStatus.UnhealthyJSON
  | HealthStatus.LiquidatableJSON
  | HealthStatus.NotLiquidatableJSON

export { ActionStatus }

export type ActionStatusKind = ActionStatus.Approved | ActionStatus.NotApproved
export type ActionStatusJSON = ActionStatus.ApprovedJSON | ActionStatus.NotApprovedJSON
