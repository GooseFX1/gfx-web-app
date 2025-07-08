import { FC, ReactElement, useEffect, useMemo, useState } from 'react'
import { Badge, Tooltip, TooltipContent, TooltipTrigger } from 'gfx-component-lib'
import { GAMMAPool } from '@/types/gamma'
import { numberFormatter } from '@/utils'
import BigNumber from 'bignumber.js'
import { fetchTokensByPublicKey } from '@/api/gamma'
import { getPoolValuesByRange } from '@/pages/FarmV4/FarmRow'
import { useBoostedRewards } from '@/context/boostedRewardsContext'
import { PublicKey } from '@solana/web3.js'
import { useGamma } from '@/context'
import { useKamino } from '@/context/kaminoContext'

export const PoolStats: FC<{ pool: GAMMAPool }> = ({ pool }): ReactElement => {
  if (!pool.mintA || !pool.mintB) return <></>
  const { viewRange } = useGamma()
  const { getActiveRewardByPoolId } = useBoostedRewards()
  const { apyForPool } = useKamino()
  const poolTVL = useMemo(() => {
    const liquidity = parseFloat(pool.tvl)
    return liquidity ? numberFormatter(Math.max(0, liquidity)) : '0.00'
  }, [pool])
  const dailyVolume = useMemo(
    () => numberFormatter(Math.max(0, pool?.stats?.daily?.volumeTokenAUsd)),
    [pool?.stats?.daily?.volumeTokenAUsd]
  )

  const [fees, setFees] = useState<string>('Loading')

  // --- BEGIN: APR calculation logic copied from FarmRow.tsx ---
  const { tradeAPR } = useMemo(() => getPoolValuesByRange(pool, viewRange), [pool.stats, viewRange])

  const lendingApy = useMemo(
    () => (pool.mintA && pool.mintB ? apyForPool(pool.mintA.address, pool.mintB.address) : []),
    [pool]
  )
  const lendingApySum = useMemo(() => lendingApy.reduce((acc, curr) => acc + curr.apy, 0), [lendingApy])

  const activeReward = useMemo(
    () => getActiveRewardByPoolId(new PublicKey(pool.id)),
    [pool.id, getActiveRewardByPoolId]
  )

  const activeRewardsAmount = useMemo(
    () => activeReward?.reduce((acc, curr) => acc.plus(curr.pricePerDayUsd), new BigNumber(0)),
    [activeReward]
  )

  const activeRewardsApr = useMemo(
    () => activeRewardsAmount.div(pool.tvl).multipliedBy(100).multipliedBy(365),
    [activeRewardsAmount, pool.tvl]
  )

  const apr = useMemo(
    () => numberFormatter(new BigNumber(tradeAPR).plus(lendingApySum).plus(activeRewardsApr).toNumber()),
    [tradeAPR, lendingApySum, activeRewardsApr, numberFormatter]
  )
  // --- END: APR calculation logic copied from FarmRow.tsx ---

  useEffect(() => {
    ;(async () => {
      if (!pool.mintA || !pool.mintB) return
      setFees('Loading')
      const tokenListData = await fetchTokensByPublicKey(`${pool.mintA.address},${pool.mintB.address}`)

      if (!tokenListData.success || tokenListData.data.tokens?.length !== 2) return

      const tokenA =
        tokenListData.data.tokens[0].address === pool.mintA.address
          ? tokenListData.data.tokens[0]
          : tokenListData.data.tokens[1]
      const tokenB =
        tokenListData.data.tokens[0].address === pool.mintA.address
          ? tokenListData.data.tokens[1]
          : tokenListData.data.tokens[0]

      const tokenAfee = new BigNumber(pool.mintA.cumulativeTradeFees)
        .div(10 ** pool.mintA.decimals)
        .multipliedBy(new BigNumber(tokenA.price))
      const tokenBfee = new BigNumber(pool.mintB.cumulativeTradeFees)
        .div(10 ** pool.mintB.decimals)
        .multipliedBy(new BigNumber(tokenB.price))

      const totalFee = tokenAfee.plus(tokenBfee).toNumber()

      setFees(`$${numberFormatter(totalFee)}`)
    })()
  }, [pool])

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
        <Tooltip>
          <TooltipTrigger asChild className={'dark:text-text-darkmode-secondary text-text-lightmode-secondary '}>
            <span
              className={`!text-regular font-semibold dark:text-text-darkmode-secondary
               text-text-lightmode-secondary underline decoration-dotted
                underline-offset-4
              `}
            >
              Total Fees
            </span>
          </TooltipTrigger>
          <TooltipContent>Total fees generated by the pool since creation.</TooltipContent>
        </Tooltip>
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
          <TooltipContent>APR is determined by trade fees or rewards generated on each pool</TooltipContent>
        </Tooltip>
        <Badge variant="default" size={'lg'} className={'to-brand-secondaryGradient-secondary/50'}>
          <span className={'font-poppins font-semibold my-0.5'}>{apr}%</span>
        </Badge>
      </div>
    </>
  )
}
