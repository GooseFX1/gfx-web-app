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
  poolType: string,
  sortDirection: string,
  sortBy: string,
  showCreated: boolean,
  showDeposited: boolean
}

export type InfiniteDataAPIResponse<T> = {
  data: T,
  currentPage: number,
  totalItems: number,
  totalPages: number,
  nextPage: number
}

export interface InfiniteDataQueryResponse<T , U = T> extends InfiniteData<T> {
  allPages: U[]
  maxPagesReached: boolean
}