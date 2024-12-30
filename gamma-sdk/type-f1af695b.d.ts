import { PublicKey, TransactionInstruction, Signer, Transaction, VersionedTransaction, Connection, Commitment } from '@solana/web3.js';
import { Mint, TransferFeeConfig } from '@solana/spl-token';
import { TokenAmount } from './module/amount.js';
import BN__default from 'bn.js';
import { Api } from './api/api.js';
import { Cluster } from './solana/type.js';
import { TxVersion } from './common/txTool/txType.js';
import { Owner } from './common/owner.js';
import { CacheLTA } from './common/txTool/lookupTable.js';

interface ExecuteParams {
    skipPreflight?: boolean;
    recentBlockHash?: string;
    sendAndConfirm?: boolean;
}
interface TxBuilderInit {
    connection: Connection;
    feePayer: PublicKey;
    cluster: Cluster;
    owner?: Owner;
    blockhashCommitment?: Commitment;
    api?: Api;
    signAllTransactions?: SignAllTransactions;
}
interface AddInstructionParam {
    addresses?: Record<string, PublicKey>;
    instructions?: TransactionInstruction[];
    endInstructions?: TransactionInstruction[];
    lookupTableAddress?: string[];
    signers?: Signer[];
    instructionTypes?: string[];
    endInstructionTypes?: string[];
}
interface TxBuildData<T = Record<string, any>> {
    builder: TxBuilder;
    transaction: Transaction;
    instructionTypes: string[];
    signers: Signer[];
    execute: (params?: ExecuteParams) => Promise<{
        txId: string;
        signedTx: Transaction;
    }>;
    extInfo: T;
}
interface TxV0BuildData<T = Record<string, any>> extends Omit<TxBuildData<T>, "transaction" | "execute"> {
    builder: TxBuilder;
    transaction: VersionedTransaction;
    buildProps?: {
        lookupTableCache?: CacheLTA;
        lookupTableAddress?: string[];
    };
    execute: (params?: ExecuteParams) => Promise<{
        txId: string;
        signedTx: VersionedTransaction;
    }>;
}
type TxUpdateParams = {
    txId: string;
    status: "success" | "error" | "sent";
    signedTx: Transaction | VersionedTransaction;
};
interface MultiTxExecuteParam extends ExecuteParams {
    sequentially: boolean;
    onTxUpdate?: (completeTxs: TxUpdateParams[]) => void;
}
interface MultiTxBuildData<T = Record<string, any>> {
    builder: TxBuilder;
    transactions: Transaction[];
    instructionTypes: string[];
    signers: Signer[][];
    execute: (executeParams?: MultiTxExecuteParam) => Promise<{
        txIds: string[];
        signedTxs: Transaction[];
    }>;
    extInfo: T;
}
interface MultiTxV0BuildData<T = Record<string, any>> extends Omit<MultiTxBuildData<T>, "transactions" | "execute"> {
    builder: TxBuilder;
    transactions: VersionedTransaction[];
    buildProps?: {
        lookupTableCache?: CacheLTA;
        lookupTableAddress?: string[];
    };
    execute: (executeParams?: MultiTxExecuteParam) => Promise<{
        txIds: string[];
        signedTxs: VersionedTransaction[];
    }>;
}
type MakeMultiTxData<T = TxVersion.LEGACY, O = Record<string, any>> = T extends TxVersion.LEGACY ? MultiTxBuildData<O> : MultiTxV0BuildData<O>;
type MakeTxData<T = TxVersion.LEGACY, O = Record<string, any>> = T extends TxVersion.LEGACY ? TxBuildData<O> : TxV0BuildData<O>;
declare class TxBuilder {
    private connection;
    private owner?;
    private instructions;
    private endInstructions;
    private lookupTableAddress;
    private signers;
    private instructionTypes;
    private endInstructionTypes;
    private feePayer;
    private cluster;
    private signAllTransactions?;
    private blockhashCommitment?;
    private api?;
    constructor(params: TxBuilderInit);
    get AllTxData(): {
        instructions: TransactionInstruction[];
        endInstructions: TransactionInstruction[];
        signers: Signer[];
        instructionTypes: string[];
        endInstructionTypes: string[];
        lookupTableAddress: string[];
    };
    get allInstructions(): TransactionInstruction[];
    getComputeBudgetConfig(): Promise<ComputeBudgetConfig | undefined>;
    addCustomComputeBudget(config?: ComputeBudgetConfig): boolean;
    calComputeBudget({ config: propConfig, defaultIns, }: {
        config?: ComputeBudgetConfig;
        defaultIns?: TransactionInstruction[];
    }): Promise<void>;
    addInstruction({ instructions, endInstructions, signers, instructionTypes, endInstructionTypes, lookupTableAddress, }: AddInstructionParam): TxBuilder;
    versionBuild<O = Record<string, any>>({ txVersion, extInfo, }: {
        txVersion?: TxVersion;
        extInfo?: O;
    }): Promise<MakeTxData<TxVersion.LEGACY, O> | MakeTxData<TxVersion.V0, O>>;
    build<O = Record<string, any>>(extInfo?: O): MakeTxData<TxVersion.LEGACY, O>;
    buildMultiTx<T = Record<string, any>>(params: {
        extraPreBuildData?: MakeTxData<TxVersion.LEGACY>[];
        extInfo?: T;
    }): MultiTxBuildData;
    versionMultiBuild<T extends TxVersion, O = Record<string, any>>({ extraPreBuildData, txVersion, extInfo, }: {
        extraPreBuildData?: MakeTxData<TxVersion.V0>[] | MakeTxData<TxVersion.LEGACY>[];
        txVersion?: T;
        extInfo?: O;
    }): Promise<MakeMultiTxData<T, O>>;
    buildV0<O = Record<string, any>>(props?: O & {
        lookupTableCache?: CacheLTA;
        lookupTableAddress?: string[];
        forerunCreate?: boolean;
        recentBlockhash?: string;
    }): Promise<MakeTxData<TxVersion.V0, O>>;
    buildV0MultiTx<T = Record<string, any>>(params: {
        extraPreBuildData?: MakeTxData<TxVersion.V0>[];
        buildProps?: T & {
            lookupTableCache?: CacheLTA;
            lookupTableAddress?: string[];
            forerunCreate?: boolean;
            recentBlockhash?: string;
        };
    }): Promise<MultiTxV0BuildData>;
    sizeCheckBuild(props?: Record<string, any> & {
        computeBudgetConfig?: ComputeBudgetConfig;
    }): Promise<MultiTxBuildData>;
    sizeCheckBuildV0(props?: Record<string, any> & {
        computeBudgetConfig?: ComputeBudgetConfig;
        lookupTableCache?: CacheLTA;
        lookupTableAddress?: string[];
    }): Promise<MultiTxV0BuildData>;
}

