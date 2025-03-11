/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC } from 'react'
import FarmCard, { FarmCardLoader } from '@/pages/FarmV4/FarmCard'
import { useGamma } from '@/context'
import { Button } from 'gfx-component-lib'

const FarmItemsLite: FC<{
  openPositionImages: string[]
  openPositionsAcrossPrograms: number
}> = ({ openPositionImages, openPositionsAcrossPrograms }) => {
  const {
    filteredPools,
    isLoadingPools,
    totalPoolCount,
    poolsQuery
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
      {totalPoolCount !== filteredPools.length && (
        <Button
          className="cursor-pointer rounded-full border-[1.5px] border-solid border-purple-5
            dark:bg-black-1 dark:text-white bg-grey-5 font-bold text-regular text-black-4
            flex flex-row justify-center items-center mt-2.5 mx-auto"
          variant={'primary'}
          onClick={() => poolsQuery.fetchNextPage()}
        >
          Load More
        </Button>
      )}
    </div>
  )
}

export default FarmItemsLite
