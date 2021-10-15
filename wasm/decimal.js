import * as wasm from './decimaljs_bg.wasm'

/**
 * @param {number} flags
 * @param {number} hi
 * @param {number} lo
 * @param {number} mid
 * @returns {number}
 */
export function decimalToNumber({ flags, hi, lo, mid }) {
  return wasm.decimal2number(flags, hi, lo, mid)
}
