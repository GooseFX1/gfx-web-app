import React, { FC, useCallback } from 'react'
import { Button, cn, Tooltip, TooltipContent, TooltipTrigger } from 'gfx-component-lib'
import { CircularArrow } from '@/components/common/Arrow'
import useBreakPoint from '@/hooks/useBreakPoint'

const FarmRowItem: FC<{
  title: string
  onClick: () => void
  className?: string
  invert?: boolean
  tooltip?: React.ReactNode
}> = ({ title, onClick, className, invert, tooltip }) => {
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
const FarmFilter: FC<{
  sort: string
  sortType: string
  handleColumnSort: (s: string) => void
  poolSize: number
}> = ({ sort, sortType, handleColumnSort, poolSize }) => {
  const { isMobile, isTablet } = useBreakPoint()
  const handleSort = useCallback((col: string) => () => handleColumnSort(col), [handleColumnSort])
  return (
    <div
      className={cn(
        `grid grid-cols-7 border-b-1 border-solid border-border-lightmode-secondary 
      dark:border-border-darkmode-secondary h-10 px-2 items-center`,
        isMobile && `grid-cols-3`,
        isTablet && `grid-cols-4`
      )}
    >
      <FarmRowItem
        title={'Pool'}
        onClick={handleSort('token')}
        className={'justify-start'}
        invert={sort == 'DESC' && sortType == 'token'}
      />
      <FarmRowItem
        title={'APY'}
        tooltip={'APY is calculated on a rolling 3 day basis based on TVL/Fees. See FAQ below for more info'}
        onClick={handleSort('apy')}
        invert={sort == 'DESC' && sortType == 'apy'}
      />
      {!isMobile && (
        <>
          {!isTablet && (
            <>
              <FarmRowItem
                title={'Liquidity'}
                onClick={handleSort('liquidity')}
                invert={sort == 'DESC' && sortType == 'liquidity'}
              />
              <FarmRowItem
                title={'24H Volume'}
                tooltip={'24H Volume is calculated since 10P.M UTC on a daily basis'}
                onClick={handleSort('volume')}
                invert={sort == 'DESC' && sortType == 'volume'}
              />
              <FarmRowItem
                title={'24H Fees'}
                onClick={handleSort('fee')}
                invert={sort == 'DESC' && sortType == 'fee'}
              />
            </>
          )}
          <FarmRowItem
            title={'My Balance'}
            tooltip={'Values are displayed in native token'}
            onClick={handleSort('balance')}
            invert={sort == 'DESC' && sortType == 'balance'}
          />
        </>
      )}
      <h4 className={'text-end self-center text-text-lightmode-secondary dark:text-text-darkmode-secondary'}>
        Pools: {poolSize}
      </h4>
    </div>
  )
}

export default FarmFilter
