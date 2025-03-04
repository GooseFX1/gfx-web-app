import { UseBaseQueryResult } from '@tanstack/react-query'

function useQueryWrapperWithError<T extends UseBaseQueryResult, U>(query: T, DEFAULT: U) {
  if (query.isError) {
    query.data = DEFAULT
  }

  return query;
}

export default useQueryWrapperWithError