import { InfiniteData, UseInfiniteQueryResult, UseQueryResult } from '@tanstack/react-query'

/**
 * Fix for UseInfiniteQueryResponse
 */
export type UseInfiniteQueryResponseFix<T, U, K = T> = UseInfiniteQueryResult<T, U> & {
  data: K
};

export type UseQueryResponseFix<T, U, K = T> = UseQueryResult<T, U> & {
  data: K
}

export type PoolsQueryProps = {
  sortDirection: string,
  sortBy: string,
  showCreated: boolean,
  showDeposited: boolean
  enabled?: boolean
}

export type InfiniteDataAPIResponse<T> = {
  data: T,
  currentPage: number,
  totalItems: number,
  totalPages: number,
  nextPage: number
}
// UPDATE query.helper.ts DEFAULT_INFINITE_QUERY_RESPONSE - it scoops the error there and injects this
export interface InfiniteDataQueryResponse<T , U = T> extends InfiniteData<T> {
  allPages: U[]
  maxPagesReached: boolean
  totalItems: number
}