type SignAllTransactions = (<T extends Transaction | VersionedTransaction>(transaction: T[]) => Promise<T[]>) | undefined;
interface MakeTransaction<T = Record<string, any>> {
    builder: TxBuilder;
    signers: Signer[];
    transaction: Transaction;
    instructionTypes: string[];
    execute: () => Promise<{
        txId: string;
        signedTx: Transaction;
    }>;
    extInfo: T;
}
interface MakeV0Transaction<T = Record<string, any>> {
    builder: TxBuilder;
    signers: Signer[];
    transaction: VersionedTransaction;
    instructionTypes: string[];
    execute: () => Promise<string>;
    extInfo: T;
}
interface MakeMultiTransaction {
    builder: TxBuilder;
    signers: Signer[][];
    transactions: Transaction[];
    instructionTypes: string[];
    execute: (params?: MultiTxExecuteParam) => Promise<{
        txIds: string[];
        signedTxs: Transaction[];
    }>;
    extInfo: Record<string, any>;
}
interface InstructionReturn {
    instruction: TransactionInstruction;
    instructionType: string;
}
interface ComputeBudgetConfig {
    units?: number;
    microLamports?: number;
}
interface LoadParams {
    forceUpdate?: boolean;
}
interface TransferAmountFee {
    amount: TokenAmount;
    fee: TokenAmount | undefined;
    expirationTime: number | undefined;
}
interface GetTransferAmountFee {
    amount: BN__default;
    fee: BN__default | undefined;
    expirationTime: number | undefined;
}
type ReturnTypeFetchMultipleMintInfo = Mint & {
    feeConfig: TransferFeeConfig | undefined;
};
interface ReturnTypeFetchMultipleMintInfos {
    [mint: string]: ReturnTypeFetchMultipleMintInfo & {
        programId: PublicKey;
    };
}
type Primitive = boolean | number | string | null | undefined | PublicKey;
/**
 *
 * @example
 * ```typescript
 * interface A {
 *   keyA: string;
 *   keyB: string;
 *   map: {
 *     hello: string;
 *     i: number;
 *   };
 *   list: (string | number)[];
 *   keyC: number;
 * }
 *
 * type WrappedA = ReplaceType<A, string, boolean> // {
 *   keyA: boolean;
 *   keyB: boolean;
 *   map: {
 *     hello: boolean;
 *     i: number;
 *   };
 *   list: (number | boolean)[];
 *   keyC: number;
 * }
 * ```
 */
