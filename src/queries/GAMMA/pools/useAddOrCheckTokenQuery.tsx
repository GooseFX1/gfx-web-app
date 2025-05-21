import { useQuery } from '@tanstack/react-query'
import { getQueryKeys, QUERY_DEFAULT_MAP, QUERY_KEY, UseAddOrCheckTokenQueryKey } from '@/queries/query.helper'
import { INTERVALS } from '@/utils/time'
import { getGAMMARootUrl } from '@/api'
import { GAMMA_ENDPOINTS_V1 } from '@/api/gamma/constants'

type AddOrCheckTokenQueryProps = {
  address?: string
}
function useAddOrCheckTokenQuery({ address }: AddOrCheckTokenQueryProps) {
  const keys = getQueryKeys(QUERY_KEY, UseAddOrCheckTokenQueryKey, address)
  return useQuery({
    queryKey: keys,
    queryFn: async ({ signal }) => addOrCheckToken({ address, signal }),
    placeholderData: QUERY_DEFAULT_MAP[UseAddOrCheckTokenQueryKey],
    staleTime: INTERVALS.MINUTE,
    enabled: !!address
  })
}

export default useAddOrCheckTokenQuery
// TODO: fill this in
type GAMMAEnrichedTokenResponse = Record<string, unknown>

async function addOrCheckToken({ address, signal }) {
  const response = (
    await fetch(getGAMMARootUrl() + GAMMA_ENDPOINTS_V1.ADD_OR_CHECK_TOKEN + `?address=${address}`, {
      signal
    }).then((res) => res.json())
  ).data as GAMMAEnrichedTokenResponse

  return response
}
