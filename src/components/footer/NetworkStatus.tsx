import { FC, useMemo } from 'react'
import { cn, Popover, PopoverContent, PopoverTrigger } from 'gfx-component-lib'
// import { Circle } from '@/components/common/Circle'
import { FooterItem, FooterItemContent } from '@/components/footer/FooterItem'
import { Circle } from '@/components/common/Circle'
import useNetworkStatus from '@/hooks/useNetworkStatus'
const STATUS = {
  CONGESTED: `The Solana network is very busy right now, your transactions might  take longer and sometimes they
   might not go through at all.`,
  DEGRADED: 'The Solana network is degraded, please be careful as most of your transactions might fail.',
  NORMAL: 'The Solana network is running at normal speeds, expect normal to fast transactions.',
  UNKNOWN: 'The Solana network status is unknown, please check back later.'
}
const NetworkStatus: FC = () => {
  const { status } = useNetworkStatus()

  const { networkStatus, textColor, bgColor, description } = useMemo(() => {
    switch (status) {
      case 0:
        return {
          networkStatus: 'Normal',
          textColor: 'text-background-green',
          bgColor: 'bg-background-green',
          description: STATUS.NORMAL
        }
      case 1:
        return {
          networkStatus: 'Degraded',
          textColor: 'text-background-yellow',
          bgColor: 'bg-background-yellow',
          description: STATUS.DEGRADED
        }
      case 2:
        return {
          networkStatus: 'Congested',
          textColor: 'text-background-red',
          bgColor: 'bg-background-red',
          description: STATUS.CONGESTED
        }
      default:
        return {
          networkStatus: 'Unknown',
          textColor: 'text-background-green',
          bgColor: 'bg-background-green',
          description: STATUS.UNKNOWN
        }
    }
  }, [status])
  return (
    <FooterItem title={'Network Status:'}>
      <Popover>
        <PopoverTrigger>
          <FooterItemContent>
            <p className={cn('text-b3 font-bold', textColor)}>{networkStatus}</p>
            <Circle className={bgColor} />
          </FooterItemContent>
        </PopoverTrigger>
        <PopoverContent collisionPadding={15} className={'mb-[15px]'}>
          <div className={'inline-flex items-center gap-1'}>
            <p className={cn('text-b2 font-bold', textColor)}>{networkStatus}</p>
            <Circle className={`bg-background-${status} w-2 h-2`} />
          </div>
          <p
            className={
              'text-justify font-semibold text-text-lightmode-secondary dark:text-text-darkmode-secondary'
            }
          >
            {description}
          </p>
        </PopoverContent>
      </Popover>
    </FooterItem>
  )
}

export default NetworkStatus
