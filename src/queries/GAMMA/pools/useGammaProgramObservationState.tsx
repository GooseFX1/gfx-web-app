import { PublicKey } from '@solana/web3.js'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEY } from '@/queries/query.helper'
import { INTERVALS } from '@/utils/time'
import { usePriceFeedFarm } from '@/context'

function useGammaProgramObservationState({ observerKey }: { observerKey: PublicKey }) {
  const { GammaProgram } = usePriceFeedFarm()
  return useQuery({
    queryKey: [QUERY_KEY, 'gamma-observation-state', observerKey?.toBase58()],
    queryFn: async () => GammaProgram.account.observationState.fetch(observerKey),
    staleTime: INTERVALS.MINUTE * 5,
    enabled: !!observerKey
  })
}

export default useGammaProgramObservationState
