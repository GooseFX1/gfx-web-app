import { GAMMASortConfig } from '@/pages/FarmV4/constants'
import { GAMMAPool, GAMMAUserLPPositionWithPrice } from '@/types/gamma'
import { UseQueryResult } from '@tanstack/react-query'
import BN from 'bn.js'
import Decimal from 'decimal.js-light'

export function getSortKey(sortConfig: GAMMASortConfig, isPortfolio: boolean, viewRange: number) {
  const computedViewRange = viewRange == 0 ? '24H' : viewRange == 1 ? '7D' : '30D'

  const key = `${sortConfig.key.toLowerCase()}`
  if ((sortConfig.id == '9' || sortConfig.id == '10') && !isPortfolio) {
    return ''
  }
  if (sortConfig.id !== '1' && sortConfig.id !== '2' && sortConfig.id !== '9' && sortConfig.id !== '10') {
    return `${key}${computedViewRange.toLowerCase()}`
  }
  return key
}

export
function attachLiquidity<T extends GAMMAPool>({
                                                pools,
                                                userLiqQuery,
                                                mintA,
                                                mintB,
                                                sortBy,
                                                sortDirection
                                              }: {
  pools: T[]
  userLiqQuery: UseQueryResult<GAMMAUserLPPositionWithPrice[]>
  mintA: string
  mintB: string
  sortBy: string
  sortDirection: string
}) {
  const userLpPositions = new Map(userLiqQuery.data.map((lp) => [lp.poolStatePublicKey, lp]))

  return pools
    .map((pool) => {
      const userLpPosition = userLpPositions.get(pool.id)
      return {
        ...pool,
        userLpPosition: userLpPosition ? structuredClone(userLpPosition) : undefined,
        hasDeposit: userLpPosition ? new BN(userLpPosition?.lpTokensOwned)?.gt(new BN(0)) : false
      }
    })
    .sort((a, b) => {
      if (sortBy === 'position') {
        const aValue = new Decimal(a.userLpPosition.totalValue)
        const bValue = new Decimal(b.userLpPosition.totalValue)

        if (sortDirection === 'asc') {
          return aValue.gte(bValue) ? -1 : 1
        }
        return aValue.lte(bValue) ? -1 : 1
      }
      if (mintA && mintB) {
        // don't have both so keep current sort
        if (
          (a.mintA.address === mintA && a.mintB.address === mintB) ||
          (a.mintB.address === mintA && a.mintA.address === mintB)
        ) {
          return -1
        } else if (
          (b.mintA.address === mintA && b.mintB.address === mintB) ||
          (b.mintB.address === mintA && b.mintA.address === mintB)
        ) {
          return 1
        }
      }
      return 0
    })
}