type ReplaceType<Old, From, To> = {
    [T in keyof Old]: Old[T] extends From ? Exclude<Old[T], From> | To : Old[T] extends Primitive ? From extends Old[T] ? Exclude<Old[T], From> | To : Old[T] : ReplaceType<Old[T], From, To>;
};
type MayArray<T> = T | Array<T>;
type MayDeepArray<T> = T | Array<MayDeepArray<T>>;
type MayFunction<T, PS extends any[] = []> = T | ((...Params: PS) => T);
type ArrayItem<T extends ReadonlyArray<any>> = T extends Array<infer P> ? P : never;
type ExactPartial<T, U> = {
    [P in Extract<keyof T, U>]?: T[P];
} & {
    [P in Exclude<keyof T, U>]: T[P];
};
type ExactRequired<T, U> = {
    [P in Extract<keyof T, U>]-?: T[P];
} & {
    [P in Exclude<keyof T, U>]: T[P];
};
/**
 * extract only string and number
 */
type SKeyof<O> = Extract<keyof O, string>;
type GetValue<T, K> = K extends keyof T ? T[K] : undefined;
/**
 * @example
 * type A = { a: number; b: string; c?: string }
 * type B = { a: string; c: string; d?: boolean }
 *
 * type D = SOR<A, B> // { a: number | string; b: string | undefined; c: string | undefined; d: boolean | undefined } // ! if use SOR, you lost union type guard feature, try NOT to use this trick
 */
type SOR<T, U> = {
    [K in keyof T | keyof U]: GetValue<T, K> | GetValue<U, K>;
};
type Fallback<T, FallbackT> = T extends undefined ? FallbackT : T;
/**
 * @example
 * type A = { a: number; b: string; c?: string }
 * type B = { a: string; c: string; d?: boolean }
 *
 * type D = Cover<A, B> // { a: string; b: string; c: string; d?: boolean}
 */
type Cover<O, T> = {
    [K in SKeyof<O> | SKeyof<T>]: Fallback<GetValue<T, K>, GetValue<O, K>>;
};
type UnionCover<O, T> = T extends T ? Cover<O, T> : never;
type MergeArr<Arr> = (Arr extends (infer T)[] ? T : never)[];
/**
 * typescript type helper function
 * @example
 * type A = { hello: string; version: 3 }[]
 * type B = { hello: string; version: 5 }[]
 * type OK = MergeArr<A | B> // ({ hello: string; version: 3 } | { hello: string; version: 5 })[]
 * type Wrong = A | B // { hello: string; version: 3 }[] | { hello: string; version: 5 }[] // <= this type can't have auto type intelligense of array.map
 */
declare const unionArr: <T>(arr: T) => MergeArr<T>;

export { AddInstructionParam as A, ComputeBudgetConfig as C, ExactPartial as E, Fallback as F, GetTransferAmountFee as G, InstructionReturn as I, LoadParams as L, MultiTxExecuteParam as M, ReturnTypeFetchMultipleMintInfo as R, SignAllTransactions as S, TxBuildData as T, UnionCover as U, TxV0BuildData as a, MultiTxBuildData as b, MultiTxV0BuildData as c, MakeMultiTxData as d, MakeTxData as e, TxBuilder as f, MakeTransaction as g, MakeV0Transaction as h, MakeMultiTransaction as i, TransferAmountFee as j, ReturnTypeFetchMultipleMintInfos as k, ReplaceType as l, MayArray as m, MayDeepArray as n, MayFunction as o, ArrayItem as p, ExactRequired as q, SKeyof as r, GetValue as s, SOR as t, Cover as u, unionArr as v };
