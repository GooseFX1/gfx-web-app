import { useQuery } from '@tanstack/react-query'
import { QUERY_KEY } from '@/queries/query.helper'
import { usePriceFeedFarm } from '@/context'

function useGammaProgramAmmConfig() {
  const {GammaProgram} = usePriceFeedFarm()
  return useQuery({
    queryKey: [QUERY_KEY, 'gamma-amm-config', !!GammaProgram],
    queryFn: async () => GammaProgram.account.ammConfig.all(),
    staleTime: Infinity,
    enabled: !!GammaProgram
  })
}

export default useGammaProgramAmmConfig