import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { QUERY_KEY } from '@/queries/query.helper'
import { GammaAccountWithInfo, GammaAmmConfig, usePriceFeedFarm } from '@/context'
import { PublicKey } from '@solana/web3.js'

function useGammaProgramAmmConfig(ammConfigKey: PublicKey): UseQueryResult<GammaAccountWithInfo<GammaAmmConfig>> {
  const { GammaProgram } = usePriceFeedFarm()
  return useQuery({
    queryKey: [QUERY_KEY, 'gamma-amm-config', !!GammaProgram, ammConfigKey?.toBase58()],
    queryFn: async () => {
      console.log('ammConfigKey', ammConfigKey)
      if (!ammConfigKey) return null
      const ammConfigAccountInfo = await GammaProgram.account.ammConfig.getAccountInfo(ammConfigKey)
      const ammConfig: GammaAmmConfig = GammaProgram.account.ammConfig.coder.accounts.decode(
        'ammConfig',
        ammConfigAccountInfo.data
      )
      return {
        account: ammConfig,
        accountInfo: ammConfigAccountInfo
      }
    },
    staleTime: Infinity,
    enabled: !!GammaProgram
  })
}

export default useGammaProgramAmmConfig
