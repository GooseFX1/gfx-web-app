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
    <div className="w-full border-t-1 border-solid border-border-lightmode-secondary
         dark:border-border-darkmode-secondary">
      {/* {!isSearchActive && currentPoolType.name != POOL_TYPE.migrate.name && (
        <MigrateCard
          openPositionImages={openPositionImages}
          openPositionsAcrossPrograms={openPositionsAcrossPrograms}
        />
      )} */}
      <div className='grid gap-3 grid-cols-1 min-sm: grid-cols-2 sm:grid-cols-2 
        md-lg:grid-cols-3 lg:grid-cols-4 mt-3.75'>
        {isLoadingPools ?
          <>
            <FarmCardLoader />
            <FarmCardLoader />
            <FarmCardLoader />
            <FarmCardLoader />
          </>
          : filteredPools.map((pool, i) => (
            <FarmCard pool={pool} key={`${pool?.mintA.name}-${pool?.mintB.name}-${i}`} />
          ))}
      </div>
    </div>
  )
}

export default FarmItemsLite
