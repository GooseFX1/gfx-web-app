import { useQuery } from '@tanstack/react-query'
import { QUERY_KEY, UseGammaProgramPoolKey } from '@/queries/query.helper'
import { INTERVALS } from '@/utils/time'
import { usePriceFeedFarm } from '@/context'
import { PublicKey } from '@solana/web3.js'

type UseGammaProgramPoolQueryProps = {
  poolId?: PublicKey
}

function useGammaProgramPoolQuery({ poolId }: UseGammaProgramPoolQueryProps) {
  const {GammaProgram} = usePriceFeedFarm()
  return useQuery({
    queryKey: [QUERY_KEY, UseGammaProgramPoolKey, poolId?.toBase58()],
    queryFn: async () =>
      await GammaProgram.account.poolState.fetch(poolId)
    ,
    placeholderData: null,
    staleTime: INTERVALS.MINUTE,
    enabled: !!poolId
  })
}

export default useGammaProgramPoolQuery
