import React, { FC } from 'react'
import { Button, cn, Tooltip, TooltipContent, TooltipTrigger } from 'gfx-component-lib'
import { CircularArrow } from '@/components/common/Arrow'
import useBreakPoint from '@/hooks/useBreakPoint'
import { useGamma } from '@/context'

const FarmRowItem: FC<{
  title: string | JSX.Element
  onClick?: () => void
  className?: string
  invert?: boolean
  tooltip?: React.ReactNode
  iconRight?: boolean
}> = ({ title, className, invert, tooltip, iconRight, onClick }) => {
  const buttonContent = (
    <>
      {title}
      {iconRight && <CircularArrow className={`min-h-5 min-w-5`} invert={invert} />}
    </>
  )

  if (tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={'default'}
            onClick={onClick}
            className={cn(
              `justify-center p-0 break-words text-h4 text-text-lightmode-secondary
              dark:text-text-darkmode-secondary font-semibold font-nunito no-underline
            `,
              className
            )}
          >
            {buttonContent}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    )
  }

  return (
    <Button
      variant={'default'}
      onClick={onClick}
      className={cn(
        `justify-center p-0 break-words text-h4 text-text-lightmode-secondary
        dark:text-text-darkmode-secondary font-semibold font-nunito
      `,
        className
      )}
    >
      {buttonContent}
    </Button>
  )
}

const MyPositionSortHeader: FC = () => {
  const { isMobile, isTablet, isDesktop } = useBreakPoint()
  const { handlePoolSort, sortConfig } = useGamma()
  const { direction: sort, key: sortType } = sortConfig
  return (
    <div
      className={cn(
        `grid grid-flow-col grid-cols-[1.5fr_1fr_0.5fr_1fr_0.5fr_1fr] border-b-1 border-solid 
          dark:border-border-darkmode-secondary border-border-lightmode-secondary
          h-10 px-2 items-center sm-lg:grid-cols-[1.25fr_0.75fr_0.75fr]`,
        isMobile && `grid-cols-[1.25fr_0.75fr_0.75fr]`,
        isTablet && `grid-cols-[1.5fr_1fr_1fr_0.5fr]`
      )}
    >
      <FarmRowItem
        title={'Name'}
        //onClick={handleSort('token')}
        className={'justify-start'}
        invert={sort == 'DESC' && sortType == 'token'}
        iconRight={false}
      />
      <FarmRowItem
        title={'Position'}
        onClick={() => handlePoolSort(sort == 'ASC' ? '9' : '10')}
        tooltip={'Current deposit in the pool, displayed in approximate USD value.'}
        invert={sort == 'DESC' && sortType == 'position'}
        iconRight={true}
      />
      {isDesktop && (
        <FarmRowItem
          title={'Fee Tier'}
          tooltip={`This is a dynamic fee that can vary between 0.01-10% depending on the token volatility`}
          invert={sort == 'DESC' && sortType == 'fee'}
          onClick={() => handlePoolSort(sort == 'ASC' ? '5' : '6')}
          iconRight={true}
        />
      )}
      {isDesktop && <FarmRowItem title={'Token A/B'} />}
      <FarmRowItem
        title={'APR'}
        tooltip={`APR is determined by trade fees or rewards generated on each pool`}
        onClick={() => handlePoolSort(sort == 'ASC' ? '7' : '8')}
        invert={sort == 'DESC' && sortType == 'apr'}
        iconRight={true}
      />
      {(isTablet || isDesktop) && <FarmRowItem title={'Actions'} iconRight={false} />}
    </div>
  )
}

// <FarmRowItem
//       title={'Pending'}
//       tooltip={'Unclaimed interest generated from your deposits in the pool.'}
//       //onClick={handleSort('balance')}
//       invert={sort == 'DESC' && sortType == 'balance'}
//       iconRight={true}

//   />
//   <FarmRowItem
//       title={'Earned'}
//       tooltip={'Earned is the total amount of claimed interest generated.'}
//       //onClick={handleSort('balance')}
//       invert={sort == 'DESC' && sortType == 'balance'}
//       iconRight={true}

//   /> 

export default MyPositionSortHeader
