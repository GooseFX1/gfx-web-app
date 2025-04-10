import { useQuery } from '@tanstack/react-query'
import { getQueryKeys, QUERY_DEFAULT_MAP, QUERY_KEY, UseSelectPoolQueryKey } from '@/queries/query.helper'
import { INTERVALS } from '@/utils/time'
import { getGAMMARootUrl } from '@/api'
import { GAMMA_ENDPOINTS_V1 } from '@/api/gamma/constants'
import { useWalletBalance } from '@/context/walletBalanceContext'

type SelectPoolQueryProps = {
  id?: string
}
function useSelectPoolQuery({ id }: SelectPoolQueryProps) {
  const { base58PublicKey } = useWalletBalance()
  const keys = getQueryKeys(QUERY_KEY, UseSelectPoolQueryKey, id, base58PublicKey)
  return useQuery({
    queryKey: keys,
    queryFn: async ({ signal }) => getPoolById({ id, publicKey: base58PublicKey, signal }),
    placeholderData: QUERY_DEFAULT_MAP[UseSelectPoolQueryKey],
    staleTime: INTERVALS.MINUTE,
    enabled: !!id
  })
}

export default useSelectPoolQuery
// TODO: fill this in
type GAMMAEnrichedPoolResponse = Record<string, unknown>

async function getPoolById({ id, publicKey, signal }) {
  const userQuery = publicKey ? `?userPublicKey=${publicKey}` : ''
  const response = (await fetch(getGAMMARootUrl() + GAMMA_ENDPOINTS_V1.POOL_BY_ID + `/${id}?` + userQuery, {
    signal
  }).then((res) => res.json())).data as GAMMAEnrichedPoolResponse

  return response
}
