import { FC, useMemo } from 'react'
import { POOL_TYPE } from '@/pages/FarmV4/constants'
import MigrateCard from '@/pages/FarmV4/MigrateCard'
import { truncateBigString } from '@/utils'
import FarmCard from '@/pages/FarmV4/FarmCard'
import { useGamma } from '@/context'

const FarmItemsLite: FC<{
  openPositionImages: string[]
  openPositionsAcrossPrograms: number
  tokens: any
  filteredLiquidityAccounts: any
}> = ({ openPositionImages, openPositionsAcrossPrograms, tokens, filteredLiquidityAccounts }) => {
  const { currentPoolType, searchTokens, showDeposited } = useGamma()
  const isSearchActive = useMemo(() => searchTokens.length > 0, [searchTokens])
  return (
    <div className="border-top grid gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {!isSearchActive && currentPoolType?.name != POOL_TYPE?.migrate?.name && (
        <MigrateCard
          openPositionImages={openPositionImages}
          openPositionsAcrossPrograms={openPositionsAcrossPrograms}
        />
      )}
      {tokens
        .filter((token: any) => {
          if (currentPoolType.name === 'All') return true
          else return currentPoolType.name === token.type
        })
        .map((token, i) => {
          if (!token || !filteredLiquidityAccounts) return null
          const liqAcc = filteredLiquidityAccounts[token.sourceTokenMintAddress]
          const userDepositedAmount = truncateBigString(
            liqAcc?.amountDeposited.toString(),
            token.sourceTokenMintDecimals
          )

          const show =
            (showDeposited && Boolean(userDepositedAmount) && userDepositedAmount != '0.00') || !showDeposited

          return show ? <FarmCard token={token} key={`${token?.sourceToken}-${token?.targetToken}-${i}`} /> : null
        })}
    </div>
  )
}

export default FarmItemsLite
