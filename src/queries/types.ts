import { UseInfiniteQueryResult } from '@tanstack/react-query'

/**
 * Fix for UseInfiniteQueryResponse
 */
export type UseInfiniteQueryResponseFix<T, U, K> = UseInfiniteQueryResult<T, U> & {
  data: K
};