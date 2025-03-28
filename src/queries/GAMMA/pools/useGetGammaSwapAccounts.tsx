import { useQuery } from '@tanstack/react-query'
import { getAccountsForSwappingTokens } from '@/web3/Farm'
import { PublicKey } from '@solana/web3.js'
import { useWalletBalance } from '@/context/walletBalanceContext'
import { QUERY_KEY } from '@/queries/query.helper'

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
    queryKey: [
      QUERY_KEY,
      'gamma-swap-accounts',
      mintA,
      mintB,
      userSourceTokenType,
      userTargetTokenType,
      !!poolState,
      ammConfigId?.toBase58(),
      poolIdKey?.toBase58(),
      base58PublicKey
    ],
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
    enabled:
      Boolean(mintA) &&
      Boolean(mintB) &&
      Boolean(userSourceTokenType) &&
      Boolean(userTargetTokenType) &&
      Boolean(poolIdKey) &&
      Boolean(poolState) &&
      Boolean(ammConfigId) &&
      Boolean(base58PublicKey)
  })
}

export default useGetGammaSwapAccounts
