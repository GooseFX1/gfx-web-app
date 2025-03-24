import { useQuery } from '@tanstack/react-query'
import { QUERY_KEY, UseGammaProgramUserLiquidityKey } from '@/queries/query.helper'
import { INTERVALS } from '@/utils/time'
import { usePriceFeedFarm } from '@/context'

function useGammaProgramUserLiquidityQuery({ liqKey }) {
  const { GammaProgram } = usePriceFeedFarm()

  return useQuery({
    queryKey: [QUERY_KEY, UseGammaProgramUserLiquidityKey, !!liqKey, !!GammaProgram],
    queryFn: async () => await GammaProgram.account.userPoolLiquidity.fetch(liqKey),
    staleTime: INTERVALS.MINUTE,
    enabled: !!liqKey
  })
}

export default useGammaProgramUserLiquidityQuery
