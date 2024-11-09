import { useEffect, useMemo } from 'react'
import React, { FC } from 'react'
import MigrateNotConnected from '@/pages/FarmV4/MigrateNotConnected'
import MigratePositionCard from '@/pages/FarmV4/MigratePositionCard'
import { useLPMigratePositions } from '@/context/lp_migrate_positions'

const FarmItemsMigrate: FC = () => {
  const { lpPositions } = useLPMigratePositions()

  useEffect(() => {
    console.log('FARM ITEMS MIGRATE',lpPositions)
  }, [lpPositions])

  const positionsBySource: Record<string, MigratePosition[]> = useMemo(() => {
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

  const renderLPSource = (sources: string[]): string[] =>
    sources.map((source: string) => {
      if (source === 'RaydiumCLMM') return '/img/crypto/raydium.svg'
      if (source === 'OrcaCLMM') return '/img/crypto/ORCA.svg'
      if (source === 'MeteoraCLMM') return '/img/crypto/meteora.svg'
    })

  if (Object.keys(positionsBySource).length === 0)
    return <MigrateNotConnected noPositions={false} />

  return (
    <div className={'grid gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}>
      {Object.keys(positionsBySource).map((posKey: string) => (
        <MigratePositionCard
          key={posKey}
          position={positionsBySource[posKey][0]}
          positionsOnOtherPrograms={renderLPSource(positionsBySource[posKey].map((pos) => pos.source))}
          apr={95}
        />
      ))}
    </div>
  )
}

export default FarmItemsMigrate
