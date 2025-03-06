import useQueryWrapperWithError from '@/queries/useQueryWrapperWithError'
import { useQuery } from '@tanstack/react-query'
import { getQueryKeys } from '@/queries/query.helper'
import { INTERVALS } from '@/utils/time'
import { getGAMMARootUrl } from '@/api'
import { GAMMA_ENDPOINTS_V1 } from '@/api/gamma/constants'
import { useWalletBalance } from '@/context/walletBalanceContext'

type SelectPoolQueryProps = {
  id?: string
}

function useSelectPoolQuery({ id }: SelectPoolQueryProps) {
  const { base58PublicKey } = useWalletBalance()
  const keys = getQueryKeys('GAMMA-pool-by-id', id, base58PublicKey)
  return useQueryWrapperWithError(
    useQuery({
      queryKey: keys,
      queryFn: async ({ signal }) =>
        getPoolById({ id, publicKey: base58PublicKey, signal }),
      placeholderData: null,
      staleTime: INTERVALS.MINUTE,
      enabled: !!id
    }),
    null,
    keys
  )
}

export default useSelectPoolQuery
// TODO: fill this in
type GAMMAEnrichedPoolResponse = {

}

async function getPoolById({ id, publicKey, signal }) {
  const userQuery = publicKey ? `?userPublicKey=${publicKey}` : ''
  const response = await fetch(
    getGAMMARootUrl() +
    GAMMA_ENDPOINTS_V1.POOL_BY_ID +
    `/${id}?`+
    userQuery,
    { signal }).then((res) => res.json()) as GAMMAEnrichedPoolResponse

  return response
}
