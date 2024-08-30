/* eslint-disable */

import React, { FC } from 'react'
import { Badge, Button, cn, Container, Icon } from 'gfx-component-lib'

type MigratePositionCardProps = {
  //TODO: type this
  position: any
  positionsOnOtherPrograms: string[]
  apr: number
}
const MigratePositionCard: FC<MigratePositionCardProps> = ({ position,positionsOnOtherPrograms, apr }) => {

  return (
    <div className={`
    flex flex-col gap-2.5 border-solid border-1 border-border-lightmode-secondary dark:border-border-darkmode-secondary
    rounded-[8px] p-2.5 bg-white dark:bg-background-darkmode-primary flex-1
    `}>
      <div className={'flex flex-1 gap-7 items-center'}>
        <div className={'relative'}>
          <Icon src={position.tokenA.src} />
          <Icon
            className={'absolute left-2/3 top-0'}
            src={position.tokenB.src}
          />
        </div>
        <h3 className={`
        text-text-lightmode-primary dark:text-text-darkmode-primary
        `}
        >{position.tokenA.name} - {position.tokenB.name}</h3>
      </div>
      <Container className={`
      bg-background-lightmode-primary dark:bg-background-darkmode-primary gap-2`}>
        <h3 className={`bg-gradient-to-r from-brand-secondaryGradient-primary to-brand-secondaryGradient-secondary
         inline-block text-transparent 
        bg-clip-text`}>
          Boost Your Earnings!
        </h3>
        <div className={cn('flex items-center gap-2'
        )}>
          <div className={cn(`relative`,
            positionsOnOtherPrograms.length == 1 && `w-[30px]`,
            positionsOnOtherPrograms.length == 2 && `w-[52px]`,
            positionsOnOtherPrograms.length == 3 && `w-[74px]`,
          )}>
            {positionsOnOtherPrograms.map((src) => (
              <Icon src={src} className={`box-content [&:nth-child(2)]:left-1/3 [&:nth-child(2)]:absolute rounded-full
              [&:nth-child(3)]:left-2/3 [&:nth-child(3)]:absolute top-0
           `} />
            ))}
          </div>
          <p className={'font-semibold text-text-lightmode-primary dark:text-text-darkmode-primary'}>
            {positionsOnOtherPrograms.length + 1} Positions
          </p>
        </div>
        <div className={'flex justify-between'}>
          <p className={`font-semibold text-b2 underline decoration-current decoration-1 decoration-dashed 
          underline-offset-2 text-text-lightmode-secondary dark:text-text-darkmode-secondary
          `}>
            Our APR
          </p>
          <Badge>
            {apr}%
          </Badge>
        </div>
      </Container>
      <Button
        fullWidth
        colorScheme={'blue'}
      >Migrate Now</Button>
    </div>
  )
}

export default MigratePositionCard