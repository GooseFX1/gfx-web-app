import { useQuery } from '@tanstack/react-query'
import { getAmmConfigId } from '@/web3/Farm'


function useGetAmmConfigIdQuery(id = 0) {
  return useQuery({
    queryKey: ['GAMMA-amm-config', id],
    queryFn: async () => {
      const response = await getAmmConfigId(id)
      return response[0]
    },
    staleTime: -1
  })
}

export default useGetAmmConfigIdQuery
