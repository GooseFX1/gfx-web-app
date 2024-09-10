import React, { FC } from 'react'
import { Button, cn, Container, Icon } from 'gfx-component-lib'
import { POOL_TYPE } from '@/pages/FarmV4/constants'
import { Connect } from '@/layouts'
import { useWallet } from '@solana/wallet-adapter-react'
import { useGamma } from '@/context'

type MigrateCardProps = {
  openPositionsAcrossPrograms: number
  openPositionImages: string[]
}
const MigrateCard: FC<MigrateCardProps> = ({
  openPositionsAcrossPrograms,
  openPositionImages
}) => {
  const { connected } = useWallet()
  const { setCurrentPoolType } = useGamma()
  return (
    <Container className={`flex flex-col flex-1 gap-2.5 p-2.5 bg-background-lightmode-secondary 
    dark:bg-background-darkmode-secondary rounded-[8px] before:rounded-[8px]`}>
      <h3 className={`text-text-lightmode-primary dark:text-text-darkmode-primary`}>
        Boost Your Earnings!
      </h3>
      <p className={`text-b2 text-text-lightmode-secondary dark:text-text-darkmode-secondary`}>
        Easily migrate your open LP positions from other AMMs to our platform to enjoy all the
        GooseFX benefits!
      </p>

      {connected ? <div className={'mt-auto gap-2 flex flex-col'}>
        {openPositionsAcrossPrograms > 0 && <div className={cn(`flex w-full gap-2 relative items-center`
        )}>
          <div className={cn(`flex relative`,
            openPositionImages.length == 1 && `w-[30px]`,
            openPositionImages.length == 2 && `w-[52px]`,
            openPositionImages.length == 3 && `w-[74px]`
          )}>
            {openPositionImages.map((src) =>
              <Icon src={src} key={src} className={`[&:nth-child(2)]:left-1/4 [&:nth-child(2)]:absolute 
                  [&:nth-child(3)]:left-2/4 [&:nth-child(3)]:absolute`} />
            )} </div> <p>{openPositionsAcrossPrograms} Positions</p>
        </div>}
        <Button
          className={`w-max`}
          colorScheme={'blue'}
          onClick={() => setCurrentPoolType(POOL_TYPE?.migrate)}
          disabled={openPositionsAcrossPrograms === 0}
        >
          {openPositionsAcrossPrograms > 0 ? 'Migrate Now' : 'No Open Positions'}
        </Button>
      </div> :
        <Connect customButtonStyle={`mt-auto w-max`} />}
    </Container>
  )
}

export default MigrateCard