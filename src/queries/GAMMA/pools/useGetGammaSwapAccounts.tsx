import { useQuery } from '@tanstack/react-query'
import { getAccountsForSwappingTokens } from '@/web3/Farm'
import { PublicKey } from '@solana/web3.js'
import { useWalletBalance } from '@/context/walletBalanceContext'

type UseGetGammaSwapAccountsProps = {
  mintA: string
  mintB: string
  userSourceTokenType: '' | 'spl-token' | 'native' | 'spl-token-2022'
  userTargetTokenType: '' | 'spl-token' | 'native' | 'spl-token-2022'
  poolState: any
  ammConfigId: PublicKey
  poolIdKey: PublicKey
}

function useGetGammaSwapAccounts({
  mintA,
  mintB,
  userSourceTokenType,
  userTargetTokenType,
  poolState,
  ammConfigId,
  poolIdKey
}: UseGetGammaSwapAccountsProps) {
  const { publicKey, base58PublicKey } = useWalletBalance()
  return useQuery({
    queryKey: ['gamma-swap-accounts', mintA, mintB, poolIdKey?.toBase58()],
    queryFn: async () =>
      getAccountsForSwappingTokens(
        mintA,
        mintB,
        userSourceTokenType,
        userTargetTokenType,
        poolState,
        publicKey,
        ammConfigId,
        poolIdKey
      ),
    enabled: !!mintA && !!mintB && !!poolIdKey && !!poolState && !!ammConfigId && !!base58PublicKey
  })
}

export default useGetGammaSwapAccounts
