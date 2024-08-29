/* eslint-disable */
import { FC, ReactElement } from 'react'
import { Badge, Tooltip, TooltipContent, TooltipTrigger } from 'gfx-component-lib'

export const PoolStats: FC<{ token: any }> = ({ token }): ReactElement => {
  return (
    <>
      <div className="flex justify-between mb-2">
        <Tooltip>
          <TooltipTrigger asChild className={'dark:text-text-darkmode-secondary text-text-lightmode-secondary '}>
              <span className={`!text-regular font-semibold underline decoration-dotted
                underline-offset-4
              `}>
            Liquidity
          </span>
          </TooltipTrigger>
          <TooltipContent>
            The current liquidity in this pool
          </TooltipContent>
        </Tooltip>
        <span className="!text-regular font-semibold dark:text-grey-8 text-black-4">{token?.liquidity}</span>
      </div>
      <div className="flex justify-between mb-2">
        <span className={`!text-regular font-semibold dark:text-text-darkmode-secondary
               text-text-lightmode-secondary
              `}>
            Volume
          </span>
        <span className="!text-regular font-semibold dark:text-grey-8 text-black-4">{token?.volume}</span>
      </div>
      <div className="flex justify-between mb-2">
        <span className={`!text-regular font-semibold dark:text-text-darkmode-secondary
               text-text-lightmode-secondary
              `}>
            Fees
          </span>
        <span className="!text-regular font-semibold dark:text-grey-8 text-black-4">{token?.fees}</span>
      </div>
      <div className="flex justify-between mb-2">
        <Tooltip>
        <TooltipTrigger asChild className={'dark:text-text-darkmode-secondary text-text-lightmode-secondary '}>
              <span className={`!text-regular font-semibold dark:text-text-darkmode-secondary
               text-text-lightmode-secondary underline decoration-dotted
                underline-offset-4
              `}>
            APR
          </span>
          <div>
            <Badge variant="default" size={'lg'} className={'to-brand-secondaryGradient-secondary/50'}>
              <span className={'font-poppins font-semibold my-0.5'}>{token?.apr}%</span>
            </Badge>
          </div>
        </div>
      </div>
    </>
  )
}