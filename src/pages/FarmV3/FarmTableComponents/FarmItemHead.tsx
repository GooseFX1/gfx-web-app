import React, { FC } from 'react'
import useBreakPoint from '@/hooks/useBreakPoint'
import { AccordionTrigger, cn, Icon, IconTooltip } from 'gfx-component-lib'
import { CircularArrow } from '@/components/common/Arrow'

const FarmItemHead: FC<{
  icon: string
  depositPercentage: number
  canClaim: boolean
  token: React.ReactNode
  tooltip: React.ReactNode
  apy: React.ReactNode
  liquidity: React.ReactNode
  volume: React.ReactNode
  fees: React.ReactNode
  balance: React.ReactNode
}> = ({ icon, depositPercentage, canClaim, token, tooltip, apy, liquidity, volume, fees, balance }) => {
  const { isMobile, isTablet } = useBreakPoint()

  return (
    <AccordionTrigger
      className={cn(`grid grid-cols-7 `, isMobile && `grid-cols-3`, isTablet && `grid-cols-4`)}
      indicator={<></>}
      variant={'secondary'}
    >
      <div className={'flex flex-row items-center gap-2.5'}>
        <div className={'relative'}>
          <Icon src={icon} size={'lg'} />
          {canClaim && <span className={'absolute rounded-full bg-background-red w-3 h-3 top-0 right-0'} />}
        </div>
        <h4 className={'text-start dark:text-text-darkmode-primary text-text-lightmode-primary'}>{token}</h4>
        <IconTooltip
          tooltipType={'outline'}
          tooltipClassName={
            depositPercentage >= 100
              ? 'stroke-background-red dark:stroke-background-red'
              : 'stroke-background-green dark:stroke-background-green'
          }
        >
          {tooltip}
        </IconTooltip>
      </div>
      <h4 className={'text-center dark:text-text-darkmode-primary text-text-lightmode-primary'}>{apy}</h4>
      {!isMobile && (
        <>
          {!isTablet && (
            <>
              <h4 className={'text-center dark:text-text-darkmode-primary text-text-lightmode-primary'}>
                {liquidity}
              </h4>
              <h4 className={'text-center dark:text-text-darkmode-primary text-text-lightmode-primary'}>
                {volume}
              </h4>
              <h4 className={'text-center dark:text-text-darkmode-primary text-text-lightmode-primary'}>{fees}</h4>
            </>
          )}
          <h4 className={'text-center dark:text-text-darkmode-primary text-text-lightmode-primary'}>{balance}</h4>
        </>
      )}
      <div className={'transition-all w-5  ml-auto'}>
        <CircularArrow className={`h-5 w-5`} />
      </div>
    </AccordionTrigger>
  )
}
export default FarmItemHead
