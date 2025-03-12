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
  loaders
} from 'gfx-component-lib'
import { useDarkMode, useGamma } from '@/context'
import useBreakpoint from '../../hooks/useBreakPoint'
import { GAMMAPoolWithUserLiquidity } from '@/types/gamma'
import { useWalletBalance } from '@/context/walletBalanceContext'
import { loadIconImage, numberFormatter } from '@/utils'
import { IconWithFallback } from '@/components/common/IconWithFallback'
import BigNumber from 'bignumber.js'

type FarmRowProps = {
  pool: GAMMAPoolWithUserLiquidity
  props?: any
  key?: string
}

const FarmRow: FC<FarmRowProps> = ({ pool, ...props }) => {
  const { setSelectedCard, setOpenDepositWithdrawSlider, viewRange } = useGamma()
  const { isMobile, isTablet, isDesktop } = useBreakpoint()
  const { base58PublicKey } = useWalletBalance()
  const { mode } = useDarkMode()

  const formattedTVL = useMemo(() => {
    const liquidity = parseFloat(pool.tvl)
    return liquidity ? numberFormatter(Math.max(0, liquidity)) : '0.00'
  }, [pool])
  const { formattedVolume, formattedFees, formattedAPR, tradeAPR, kaminoAPR } = useMemo(() => {
    if (!pool.stats) {
      return {
        formattedVolume: '0.00',
        formattedFees: '0.00',
        formattedAPR: '0.00',
        tradeAPR: '0.00',
        kaminoAPR: '0.00'
      }
    }
    switch (viewRange) {
      case 0:
        return {
          formattedVolume: numberFormatter(
            Math.max(0, pool.stats.daily.volumeTokenAUSD + pool.stats.daily.volumeTokenBUSD)
          ),
          formattedFees: numberFormatter(Math.max(0, pool.stats.daily.feesUSD)),
          formattedAPR: numberFormatter(
            Math.max(
              0,
              pool.stats.daily.feesAprUSD +
                pool.stats.daily.withdrawnKaminoProfitTokenAUsd +
                pool.stats.daily.withdrawnKaminoProfitTokenBUsd
            )
          ),
          tradeAPR: numberFormatter(Math.max(0, pool.stats.daily.feesAprUSD)),
          kaminoAPR: numberFormatter(
            Math.max(
              0,
              pool.stats.daily.withdrawnKaminoProfitTokenAUsd + pool.stats.daily.withdrawnKaminoProfitTokenBUsd
            )
          )
        }
      case 1:
        return {
          formattedVolume: numberFormatter(
            Math.max(0, pool.stats.weekly.volumeTokenAUSD + pool.stats.weekly.volumeTokenBUSD)
          ),
          formattedFees: numberFormatter(Math.max(0, pool.stats.weekly.feesUSD)),
          formattedAPR: numberFormatter(
            Math.max(
              0,
              pool.stats.weekly.feesAprUSD +
                pool.stats.weekly.withdrawnKaminoProfitTokenAUsd +
                pool.stats.weekly.withdrawnKaminoProfitTokenBUsd
            )
          ),
          tradeAPR: numberFormatter(Math.max(0, pool.stats.weekly.feesAprUSD)),
          kaminoAPR: numberFormatter(
            Math.max(
              0,
              pool.stats.weekly.withdrawnKaminoProfitTokenAUsd + pool.stats.weekly.withdrawnKaminoProfitTokenBUsd
            )
          )
        }
      case 2:
        return {
          formattedVolume: numberFormatter(
            Math.max(0, pool.stats.monthly.volumeTokenAUSD + pool.stats.monthly.volumeTokenBUSD)
          ),
          formattedFees: numberFormatter(Math.max(0, pool.stats.monthly.feesUSD)),
          formattedAPR: numberFormatter(
            Math.max(
              0,
              pool.stats.monthly.feesAprUSD +
                pool.stats.monthly.withdrawnKaminoProfitTokenAUsd +
                pool.stats.monthly.withdrawnKaminoProfitTokenBUsd
            )
          ),
          tradeAPR: numberFormatter(Math.max(0, pool.stats.monthly.feesAprUSD)),
          kaminoAPR: numberFormatter(
            Math.max(
              0,
              pool.stats.monthly.withdrawnKaminoProfitTokenAUsd + pool.stats.monthly.withdrawnKaminoProfitTokenBUsd
            )
          )
        }
    }
  }, [pool.stats, viewRange])

  return (
    <div
      className={cn(
        `grid grid-flow-col grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1fr_0.5fr] dark:bg-black-2 px-2.5 cursor-pointer
      h-15 border border-solid dark:border-black-4 border-grey-4 bg-white rounded-tiny py-3.75
      sm-lg:grid-cols-[1.1fr_0.85fr_0.85fr]`,
        isMobile && `grid-cols-[1.1fr_0.85fr_0.85fr]`,
        isTablet && `grid-cols-[1.5fr_0.75fr_0.75fr_0.75fr_0.5fr]`
      )}
      {...props}
      onClick={() => {
        setSelectedCard(pool)
        setOpenDepositWithdrawSlider(true)
      }}
    >
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
        {pool.poolCreator === base58PublicKey && !isMobile && (
          <Badge size="sm" variant="default" className={'ml-1 h-5.5'}>
            Owner
          </Badge>
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
        <TooltipTrigger className="no-underline">
          <div className="flex items-center justify-center max-sm:justify-end sm-lg:justify-end">
            <Badge variant="default" size={'lg'} className={'to-brand-secondaryGradient-secondary/50'}>
              <span className={'font-poppins font-semibold my-0.5'}>{formattedAPR}%</span>
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex flex-col">
            <div className="flex flex-row justify-between gap-5">
              <div className="flex flex-row gap-1 items-center">
                <img src="/img/mainnav/Icon.svg" alt="kamino" className="w-5 h-5" />
                <span className="font-poppins font-medium my-0.5 text-base">Trade APR</span>
              </div>
              <span className="font-poppins font-normal my-0.5 text-base">{tradeAPR}</span>
            </div>
            <div className="flex flex-row justify-between gap-5">
              <div className="flex flex-row gap-1 items-center">
                <img src="/img/assets/kamino.svg" alt="kamino" className="w-5 h-5" />
                <span className="font-poppins font-medium my-0.5 text-base">Kamino APR</span>
              </div>

              <span className="font-poppins font-normal my-0.5 text-base">{kaminoAPR}</span>
            </div>
            <div className="flex flex-row justify-between gap-5">
              <span className="font-poppins font-medium my-0.5 text-base">Total APR</span>
              <span className="font-poppins font-normal my-0.5 text-base">{formattedAPR}</span>
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
              setSelectedCard(pool)
              setOpenDepositWithdrawSlider(true)
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
