import React, { FC } from 'react'
import MigratePositionCard from '@/pages/FarmV4/MigratePositionCard'
import { useLPMigratePositions } from '@/context/lp_migrate_positions'

const FarmItemsMigrate: FC = () => {
  const { positionsByPair } = useLPMigratePositions()

  return positionsByPair && Object.keys(positionsByPair).length > 0 ? (
    <div className={'grid gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}>
      {Object.keys(positionsByPair).map((posKey: string) => (
        <MigratePositionCard key={posKey} positionsByPair={positionsByPair[posKey]} apr={95} />
      ))}
    </div>
  ) : (
    <div>No positions found</div>
  )
}

export default FarmItemsMigrate
