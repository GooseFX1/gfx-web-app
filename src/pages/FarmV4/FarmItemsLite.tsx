/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC } from 'react'
import FarmCard, { FarmCardLoader } from '@/pages/FarmV4/FarmCard'
import { useGamma } from '@/context'

const FarmItemsLite: FC<{
  openPositionImages: string[]
  openPositionsAcrossPrograms: number
}> = ({ openPositionImages, openPositionsAcrossPrograms }) => {
  const {
    filteredPools,
    isLoadingPools
    // currentPoolType,
    // isSearchActive
  } = useGamma()

  // TODO: Enable MigrateCard
  return (
    <div className="w-full border-top grid gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {/* {!isSearchActive && currentPoolType.name != POOL_TYPE.migrate.name && (
        <MigrateCard
          openPositionImages={openPositionImages}
          openPositionsAcrossPrograms={openPositionsAcrossPrograms}
        />
      )} */}
      {isLoadingPools ?
        <>
          <FarmCardLoader/>
          <FarmCardLoader/>
          <FarmCardLoader/>
          <FarmCardLoader/>
        </>
        : filteredPools.map((pool, i) => (
        <FarmCard pool={pool} key={`${pool?.mintA.name}-${pool?.mintB.name}-${i}`} />
      ))}
    </div>
  )
}

export default FarmItemsLite
