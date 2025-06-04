import { useQuery } from '@tanstack/react-query'
import { INTERVALS } from '@/utils/time'
import { TOKEN_LIST_PAGE_SIZE } from '@/pages/FarmV4/constants'
import { GAMMA_API_BASE, GAMMA_ENDPOINTS_V1 } from '@/api/gamma/constants'
import { GAMMAListTokenResponse } from '@/types/gamma'

function useTokenQuery({ address }: { address?: string }) {
  return useQuery({
    queryKey: ['getToken', address],
    queryFn: async ({ signal }) => getToken({ address, signal }),
    staleTime: INTERVALS.MINUTE,
    enabled: !!address
  })
}

export default useTokenQuery

async function getToken({ address, signal }: { address: string; signal: AbortSignal }) {
  const pageQuery = `?&page=${1}&pageSize=${TOKEN_LIST_PAGE_SIZE}&search=${address}`
  const response = (await fetch(
    `https://${GAMMA_API_BASE}.goosefx.io` + GAMMA_ENDPOINTS_V1.TOKEN_LIST + pageQuery,
    {
      signal
    }
  ).then((res) => res.json())) as GAMMAListTokenResponse

  return response.data.tokens.filter((token) => token.address.toLowerCase() === address.toLowerCase())?.[0] || null
}
