import { PublicKey } from '@solana/web3.js'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { QUERY_KEY } from '@/queries/query.helper'
import { INTERVALS } from '@/utils/time'
import { GammaAccountWithInfo, GammaObservationState, usePriceFeedFarm } from '@/context'

function useGammaProgramObservationState({
  observerKey
}: {
  observerKey: PublicKey
}): UseQueryResult<GammaAccountWithInfo<GammaObservationState>> {
  const { GammaProgram } = usePriceFeedFarm()
  return useQuery({
    queryKey: [QUERY_KEY, 'gamma-observation-state', observerKey?.toBase58()],
    queryFn: async () => {
      const observationStateAccountInfo = await GammaProgram.account.observationState.getAccountInfo(observerKey)
      const observationState: GammaObservationState = GammaProgram.account.observationState.coder.accounts.decode(
        'observationState',
        observationStateAccountInfo.data
      )
      return {
        account: observationState,
        accountInfo: observationStateAccountInfo
      }
    },
    staleTime: INTERVALS.MINUTE * 5,
    enabled: !!observerKey
  })
}

export default useGammaProgramObservationState
