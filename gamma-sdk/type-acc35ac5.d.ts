import { PublicKey, EpochInfo } from '@solana/web3.js';
import { ConfigInfo, PoolInfo, PoolKeys } from './api/type.js';
import { TxVersion } from './common/txTool/txType.js';
import BN__default from 'bn.js';
import { C as ComputeBudgetConfig, G as GetTransferAmountFee } from './type-f1af695b.js';
import { Percent } from './module/percent.js';
import { CpmmPoolInfoLayout, ObservationLayout, CpmmObservationStateLayout, CpmmUserPoolLiquidityLayout } from './gfx/cpmm/layout.js';
import Decimal from 'decimal.js';

declare enum RoundDirection {
    Floor = 0,
    Ceiling = 1
}
type SwapWithoutFeesResult = {
    sourceAmountSwapped: BN__default;
    destinationAmountSwapped: BN__default;
};
type TradingTokenResult = {
    tokenAmount0: BN__default;
    tokenAmount1: BN__default;
};
type SwapResult = {
    newSwapSourceAmount: BN__default;
    newSwapDestinationAmount: BN__default;
    sourceAmountSwapped: BN__default;
    destinationAmountSwapped: BN__default;
    tradeFee: BN__default;
};
declare class CurveCalculator {
    static validate_supply(tokenAmount0: BN__default, tokenAmount1: BN__default): void;
    static swap(sourceAmount: BN__default, swapSourceAmount: BN__default, swapDestinationAmount: BN__default, tradeFeeRate: BN__default, observationState: CpmmObservationState): SwapResult;
    static swapBaseOut({ poolMintA, poolMintB, tradeFeeRate, baseReserve, quoteReserve, outputMint, outputAmount, }: {
        poolMintA: {
            address: string;
            decimals: number;
        };
        poolMintB: {
            address: string;
            decimals: number;
        };
        tradeFeeRate: BN__default;
        baseReserve: BN__default;
        quoteReserve: BN__default;
        outputMint: string | PublicKey;
        outputAmount: BN__default;
    }): {
        amountRealOut: BN__default;
        amountIn: BN__default;
        amountInWithoutFee: BN__default;
        tradeFee: BN__default;
        priceImpact: number;
    };
}

