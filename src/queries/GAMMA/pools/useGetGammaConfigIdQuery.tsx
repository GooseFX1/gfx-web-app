import { useQuery } from '@tanstack/react-query'
import { PublicKey } from '@solana/web3.js'
import { AMM_CONFIG, GAMMA_PROGRAM_ID } from '@/web3'
import { u16ToBytes } from '@raydium-io/raydium-sdk-v2'

function useGetGammaConfigIdQuery(id = 0) {
  return useQuery({
    queryKey: ['GAMMA-amm-config', id],
    queryFn: async (): Promise<PublicKey> =>
      PublicKey.findProgramAddressSync(
        [Buffer.from(AMM_CONFIG), u16ToBytes(id)],
        new PublicKey(GAMMA_PROGRAM_ID)
      )[0],
    staleTime: -1
  })
}

export default useGetGammaConfigIdQuery
