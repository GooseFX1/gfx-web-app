import { useCallback, useEffect, useMemo, useState } from 'react'
import { useConnectionConfig } from '@/context'
import { INTERVALS } from '@/utils/time'
type NETWORK_STATUS_UNKOWN = -1
type NETWORK_STATUS_NORMAL = 0
type NETWORK_STATUS_CONGESTED = 1
type NETWORK_STATUS_DEGRADED = 2
type NETWORK_STATUS =
  | NETWORK_STATUS_UNKOWN
  | NETWORK_STATUS_NORMAL
  | NETWORK_STATUS_CONGESTED
  | NETWORK_STATUS_DEGRADED
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
  const { endpoint } = useConnectionConfig()
  const refetch = useCallback(async () => {
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
    })
      .then((r) => r.json())
      .catch((e) => {
        console.log('[Warning] Health Fetch Failed')
        console.error(e)
        return null
      })
    if (res == null) {
      return
    }
    console.log('[Log] Health Response: ', res)
    if (res.result) {
      setStatus(0)
    } else {
      if (res.error && res.error.data.numSlotsBehind) {
        setStatus(2)
      } else {
        setStatus(1)
      }
    }
  }, [endpoint])
  const mappedStatus = useMemo(() => {
    switch (status) {
      case 0:
        return 'Normal'
      case 1:
        return 'Congested'
      case 2:
        return 'Degraded'
      default:
        return 'Unknown'
    }
  }, [status])
  useEffect(() => {
    refetch()
    const interval = setInterval(() => refetch(), INTERVALS.MINUTE * 5)
    return () => clearInterval(interval)
  }, [endpoint])
  return { status, mappedStatus, refetch }
}

export default useNetworkStatus