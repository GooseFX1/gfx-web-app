import { useQuery } from '@tanstack/react-query'
import { INTERVALS } from '@/utils/time'
import { fetchAggregateStats } from '@/api/gamma'
import { useLocation } from 'react-router-dom'
import { ROUTES } from '@/Router'
import useQueryWrapperWithError from '../useQueryWrapperWithError'

const DEFAULT = {
  tvl: '0',
  stats24h: {
    volume: '0',
    fees: '0'
  },
  stats7d: {
    volume: '0',
    fees: '0'
  },
  stats30d: {
    volume: '0',
    fees: '0'
  }
} as const

function useStatsQuery() {
  const { pathname } = useLocation()
  return useQueryWrapperWithError(useQuery({
    queryKey: ['GAMMA-stats'],
    queryFn: fetchAggregateStats,
    staleTime: INTERVALS.MINUTE,
    placeholderData: DEFAULT,
    enabled: pathname.startsWith(ROUTES.GAMMA)
  }), DEFAULT)
}

export default useStatsQuery
