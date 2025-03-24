import { useQuery } from '@tanstack/react-query'
import { QUERY_KEY } from '@/queries/query.helper'
import { PublicKey } from '@solana/web3.js'
import { GAMMA_PROGRAM_ID, POOL_SEED_PRFIX } from '@/web3'
type UseGammaPoolIdQueryProps = {
  configId: PublicKey
  mintA: string
  mintB: string
}
function useGammaPoolIdQuery({ configId, mintA, mintB }: UseGammaPoolIdQueryProps) {
  return useQuery({
    queryKey: [QUERY_KEY, 'gamma-pool-id', mintA, mintB, configId],
    queryFn: () => {
      if (!configId || !mintA || !mintB) return null
      const mintAPublicKey = new PublicKey(mintA)
      const mintBPublicKey = new PublicKey(mintB)
      const compare = mintBPublicKey.toBuffer()?.compare(mintAPublicKey.toBuffer())
      return PublicKey.findProgramAddressSync(
        [
          Buffer.from(POOL_SEED_PRFIX),
          configId?.toBuffer(),
          compare > 0 ? mintAPublicKey?.toBuffer() : mintBPublicKey?.toBuffer(),
          compare > 0 ? mintBPublicKey?.toBuffer() : mintAPublicKey?.toBuffer()
        ],
        new PublicKey(GAMMA_PROGRAM_ID)
      )[0]
    },
    staleTime: -1,
    enabled: !!configId && !!mintA && !!mintB
  })
}

export default useGammaPoolIdQuery
