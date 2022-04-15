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

const heap = new Array(32).fill(undefined)

heap.push(undefined, null, true, false)

let heap_next = heap.length

function addHeapObject(obj) {
  if (heap_next === heap.length) heap.push(heap.length + 1)
  const idx = heap_next
  heap_next = heap[idx]

  heap[idx] = obj
  return idx
}

let WASM_VECTOR_LEN = 0

function passArray8ToWasm0(arg, malloc) {
  const ptr = malloc(arg.length * 1)
  getUint8Memory0().set(arg, ptr / 1)
  WASM_VECTOR_LEN = arg.length
  return ptr
}

let cachegetInt32Memory0 = null
function getInt32Memory0() {
  if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
    cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer)
  }
  return cachegetInt32Memory0
}

function getObject(idx) {
  return heap[idx]
}

function dropObject(idx) {
  if (idx < 36) return
  heap[idx] = heap_next
  heap_next = idx
}

function takeObject(idx) {
  const ret = getObject(idx)
  dropObject(idx)
  return ret
}

const u32CvtShim = new Uint32Array(2)

const uint64CvtShim = new BigUint64Array(u32CvtShim.buffer)

function _assertClass(instance, klass) {
  if (!(instance instanceof klass)) {
    throw new Error(`expected instance of ${klass.name}`)
  }
  return instance.ptr
}
/**
 * @param {Uint8Array} ssl_in
 * @param {Uint8Array} ssl_out
 * @param {Uint8Array} pair
 * @param {OracleRegistry} oracles
 * @param {BigInt} amount_in
 * @param {BigInt} min_out
 * @returns {SwapResult}
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
    var r2 = getInt32Memory0()[retptr / 4 + 2]
    if (r2) {
      throw takeObject(r1)
    }
    return SwapResult.__wrap(r0)
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16)
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
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16)
      var ptr0 = passArray8ToWasm0(key, wasm.__wbindgen_malloc)
      var len0 = WASM_VECTOR_LEN
      var ptr1 = passArray8ToWasm0(data, wasm.__wbindgen_malloc)
      var len1 = WASM_VECTOR_LEN
      wasm.oracleregistry_add_oracle(retptr, this.ptr, ptr0, len0, ptr1, len1)
      var r0 = getInt32Memory0()[retptr / 4 + 0]
      var r1 = getInt32Memory0()[retptr / 4 + 1]
      if (r1) {
        throw takeObject(r0)
      }
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16)
    }
  }
}
/**
 */
export class SwapResult {
  static __wrap(ptr) {
    const obj = Object.create(SwapResult.prototype)
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
    wasm.__wbg_swapresult_free(ptr)
  }
  /**
   */
  get out() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16)
      wasm.__wbg_get_swapresult_out(retptr, this.ptr)
      var r0 = getInt32Memory0()[retptr / 4 + 0]
      var r1 = getInt32Memory0()[retptr / 4 + 1]
      u32CvtShim[0] = r0
      u32CvtShim[1] = r1
      const n0 = uint64CvtShim[0]
      return n0
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16)
    }
  }
  /**
   * @param {BigInt} arg0
   */
  set out(arg0) {
    uint64CvtShim[0] = arg0
    const low0 = u32CvtShim[0]
    const high0 = u32CvtShim[1]
    wasm.__wbg_set_swapresult_out(this.ptr, low0, high0)
  }
  /**
   */
  get price_impact() {
    var ret = wasm.__wbg_get_swapresult_price_impact(this.ptr)
    return ret
  }
  /**
   * @param {number} arg0
   */
  set price_impact(arg0) {
    wasm.__wbg_set_swapresult_price_impact(this.ptr, arg0)
  }
}

export function __wbindgen_string_new(arg0, arg1) {
  var ret = getStringFromWasm0(arg0, arg1)
  return addHeapObject(ret)
}

export function __wbindgen_throw(arg0, arg1) {
  throw new Error(getStringFromWasm0(arg0, arg1))
}
