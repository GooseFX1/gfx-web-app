import { UseBaseQueryResult, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

function useQueryWrapperWithError<T extends UseBaseQueryResult, U>(query: T, DEFAULT: U, keys: any[]) {
  const queryClient = useQueryClient();
  useEffect(() => {
    if (query.isError) {
      queryClient.setQueriesData(keys, DEFAULT)
    }
  }, [query.isError, DEFAULT, keys])

  return query;
}

export default useQueryWrapperWithError