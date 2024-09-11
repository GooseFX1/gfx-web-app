import { FC } from 'react'
import { POOL_TYPE } from '@/pages/FarmV4/constants'
import MigrateCard from '@/pages/FarmV4/MigrateCard'
import FarmCard from '@/pages/FarmV4/FarmCard'
import { useGamma } from '@/context'
import { GAMMAPool } from '@/types/gamma'

const FarmItemsLite: FC<{
  openPositionImages: string[]
  openPositionsAcrossPrograms: number
  poolsToRender: GAMMAPool[]
}> = ({ openPositionImages, openPositionsAcrossPrograms, poolsToRender }) => {
  const { currentPoolType, isSearchActive } = useGamma()
  return (
    <div className="border-top grid gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {!isSearchActive && currentPoolType.name != POOL_TYPE.migrate.name && (
        <MigrateCard
          openPositionImages={openPositionImages}
          openPositionsAcrossPrograms={openPositionsAcrossPrograms}
        />
      )}
      {poolsToRender.map((token,i) => <FarmCard
        token={token} key={`${token?.mintA.name}-${token?.mintB.name}-${i}`} />)}

    </div>
  )
}

export default FarmItemsLite