interface MintInfo {
    address: string;
    decimals: number;
    programId: string;
}
interface CpmmConfigInfoInterface {
    bump: number;
    disableCreatePool: boolean;
    index: number;
    tradeFeeRate: BN__default;
    protocolFeeRate: BN__default;
    fundFeeRate: BN__default;
    createPoolFee: BN__default;
    protocolOwner: PublicKey;
    fundOwner: PublicKey;
}
interface CpmmPoolInfoInterface {
    configId: PublicKey;
    poolCreator: PublicKey;
    vaultA: PublicKey;
    vaultB: PublicKey;
    mintLp: PublicKey;
    mintA: PublicKey;
    mintB: PublicKey;
    mintProgramA: PublicKey;
    mintProgramB: PublicKey;
    observationId: PublicKey;
    bump: number;
    status: number;
    lpDecimals: number;
    mintDecimalA: number;
    mintDecimalB: number;
    lpAmount: BN__default;
    protocolFeesMintA: BN__default;
    protocolFeesMintB: BN__default;
    fundFeesMintA: BN__default;
    fundFeesMintB: BN__default;
    openTime: BN__default;
    recentEpoch: BN__default;
    tradeFeesTokenA: BN__default;
    tradeFeesTokenB: BN__default;
    cumulativeVolumeTokenA: BN__default;
    cumulativeVolumeTokenB: BN__default;
}
interface CreateCpmmPoolParam<T> {
    programId: PublicKey;
    poolFeeAccount: PublicKey;
    mintA: MintInfo;
    mintB: MintInfo;
    mintAAmount: BN__default;
    mintBAmount: BN__default;
    startTime: BN__default;
    maxTradeFeeRate: BN__default;
    volatilityFactor: BN__default;
    feeConfig: ConfigInfo;
    associatedOnly: boolean;
    checkCreateATAOwner?: boolean;
    ownerInfo: {
        feePayer?: PublicKey;
        useSOLBalance?: boolean;
    };
    computeBudgetConfig?: ComputeBudgetConfig;
    txVersion?: T;
}
interface CreateCpmmPoolAddress {
    poolId: PublicKey;
    configId: PublicKey;
    authority: PublicKey;
    lpMint: PublicKey;
    vaultA: PublicKey;
    vaultB: PublicKey;
    observationId: PublicKey;
    mintA: MintInfo;
    mintB: MintInfo;
    programId: PublicKey;
    poolFeeAccount: PublicKey;
    feeConfig: ConfigInfo;
}
declare enum PartnerType {
    AssetDash = "AssetDash"
}
interface AddCpmmLiquidityParams<T = TxVersion.LEGACY> {
    poolInfo: PoolInfo;
    poolKeys?: PoolKeys;
    payer?: PublicKey;
    inputAmount: BN__default;
    baseIn: boolean;
    slippage: Percent;
    config?: {
        bypassAssociatedCheck?: boolean;
        checkCreateATAOwner?: boolean;
    };
    computeBudgetConfig?: ComputeBudgetConfig;
    txVersion?: T;
    computeResult?: {
        inputAmountFee: GetTransferAmountFee;
        anotherAmount: GetTransferAmountFee;
        maxAnotherAmount: GetTransferAmountFee;
        liquidity: BN__default;
    };
    partner?: PartnerType;
}
interface WithdrawCpmmLiquidityParams<T = TxVersion.LEGACY> {
    poolInfo: PoolInfo;
    poolKeys?: PoolKeys;
    payer?: PublicKey;
    lpAmount: BN__default;
    slippage: Percent;
    computeBudgetConfig?: ComputeBudgetConfig;
    txVersion?: T;
}
interface CpmmSwapParams<T = TxVersion.LEGACY> {
    poolInfo: PoolInfo;
    poolKeys?: PoolKeys;
    payer?: PublicKey;
    baseIn: boolean;
    fixedOut?: boolean;
    slippage?: number;
    swapResult: Pick<SwapResult, "sourceAmountSwapped" | "destinationAmountSwapped">;
    inputAmount: BN__default;
    config?: {
        bypassAssociatedCheck?: boolean;
        checkCreateATAOwner?: boolean;
        associatedOnly?: boolean;
    };
    computeBudgetConfig?: ComputeBudgetConfig;
    txVersion?: T;
    wrapSol?: boolean;
}
interface ComputePairAmountParams {
    poolInfo: PoolInfo;
    baseReserve: BN__default;
    quoteReserve: BN__default;
    amount: string | Decimal;
    slippage: Percent;
    epochInfo: EpochInfo;
    baseIn?: boolean;
}
type CpmmRpcData = ReturnType<typeof CpmmPoolInfoLayout.decode> & {
    baseReserve: BN__default;
    quoteReserve: BN__default;
    vaultAAmount: BN__default;
    vaultBAmount: BN__default;
    configInfo?: CpmmConfigInfoInterface;
    poolPrice: Decimal;
    programId: PublicKey;
};
type CpmmComputeData = {
    id: PublicKey;
    version: 7;
    configInfo: CpmmConfigInfoInterface;
    mintA: MintInfo;
    mintB: MintInfo;
    authority: PublicKey;
} & Omit<CpmmRpcData, "configInfo" | "mintA" | "mintB">;
type CpmmObservation = ReturnType<typeof ObservationLayout.decode>;
type CpmmObservationState = ReturnType<typeof CpmmObservationStateLayout.decode>;
type UserLiquidityAccount = ReturnType<typeof CpmmUserPoolLiquidityLayout.decode>;

export { AddCpmmLiquidityParams as A, CpmmConfigInfoInterface as C, PartnerType as P, RoundDirection as R, SwapWithoutFeesResult as S, TradingTokenResult as T, UserLiquidityAccount as U, WithdrawCpmmLiquidityParams as W, CpmmPoolInfoInterface as a, CreateCpmmPoolParam as b, CreateCpmmPoolAddress as c, CpmmSwapParams as d, ComputePairAmountParams as e, CpmmRpcData as f, CpmmComputeData as g, CpmmObservation as h, CpmmObservationState as i, SwapResult as j, CurveCalculator as k };
