import BN__default from 'bn.js';
import { BigNumberish, Rounding } from '../common/number.js';

declare class Fraction {
    readonly numerator: BN__default;
    readonly denominator: BN__default;
    constructor(numerator: BigNumberish, denominator?: BigNumberish);
    get quotient(): BN__default;
    invert(): Fraction;
    add(other: Fraction | BigNumberish): Fraction;
    sub(other: Fraction | BigNumberish): Fraction;
    mul(other: Fraction | BigNumberish): Fraction;
    div(other: Fraction | BigNumberish): Fraction;
    toSignificant(significantDigits: number, format?: object, rounding?: Rounding): string;
    toFixed(decimalPlaces: number, format?: object, rounding?: Rounding): string;
    isZero(): boolean;
}

export { Fraction };
