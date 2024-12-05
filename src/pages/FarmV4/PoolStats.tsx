import { FC, ReactElement, useEffect, useMemo, useState } from 'react'
import { Badge, Tooltip, TooltipContent, TooltipTrigger } from 'gfx-component-lib'
import { GAMMAPool } from '@/types/gamma'
import { numberFormatter } from '@/utils'
import BigNumber from 'bignumber.js'
import { fetchTokenList } from '@/api/gamma'

export const PoolStats: FC<{ pool: GAMMAPool; updatedPoolState: any }> = ({
  pool,
  updatedPoolState
}): ReactElement => {
  const poolTVL = useMemo(() => {
    const liquidity = parseFloat(pool.tvl)
    return liquidity ? numberFormatter(liquidity) : '0.00'
  }, [pool])
  const dailyVolume = useMemo(
    () => numberFormatter(pool?.stats?.daily?.volumeTokenAUSD + pool?.stats?.daily?.volumeTokenBUSD),
    [pool?.stats?.daily?.volumeTokenAUSD, pool?.stats?.daily?.volumeTokenBUSD]
  )

  const [fees, setFees] = useState<string>('Loading')

  const dailyAPR = useMemo(() => numberFormatter(pool?.stats?.daily?.feesAprUSD), [pool?.stats?.daily?.feesAprUSD])

  useEffect(() => {
    ;(async () => {
      if (
        !pool.mintA ||
        !pool.mintB ||
        !updatedPoolState?.comulativeTradeFeesToken0 ||
        !updatedPoolState?.comulativeTradeFeesToken1
      )
        return
      setFees('Loading')
      const tokenAData = await fetchTokenList(1, 1, undefined, pool.mintA.address)
      const tokenBData = await fetchTokenList(1, 1, undefined, pool.mintB.address)

      if (
        !tokenAData.success ||
        !tokenAData.data.tokens?.[0] ||
        !tokenBData.success ||
        !tokenBData.data.tokens?.[0]
      )
        return

      const tokenA = tokenAData.data.tokens[0]
      const tokenB = tokenBData.data.tokens[0]

      const tokenAfee = new BigNumber(updatedPoolState.comulativeTradeFeesToken0)
        .div(10**pool.mintA.decimals)
        .multipliedBy(new BigNumber(tokenA.price))
      const tokenBfee = new BigNumber(updatedPoolState.comulativeTradeFeesToken1)
        .div(10**pool.mintB.decimals)
        .multipliedBy(new BigNumber(tokenB.price))

      const totalFee = tokenAfee.plus(tokenBfee).toNumber()

      setFees(`$${numberFormatter(totalFee)}`)
    })()
  }, [pool, updatedPoolState?.comulativeTradeFeesToken0, updatedPoolState?.comulativeTradeFeesToken1])

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
        <span className="!text-regular font-semibold dark:text-grey-8 text-black-4">{fees}</span>
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
