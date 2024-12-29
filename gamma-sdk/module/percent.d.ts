import { Rounding } from '../common/number.js';
import { Fraction } from './fraction.js';
import 'bn.js';

declare const _100_PERCENT: Fraction;
declare class Percent extends Fraction {
    toSignificant(significantDigits?: number, format?: object, rounding?: Rounding): string;
    toFixed(decimalPlaces?: number, format?: object, rounding?: Rounding): string;
}

export { Percent, _100_PERCENT };
