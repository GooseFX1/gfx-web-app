import * as wasm from "./gamma-wasm_bg.wasm";
export * from "./gamma-wasm_bg.js";
import { __wbg_set_wasm } from "./gamma-wasm_bg.js";
__wbg_set_wasm(wasm);
wasm.__wbindgen_start();
