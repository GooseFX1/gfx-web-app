import { Rounding, BigNumberish } from '../common/number.js';
import { Fraction } from './fraction.js';
import { Token } from './token.js';
import 'bn.js';
import '@solana/web3.js';
import '../common/pubKey.js';

interface PriceProps {
    baseToken: Token;
    denominator: BigNumberish;
    quoteToken: Token;
    numerator: BigNumberish;
}
declare class Price extends Fraction {
    readonly baseToken: Token;
    readonly quoteToken: Token;
    readonly scalar: Fraction;
    constructor(params: PriceProps);
    get raw(): Fraction;
    get adjusted(): Fraction;
    invert(): Price;
    mul(other: Price): Price;
    toSignificant(significantDigits?: number, format?: object, rounding?: Rounding): string;
    toFixed(decimalPlaces?: number, format?: object, rounding?: Rounding): string;
}

export { Price };
