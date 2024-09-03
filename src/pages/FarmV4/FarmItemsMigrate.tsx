import React, { FC } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import MigrateNotConnected from '@/pages/FarmV4/MigrateNotConnected'
import MigratePositionCard from '@/pages/FarmV4/MigratePositionCard'

type Position = {
  tokenA: Token
  tokenB: Token
}
type Token = {
  name: string
  balance: string
  symbol: string
  src: string
}
const FarmItemsMigrate: FC<{
  openPositionsAcrossPrograms: Position[]
}> = ({
  openPositionsAcrossPrograms
                              }) => {
  const { connected } = useWallet()

  if (!connected || openPositionsAcrossPrograms.length ==0)
    return <MigrateNotConnected noPositions={openPositionsAcrossPrograms.length>0}/>
  return <div className={'grid gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}>
    {openPositionsAcrossPrograms.map((pos)=>
    <MigratePositionCard position={pos} key={pos?.tokenA?.name} positionsOnOtherPrograms={[
      '/img/crypto/ORCA.svg',
      '/img/crypto/raydium.svg',
      '/img/crypto/meteora.svg'
    ]} apr={95}/>
    )}
  </div>
}

export default FarmItemsMigrate