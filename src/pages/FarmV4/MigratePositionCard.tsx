import { FC, useState, useMemo } from 'react'
import { Badge, Button, cn, Container, Icon } from 'gfx-component-lib'
import { MigratePosition } from '@/context/lp_migrate_positions'
import MigrateDialog from './MigrateDialog'
import { useLPMigratePositions } from '@/context/lp_migrate_positions'

type MigratePositionCardProps = {
  positionsByPair: MigratePosition[]
  apr: string
}
const MigratePositionCard: FC<MigratePositionCardProps> = ({ positionsByPair, apr }) => {
  const [migrateModal, setMigrateModal] = useState<boolean>(false)
  const { lpSources } = useLPMigratePositions()

  const tokenA = useMemo(() => positionsByPair[0].tokenA, [positionsByPair])
  const tokenB = useMemo(() => positionsByPair[0].tokenB, [positionsByPair])

  
  const renderLPSource = (sources: string[]): string[] =>
    sources.map((source: string) => lpSources[source])
    
  const positionsOnOtherPrograms = useMemo(
    () => (positionsByPair ? renderLPSource(positionsByPair.map((pos) => pos.source)) : []),
    [positionsByPair]
  )

  const handleMigrateModal = () => {
    setMigrateModal(true)
  }

  return (
    <div
      className={`
    flex flex-col gap-2.5 border-solid border-1 border-border-lightmode-secondary dark:border-border-darkmode-secondary
    rounded-[8px] p-2.5 bg-white dark:bg-background-darkmode-primary flex-1
    `}
    >
      {migrateModal && <MigrateDialog isOpen={migrateModal} onClose={setMigrateModal} positions={positionsByPair} />}
      <div className={'flex flex-1 gap-7 items-center'}>
        <div className={'relative'}>
          <Icon
            src={tokenA.logoURI}
            size="lg"
            className={'border-solid dark:border-black-2 border-white border-[3px] rounded-full'}
          />
          <Icon
            src={tokenB.logoURI}
            size="lg"
            className={
              'absolute left-2/3 top-0 border-solid dark:border-black-2 border-white border-[3px] rounded-full'
            }
          />
        </div>
        <h3
          className={`
        text-text-lightmode-primary dark:text-text-darkmode-primary
        `}
        >
          {tokenA.symbol} - {tokenB.symbol}
        </h3>
      </div>
      <Container
        className={` p-2.5 pt-0.5
      bg-background-lightmode-primary dark:bg-background-darkmode-primary gap-2`}
      >
        <h3
          className={`bg-gradient-to-r from-brand-secondaryGradient-primary to-brand-secondaryGradient-secondary
        text-transparent leading-normal
        bg-clip-text`}
        >
          Boost Your Earnings!
        </h3>
        <div className={cn('flex items-center gap-2')}>
          <div
            className={cn(
              `relative`,
              positionsOnOtherPrograms.length == 1 && `w-[30px]`,
              positionsOnOtherPrograms.length == 2 && `w-[52px]`,
              positionsOnOtherPrograms.length == 3 && `w-[74px]`
            )}
          >
            {positionsOnOtherPrograms.map((src) => (
              <Icon
                src={src}
                key={src}
                className={`box-content [&:nth-child(2)]:left-1/3 [&:nth-child(2)]:absolute rounded-full
              [&:nth-child(3)]:left-2/3 [&:nth-child(3)]:absolute top-0
           `}
              />
            ))}
          </div>
          <p className={'font-semibold text-text-lightmode-primary dark:text-text-darkmode-primary'}>
            {positionsOnOtherPrograms.length === 1 ? '1 Position' : `${positionsOnOtherPrograms.length} Positions`}
          </p>
        </div>
        <div className={'flex justify-between'}>
          <p
            className={`font-semibold text-b2 underline decoration-current decoration-1 decoration-dashed 
          underline-offset-2 text-text-lightmode-secondary dark:text-text-darkmode-secondary
          `}
          >
            Our APR
          </p>
          <Badge>{apr}%</Badge>
        </div>
      </Container>
      <Button fullWidth colorScheme={'blue'} onClick={() => handleMigrateModal()}>
        Migrate Now
      </Button>
    </div>
  )
}

export default MigratePositionCard
