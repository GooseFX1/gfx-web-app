import useQueryWrapperWithError from '@/queries/useQueryWrapperWithError'
import { useQuery } from '@tanstack/react-query'
import { useWalletBalance } from '@/context/walletBalanceContext'
import { getQueryKeys } from '@/queries/query.helper'
import { getGAMMARootUrl } from '@/api'
import { GAMMA_ENDPOINTS_V1 } from '@/api/gamma/constants'
import { ROUTES } from '@/Router'
import { useLocation } from 'react-router-dom'

const DEFAULT: PortfolioStatsResponse = {
  portfolioValue: '0.00'
}

function useUserPortfolioStatsQuery() {
  const { base58PublicKey } = useWalletBalance()
  const { pathname } = useLocation()
  const keys = getQueryKeys('GAMMA-portfolio-stats', base58PublicKey)
  return useQueryWrapperWithError(
    useQuery({
      queryKey: keys,
      queryFn: async ({ signal }) =>
        getPortfolioStats({
          signal,
          publicKey: base58PublicKey
        }),
      placeholderData: DEFAULT,
      enabled: !!base58PublicKey && pathname.includes(ROUTES.GAMMA)
    }),
    DEFAULT,
    keys
  )
}

export default useUserPortfolioStatsQuery

type PortfolioStatsResponse = {
  portfolioValue: string
}

async function getPortfolioStats({ signal, publicKey }) {
  return (await fetch(getGAMMARootUrl() + GAMMA_ENDPOINTS_V1.PORTFOLIO_STATS + `/${publicKey}`, {
    signal
  }).then((res) => res.json())).data as PortfolioStatsResponse
}
