/* tslint:disable */
/* eslint-disable */
export const memory: WebAssembly.Memory
export type Decimal = {
  flags: number
  hi: number
  lo: number
  mid: number
}
export function decimalToNumber(d: Decimal): number
