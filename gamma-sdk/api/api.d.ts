import { AxiosInstance } from 'axios';
import { Cluster } from '../solana/type.js';
import { ConfigInfo, JupiterListToken, GammaToken, FetchPoolParams, PaginatedPoolInfos, PoolInfo, PoolKeys } from './type.js';
import { API_URL_CONFIG } from './url.js';
import { PublicKey } from '@solana/web3.js';

declare function endlessRetry<T>(name: string, call: () => Promise<T>, interval?: number): Promise<T>;
interface ApiProps {
    cluster: Cluster;
    timeout: number;
    logRequests?: boolean;
    logCount?: number;
    urlConfigs?: API_URL_CONFIG;
}
declare class Api {
    cluster: Cluster;
    api: AxiosInstance;
    logCount: number;
    urlConfigs: API_URL_CONFIG;
    constructor({ cluster, timeout, logRequests, logCount, urlConfigs }: ApiProps);
    getConfig(id: string): Promise<ConfigInfo>;
    getJupTokenList(): Promise<JupiterListToken[]>;
    getTokenInfo(mint: (string | PublicKey)[]): Promise<GammaToken[]>;
    getPoolList(props?: FetchPoolParams): Promise<PaginatedPoolInfos>;
    fetchPoolById(props: {
        idList: string[];
    }): Promise<PoolInfo[]>;
    fetchPoolKeysById(props: {
        idList: string[];
    }): Promise<PoolKeys[]>;
    fetchPoolByMints(props: {
        mint1: string | PublicKey;
        mint2?: string | PublicKey;
    } & Omit<FetchPoolParams, 'pageSize'>): Promise<PaginatedPoolInfos>;
}

export { Api, ApiProps, endlessRetry };
