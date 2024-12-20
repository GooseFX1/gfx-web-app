import React, { FC } from 'react'
import { Button, cn, Tooltip, TooltipContent, TooltipTrigger } from 'gfx-component-lib'
import { CircularArrow } from '@/components/common/Arrow'
import useBreakPoint from '@/hooks/useBreakPoint'
import { useGamma } from '@/context'

const FarmRowItem: FC<{
  title: string
  onClick?: () => void
  className?: string
  invert?: boolean
  tooltip?: React.ReactNode
  canSort?: boolean
}> = ({ title, className, invert, onClick, tooltip, canSort = true }) => {
  const Comp = (
    <Button
      variant={'default'}
      onClick={onClick}
      className={cn(
        `justify-center p-0 break-words text-h4 text-text-lightmode-secondary
      dark:text-text-darkmode-secondary font-semibold font-nunito
    `,
        className
      )}
      iconRight={canSort ? <CircularArrow className={`min-h-5 min-w-5`} invert={invert} /> : undefined}
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
const FarmItemsProSort: FC = () => {
  // const { userCache, updateUserCache } = useConnectionConfig()
  const { isMobile, isTablet, isDesktop } = useBreakPoint()
  const { currentSort, handlePoolSort, computedViewRange } = useGamma()

  return (
    <div
      className={cn(
        `grid grid-flow-col grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1fr_0.5fr] border-b-1 border-solid
        border-border-lightmode-secondary dark:border-border-darkmode-secondary h-10 px-2 items-center
        sm-lg:grid-cols-[1.1fr_0.85fr_0.85fr] mb-3.75`,
        isMobile && `grid-cols-[1.1fr_0.85fr_0.85fr]`,
        isTablet && `grid-cols-[1.5fr_0.75fr_0.75fr_0.75fr_0.5fr]`
      )}
    >
      <FarmRowItem title={'Name'} className={'justify-start'} canSort={false} />
      {!isMobile && (
        <FarmRowItem
          title={'Liquidity'}
          onClick={() => handlePoolSort(currentSort === '1' ? '2' : '1')}
          invert={currentSort == '1'}
          className={'sm-lg:hidden'}
        />
      )}
      {isDesktop &&
        <FarmRowItem
          title={'Fee Tier'}
          canSort={false}
        />
      }
      <FarmRowItem
        title={`${computedViewRange} Volume`}
        tooltip={`${computedViewRange} Volume is reset daily at 10PM UTC`}
        onClick={() => handlePoolSort(currentSort === '3' ? '4' : '3')}
        invert={currentSort == '3'}
      />
      {isDesktop &&
        <FarmRowItem title={`${computedViewRange} Fees`}
          onClick={() => handlePoolSort(currentSort === '5' ? '6' : '5')}
          invert={currentSort == '5'}
        />
      }
      <FarmRowItem
        title={`${computedViewRange} APR`}
        tooltip={'Values are displayed in native token'}
        onClick={() => handlePoolSort(currentSort === '7' ? '8' : '7')}
        invert={currentSort == '7'}
      />
      {!isMobile &&
        <FarmRowItem
          title={'Actions'}
          canSort={false}
          className={'sm-lg:hidden'}
        />
      }
    </div>
  )
}

export default FarmItemsProSort
