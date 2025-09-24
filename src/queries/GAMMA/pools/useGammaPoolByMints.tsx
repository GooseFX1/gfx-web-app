import { useQuery } from '@tanstack/react-query'
import { PublicKey } from '@solana/web3.js'
import { AMM_CONFIG, GAMMA_PROGRAM_ID, POOL_SEED_PRFIX } from '@/web3'
import { u16ToBytes } from '@raydium-io/raydium-sdk-v2'
import useSelectPoolQuery from '@/queries/GAMMA/pools/useSelectPoolQuery'

function useGammaPoolByMints({
  mintA,
  mintB
                             }:{
  mintA?: string
  mintB?: string
}) {
  const poolIdQuery = useQuery({
    queryKey: ['GAMMA-pool-by-mints', mintA, mintB],
    queryFn: async () => {
      const configId =   PublicKey.findProgramAddressSync(
        [Buffer.from(AMM_CONFIG), u16ToBytes(0)],
        new PublicKey(GAMMA_PROGRAM_ID)
      )[0]
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
      )[0].toBase58()
    },
    enabled: !!(mintA && mintB),
  })
  return useSelectPoolQuery({
    id: poolIdQuery.data
  })
}

export default useGammaPoolByMints