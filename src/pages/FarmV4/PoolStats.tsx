/* eslint-disable */
import { FC, ReactElement, useMemo } from 'react'
import { Badge, Tooltip, TooltipContent, TooltipTrigger } from 'gfx-component-lib'
import { GAMMAPool } from '@/types/gamma'
import { numberFormatter } from '@/utils'

export const PoolStats: FC<{ pool: GAMMAPool }> = ({ pool }): ReactElement => {
  const poolTVL = useMemo(() => {
    const liquidity = parseFloat(pool.tvl)
    return (liquidity ? numberFormatter(liquidity) : '0.00')
  }, [pool])
  const dailyVolume = useMemo(
    () => numberFormatter(pool.stats.daily.volumeTokenAUSD + pool.stats.daily.volumeTokenBUSD),
    [pool.stats.daily.volumeTokenAUSD, pool.stats.daily.volumeTokenBUSD]
  )
  const dailyFees = useMemo(() => numberFormatter(pool.stats.daily.tradeFeesUSD), [pool.stats.daily.tradeFeesUSD])
  const dailyAPR = useMemo(() => numberFormatter(pool.stats.daily.feesAprUSD), [pool.stats.daily.feesAprUSD])

  return (
    <>
      <div className="flex justify-between mb-2">
        <Tooltip>
          <TooltipTrigger asChild className={'dark:text-text-darkmode-secondary text-text-lightmode-secondary '}>
            <span
              className={`!text-regular font-semibold underline decoration-dotted
                underline-offset-4
              `}
            >
              Liquidity
            </span>
          </TooltipTrigger>
          <TooltipContent>The current liquidity in this pool</TooltipContent>
        </Tooltip>
        <span className="!text-regular font-semibold dark:text-grey-8 text-black-4">${poolTVL}</span>
      </div>
      <div className="flex justify-between mb-2">
        <span
          className={`!text-regular font-semibold dark:text-text-darkmode-secondary
               text-text-lightmode-secondary
              `}
        >
          Volume
        </span>
        <span className="!text-regular font-semibold dark:text-grey-8 text-black-4">${dailyVolume}</span>
      </div>
      <div className="flex justify-between mb-2">
        <span
          className={`!text-regular font-semibold dark:text-text-darkmode-secondary
               text-text-lightmode-secondary
              `}
        >
          Fees
        </span>
        <span className="!text-regular font-semibold dark:text-grey-8 text-black-4">${dailyFees}</span>
      </div>
      <div className="flex justify-between mb-2">
        <Tooltip>
          <TooltipTrigger asChild className={'dark:text-text-darkmode-secondary text-text-lightmode-secondary '}>
            <span
              className={`!text-regular font-semibold dark:text-text-darkmode-secondary
               text-text-lightmode-secondary underline decoration-dotted
                underline-offset-4
              `}
            >
              APR
            </span>
          </TooltipTrigger>
          <TooltipContent>This is the yield generated on a 24H basis annualized</TooltipContent>
        </Tooltip>
        <Badge variant="default" size={'lg'} className={'to-brand-secondaryGradient-secondary/50'}>
          <span className={'font-poppins font-semibold my-0.5'}>{dailyAPR}%</span>
        </Badge>
      </div>
    </>
  )
}
