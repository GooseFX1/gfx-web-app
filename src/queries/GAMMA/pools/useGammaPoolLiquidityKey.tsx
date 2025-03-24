import { PublicKey } from '@solana/web3.js'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEY } from '@/queries/query.helper'
import { GAMMA_PROGRAM_ID, toPublicKey, USER_POOL_LIQUIDITY_PREFIX } from '@/web3'

type UseGammaPoolLiquidityKeyQueryProps = {
  poolId: PublicKey
  userPublicKey: PublicKey
}

function useGammaPoolLiquidityKey({ poolId, userPublicKey }: UseGammaPoolLiquidityKeyQueryProps) {
  return useQuery({
    queryKey: [QUERY_KEY, 'gamma-pool-liq-key', poolId, userPublicKey],
    queryFn: () =>
      PublicKey.findProgramAddressSync(
        [Buffer.from(USER_POOL_LIQUIDITY_PREFIX), poolId.toBuffer(), userPublicKey.toBuffer()],
        toPublicKey(GAMMA_PROGRAM_ID)
      )[0],
    staleTime: -1,
    enabled: !!poolId && !!userPublicKey
  })
}

export default useGammaPoolLiquidityKey
