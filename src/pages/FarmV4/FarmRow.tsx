import { FC, useMemo } from 'react'
import {
  Badge,
  Button,
  cn,
  Skeleton,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  Loader,
  loaders,
  Icon
} from 'gfx-component-lib'
import { useDarkMode, useGamma } from '@/context'
import useBreakpoint from '../../hooks/useBreakPoint'
import { GAMMAPoolWithUserLiquidity } from '@/types/gamma'
import { useWalletBalance } from '@/context/walletBalanceContext'
import { loadIconImage, numberFormatter } from '@/utils'
import { IconWithFallback } from '@/components/common/IconWithFallback'
import BigNumber from 'bignumber.js'
import { PublicKey } from '@solana/web3.js'
import { useBoostedRewards } from '@/context/boostedRewardsContext'
import { useKamino } from '@/context/kaminoContext'
type FarmRowProps = {
  pool: GAMMAPoolWithUserLiquidity
  props?: any
  key?: string
}

const FarmRow: FC<FarmRowProps> = ({ pool, ...props }) => {
  const { updateGammaRoute, viewRange } = useGamma()
  const { isMobile, isTablet, isDesktop } = useBreakpoint()
  const { base58PublicKey } = useWalletBalance()
  const { mode } = useDarkMode()
  const { getActiveRewardByPoolId } = useBoostedRewards()
  const { apyForPool } = useKamino()
  const formattedTVL = useMemo(() => {
    const liquidity = parseFloat(pool.tvl)
    return liquidity ? numberFormatter(Math.max(0, liquidity)) : '0.00'
  }, [pool])
  const { formattedVolume, formattedFees, formattedAPR, tradeAPR } = useMemo(
    () => getPoolValuesByRange(pool, viewRange),
    [pool.stats, viewRange]
  )

  const activeReward = getActiveRewardByPoolId(new PublicKey(pool.id))

  const activeRewardsAmount = activeReward?.reduce((acc, curr) => acc.plus(curr.pricePerDayUsd), new BigNumber(0))
  const apr = activeReward
    ? numberFormatter(
        new BigNumber(formattedAPR)
          .plus(activeRewardsAmount.div(pool.tvl).multipliedBy(100).multipliedBy(365).toNumber())
          .toNumber()
      )
    : numberFormatter(formattedAPR)

  const lendingApy = apyForPool(pool)

  return (
    <div
      className={cn(
        `relative grid grid-flow-col grid-cols-[1fr_0.8fr_0.8fr_0.8fr_1fr_1fr_0.5fr] dark:bg-black-2 px-2.5 
      h-15 border border-solid dark:border-black-4 left-2 top-2 
      border-grey-4 bg-white rounded-tiny py-3.75 cursor-pointer w-[99%]
      sm-lg:grid-cols-[1.1fr_0.85fr_0.85fr] overflow-visible mt-2.5`,
        isMobile && `grid-cols-[1.1fr_0.85fr_0.85fr] w-[97%]`,
        isTablet && `grid-cols-[1.5fr_0.75fr_0.75fr_0.75fr_0.5fr]`
      )}
      {...props}
      onClick={() => {
        updateGammaRoute(pool)
      }}
    >
      {pool.poolCreator === base58PublicKey && (
        <Tooltip>
          <TooltipTrigger className="absolute">
            <Icon
              src={`/img/assets/owner-${mode}.svg`}
              alt="pool-owner"
              size={'sm'}
              className="absolute top-[-10px] left-[-6px]"
            />
          </TooltipTrigger>
          <TooltipContent>
            <span>You are the owner of this pool</span>
          </TooltipContent>
        </Tooltip>
      )}
      <div className="flex flex-row items-center">
        <IconWithFallback
          src={loadIconImage(pool.mintA.logoURI, mode)}
          className="border-solid dark:border-black-2 border-white
          border-[2px] rounded-full h-[25px] w-[25px]"
        />
        <IconWithFallback
          src={loadIconImage(pool.mintB.logoURI, mode)}
          className="relative right-[10px] border-solid dark:border-black-2
          border-white border-[2px] rounded-full h-[25px] w-[25px]"
        />
        <div className="font-poppins text-regular font-semibold dark:text-grey-8 text-black-4 max-sm:text-tiny">
          {pool.mintA.symbol} - {pool.mintB.symbol}
        </div>

        {/* {!isMobile &&
          <IconWithFallback src={`img/assets/farm_${pool.pool_type}.svg`} size="sm" className="ml-1.5" />
        } */}
        {activeReward && activeReward.length > 0 && !isMobile && (
          <Icon src={`/img/assets/rewards-icon-${mode}.svg`} alt="claim-rewards" size={'sm'} className="ml-2" />
        )}
      </div>
      {!isMobile && (
        <div
          className="flex items-center justify-center text-regular font-semibold
        dark:text-grey-8 text-black-4 sm-lg:hidden"
        >
          {formattedTVL}
        </div>
      )}
      {isDesktop && (
        <div className="flex flex-row justify-center items-center">
          <div
            className="border border-solid dark:border-black-4 flex items-center w-[50px]
                font-poppins text-tiny font-semibold dark:text-grey-8 text-black-4 justify-center
                border-grey-1 bg-grey-5 dark:bg-black-2 rounded-[2.5px] h-[30px] p-2"
          >
            {(
              new BigNumber(pool?.latestDynamicFeeRate || 0.0).div(10 ** 4).toNumber() ||
              new BigNumber(pool?.config.tradeFeeRate || 0.0).div(10 ** 4).toNumber()
            ).toFixed(2)}
            %
          </div>
        </div>
      )}
      <div className="flex items-center justify-center text-regular font-semibold dark:text-grey-8 text-black-4">
        {formattedVolume}
      </div>
      {isDesktop && (
        <div className="flex items-center justify-center text-regular font-semibold dark:text-grey-8 text-black-4">
          {formattedFees}
        </div>
      )}
      <Tooltip>
        <TooltipTrigger className="no-underline !cursor-default">
          <div className="flex items-center justify-center max-sm:justify-end sm-lg:justify-end">
            <Badge
              variant="default"
              size={'lg'}
              className={'to-brand-secondaryGradient-secondary/50 min-w-[60px]'}
            >
              <span className={'font-poppins font-semibold my-0.5 m-auto'}>{apr}%</span>
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent className="w-[266px] max-w-[266px] p-2">
          <div className="">
            {/* should only show if kaminoUSD is greater than 0 or activeReward */}
            {lendingApy.length > 0 || activeReward ? (
              <div className="flex flex-row justify-between mb-3">
                <span className="font-poppins font-semibold text-[13px]">Trade APR</span>
                <span className="font-display font-semibold text-[13px]">{tradeAPR}%</span>
              </div>
            ) : null}

            {lendingApy.length > 0 && !isMobile && (
              <div>
                <h2 className="text-[10px] text-primary-gradient">Kamino APY</h2>

                {lendingApy.map(
                  ({ apy, token }, index) =>
                    apy > 0 && (
                      <div key={`${token.symbol}-${index}`} className="flex flex-row items-center mb-3">
                        <IconWithFallback
                          src={loadIconImage(token.logoURI, mode)}
                          className="border-solid dark:border-black-2 border-white
                            border-[2px] rounded-full h-5 w-5"
                        />
                        <span className="font-poppins font-semibold text-[15px]">{token.symbol}</span>
                        <span className="font-display font-semibold text-[15px] ml-auto">
                          {numberFormatter(apy)}%
                        </span>
                      </div>
                    )
                )}
              </div>
            )}

            {activeReward && activeReward.length > 0 && !isMobile && (
              <div>
                <h2 className="text-[10px] text-primary-gradient">Boosted Rewards</h2>

                {activeReward.map((reward, index) => (
                  <div key={`${reward.token.symbol}-${index}`} className="flex flex-row items-center mb-3">
                    <IconWithFallback
                      src={loadIconImage(reward.token.logoURI, mode)}
                      className="border-solid dark:border-black-2 border-white
                            border-[2px] rounded-full h-5 w-5"
                    />
                    <span className="font-poppins font-semibold text-[15px]">{reward.token.symbol}</span>
                    <span className="font-display font-semibold text-[15px] ml-auto">
                      {numberFormatter(
                        reward.pricePerDayUsd.div(pool.tvl).multipliedBy(100).multipliedBy(365).toNumber()
                      )}
                      %
                    </span>
                  </div>
                ))}
              </div>
            )}
            {lendingApy.length > 0 || activeReward ? (
              <div
                className="w-full h-[1px] border-t-1 border-border-lightmode-secondary 
                dark:border-border-darkmode-secondary my-2"
              />
            ) : null}
            <div className="flex flex-row justify-between ">
              <span className="font-poppins font-semibold text-[13px]">Total APR</span>
              <span className="font-display font-semibold text-[13px]">{apr}%</span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
      {(isTablet || isDesktop) && (
        <div className="flex items-center justify-center">
          <Button
            className={cn(`cursor-pointer bg-blue-1 text-white h-[30px]`, pool.hasDeposit && 'w-[30px] h-[30px]')}
            variant={'secondary'}
            onClick={() => {
              updateGammaRoute(pool)
            }}
          >
            {!pool.hasDeposit ? 'Deposit' : '+'}
          </Button>
        </div>
      )}
    </div>
  )
}

