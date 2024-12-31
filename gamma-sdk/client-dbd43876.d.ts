import { PublicKey, Commitment, Connection, Keypair, EpochInfo } from '@solana/web3.js';
import { Api } from './api/api.js';
import { PoolKeys, PoolInfo, GammaToken, JupiterListToken } from './api/type.js';
import { API_URL_CONFIG } from './api/url.js';
import { Owner } from './common/owner.js';
import { Cluster } from './solana/type.js';
import { f as TxBuilder, A as AddInstructionParam, k as ReturnTypeFetchMultipleMintInfos, e as MakeTxData, G as GetTransferAmountFee, L as LoadParams, S as SignAllTransactions } from './type-f1af695b.js';
import { BigNumberish } from './common/number.js';
import { Logger } from './common/logger.js';
import { TxVersion } from './common/txTool/txType.js';
import { f as CpmmRpcData, g as CpmmComputeData, b as CreateCpmmPoolParam, c as CreateCpmmPoolAddress, A as AddCpmmLiquidityParams, W as WithdrawCpmmLiquidityParams, d as CpmmSwapParams, i as CpmmObservationState, e as ComputePairAmountParams, U as UserLiquidityAccount } from './type-acc35ac5.js';
import BN__default from 'bn.js';
import Decimal from 'decimal.js';
import { TokenInfo } from './gfx/token/type.js';
import { TokenAccount, TokenAccountRaw, GetOrCreateTokenAccountParams, HandleTokenAccountParams } from './gfx/account/types.js';

interface ModuleBaseProps {
    scope: GfxCpmmClient;
    moduleName: string;
}
declare class ModuleBase {
    scope: GfxCpmmClient;
    private disabled;
    protected logger: Logger;
    constructor({ scope, moduleName }: ModuleBaseProps);
    protected createTxBuilder(feePayer?: PublicKey): TxBuilder;
    logDebug(...args: (string | number | Record<string, any>)[]): void;
    logInfo(...args: (string | number | Record<string, any>)[]): void;
    logAndCreateError(...args: (string | number | Record<string, any>)[]): void;
    checkDisabled(): void;
}

interface TokenAccountDataProp {
    tokenAccounts?: TokenAccount[];
    tokenAccountRawInfos?: TokenAccountRaw[];
}
declare class Account extends ModuleBase {
    private _tokenAccounts;
    private _tokenAccountRawInfos;
    private _accountChangeListenerId?;
    private _accountListener;
    private _clientOwnedToken;
    private _accountFetchTime;
    constructor(params: TokenAccountDataProp & ModuleBaseProps);
    get tokenAccounts(): TokenAccount[];
    get tokenAccountRawInfos(): TokenAccountRaw[];
    updateTokenAccount({ tokenAccounts, tokenAccountRawInfos }: TokenAccountDataProp): Account;
    addAccountChangeListener(cbk: (data: TokenAccountDataProp) => void): Account;
    removeAccountChangeListener(cbk: (data: TokenAccountDataProp) => void): Account;
    getAssociatedTokenAccount(mint: PublicKey, programId?: PublicKey): PublicKey;
    resetTokenAccounts(): void;
    fetchWalletTokenAccounts(config?: {
        forceUpdate?: boolean;
        commitment?: Commitment;
    }): Promise<{
        tokenAccounts: TokenAccount[];
        tokenAccountRawInfos: TokenAccountRaw[];
    }>;
    getCreatedTokenAccount({ mint, programId, associatedOnly, }: {
        mint: PublicKey;
        programId?: PublicKey;
        associatedOnly?: boolean;
    }): Promise<PublicKey | undefined>;
    getOrCreateTokenAccount(params: GetOrCreateTokenAccountParams): Promise<{
        account?: PublicKey;
        instructionParams?: AddInstructionParam;
    }>;
    checkOrCreateAta({ mint, programId, autoUnwrapWSOLToSOL, }: {
        mint: PublicKey;
        programId?: PublicKey;
        autoUnwrapWSOLToSOL?: boolean;
    }): Promise<{
        pubKey: PublicKey;
        newInstructions: AddInstructionParam;
    }>;
    handleTokenAccount(params: HandleTokenAccountParams): Promise<AddInstructionParam & {
        tokenAccount: PublicKey;
    }>;
    processTokenAccount(props: {
        mint: PublicKey;
        programId?: PublicKey;
        amount?: BigNumberish;
        useSOLBalance?: boolean;
        handleTokenAccount?: boolean;
    }): Promise<Promise<AddInstructionParam & {
        tokenAccount?: PublicKey;
    }>>;
}

