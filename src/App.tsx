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
import { createAppKit } from "@reown/appkit/react";
import { SolanaAdapter } from "@reown/appkit-adapter-solana/react";
import { solana, solanaTestnet, solanaDevnet } from "@reown/appkit/networks";
import { APP_URL } from '@/constants'

const solanaWeb3JsAdapter = new SolanaAdapter();

const projectId = "f294cea1e9cd00f0e185354688de6620";
const metadata = {
  name: 'GooseFX',
  description: 'GooseFX | Liquidity Reimagined',
  url: APP_URL,
  icons: ['https://media.goosefx.io/brand/Web_Clip.png']
}

createAppKit({
  adapters: [solanaWeb3JsAdapter],
  networks: [solana, solanaTestnet, solanaDevnet],
  metadata: metadata,
  projectId,
  features: {
    analytics: true
  }
});

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
