type ConfigInfo = {
    id: string;
    index: number;
    protocolFeeRate: number;
    tradeFeeRate: number;
    fundFeeRate: number;
    createPoolFee: string;
    protocolOwner: string;
    fundOwner: string;
};
type FetchPoolParams = {
    poolType?: PoolType;
    sortOrder?: SortOrder;
    sortBy?: SortBy;
    pageSize?: number;
    page?: number;
    search?: string;
};
type PoolType = 'all' | 'hyper' | 'primary';
type SortOrder = 'asc' | 'desc';
type SortBy = 'liquidity' | 'volume30d' | 'volume24h' | 'volume7d' | 'fee30d' | 'fee24h' | 'fee7d' | 'apr30d' | 'apr24h' | 'apr7d';
type PoolKeys = {
    programId: string;
    id: string;
    mintA: string;
    mintB: string;
    openTime: string;
    mintAVault: string;
    mintBVault: string;
    authority: string;
    config: ConfigInfo;
    poolType: PoolType;
    mintAProgram: string;
    mintBProgram: string;
};
type PoolInfo = {
    programId: string;
    id: string;
    mintA: GammaToken;
    mintB: GammaToken;
    openTime: string;
    mintAVault: string;
    mintBVault: string;
    authority: string;
    config: ConfigInfo;
    poolType: PoolType;
    price: string | null;
    tvl: string | null;
    poolCreator: string;
    liquidityTokenA: string | null;
    liquidityTokenB: string | null;
    lpSupply: string | null;
    stats: {
        daily: PoolStats;
        weekly: PoolStats;
        monthly: PoolStats;
    };
};
type PoolStats = {
    range: '24H' | '7D' | '30D';
    feesUSD: number;
    volumeTokenAUSD: number;
    volumeTokenBUSD: number;
    feesAprUSD: number;
    volumeAprUSD: number;
};
type PaginatedPoolInfos = {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
    count: number;
    pools: PoolInfo[];
};
declare enum PoolFetchTypeEnum {
    All = "all",
    Hyper = "hyper",
    Primary = "primary"
}
type GammaToken = {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    logoURI: string;
    tags: string[];
    extensions?: ExtensionsItem | null;
};
type JupiterListToken = {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    logoURI: string;
    tags: string[];
    extensions: ExtensionsItem;
};
type ExtensionsItem = {
    coingeckoId?: string;
    feeConfig?: TransferFeeDataBaseType;
};
interface TransferFeeDataBaseType {
    transferFeeConfigAuthority: string;
    withdrawWithheldAuthority: string;
    withheldAmount: string;
    olderTransferFee: {
        epoch: string;
        maximumFee: string;
        transferFeeBasisPoints: number;
    };
    newerTransferFee: {
        epoch: string;
        maximumFee: string;
        transferFeeBasisPoints: number;
    };
}

export { ConfigInfo, FetchPoolParams, GammaToken, JupiterListToken, PaginatedPoolInfos, PoolFetchTypeEnum, PoolInfo, PoolKeys, PoolStats, TransferFeeDataBaseType };
