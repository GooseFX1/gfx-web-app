import { useQuery } from '@tanstack/react-query'
import { useWalletBalance } from '@/context/walletBalanceContext'
import { getQueryKeys, QUERY_DEFAULT_MAP, QUERY_KEY, UsePortfolioStatsQueryKey } from '@/queries/query.helper'
import { getGAMMARootUrl } from '@/api'
import { GAMMA_ENDPOINTS_V1 } from '@/api/gamma/constants'
import { ROUTES } from '@/Router'
import { useLocation } from 'react-router-dom'

function useUserPortfolioStatsQuery() {
  const { base58PublicKey } = useWalletBalance()
  const { pathname } = useLocation()
  const keys = getQueryKeys(QUERY_KEY, UsePortfolioStatsQueryKey, base58PublicKey)
  return useQuery({
    queryKey: keys,
    queryFn: async ({ signal }) =>
      getPortfolioStats({
        signal,
        publicKey: base58PublicKey
      }),
    placeholderData: QUERY_DEFAULT_MAP[UsePortfolioStatsQueryKey],
    enabled: !!base58PublicKey && pathname.includes(ROUTES.GAMMA)
  })
}

export default useUserPortfolioStatsQuery

export type PortfolioStatsResponse = {
  portfolioValue: string
}

async function getPortfolioStats({ signal, publicKey }) {
  return (
    await fetch(getGAMMARootUrl() + GAMMA_ENDPOINTS_V1.PORTFOLIO_STATS + `/${publicKey}`, {
      signal
    }).then((res) => res.json())
  ).data as PortfolioStatsResponse
}
