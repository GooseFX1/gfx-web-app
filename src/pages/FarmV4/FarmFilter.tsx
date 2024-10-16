import React, { FC, useCallback } from 'react'
import { Button, cn, Tooltip, TooltipContent, TooltipTrigger } from 'gfx-component-lib'
import { CircularArrow } from '@/components/common/Arrow'
import useBreakPoint from '@/hooks/useBreakPoint'
import { useGamma } from '@/context'

const FarmRowItem: FC<{
  title: string
  onClick: () => void
  className?: string
  invert?: boolean
  tooltip?: React.ReactNode
}> = ({ title, className, invert, onClick, tooltip }) => {
  const Comp = (
    <Button
      variant={'default'}
      onClick={onClick}
      className={cn(
        `justify-center p-0 break-words text-h4 text-text-lightmode-secondary
      dark:text-text-darkmode-secondary
    `,
        className
      )}
      iconRight={<CircularArrow className={`min-h-5 min-w-5`} invert={invert} />}
    >
      {title}
    </Button>
  )
  return tooltip ? (
    <Tooltip>
      <TooltipTrigger>{Comp}</TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  ) : (
    Comp
  )
}
const FarmFilter: FC = () => {
  // const { userCache, updateUserCache } = useConnectionConfig()
  const { isMobile, isTablet, isDesktop } = useBreakPoint()
  const { currentSort, setCurrentSort } = useGamma()

  const handleColumnSort = useCallback(
    (id: string) => 
      // TODO: reinstate this
      // persists current sort in local storage
      // setCurrentSort(id)
      // setCurrentSort(() => {
      //   updateUserCache({
      //     gamma: {
      //       ...userCache.gamma,
      //       currentSort: id
      //     }
      //   })
      //   // sets value to context
      //   return id
      // })

      id
    ,
    [setCurrentSort]
  )

  return (
    <div
      className={cn(
        `grid grid-flow-col grid-cols-[1.5fr_1fr_1fr_1fr_0.5fr] border-b-1 border-solid 
        border-border-lightmode-secondary dark:border-border-darkmode-secondary h-10 px-2 items-center`,
        isMobile && `grid-cols-[1.5fr_0.5fr]`,
        isTablet && `grid-cols-[1.5fr_1fr_1fr_0.5fr]`
      )}
    >
      <FarmRowItem title={'Name'} onClick={handleColumnSort('1')} className={'justify-start'} invert={false} />
      <FarmRowItem
        title={'Liquidity'}
        onClick={handleColumnSort(currentSort === '1' ? '2' : '1')}
        invert={currentSort == '1'}
      />
      {(isTablet || isDesktop) && (
        <FarmRowItem
          title={'24H Volume'}
          tooltip={'24H Volume is reset daily at 10PM UTC'}
          onClick={handleColumnSort(currentSort === '3' ? '4' : '3')}
          invert={currentSort == '3'}
        />
      )}
      {isDesktop && <FarmRowItem title={'24H Fees'} onClick={handleColumnSort('5')} invert={currentSort == '5'} />}
      {(isTablet || isDesktop) && (
        <FarmRowItem
          title={'24H APR'}
          tooltip={'Values are displayed in native token'}
          onClick={handleColumnSort(currentSort === '7' ? '8' : '7')}
          invert={currentSort == '7'}
        />
      )}
    </div>
  )
}

export default FarmFilter
