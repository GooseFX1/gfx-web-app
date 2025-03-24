import { useEffect, useMemo, useState } from 'react'
import { useConnectionConfig } from '@/context'
import { INTERVALS } from '@/utils/time'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEY } from '@/queries/query.helper'

const NETWORK_STATUS_UNKOWN = -1
const NETWORK_STATUS_NORMAL = 0
const NETWORK_STATUS_CONGESTED = 1
const NETWORK_STATUS_DEGRADED = 2
type NETWORK_STATUS =
  | typeof NETWORK_STATUS_UNKOWN
  | typeof NETWORK_STATUS_NORMAL
  | typeof NETWORK_STATUS_CONGESTED
  | typeof NETWORK_STATUS_DEGRADED
type MAPPED_NETWORK_STATUS = 'Unknown' | 'Normal' | 'Congested' | 'Degraded'
const SOLANA_DEFAULT_ENDPOINT = 'https://api.mainnet-beta.solana.com'
type NetworkStatusReturn = {
  status: NETWORK_STATUS
  mappedStatus: MAPPED_NETWORK_STATUS
  refetch: () => void
}
type HealthResponse = {
  jsonrpc: string
  id: number
  result?: string
  error?: {
    code: number
    message: string
    data: {
      numSlotsBehind: number
    }
  }
}

function useNetworkStatus(): NetworkStatusReturn {
  const [status, setStatus] = useState<NETWORK_STATUS>(-1)
  const { endpoint, latency } = useConnectionConfig()
  const query = useQuery({
    queryKey: [QUERY_KEY, 'network-status', endpoint],
    queryFn: async () => {
      try {
        const res: HealthResponse = await fetch(`${endpoint ?? SOLANA_DEFAULT_ENDPOINT}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'getHealth'
          })
        }).then((r) => r.json())
        if (res.result) {
         return 0
        } else {
          if (res.error && res.error.data.numSlotsBehind) {
            return 2
          } else {
            return 1
          }
        }
      } catch (e) {
        console.error('[Error] Failed to fetch health status', e)
        return -1
      }
    },
    staleTime: INTERVALS.MINUTE * 5,
  })

  const mappedStatus = useMemo(() => {
    switch (query.data) {
      case 0:
        return 'Normal'
      case 1:
        return 'Congested'
      case 2:
        return 'Degraded'
      default:
        return 'Unknown'
    }
  }, [query.data])

  useEffect(() => {
    if (latency < 250 && status != NETWORK_STATUS_NORMAL) {
      setStatus(0)
    } else if (latency < 500 && status != NETWORK_STATUS_CONGESTED) {
      setStatus(1)
    } else if (latency >= 500 && status != NETWORK_STATUS_DEGRADED) {
      setStatus(2)
    }
    console.log(latency)
  }, [latency])
  return { status, mappedStatus, refetch: query.refetch }
}

export default useNetworkStatus
