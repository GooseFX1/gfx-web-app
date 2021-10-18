import * as wasm from './decimaljs_bg.wasm'

/**
 * @param {number} flags
 * @param {number} hi
 * @param {number} lo
 * @param {number} mid
 * @returns {number}
 */
export function decimal2number(flags, hi, lo, mid) {
  var ret = wasm.decimal2number(flags, hi, lo, mid)
  return ret
}
