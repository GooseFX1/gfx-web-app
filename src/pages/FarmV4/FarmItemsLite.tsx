import { FC } from 'react'
import FarmCard, { FarmCardLoader } from '@/pages/FarmV4/FarmCard'
import { useGamma } from '@/context'
import MigrateCard from "@/pages/FarmV4/MigrateCard";
import { POOL_TYPE } from '@/pages/FarmV4/constants'

const FarmItemsLite: FC = () => {
  const {
    filteredPools,
    isLoadingPools,
    currentPoolType,
    isSearchActive
  } = useGamma()

  return (
    <div className="w-full border-top grid gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {!isSearchActive && currentPoolType.name != POOL_TYPE.migrate.name && (
        <MigrateCard />
      )}
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
