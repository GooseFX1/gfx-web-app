import { useQuery } from '@tanstack/react-query'
import { QUERY_KEY, UseGammaProgramPoolKey } from '@/queries/query.helper'
import { getPoolIdKey } from '@/web3/Farm'
import useGetGammaConfigIdQuery from '@/queries/GAMMA/pools/useGetGammaConfigIdQuery'
import { PublicKey } from '@solana/web3.js'
import { INTERVALS } from '@/utils/time'
import { usePriceFeedFarm } from '@/context'

type UseGammaProgramPoolQueryProps = {
  mintA?: string
  mintB?: string
  poolId?: string
}

function useGammaProgramPoolQuery({ mintA, mintB, poolId }: UseGammaProgramPoolQueryProps) {
  const ammConfigQuery = useGetGammaConfigIdQuery(0)
  const {GammaProgram} = usePriceFeedFarm()
  const criteria = mintA ? `mintA-${mintA}_mintB-${mintB}` : `poolId-${poolId}`
  return useQuery({
    queryKey: [QUERY_KEY, UseGammaProgramPoolKey, criteria, !!GammaProgram],
    queryFn: async () => {
      let id: PublicKey;
      if (mintA && mintB && !poolId) {
        id = await getPoolIdKey(ammConfigQuery.data, new PublicKey(mintA), new PublicKey(mintB))
      } else {
        id = new PublicKey(poolId)
      }
      return await GammaProgram.account.poolState.fetch(id)
    },
    staleTime: INTERVALS.MINUTE,
    enabled: (!!(mintA && mintB) || !!poolId) && !!ammConfigQuery.isSuccess
  })
}

export default useGammaProgramPoolQuery
