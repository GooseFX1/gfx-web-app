import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { QUERY_KEY, UseGammaProgramPoolKey } from '@/queries/query.helper'
import { INTERVALS } from '@/utils/time'
import { GammaAccountWithInfo, GammaPoolState, usePriceFeedFarm } from '@/context'
import { PublicKey } from '@solana/web3.js'

type UseGammaProgramPoolQueryProps = {
  poolId?: PublicKey
}

function useGammaProgramPoolQuery({
  poolId
}: UseGammaProgramPoolQueryProps): UseQueryResult<GammaAccountWithInfo<GammaPoolState>> {
  const { GammaProgram } = usePriceFeedFarm()
  return useQuery({
    queryKey: [QUERY_KEY, UseGammaProgramPoolKey, poolId?.toBase58()],
    queryFn: async () => {
      const poolStateAccountInfo = await GammaProgram.account.poolState.getAccountInfo(poolId)
      const poolState: GammaPoolState = GammaProgram.account.poolState.coder.accounts.decode(
        'poolState',
        poolStateAccountInfo.data
      )
      return { account: poolState, accountInfo: poolStateAccountInfo }
    },
    placeholderData: null,
    staleTime: INTERVALS.SECOND * 10,
    enabled: !!poolId
  })
}

export default useGammaProgramPoolQuery
