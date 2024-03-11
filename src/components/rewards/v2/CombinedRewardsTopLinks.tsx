import React, { ReactNode } from 'react'
import { useRewardToggle } from '../../../context'
import RewardsClose from '@/assets/rewards_close.svg?react'
import { Button, cn } from 'gfx-component-lib'

interface CombinedRewardsTopLinks {
  containerStyles?: string
  children?: ReactNode | ReactNode[]
}
function CombinedRewardsTopLinks({ containerStyles, children }: CombinedRewardsTopLinks): JSX.Element {
  const { rewardToggle } = useRewardToggle()

  return (
    <div className={cn(`flex gap-4 w-full items-center justify-between `, containerStyles)}>
      <div className={`flex gap-4 w-full items-center justify-between`}>{children}</div>
      <Button
        onClick={() => rewardToggle(false)}
        variant={'ghost'}
        className={`min-md:hidden w-max p-0`}
        size={'sm'}
      >
        <RewardsClose
          className={`h-3 w-3 min-md:h-5 min-md:w-5 stroke-border-lightmode-primary 
          min-md:stroke-border-darkmode-primary min-md:dark:stroke-border-darkmode-primary`}
        />
      </Button>
    </div>
  )
}

export default CombinedRewardsTopLinks
