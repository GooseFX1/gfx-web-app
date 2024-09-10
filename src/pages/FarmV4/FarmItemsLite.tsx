import { FC, useMemo } from 'react'
import { POOL_TYPE } from '@/pages/FarmV4/constants'
import MigrateCard from '@/pages/FarmV4/MigrateCard'
import FarmCard from '@/pages/FarmV4/FarmCard'
import { useGamma } from '@/context'

const FarmItemsLite: FC<{
  openPositionImages: string[]
  openPositionsAcrossPrograms: number
}> = ({ openPositionImages, openPositionsAcrossPrograms }) => {
  const { pools, currentPoolType, searchTokens, showDeposited } = useGamma()
  const isSearchActive = useMemo(() => searchTokens.length > 0, [searchTokens])
  return (
    <div className="border-top grid gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {!isSearchActive && currentPoolType?.name != POOL_TYPE?.migrate?.name && (
        <MigrateCard
          openPositionImages={openPositionImages}
          openPositionsAcrossPrograms={openPositionsAcrossPrograms}
        />
      )}
      {pools
        .filter((token: any) => {
          if (currentPoolType.name === 'All') return true
          else return currentPoolType.name === token.type
        })
        .map((token, i) => {
          //TODO: Fetch the balance from contract/api
          const show =
            (showDeposited && Boolean(0)) || !showDeposited

          return show ? <FarmCard token={token} key={`${token?.mintA.name}-${token?.mintB.name}-${i}`} /> : null
        })}
    </div>
  )
}

export default FarmItemsLite
