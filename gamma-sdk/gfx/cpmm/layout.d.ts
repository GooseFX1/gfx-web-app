import { Structure } from '../../marshmallow/index.js';
import * as _solana_web3_js from '@solana/web3.js';
import * as BN from 'bn.js';
import '../../marshmallow/buffer-layout.js';

declare const CpmmConfigInfoLayout: Structure<number | boolean | BN | Buffer | _solana_web3_js.PublicKey | BN[], "", {
    bump: number;
    disableCreatePool: boolean;
    index: number;
    tradeFeeRate: BN;
    protocolFeeRate: BN;
    fundFeeRate: BN;
    createPoolFee: BN;
    protocolOwner: _solana_web3_js.PublicKey;
    fundOwner: _solana_web3_js.PublicKey;
    referralProject: _solana_web3_js.PublicKey;
    maxOpenTime: BN;
}>;
declare const CpmmPartnerInfoLayout: Structure<BN, "", {
    partnerId: BN;
    lpTokenLinkedWithPartner: BN;
    cumulativeFeeTotalTimesTvlShareTokenA: BN;
    cumulativeFeeTotalTimesTvlShareTokenB: BN;
}>;
declare const CpmmPoolInfoLayout: Structure<number | BN | number[] | Buffer | _solana_web3_js.PublicKey | BN[] | {
    partnerId: BN;
    lpTokenLinkedWithPartner: BN;
    cumulativeFeeTotalTimesTvlShareTokenA: BN;
    cumulativeFeeTotalTimesTvlShareTokenB: BN;
}[], "", {
    status: number;
    configId: _solana_web3_js.PublicKey;
    poolCreator: _solana_web3_js.PublicKey;
    vaultA: _solana_web3_js.PublicKey;
    vaultB: _solana_web3_js.PublicKey;
    mintA: _solana_web3_js.PublicKey;
    mintB: _solana_web3_js.PublicKey;
    mintProgramA: _solana_web3_js.PublicKey;
    mintProgramB: _solana_web3_js.PublicKey;
    observationId: _solana_web3_js.PublicKey;
    authBump: number;
    _padding2: number;
    mintDecimalA: number;
    mintDecimalB: number;
    lpSupply: BN;
    protocolFeesMintA: BN;
    protocolFeesMintB: BN;
    fundFeesMintA: BN;
    fundFeesMintB: BN;
    openTime: BN;
    recentEpoch: BN;
    cumulativeTradeFeesTokenA: BN;
    cumulativeTradeFeesTokenB: BN;
    cumulativeVolumeTokenA: BN;
    cumulativeVolumeTokenB: BN;
    latestDynamicFeeRate: BN;
    maxTradeFeeRate: BN;
    volatilityFactor: BN;
    tokenAVaultAmount: BN;
    tokenBVaultAmount: BN;
    maxSharedTokenA: BN;
    maxSharedTokenB: BN;
    partners: {
        partnerId: BN;
        lpTokenLinkedWithPartner: BN;
        cumulativeFeeTotalTimesTvlShareTokenA: BN;
        cumulativeFeeTotalTimesTvlShareTokenB: BN;
    }[];
}>;
declare const ObservationLayout: Structure<BN, "", {
    blockTimestamp: BN;
    cumulativeToken0PriceX32: BN;
    cumulativeToken1PriceX32: BN;
}>;
declare const CpmmObservationStateLayout: Structure<number | boolean | Buffer | _solana_web3_js.PublicKey | BN[] | {
    blockTimestamp: BN;
    cumulativeToken0PriceX32: BN;
    cumulativeToken1PriceX32: BN;
}[], "", {
    initialized: boolean;
    observationIndex: number;
    poolId: _solana_web3_js.PublicKey;
    observations: {
        blockTimestamp: BN;
        cumulativeToken0PriceX32: BN;
        cumulativeToken1PriceX32: BN;
    }[];
}>;
declare const CpmmUserPoolLiquidityLayout: Structure<BN | Buffer | _solana_web3_js.PublicKey, "", {
    user: _solana_web3_js.PublicKey;
    poolState: _solana_web3_js.PublicKey;
    tokenADeposited: BN;
    tokenBDeposited: BN;
    token0Withdrawn: BN;
    token1Withdrawn: BN;
    lpTokensOwned: BN;
    referrer: _solana_web3_js.PublicKey;
}>;

export { CpmmConfigInfoLayout, CpmmObservationStateLayout, CpmmPartnerInfoLayout, CpmmPoolInfoLayout, CpmmUserPoolLiquidityLayout, ObservationLayout };
