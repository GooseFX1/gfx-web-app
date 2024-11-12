import { useEffect, useMemo } from 'react'
import React, { FC } from 'react'
import MigratePositionCard from '@/pages/FarmV4/MigratePositionCard'
import { useLPMigratePositions } from '@/context/lp_migrate_positions'

const FarmItemsMigrate: FC = () => {
  const { lpPositions } = useLPMigratePositions()

  useEffect(() => {
    console.log('FARM ITEMS MIGRATE',lpPositions)
  }, [lpPositions])

  const positionsByPair: Record<string, MigratePosition[]> = useMemo(() => {
    if (lpPositions === null || lpPositions.length === 0) return {}
    return lpPositions.reduce((acc, pos) => {
      const { tokenA, tokenB } = pos;
      const key = `${tokenA.address}-${tokenB.address}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(pos);
      return acc;
    }, {});
  }, [lpPositions]);

  return lpPositions && lpPositions.length > 0 ? (
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
