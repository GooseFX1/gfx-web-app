import { useQuery } from '@tanstack/react-query'
import { QUERY_KEY, UseGammaProgramUserLiquidityKey } from '@/queries/query.helper'
import { usePriceFeedFarm } from '@/context'
import { PublicKey } from '@solana/web3.js'

function useGammaProgramUserLiquidityQuery({ liqKey }: { liqKey: PublicKey }) {
  const { GammaProgram } = usePriceFeedFarm()

  return useQuery({
    queryKey: [QUERY_KEY, UseGammaProgramUserLiquidityKey, liqKey?.toBase58(), !!GammaProgram],
    queryFn: async () => await GammaProgram.account.userPoolLiquidity.fetch(liqKey),
    staleTime: Infinity,
    enabled: !!liqKey && !!GammaProgram
  })
}

export default useGammaProgramUserLiquidityQuery