export default FarmRow

export const FarmRowLoader: FC = () => {
  const { isMobile, isTablet, isDesktop } = useBreakpoint()
  return (
    <div
      className={cn(
        `grid grid-flow-col grid-cols-[1.5fr_1fr_1fr_1fr_0.5fr] dark:bg-black-2 px-2.5 cursor-pointer
      h-15 border border-solid dark:border-black-4 border-grey-4 bg-white rounded-tiny py-3.75`,
        isMobile && `grid-cols-[1.25fr_0.75fr_0.75fr]`,
        isTablet && `grid-cols-[1.5fr_1fr_1fr_0.5fr]`
      )}
    >
      <div className="flex flex-row items-center">
        <Skeleton
          className={`border-solid dark:border-black-2 border-white
          border-[2px] rounded-full h-[25px] w-[25px]`}
        />
        <Skeleton
          className={`relative right-[10px] border-solid dark:border-black-2
          border-white border-[2px] rounded-full h-[25px] w-[25px]`}
        />

        <Skeleton className={'w-[100px] h-[25px] rounded-[2px]'} />
      </div>
      <Skeleton className={'w-[100px] h-[25px] rounded-[2px] inline-flex m-auto'} />

      {(isTablet || isDesktop) && <Skeleton className={'w-[100px] h-[25px] rounded-[2px] inline-flex m-auto'} />}
      {isDesktop && <Skeleton className={'w-[100px] h-[25px] rounded-[2px] inline-flex m-auto'} />}
      {(isTablet || isDesktop) && <Skeleton className={'w-[100px] h-[25px] rounded-[2px] inline-flex m-auto'} />}
    </div>
  )
}

