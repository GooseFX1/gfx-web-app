import { getLiquidityPoolKey } from '@/web3/Farm'
import { useWalletBalance } from '@/context/walletBalanceContext'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEY, UseGammaProgramUserLiquidityKey } from '@/queries/query.helper'
import { INTERVALS } from '@/utils/time'
import { usePriceFeedFarm } from '@/context'
import { PublicKey } from '@solana/web3.js'

function useGammaProgramUserLiquidityQuery({
  poolId
                                           }) {
  const {publicKey, base58PublicKey} = useWalletBalance()
  const {GammaProgram} = usePriceFeedFarm()

  return useQuery({
    queryKey: [
      QUERY_KEY,
      UseGammaProgramUserLiquidityKey,
      base58PublicKey,
      poolId,
      !!GammaProgram
    ],
    queryFn: async () => {
      const accKey = await getLiquidityPoolKey(new PublicKey(poolId), publicKey)
      return await GammaProgram.account.userPoolLiquidity.fetch(accKey)
    },
    staleTime: INTERVALS.MINUTE,
    enabled: !!base58PublicKey && !!poolId,
  })
}

export default useGammaProgramUserLiquidityQuery