import React, { FC } from 'react'
import { Button, cn, Tooltip, TooltipContent, TooltipTrigger } from 'gfx-component-lib'
import { CircularArrow } from '@/components/common/Arrow'
import useBreakPoint from '@/hooks/useBreakPoint'

const FarmRowItem: FC<{
    title: string | JSX.Element
    //onClick: () => void
    className?: string
    invert?: boolean
    tooltip?: React.ReactNode
    iconRight: boolean
}> = ({ title, className, invert, tooltip, iconRight }) => {
    const Comp = (
        <Button
            variant={'default'}
            //onClick={onClick}
            className={cn(
                `justify-center p-0 break-words text-h4 text-text-lightmode-secondary
      dark:text-text-darkmode-secondary
    `,
                className
            )}
            iconRight={iconRight ? <CircularArrow className={`min-h-5 min-w-5`} invert={invert} /> : <></>}
        >
            <span className={tooltip ? 'underline decoration-dotted' : ''}>{title}</span>
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

const PositionHeader: FC<{
    sort: string
    sortType: string
}> = ({ sort, sortType }) => {
    const { isMobile, isTablet } = useBreakPoint()
    return (
        <div
            className={cn(
                `grid grid-cols-8 border-b-1 border-solid border-border-lightmode-secondary 
      dark:border-border-darkmode-secondary h-10 px-2 items-center`,
                isMobile && `grid-cols-3`,
                isTablet && `grid-cols-4`
            )}
        >
            <FarmRowItem
                title={'Name'}
                //onClick={handleSort('token')}
                className={'justify-start'}
                invert={sort == 'DESC' && sortType == 'token'}
                iconRight={false}
            />
            {!isMobile && (
                <>
                    {!isTablet && (
                        <>
                            <FarmRowItem
                                title={'Position'}
                                //onClick={handleSort('liquidity')}
                                tooltip={'24H Volume is reset daily at 10PM UTC'}
                                invert={sort == 'DESC' && sortType == 'liquidity'}
                                iconRight={true}
                            />
                            <FarmRowItem
                                title={'Fee Tier'}
                                tooltip={'24H Volume is reset daily at 10PM UTC'}
                                //onClick={handleSort('volume')}
                                invert={sort == 'DESC' && sortType == 'volume'}
                                iconRight={true}

                            />
                            <FarmRowItem
                                title={'Token A/B'}
                                //onClick={handleSort('fee')}
                                tooltip={'24H Volume is reset daily at 10PM UTC'}
                                invert={sort == 'DESC' && sortType == 'fee'}
                                iconRight={false}
                            />
                        </>
                    )}
                    <FarmRowItem
                        title={'Pending'}
                        tooltip={'Values are displayed in native token'}
                        //onClick={handleSort('balance')}
                        invert={sort == 'DESC' && sortType == 'balance'}
                        iconRight={true}

                    />
                    <FarmRowItem
                        title={'Earned'}
                        tooltip={'Values are displayed in native token'}
                        //onClick={handleSort('balance')}
                        invert={sort == 'DESC' && sortType == 'balance'}
                        iconRight={true}

                    />
                    <FarmRowItem
                        title={'APR'}
                        //onClick={handleSort('balance')}
                        invert={sort == 'DESC' && sortType == 'balance'}
                        iconRight={true}

                    />
                    <FarmRowItem
                        title={'Actions'}
                        //onClick={handleSort('balance')}
                        iconRight={false}
                        className='justify-end'
                    />
                </>
            )}
        </div>
    )
}

export default PositionHeader
