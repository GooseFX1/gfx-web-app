/* tslint:disable */
/* eslint-disable */
/**
 * @param {Uint8Array} ssl_in
 * @param {Uint8Array} ssl_out
 * @param {Uint8Array} pair
 * @param {OracleRegistry} oracles
 * @param {BigInt} amount_in
 * @param {BigInt} min_out
 * @returns {SwapResult}
 */
export function swap(
  ssl_in: Uint8Array,
  ssl_out: Uint8Array,
  pair: Uint8Array,
  oracles: OracleRegistry,
  amount_in: BigInt,
  min_out: BigInt
): SwapResult
/**
 */
export class OracleRegistry {
  free(): void
  /**
   */
  constructor()
  /**
   * @param {Uint8Array} key
   * @param {Uint8Array} data
   */
  add_oracle(key: Uint8Array, data: Uint8Array): void
}
/**
 */
export class SwapResult {
  free(): void
  /**
   */
  out: BigInt
  /**
   */
  price_impact: number
}
