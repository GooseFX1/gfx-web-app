import * as wasm from './gfx_ssl_wasm_bg.wasm'

const lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true })

cachedTextDecoder.decode()

let cachegetUint8Memory0 = null
function getUint8Memory0() {
  if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
    cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer)
  }
  return cachegetUint8Memory0
}

function getStringFromWasm0(ptr, len) {
  return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len))
}

let WASM_VECTOR_LEN = 0

function passArray8ToWasm0(arg, malloc) {
  const ptr = malloc(arg.length * 1)
  getUint8Memory0().set(arg, ptr / 1)
  WASM_VECTOR_LEN = arg.length
  return ptr
}

function _assertClass(instance, klass) {
  if (!(instance instanceof klass)) {
    throw new Error(`expected instance of ${klass.name}`)
  }
  return instance.ptr
}

const u32CvtShim = new Uint32Array(2)

const uint64CvtShim = new BigUint64Array(u32CvtShim.buffer)

let cachegetInt32Memory0 = null
function getInt32Memory0() {
  if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
    cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer)
  }
  return cachegetInt32Memory0
}
/**
 * @param {Uint8Array} ssl_in
 * @param {Uint8Array} ssl_out
 * @param {Uint8Array} pair
 * @param {OracleRegistry} oracles
 * @param {BigInt} amount_in
 * @param {BigInt} min_out
 * @returns {BigInt}
 */
export function swap(ssl_in, ssl_out, pair, oracles, amount_in, min_out) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16)
    var ptr0 = passArray8ToWasm0(ssl_in, wasm.__wbindgen_malloc)
    var len0 = WASM_VECTOR_LEN
    var ptr1 = passArray8ToWasm0(ssl_out, wasm.__wbindgen_malloc)
    var len1 = WASM_VECTOR_LEN
    var ptr2 = passArray8ToWasm0(pair, wasm.__wbindgen_malloc)
    var len2 = WASM_VECTOR_LEN
    _assertClass(oracles, OracleRegistry)
    var ptr3 = oracles.ptr
    oracles.ptr = 0
    uint64CvtShim[0] = amount_in
    const low4 = u32CvtShim[0]
    const high4 = u32CvtShim[1]
    uint64CvtShim[0] = min_out
    const low5 = u32CvtShim[0]
    const high5 = u32CvtShim[1]
    wasm.swap(retptr, ptr0, len0, ptr1, len1, ptr2, len2, ptr3, low4, high4, low5, high5)
    var r0 = getInt32Memory0()[retptr / 4 + 0]
    var r1 = getInt32Memory0()[retptr / 4 + 1]
    u32CvtShim[0] = r0
    u32CvtShim[1] = r1
    const n6 = uint64CvtShim[0]
    return n6
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16)
    ssl_in.set(getUint8Memory0().subarray(ptr0 / 1, ptr0 / 1 + len0))
    wasm.__wbindgen_free(ptr0, len0 * 1)
    ssl_out.set(getUint8Memory0().subarray(ptr1 / 1, ptr1 / 1 + len1))
    wasm.__wbindgen_free(ptr1, len1 * 1)
    pair.set(getUint8Memory0().subarray(ptr2 / 1, ptr2 / 1 + len2))
    wasm.__wbindgen_free(ptr2, len2 * 1)
  }
}

/**
 */
export class OracleRegistry {
  static __wrap(ptr) {
    const obj = Object.create(OracleRegistry.prototype)
    obj.ptr = ptr

    return obj
  }

  __destroy_into_raw() {
    const ptr = this.ptr
    this.ptr = 0

    return ptr
  }

  free() {
    const ptr = this.__destroy_into_raw()
    wasm.__wbg_oracleregistry_free(ptr)
  }
  /**
   */
  constructor() {
    var ret = wasm.oracleregistry_new()
    return OracleRegistry.__wrap(ret)
  }
  /**
   * @param {Uint8Array} key
   * @param {Uint8Array} data
   */
  add_oracle(key, data) {
    var ptr0 = passArray8ToWasm0(key, wasm.__wbindgen_malloc)
    var len0 = WASM_VECTOR_LEN
    var ptr1 = passArray8ToWasm0(data, wasm.__wbindgen_malloc)
    var len1 = WASM_VECTOR_LEN
    wasm.oracleregistry_add_oracle(this.ptr, ptr0, len0, ptr1, len1)
  }
}

export function __wbindgen_throw(arg0, arg1) {
  throw new Error(getStringFromWasm0(arg0, arg1))
}
