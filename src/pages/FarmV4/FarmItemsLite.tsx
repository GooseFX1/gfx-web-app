/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC } from 'react'
import { POOL_TYPE } from '@/pages/FarmV4/constants'
import MigrateCard from '@/pages/FarmV4/MigrateCard'
import FarmCard from '@/pages/FarmV4/FarmCard'
import { useGamma } from '@/context'

const FarmItemsLite: FC<{
  openPositionImages: string[]
  openPositionsAcrossPrograms: number
}> = ({ openPositionImages, openPositionsAcrossPrograms }) => {
  const {
    filteredPools
    // currentPoolType,
    // isSearchActive
  } = useGamma()

  // TODO: Enable MigrateCard
  return (
    <div className="border-top grid gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {/* {!isSearchActive && currentPoolType.name != POOL_TYPE.migrate.name && (
        <MigrateCard
          openPositionImages={openPositionImages}
          openPositionsAcrossPrograms={openPositionsAcrossPrograms}
        />
      )} */}
      {filteredPools.map((pool, i) => (
        <FarmCard pool={pool} key={`${pool?.mintA.name}-${pool?.mintB.name}-${i}`} />
      ))}
    </div>
  )
}

export default FarmItemsLite
