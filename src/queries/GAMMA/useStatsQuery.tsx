import { useQuery } from '@tanstack/react-query'
import { INTERVALS } from '@/utils/time'
import { fetchAggregateStats } from '@/api/gamma'
import { useLocation } from 'react-router-dom'
import { ROUTES } from '@/Router'
import { getQueryKeys, QUERY_DEFAULT_MAP, QUERY_KEY, UseStatsQueryKey } from '../query.helper'

function useStatsQuery() {
  const { pathname } = useLocation()
  const keys = getQueryKeys(QUERY_KEY, UseStatsQueryKey)
  return useQuery({
    queryKey: keys,
    queryFn: fetchAggregateStats,
    staleTime: INTERVALS.MINUTE,
    placeholderData: QUERY_DEFAULT_MAP[UseStatsQueryKey],
    enabled: pathname.startsWith(ROUTES.GAMMA)
  })
}

export default useStatsQuery
