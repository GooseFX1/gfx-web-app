import React from 'react'
import './App.less'
import AppInner from './AppInner'
import AppErrorBoundary from '@/components/AppErrorBoundary'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient()

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
