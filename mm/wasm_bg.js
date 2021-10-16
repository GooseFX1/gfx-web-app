import * as wasm from './wasm_bg.wasm';

/**
* @param {number} a
* @param {number} b
* @returns {number}
*/
export function add_two_ints(a, b) {
    var ret = wasm.add_two_ints(a, b);
    return ret >>> 0;
}

/**
* @param {number} n
* @returns {number}
*/
export function fib(n) {
    var ret = wasm.fib(n);
    return ret >>> 0;
}

