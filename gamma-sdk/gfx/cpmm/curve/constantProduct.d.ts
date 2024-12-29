import BN__default from 'bn.js';
import { S as SwapWithoutFeesResult, R as RoundDirection, T as TradingTokenResult } from '../../../type-acc35ac5.js';
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

declare class ConstantProductCurve {
    static swapWithoutFees(sourceAmount: BN__default, swapSourceAmount: BN__default, swapDestinationAmount: BN__default): SwapWithoutFeesResult;
    static lpTokensToTradingTokens(lpTokenAmount: BN__default, lpTokenSupply: BN__default, swapTokenAmount0: BN__default, swapTokenAmount1: BN__default, roundDirection: RoundDirection): TradingTokenResult;
}

export { ConstantProductCurve };
