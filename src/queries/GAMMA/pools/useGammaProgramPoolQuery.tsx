import { useQuery } from '@tanstack/react-query'
import { QUERY_KEY, UseGammaProgramPoolKey } from '@/queries/query.helper'
import { INTERVALS } from '@/utils/time'
import { usePriceFeedFarm } from '@/context'

type UseGammaProgramPoolQueryProps = {
  poolId?: string
}

function useGammaProgramPoolQuery({ poolId }: UseGammaProgramPoolQueryProps) {
  const {GammaProgram} = usePriceFeedFarm()

  return useQuery({
    queryKey: [QUERY_KEY, UseGammaProgramPoolKey, poolId, !!GammaProgram],
    queryFn: async () =>
      await GammaProgram.account.poolState.fetch(poolId)
    ,
    staleTime: INTERVALS.MINUTE,
    enabled: !!poolId
  })
}

export default useGammaProgramPoolQuery
