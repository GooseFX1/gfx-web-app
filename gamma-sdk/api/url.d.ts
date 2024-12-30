declare const API_URLS: {
    BASE_HOST: string;
    /** id: string */
    CONFIG: string;
    /** ids: idList.join(',') */
    POOL_BY_IDS: string;
    /**
     * poolType?: { 'hyper' | 'primary' | 'all' }. defaults to 'all'
     * sortOrder?: { 'asc' | 'desc' }. defaults to 'desc'
     * sortBy?: { 'liquidity' | 'volume_24h' / 7d / 30d | 'fee_24h' / 7d / 30d | 'apr_24h' / 7d / 30d }.
     * pageSize?. { number } defaults to 200
     * page?: { number } defaults to 1
     * search: { string | undefined }
     * mint1: string
     * mint2?: string
     */
    POOL_BY_MINTS: string;
    /**
    * poolType?: { 'hyper' | 'primary' | 'all' }. defaults to 'all'
    * sortOrder?: { 'asc' | 'desc' }. defaults to 'desc'
    * sortBy?: { 'liquidity' | 'volume_24h' / 7d / 30d | 'fee_24h' / 7d / 30d | 'apr_24h' / 7d / 30d }.
    * pageSize?. { number } defaults to 200
    * page?: { number } defaults to 1
    * search: { string | undefined }
    */
    POOL_LIST: string;
    /** ids: idList.join(',') */
    POOL_KEYS_BY_IDS: string;
    TOKEN_LIST: string;
    JUP_TOKEN_LIST: string;
};
declare const DEV_API_URLS: {
    BASE_HOST: string;
    /** id: string */
    CONFIG: string;
    /** ids: idList.join(',') */
    POOL_BY_IDS: string;
    /**
     * poolType?: { 'hyper' | 'primary' | 'all' }. defaults to 'all'
     * sortOrder?: { 'asc' | 'desc' }. defaults to 'desc'
     * sortBy?: { 'liquidity' | 'volume_24h' / 7d / 30d | 'fee_24h' / 7d / 30d | 'apr_24h' / 7d / 30d }.
     * pageSize?. { number } defaults to 200
     * page?: { number } defaults to 1
     * search: { string | undefined }
     * mint1: string
     * mint2?: string
     */
    POOL_BY_MINTS: string;
    /**
    * poolType?: { 'hyper' | 'primary' | 'all' }. defaults to 'all'
    * sortOrder?: { 'asc' | 'desc' }. defaults to 'desc'
    * sortBy?: { 'liquidity' | 'volume_24h' / 7d / 30d | 'fee_24h' / 7d / 30d | 'apr_24h' / 7d / 30d }.
    * pageSize?. { number } defaults to 200
    * page?: { number } defaults to 1
    * search: { string | undefined }
    */
    POOL_LIST: string;
    /** ids: idList.join(',') */
    POOL_KEYS_BY_IDS: string;
    TOKEN_LIST: string;
    JUP_TOKEN_LIST: string;
};
type API_URL_CONFIG = Partial<typeof API_URLS>;

export { API_URLS, API_URL_CONFIG, DEV_API_URLS };
