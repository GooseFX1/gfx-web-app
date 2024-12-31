import BN__default from 'bn.js';
import { i as CpmmObservationState } from '../../../type-acc35ac5.js';
import '@solana/web3.js';
import '../../../api/type.js';
import '../../../common/txTool/txType.js';
import '../../../type-f1af695b.js';
import '@solana/spl-token';
import '../../../module/amount.js';
import '../../../common/number.js';
import '../../../common/logger.js';
import '../../../module/fraction.js';
import '../../../module/token.js';
import '../../../common/pubKey.js';
import '../../../module/currency.js';
import '../../../api/api.js';
import 'axios';
import '../../../solana/type.js';
import '../../../api/url.js';
import '../../../common/owner.js';
import '../../../common/txTool/lookupTable.js';
import '../../../module/percent.js';
import '../layout.js';
import '../../../marshmallow/index.js';
import '../../../marshmallow/buffer-layout.js';
import 'decimal.js';

declare const FEE_RATE_DENOMINATOR_VALUE: BN__default;
type PriceRange = {
    minPrice: BN__default;
    maxPrice: BN__default;
    twapPrice: BN__default;
};
type FeeType = 'volatility';
declare class DynamicFee {
    static calculateDynamicFee(amount: BN__default, blockTimestamp: BN__default, observationState: CpmmObservationState, feeType: FeeType, baseFees: BN__default): BN__default;
    static calculateDynamicFeeRate(blockTimestamp: BN__default, observationState: CpmmObservationState, feeType: FeeType, baseFees: BN__default): BN__default;
    static calculateVolatileFee(blockTimestamp: BN__default, observationState: CpmmObservationState, baseFees: BN__default): BN__default;
    static getPriceRange(observationState: CpmmObservationState, currentTime: BN__default, window: BN__default): PriceRange;
    static calculatePreFeeAmount(blockTimestamp: BN__default, postFeeAmount: BN__default, observationState: CpmmObservationState, feeType: FeeType, baseFees: BN__default): BN__default;
}

export { DynamicFee, FEE_RATE_DENOMINATOR_VALUE };
