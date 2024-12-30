import BN__default from 'bn.js';
import Decimal from 'decimal.js';
import { Token } from '../module/token.js';
import { Price } from '../module/price.js';
import { CurrencyAmount } from '../module/amount.js';
import { Fraction } from '../module/fraction.js';
import { Percent } from '../module/percent.js';
import { TokenJson, SplToken } from '../gfx/token/type.js';
import { l as ReplaceType } from '../type-f1af695b.js';
import { BigNumberish } from './number.js';
import '@solana/web3.js';
import './pubKey.js';
import './logger.js';
import '../module/currency.js';
import '../api/type.js';
import '@solana/spl-token';
import '../api/api.js';
import 'axios';
import '../solana/type.js';
import '../api/url.js';
import './txTool/txType.js';
import './owner.js';
import './txTool/lookupTable.js';

type Numberish = number | string | bigint | Fraction | BN__default;
/**
 *
 * @example
 * getIntInfo(0.34) => { numerator: '34', denominator: '100'}
 * getIntInfo('0.34') //=> { numerator: '34', denominator: '100'}
 */
declare function parseNumberInfo(n: Numberish | undefined): {
    denominator: string;
    numerator: string;
    sign?: string;
    int?: string;
    dec?: string;
};
declare function divCeil(a: BN__default, b: BN__default): BN__default;
declare function shakeFractionDecimal(n: Fraction): string;
declare function toBN(n: Numberish, decimal?: BigNumberish): BN__default;
declare function toFraction(value: Numberish): Fraction;
/**
 * @example
 * toPercent(3.14) // => Percent { 314.00% }
 * toPercent(3.14, { alreadyDecimaled: true }) // => Percent {3.14%}
 */
declare function toPercent(n: Numberish, options?: {
    alreadyDecimaled?: boolean;
}): Percent;
declare function toTokenPrice(params: {
    token: TokenJson | Token | SplToken;
    numberPrice: Numberish;
    decimalDone?: boolean;
}): Price;
declare function toUsdCurrency(amount: Numberish): CurrencyAmount;
declare function toTotalPrice(amount: Numberish | undefined, price: Price | undefined): CurrencyAmount;
declare function decimalToFraction(n: Decimal | undefined): Fraction | undefined;
declare function isDecimal(val: unknown): boolean;
declare function recursivelyDecimalToFraction<T>(info: T): ReplaceType<T, Decimal, Fraction>;

export { Numberish, decimalToFraction, divCeil, isDecimal, parseNumberInfo, recursivelyDecimalToFraction, shakeFractionDecimal, toBN, toFraction, toPercent, toTokenPrice, toTotalPrice, toUsdCurrency };
