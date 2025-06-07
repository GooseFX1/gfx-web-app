import React from 'react'
import './App.less'
import AppInner from './AppInner'
import AppErrorBoundary from '@/components/AppErrorBoundary'
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
  DEFAULT_INFINITE_QUERY_RESPONSE,
  INFINITE_QUERY_KEY,
  QUERY_DEFAULT_MAP,
  QUERY_KEY
} from '@/queries/query.helper'

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      console.log('ERROR:', error, query)
      if (query.queryKey[0] == INFINITE_QUERY_KEY) {
        query.setData(DEFAULT_INFINITE_QUERY_RESPONSE)
      } else if (query.queryKey[0] == QUERY_KEY) {
        const key = query.queryKey[1] as string
        if (key in QUERY_DEFAULT_MAP) {
          query.setData(QUERY_DEFAULT_MAP[key])
        } else {
          query.setData(null)
        }
      }
    }
  })
})

export default function App(): JSX.Element {
  return (
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AppInner />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AppErrorBoundary>
  )
}
