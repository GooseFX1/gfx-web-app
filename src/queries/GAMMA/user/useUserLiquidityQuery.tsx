import { useQuery } from '@tanstack/react-query'
import { useWalletBalance } from '@/context/walletBalanceContext'
import { fetchLpPositions, fetchTokensByPublicKey } from '@/api/gamma'
import Decimal from 'decimal.js-light'
import { GAMMAUserLPPositionWithPrice } from '@/types/gamma'
import { INTERVALS } from '@/utils/time'
import { getQueryKeys, QUERY_DEFAULT_MAP, QUERY_KEY, UseUserLiquidityQueryKey } from '@/queries/query.helper'

/**
 * @deprecated DO NOT USE THIS - IT IS BEING PHASED OUT
 */
function useUserLiquidityQuery() {
 const {base58PublicKey} = useWalletBalance()
  const keys = getQueryKeys(QUERY_KEY, UseUserLiquidityQueryKey, base58PublicKey)
  return useQuery({
    queryKey: keys,
    queryFn: async ()=> getLpPositions(base58PublicKey),
    placeholderData: QUERY_DEFAULT_MAP[UseUserLiquidityQueryKey],
    staleTime: INTERVALS.MINUTE * 5,
    enabled: !!base58PublicKey
  });
}

export default useUserLiquidityQuery

async function getLpPositions(base58PublicKey): Promise<GAMMAUserLPPositionWithPrice[]> {
  const response = await fetchLpPositions(base58PublicKey)
  if (!response.length) return []
  const tokenListResponse = await fetchTokensByPublicKey(
    response
      .reduce((acc, icc) => acc + icc.mintA.address + ',' + icc.mintB.address + ',', '')
      .slice(0, -1)
  )

  if (tokenListResponse && tokenListResponse.success) {
    const priceMap = new Map(tokenListResponse.data.tokens.map((token) => [token.address, token.price]))
    return response.map((position) => {
      const tokenAPrice = priceMap.get(position.mintA.address)
      const tokenBPrice = priceMap.get(position.mintB.address)
      const uiValueA = new Decimal(position.tokenADeposited).sub(position.tokenAWithdrawn)
        .div(Math.pow(10, parseInt(position.mintA.decimals)))
      const valueA = uiValueA.mul(tokenAPrice)
      const uiValueB = new Decimal(position.tokenBDeposited).sub(position.tokenBWithdrawn)
        .div(Math.pow(10, parseInt(position.mintB.decimals)))
      const valueB = uiValueB.mul(tokenBPrice)
      const totalValue = valueA.add(valueB)
      return {
        ...position,
        totalValue: totalValue.toString(),
        valueA: valueA.toString(),
        valueB: valueB.toString(),
        uiValueA: uiValueA.toString(),
        uiValueB: uiValueB.toString()
      }
    })
  }

  return response.map((position) => ({
    ...position,
    totalValue: '0.0',
    valueA: '0.0',
    valueB: '0.0',
    uiValueA: '0.0',
    uiValueB: '0.0'
  }))
}