declare class CpmmModule extends ModuleBase {
    constructor(params: ModuleBaseProps);
    load(): Promise<void>;
    getCpmmPoolKeys(poolId: string): Promise<PoolKeys>;
    getRpcPoolInfo(poolId: string, fetchConfigInfo?: boolean): Promise<CpmmRpcData>;
    getRpcPoolInfos(poolIds: string[], fetchConfigInfo?: boolean): Promise<{
        [poolId: string]: CpmmRpcData;
    }>;
    toComputePoolInfos({ pools, mintInfos, }: {
        pools: Record<string, CpmmRpcData>;
        mintInfos: ReturnTypeFetchMultipleMintInfos;
    }): Record<string, CpmmComputeData>;
    getPoolInfoFromRpc(poolId: string): Promise<{
        poolInfo: PoolInfo;
        poolKeys: PoolKeys;
        rpcData: CpmmRpcData;
    }>;
    createPool<T extends TxVersion>({ programId, poolFeeAccount, startTime, maxTradeFeeRate, volatilityFactor, ownerInfo, associatedOnly, checkCreateATAOwner, txVersion, feeConfig, computeBudgetConfig, ...params }: CreateCpmmPoolParam<T>): Promise<MakeTxData<T, {
        address: CreateCpmmPoolAddress;
    }>>;
    addLiquidity<T extends TxVersion>(params: AddCpmmLiquidityParams<T>): Promise<MakeTxData<T>>;
    withdrawLiquidity<T extends TxVersion>(params: WithdrawCpmmLiquidityParams<T>): Promise<MakeTxData<T>>;
    swap<T extends TxVersion>(params: CpmmSwapParams<T>): Promise<MakeTxData<T>>;
    computeSwapAmount({ pool, amountIn, outputMint, slippage, observationState, }: {
        pool: CpmmComputeData;
        amountIn: BN__default;
        outputMint: string | PublicKey;
        slippage: number;
        observationState: CpmmObservationState;
    }): {
        allTrade: boolean;
        amountIn: BN__default;
        amountOut: BN__default;
        minAmountOut: BN__default;
        fee: BN__default;
        executionPrice: Decimal;
        priceImpact: any;
    };
    computePairAmount({ poolInfo, baseReserve, quoteReserve, amount, slippage, epochInfo, baseIn, }: ComputePairAmountParams): {
        inputAmountFee: GetTransferAmountFee;
        anotherAmount: GetTransferAmountFee;
        maxAnotherAmount: GetTransferAmountFee;
        liquidity: BN__default;
    };
    getRpcUserLiquidityAccounts(addresses: PublicKey[]): Promise<(UserLiquidityAccount | null)[]>;
    getObservationStates(addresses: PublicKey[]): Promise<(CpmmObservationState | null)[]>;
}

declare class TokenModule extends ModuleBase {
    private _tokenList;
    private _tokenMap;
    private _mintGroup;
    private _extraTokenList;
    constructor(params: ModuleBaseProps);
    load(params?: LoadParams): Promise<void>;
    get tokenList(): TokenInfo[];
    get tokenMap(): Map<string, TokenInfo>;
    get mintGroup(): {
        official: Set<string>;
        jup: Set<string>;
    };
    /** === util functions === */
    getTokenInfo(mint: string | PublicKey): Promise<GammaToken>;
}

interface ClientLoadParams extends TokenAccountDataProp, Omit<ClientApiBatchRequestParams, "api"> {
    connection: Connection;
    cluster?: Cluster;
    owner?: PublicKey | Keypair;
    apiRequestInterval?: number;
    apiRequestTimeout?: number;
    apiCacheTime?: number;
    signAllTransactions?: SignAllTransactions;
    urlConfigs?: API_URL_CONFIG;
    logRequests?: boolean;
    logCount?: number;
    disableFeatureCheck?: boolean;
    disableLoadToken?: boolean;
    blockhashCommitment?: Commitment;
}
interface ClientApiBatchRequestParams {
    api: Api;
    defaultChainTimeOffset?: number;
    defaultChainTime?: number;
}
type ClientConstructorParams = Required<ClientLoadParams> & ClientApiBatchRequestParams;
interface DataBase<T> {
    fetched: number;
    data: T;
    extInfo?: Record<string, any>;
}
interface ApiData {
    jupTokenList?: DataBase<JupiterListToken[]>;
}
declare class GfxCpmmClient {
    cluster: Cluster;
    account: Account;
    cpmm: CpmmModule;
    token: TokenModule;
    rawBalances: Map<string, string>;
    apiData: ApiData;
    blockhashCommitment: Commitment;
    private _connection;
    private _owner;
    api: Api;
    private _apiCacheTime;
    private _signAllTransactions?;
    private logger;
    private _chainTime?;
    private _epochInfo?;
    constructor(config: ClientConstructorParams);
    static load(config: ClientLoadParams): Promise<GfxCpmmClient>;
    get owner(): Owner | undefined;
    get ownerPubKey(): PublicKey;
    setOwner(owner?: PublicKey | Keypair): GfxCpmmClient;
    get connection(): Connection;
    setConnection(connection: Connection): GfxCpmmClient;
    get signAllTransactions(): SignAllTransactions | undefined;
    setSignAllTransactions(signAllTransactions?: SignAllTransactions): GfxCpmmClient;
    checkOwner(): void;
    private isCacheInvalidate;
    fetchJupTokenList(forceUpdate?: boolean): Promise<JupiterListToken[]>;
    get chainTimeData(): {
        offset: number;
        chainTime: number;
    } | undefined;
    fetchEpochInfo(): Promise<EpochInfo>;
}

export { Account as A, ClientLoadParams as C, GfxCpmmClient as G, ModuleBase as M, TokenAccountDataProp as T, ClientApiBatchRequestParams as a, ClientConstructorParams as b, ModuleBaseProps as c, CpmmModule as d, TokenModule as e };
