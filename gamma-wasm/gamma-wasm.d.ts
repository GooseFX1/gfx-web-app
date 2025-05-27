/* tslint:disable */
/* eslint-disable */
/**
 * Initialize Javascript logging and panic handler
 */
export function solana_program_init(): void;

interface SwapResult {
    newSwapSourceAmount: string;
    newSwapDestinationAmount: string;
    sourceAmountSwapped: string;
    destinationAmountSwapped: string;
    dynamicFee: string;
    protocolFee: string;
    fundFee: string;
    dynamicFeeRate: string;
}

interface QuoteInput {
    sourceAmountToBeSwapped: number;
    ammConfigData: Buffer<ArrayBufferLike>;
    poolStateData: Buffer<ArrayBufferLike>;
    observationStateData: Buffer<ArrayBufferLike>;
    zeroForOne: boolean;
    isInvokedBySignedSegmenter: boolean;
}

export function getSwapBaseInputQuoteAmount(val: QuoteInput): SwapResult;
export function getOracleBasedSwapQuoteAmount(val: QuoteInput): SwapResult;


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
   */
  constructor(value: any);
  /**
   * Return the base58 string representation of the hash
   */
  toString(): string;
  /**
   * Checks if two `Hash`s are equal
   */
  equals(other: Hash): boolean;
  /**
   * Return the `Uint8Array` representation of the hash
   */
  toBytes(): Uint8Array;
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
 * [cpi]: https://solana.com/docs/core/cpi
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
  private constructor();
  free(): void;
}
export class Instructions {
  free(): void;
  constructor();
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
   */
  toBytes(): Uint8Array;
  /**
   * Recover a `Keypair` from a `Uint8Array`
   */
  static fromBytes(bytes: Uint8Array): Keypair;
  /**
   * Return the `Pubkey` for this `Keypair`
   */
  pubkey(): Pubkey;
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
  private constructor();
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
 * [acc]: https://solana.com/docs/core/accounts
 * [ed25519]: https://ed25519.cr.yp.to/
 * [pdas]: https://solana.com/docs/core/cpi#program-derived-addresses
 * [`Keypair`]: https://docs.rs/solana-sdk/latest/solana_sdk/signer/keypair/struct.Keypair.html
 */
export class Pubkey {
  free(): void;
  /**
   * Create a new Pubkey object
   *
   * * `value` - optional public key as a base58 encoded string, `Uint8Array`, `[number]`
   */
  constructor(value: any);
  /**
   * Return the base58 string representation of the public key
   */
  toString(): string;
  /**
   * Check if a `Pubkey` is on the ed25519 curve.
   */
  isOnCurve(): boolean;
  /**
   * Checks if two `Pubkey`s are equal
   */
  equals(other: Pubkey): boolean;
  /**
   * Return the `Uint8Array` representation of the public key
   */
  toBytes(): Uint8Array;
  /**
   * Derive a Pubkey from another Pubkey, string seed, and a program id
   */
  static createWithSeed(base: Pubkey, seed: string, owner: Pubkey): Pubkey;
  /**
   * Derive a program address from seeds and a program id
   */
  static createProgramAddress(seeds: any[], program_id: Pubkey): Pubkey;
  /**
   * Find a valid program address
   *
   * Returns:
   * * `[PubKey, number]` - the program address and bump seed
   */
  static findProgramAddress(seeds: any[], program_id: Pubkey): any;
}
/**
 * An atomically-committed sequence of instructions.
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
   */
  constructor(instructions: Instructions, payer?: Pubkey | null);
  /**
   * Return a message containing all data that should be signed.
   */
  message(): Message;
  /**
   * Return the serialized message data to sign.
   */
  messageData(): Uint8Array;
  /**
   * Verify the transaction
   */
  verify(): void;
  partialSign(keypair: Keypair, recent_blockhash: Hash): void;
  isSigned(): boolean;
  toBytes(): Uint8Array;
  static fromBytes(bytes: Uint8Array): Transaction;
}
