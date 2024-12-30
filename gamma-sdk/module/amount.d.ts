import BN__default from 'bn.js';
import { BigNumberish, Rounding } from '../common/number.js';
import { Logger } from '../common/logger.js';
import { Fraction } from './fraction.js';
import { Token } from './token.js';
import { Currency } from './currency.js';
import '@solana/web3.js';
import '../common/pubKey.js';

declare function splitNumber(num: string, decimals: number): [string, string];
declare class TokenAmount extends Fraction {
    readonly token: Token;
    protected logger: Logger;
    constructor(token: Token, amount: BigNumberish, isRaw?: boolean, name?: string);
    get raw(): BN__default;
    isZero(): boolean;
    gt(other: TokenAmount): boolean;
    /**
     * a less than b
     */
    lt(other: TokenAmount): boolean;
    add(other: TokenAmount): TokenAmount;
    subtract(other: TokenAmount): TokenAmount;
    toSignificant(significantDigits?: number, format?: object, rounding?: Rounding): string;
    /**
     * To fixed
     *
     * @example
     * ```
     * 1 -> 1.000000000
     * 1.234 -> 1.234000000
     * 1.123456789876543 -> 1.123456789
     * ```
     */
    toFixed(decimalPlaces?: number, format?: object, rounding?: Rounding): string;
    /**
     * To exact
     *
     * @example
     * ```
     * 1 -> 1
     * 1.234 -> 1.234
     * 1.123456789876543 -> 1.123456789
     * ```
     */
    toExact(format?: object): string;
}
declare class CurrencyAmount extends Fraction {
    readonly currency: Currency;
    protected logger: Logger;
    constructor(currency: Currency, amount: BigNumberish, isRaw?: boolean, name?: string);
    get raw(): BN__default;
    isZero(): boolean;
    /**
     * a greater than b
     */
    gt(other: CurrencyAmount): boolean;
    /**
     * a less than b
     */
    lt(other: CurrencyAmount): boolean;
    add(other: CurrencyAmount): CurrencyAmount;
    sub(other: CurrencyAmount): CurrencyAmount;
    toSignificant(significantDigits?: number, format?: object, rounding?: Rounding): string;
    /**
     * To fixed
     *
     * @example
     * ```
     * 1 -> 1.000000000
     * 1.234 -> 1.234000000
     * 1.123456789876543 -> 1.123456789
     * ```
     */
    toFixed(decimalPlaces?: number, format?: object, rounding?: Rounding): string;
    /**
     * To exact
     *
     * @example
     * ```
     * 1 -> 1
     * 1.234 -> 1.234
     * 1.123456789876543 -> 1.123456789
     * ```
     */
    toExact(format?: object): string;
}

export { CurrencyAmount, TokenAmount, splitNumber };
