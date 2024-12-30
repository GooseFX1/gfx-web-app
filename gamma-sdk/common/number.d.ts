import BN__default from 'bn.js';

declare enum Rounding {
    ROUND_DOWN = 0,
    ROUND_HALF_UP = 1,
    ROUND_UP = 2
}
declare const BN_ZERO: BN__default;
declare const BN_ONE: BN__default;
declare const BN_TWO: BN__default;
declare const BN_THREE: BN__default;
declare const BN_FIVE: BN__default;
declare const BN_TEN: BN__default;
declare const BN_100: BN__default;
declare const BN_1000: BN__default;
declare const BN_10000: BN__default;
type BigNumberish = BN__default | string | number | bigint;
declare function parseBigNumberish(value: BigNumberish): BN__default;
declare function tenExponential(shift: BigNumberish): BN__default;

export { BN_100, BN_1000, BN_10000, BN_FIVE, BN_ONE, BN_TEN, BN_THREE, BN_TWO, BN_ZERO, BigNumberish, Rounding, parseBigNumberish, tenExponential };
