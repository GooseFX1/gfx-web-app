import { UseInfiniteQueryResult, UseQueryResult } from '@tanstack/react-query'

/**
 * Fix for UseInfiniteQueryResponse
 */
export type UseInfiniteQueryResponseFix<T, U, K> = UseInfiniteQueryResult<T, U> & {
  data: K
};

export type UseQueryResponseFix<T, U, K = T> = UseQueryResult<T, U> & {
  data: K
}