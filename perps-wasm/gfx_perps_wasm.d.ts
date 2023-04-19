/* tslint:disable */
/* eslint-disable */
/**
* @param {Uint8Array} market_product_group
* @param {Uint8Array} trader_risk_group
* @returns {HealthInfo}
*/
export function risk_checks(market_product_group: Uint8Array, trader_risk_group: Uint8Array): HealthInfo;
/**
* @param {Uint8Array} market_product_group
* @param {Uint8Array} trader_risk_group
* @returns {Fractional}
*/
export function margin_available(market_product_group: Uint8Array, trader_risk_group: Uint8Array): Fractional;
/**
* @param {Uint8Array} market_product_group
* @param {Uint8Array} trader_risk_group
* @param {bigint} product_index
* @returns {Fractional}
*/
export function unrealised_pnl(market_product_group: Uint8Array, trader_risk_group: Uint8Array, product_index: bigint): Fractional;
/**
* @param {Uint8Array} market_product_group
* @param {Uint8Array} trader_risk_group
* @param {bigint} prod_index
* @returns {Fractional}
*/
export function get_liquidation_price(market_product_group: Uint8Array, trader_risk_group: Uint8Array, prod_index: bigint): Fractional;
/**
* @param {Uint8Array} market_product_group
* @param {bigint} prod_index
* @returns {Fractional}
*/
export function get_on_chain_price(market_product_group: Uint8Array, prod_index: bigint): Fractional;
/**
* @param {Uint8Array} market_product_group
* @param {Uint8Array} trader_risk_group
* @returns {Fractional}
*/
export function get_leverage_used(market_product_group: Uint8Array, trader_risk_group: Uint8Array): Fractional;
/**
* @param {Uint8Array} market_product_group
* @param {Uint8Array} trader_risk_group
* @returns {Fractional}
*/
export function get_leverage_available(market_product_group: Uint8Array, trader_risk_group: Uint8Array): Fractional;
/**
* @param {Uint8Array} market_product_group_byte
* @param {Uint8Array} trader_risk_group_byte
* @param {bigint} prod_index
* @returns {Fractional}
*/
export function get_max_quantity(market_product_group_byte: Uint8Array, trader_risk_group_byte: Uint8Array, prod_index: bigint): Fractional;
/**
* @param {Uint8Array} market_product_group_byte
* @param {bigint} prod_index
* @returns {Fractional}
*/
export function get_open_interests(market_product_group_byte: Uint8Array, prod_index: bigint): Fractional;
/**
* @param {Uint8Array} market_product_group_byte
* @param {Uint8Array} trader_risk_group_byte
* @returns {Fractional}
*/
export function get_health(market_product_group_byte: Uint8Array, trader_risk_group_byte: Uint8Array): Fractional;
/**
* @param {Uint8Array} data
* @param {bigint} callback_info_len
* @param {bigint} slot_size
* @returns {number | undefined}
*/
export function find_max(data: Uint8Array, callback_info_len: bigint, slot_size: bigint): number | undefined;
/**
* @param {Uint8Array} data
* @param {bigint} callback_info_len
* @param {bigint} slot_size
* @returns {number | undefined}
*/
export function find_min(data: Uint8Array, callback_info_len: bigint, slot_size: bigint): number | undefined;
/**
* @param {Uint8Array} data
* @param {bigint} callback_info_len
* @param {bigint} slot_size
* @param {bigint} depth
* @param {boolean} increasing
* @returns {BigUint64Array}
*/
export function find_l2_depth(data: Uint8Array, callback_info_len: bigint, slot_size: bigint, depth: bigint, increasing: boolean): BigUint64Array;
/**
* Handler for `console.log` invocations.
*
* If a test is currently running it takes the `args` array and stringifies
* it and appends it to the current output of the test. Otherwise it passes
* the arguments to the original `console.log` function, psased as
* `original`.
* @param {Array<any>} args
*/
export function __wbgtest_console_log(args: Array<any>): void;
/**
* Handler for `console.debug` invocations. See above.
* @param {Array<any>} args
*/
export function __wbgtest_console_debug(args: Array<any>): void;
/**
* Handler for `console.info` invocations. See above.
* @param {Array<any>} args
*/
export function __wbgtest_console_info(args: Array<any>): void;
/**
* Handler for `console.warn` invocations. See above.
* @param {Array<any>} args
*/
export function __wbgtest_console_warn(args: Array<any>): void;
/**
* Handler for `console.error` invocations. See above.
* @param {Array<any>} args
*/
export function __wbgtest_console_error(args: Array<any>): void;
/**
* Initialize Javascript logging and panic handler
*/
export function solana_program_init(): void;
/**
*/
export enum HealthStatus {
  Healthy = 0,
  Unhealthy = 1,
  Liquidatable = 2,
  NotLiquidatable = 3,
}
/**
*/
export enum ActionStatus {
  Approved = 0,
  NotApproved = 1,
}
/**
* Fractional Operations
*/
export class Fractional {
  free(): void;
/**
* @param {bigint} m
* @param {bigint} e
*/
  constructor(m: bigint, e: bigint);
/**
* @param {string} s
* @returns {Fractional}
*/
  static from_str(s: string): Fractional;
/**
* @returns {boolean}
*/
  is_negative(): boolean;
/**
* @returns {number}
*/
  sign(): number;
/**
* @param {Fractional} other
* @returns {Fractional}
*/
  min(other: Fractional): Fractional;
/**
* @param {Fractional} other
* @returns {Fractional}
*/
  max(other: Fractional): Fractional;
/**
* @param {number} digits
* @returns {bigint}
*/
  round_up(digits: number): bigint;
/**
* @param {Fractional} other
* @returns {Fractional}
*/
  checked_add(other: Fractional): Fractional;
/**
* @param {Fractional} other
* @returns {Fractional}
*/
  checked_sub(other: Fractional): Fractional;
/**
* @param {Fractional} other
* @returns {Fractional}
*/
  checked_mul(other: Fractional): Fractional;
/**
* @param {Fractional} other
* @returns {Fractional}
*/
  checked_div(other: Fractional): Fractional;
/**
* @param {number} digits
* @returns {Fractional}
*/
  round_unchecked(digits: number): Fractional;
/**
* @returns {Fractional}
*/
  abs(): Fractional;
/**
*/
  exp: bigint;
/**
*/
  m: bigint;
}
/**
* A hash; the 32-byte output of a hashing algorithm.
*
* This struct is used most often in `solana-sdk` and related crates to contain
* a [SHA-256] hash, but may instead contain a [blake3] hash, as created by the
* [`blake3`] module (and used in [`Message::hash`]).
*
* [SHA-256]: https://en.wikipedia.org/wiki/SHA-2
* [blake3]: https://github.com/BLAKE3-team/BLAKE3
* [`blake3`]: crate::blake3
* [`Message::hash`]: crate::message::Message::hash
*/
export class Hash {
  free(): void;
/**
* Create a new Hash object
*
* * `value` - optional hash as a base58 encoded string, `Uint8Array`, `[number]`
* @param {any} value
*/
  constructor(value: any);
/**
* Return the base58 string representation of the hash
* @returns {string}
*/
  toString(): string;
/**
* Checks if two `Hash`s are equal
* @param {Hash} other
* @returns {boolean}
*/
  equals(other: Hash): boolean;
/**
* Return the `Uint8Array` representation of the hash
* @returns {Uint8Array}
*/
  toBytes(): Uint8Array;
}
/**
*/
export class HealthInfo {
  free(): void;
/**
*/
  action: number;
/**
*/
  health: number;
}
/**
* A directive for a single invocation of a Solana program.
*
* An instruction specifies which program it is calling, which accounts it may
* read or modify, and additional data that serves as input to the program. One
* or more instructions are included in transactions submitted by Solana
* clients. Instructions are also used to describe [cross-program
* invocations][cpi].
*
* [cpi]: https://docs.solana.com/developing/programming-model/calling-between-programs
*
* During execution, a program will receive a list of account data as one of
* its arguments, in the same order as specified during `Instruction`
* construction.
*
* While Solana is agnostic to the format of the instruction data, it has
* built-in support for serialization via [`borsh`] and [`bincode`].
*
* [`borsh`]: https://docs.rs/borsh/latest/borsh/
* [`bincode`]: https://docs.rs/bincode/latest/bincode/
*
* # Specifying account metadata
*
* When constructing an [`Instruction`], a list of all accounts that may be
* read or written during the execution of that instruction must be supplied as
* [`AccountMeta`] values.
*
* Any account whose data may be mutated by the program during execution must
* be specified as writable. During execution, writing to an account that was
* not specified as writable will cause the transaction to fail. Writing to an
* account that is not owned by the program will cause the transaction to fail.
*
* Any account whose lamport balance may be mutated by the program during
* execution must be specified as writable. During execution, mutating the
* lamports of an account that was not specified as writable will cause the
* transaction to fail. While _subtracting_ lamports from an account not owned
* by the program will cause the transaction to fail, _adding_ lamports to any
* account is allowed, as long is it is mutable.
*
* Accounts that are not read or written by the program may still be specified
* in an `Instruction`'s account list. These will affect scheduling of program
* execution by the runtime, but will otherwise be ignored.
*
* When building a transaction, the Solana runtime coalesces all accounts used
* by all instructions in that transaction, along with accounts and permissions
* required by the runtime, into a single account list. Some accounts and
* account permissions required by the runtime to process a transaction are
* _not_ required to be included in an `Instruction`s account list. These
* include:
*
* - The program ID &mdash; it is a separate field of `Instruction`
* - The transaction's fee-paying account &mdash; it is added during [`Message`]
*   construction. A program may still require the fee payer as part of the
*   account list if it directly references it.
*
* [`Message`]: crate::message::Message
*
* Programs may require signatures from some accounts, in which case they
* should be specified as signers during `Instruction` construction. The
* program must still validate during execution that the account is a signer.
*/
export class Instruction {
  free(): void;
}
/**
*/
export class Instructions {
  free(): void;
/**
*/
  constructor();
/**
* @param {Instruction} instruction
*/
  push(instruction: Instruction): void;
}
/**
* A vanilla Ed25519 key pair
*/
export class Keypair {
  free(): void;
/**
* Create a new `Keypair `
*/
  constructor();
/**
* Convert a `Keypair` to a `Uint8Array`
* @returns {Uint8Array}
*/
  toBytes(): Uint8Array;
/**
* Recover a `Keypair` from a `Uint8Array`
* @param {Uint8Array} bytes
* @returns {Keypair}
*/
  static fromBytes(bytes: Uint8Array): Keypair;
/**
* Return the `Pubkey` for this `Keypair`
* @returns {Pubkey}
*/
  pubkey(): Pubkey;
}
/**
*/
export class MathError {
  free(): void;
}
/**
* A Solana transaction message (legacy).
*
* See the [`message`] module documentation for further description.
*
* [`message`]: crate::message
*
* Some constructors accept an optional `payer`, the account responsible for
* paying the cost of executing a transaction. In most cases, callers should
* specify the payer explicitly in these constructors. In some cases though,
* the caller is not _required_ to specify the payer, but is still allowed to:
* in the `Message` structure, the first account is always the fee-payer, so if
* the caller has knowledge that the first account of the constructed
* transaction's `Message` is both a signer and the expected fee-payer, then
* redundantly specifying the fee-payer is not strictly required.
*/
export class Message {
  free(): void;
/**
* The id of a recent ledger entry.
*/
  recent_blockhash: Hash;
}
/**
* The address of a [Solana account][acc].
*
* Some account addresses are [ed25519] public keys, with corresponding secret
* keys that are managed off-chain. Often, though, account addresses do not
* have corresponding secret keys &mdash; as with [_program derived
* addresses_][pdas] &mdash; or the secret key is not relevant to the operation
* of a program, and may have even been disposed of. As running Solana programs
* can not safely create or manage secret keys, the full [`Keypair`] is not
* defined in `solana-program` but in `solana-sdk`.
*
* [acc]: https://docs.solana.com/developing/programming-model/accounts
* [ed25519]: https://ed25519.cr.yp.to/
* [pdas]: https://docs.solana.com/developing/programming-model/calling-between-programs#program-derived-addresses
* [`Keypair`]: https://docs.rs/solana-sdk/latest/solana_sdk/signer/keypair/struct.Keypair.html
*/
export class Pubkey {
  free(): void;
/**
* Create a new Pubkey object
*
* * `value` - optional public key as a base58 encoded string, `Uint8Array`, `[number]`
* @param {any} value
*/
  constructor(value: any);
/**
* Return the base58 string representation of the public key
* @returns {string}
*/
  toString(): string;
/**
* Check if a `Pubkey` is on the ed25519 curve.
* @returns {boolean}
*/
  isOnCurve(): boolean;
/**
* Checks if two `Pubkey`s are equal
* @param {Pubkey} other
* @returns {boolean}
*/
  equals(other: Pubkey): boolean;
/**
* Return the `Uint8Array` representation of the public key
* @returns {Uint8Array}
*/
  toBytes(): Uint8Array;
/**
* Derive a Pubkey from another Pubkey, string seed, and a program id
* @param {Pubkey} base
* @param {string} seed
* @param {Pubkey} owner
* @returns {Pubkey}
*/
  static createWithSeed(base: Pubkey, seed: string, owner: Pubkey): Pubkey;
/**
* Derive a program address from seeds and a program id
* @param {any[]} seeds
* @param {Pubkey} program_id
* @returns {Pubkey}
*/
  static createProgramAddress(seeds: any[], program_id: Pubkey): Pubkey;
/**
* Find a valid program address
*
* Returns:
* * `[PubKey, number]` - the program address and bump seed
* @param {any[]} seeds
* @param {Pubkey} program_id
* @returns {any}
*/
  static findProgramAddress(seeds: any[], program_id: Pubkey): any;
}
/**
* An atomically-commited sequence of instructions.
*
* While [`Instruction`]s are the basic unit of computation in Solana,
* they are submitted by clients in [`Transaction`]s containing one or
* more instructions, and signed by one or more [`Signer`]s.
*
* [`Signer`]: crate::signer::Signer
*
* See the [module documentation] for more details about transactions.
*
* [module documentation]: self
*
* Some constructors accept an optional `payer`, the account responsible for
* paying the cost of executing a transaction. In most cases, callers should
* specify the payer explicitly in these constructors. In some cases though,
* the caller is not _required_ to specify the payer, but is still allowed to:
* in the [`Message`] structure, the first account is always the fee-payer, so
* if the caller has knowledge that the first account of the constructed
* transaction's `Message` is both a signer and the expected fee-payer, then
* redundantly specifying the fee-payer is not strictly required.
*/
export class Transaction {
  free(): void;
/**
* Create a new `Transaction`
* @param {Instructions} instructions
* @param {Pubkey | undefined} payer
*/
  constructor(instructions: Instructions, payer?: Pubkey);
/**
* Return a message containing all data that should be signed.
* @returns {Message}
*/
  message(): Message;
/**
* Return the serialized message data to sign.
* @returns {Uint8Array}
*/
  messageData(): Uint8Array;
/**
* Verify the transaction
*/
  verify(): void;
/**
* @param {Keypair} keypair
* @param {Hash} recent_blockhash
*/
  partialSign(keypair: Keypair, recent_blockhash: Hash): void;
/**
* @returns {boolean}
*/
  isSigned(): boolean;
/**
* @returns {Uint8Array}
*/
  toBytes(): Uint8Array;
/**
* @param {Uint8Array} bytes
* @returns {Transaction}
*/
  static fromBytes(bytes: Uint8Array): Transaction;
}
/**
* Runtime test harness support instantiated in JS.
*
* The node.js entry script instantiates a `Context` here which is used to
* drive test execution.
*/
export class WasmBindgenTestContext {
  free(): void;
/**
* Creates a new context ready to run tests.
*
* A `Context` is the main structure through which test execution is
* coordinated, and this will collect output and results for all executed
* tests.
*/
  constructor();
/**
* Inform this context about runtime arguments passed to the test
* harness.
*
* Eventually this will be used to support flags, but for now it's just
* used to support test filters.
* @param {any[]} args
*/
  args(args: any[]): void;
/**
* Executes a list of tests, returning a promise representing their
* eventual completion.
*
* This is the main entry point for executing tests. All the tests passed
* in are the JS `Function` object that was plucked off the
* `WebAssembly.Instance` exports list.
*
* The promise returned resolves to either `true` if all tests passed or
* `false` if at least one test failed.
* @param {any[]} tests
* @returns {Promise<any>}
*/
  run(tests: any[]): Promise<any>;
}