export const FarmRowLoaderText: FC = () => (
  <div className="flex flex-row items-center justify-center">
    <Loader animationData={loaders.loader_generic} className={'w-15 h-15'} />
    <span className="font-bold text-regular dark:text-grey-8 text-black-4">Loading more...</span>
  </div>
)

export const getPoolValuesByRange = (pool, viewRange) => {
  if (!pool.stats) {
    return {
      formattedVolume: '0.00',
      formattedFees: '0.00',
      formattedAPR: 0,
      tradeAPR: '0.00',
      kaminoAPR: '0.00',
      kaminoUSD: '0.00'
    }
  }
  switch (viewRange) {
    case 0:
      return {
        formattedVolume: numberFormatter(
          Math.max(0, pool.stats.daily.volumeTokenAUsd + pool.stats.daily.volumeTokenBUsd)
        ),
        formattedFees: numberFormatter(Math.max(0, pool.stats.daily.feesUsd)),
        formattedAPR: Math.max(
          0,
          pool.stats.daily.feesAprUsd +
            pool.stats.daily.withdrawnKaminoProfitTokenAAprUsd +
            pool.stats.daily.withdrawnKaminoProfitTokenBAprUsd
        ),
        tradeAPR: numberFormatter(Math.max(0, pool.stats.daily.feesAprUsd)),
        kaminoAPR: numberFormatter(
          Math.max(
            0,
            pool.stats.daily.withdrawnKaminoProfitTokenAAprUsd + pool.stats.daily.withdrawnKaminoProfitTokenBAprUsd
          )
        ),
        kaminoUSD: numberFormatter(
          Math.max(
            0,
            pool.stats.daily.withdrawnKaminoProfitTokenAUsd + pool.stats.daily.withdrawnKaminoProfitTokenBUsd
          )
        )
      }
    case 1:
      return {
        formattedVolume: numberFormatter(
          Math.max(0, pool.stats.weekly.volumeTokenAUsd + pool.stats.weekly.volumeTokenBUsd)
        ),
        formattedFees: numberFormatter(Math.max(0, pool.stats.weekly.feesUsd)),
        formattedAPR: Math.max(
          0,
          pool.stats.weekly.feesAprUsd +
            pool.stats.weekly.withdrawnKaminoProfitTokenAAprUsd +
            pool.stats.weekly.withdrawnKaminoProfitTokenBAprUsd
        ),
        tradeAPR: numberFormatter(Math.max(0, pool.stats.weekly.feesAprUsd)),
        kaminoAPR: numberFormatter(
          Math.max(
            0,
            pool.stats.weekly.withdrawnKaminoProfitTokenAAprUsd +
              pool.stats.weekly.withdrawnKaminoProfitTokenBAprUsd
          )
        ),
        kaminoUSD: numberFormatter(
          Math.max(
            0,
            pool.stats.weekly.withdrawnKaminoProfitTokenAUsd + pool.stats.weekly.withdrawnKaminoProfitTokenBUsd
          )
        )
      }
    case 2:
      return {
        formattedVolume: numberFormatter(
          Math.max(0, pool.stats.monthly.volumeTokenAUsd + pool.stats.monthly.volumeTokenBUsd)
        ),
        formattedFees: numberFormatter(Math.max(0, pool.stats.monthly.feesUsd)),
        formattedAPR: Math.max(
          0,
          pool.stats.monthly.feesAprUsd +
            pool.stats.monthly.withdrawnKaminoProfitTokenAAprUsd +
            pool.stats.monthly.withdrawnKaminoProfitTokenBAprUsd
        ),
        tradeAPR: numberFormatter(Math.max(0, pool.stats.monthly.feesAprUsd)),
        kaminoAPR: numberFormatter(
          Math.max(
            0,
            pool.stats.monthly.withdrawnKaminoProfitTokenAAprUsd +
              pool.stats.monthly.withdrawnKaminoProfitTokenBAprUsd
          )
        ),
        kaminoUSD: numberFormatter(
          Math.max(
            0,
            pool.stats.monthly.withdrawnKaminoProfitTokenAUsd + pool.stats.monthly.withdrawnKaminoProfitTokenBUsd
          )
        )
      }
  }
}
