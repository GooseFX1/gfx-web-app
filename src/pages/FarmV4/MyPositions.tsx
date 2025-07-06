import { FC } from 'react'
import { Badge, Button, Icon, Tooltip, TooltipContent, TooltipTrigger, cn } from 'gfx-component-lib'
import { useDarkMode, useGamma } from '@/context'
import { PublicKey } from '@solana/web3.js'
import { ModeOfOperation } from './constants'
import { loadIconImage, numberFormatter } from '@/utils'
import NoResultsFound from '@/pages/FarmV4/NoResultsFound'
import { noPoolsFound } from '@/pages/FarmV4/FarmItems'
import { GAMMAPortfolioPool } from '@/types/gamma'
import useBreakPoint from '@/hooks/useBreakPoint'
import { FarmRowLoader, getPoolValuesByRange } from '@/pages/FarmV4/FarmRow'
import { useWalletBalance } from '@/context/walletBalanceContext'
import { IconWithFallback } from '@/components/common/IconWithFallback'
import BigNumber from 'bignumber.js'
import useUserPortfolioPools from '@/queries/GAMMA/pools/useUserPortfolioPools'
import { getSortKey } from '@/queries/GAMMA/gammaQueries.helpers'
import { useBoostedRewards } from '@/context/boostedRewardsContext'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEY } from '@/queries/query.helper'
import { useKamino } from '@/context/kaminoContext'
import { numberFormatter as mathNumberFormatter } from '@/utils/math'

const renderTokenBalance = (p: GAMMAPortfolioPool) => {
  const ratioA = mathNumberFormatter(p.tokenARatio, 2)
  const ratioB = mathNumberFormatter(p.tokenBRatio, 2)
  return `${ratioA} / ${ratioB}`
}

const MyPositions: FC<{
  queryPositions: GAMMAPortfolioPool[]
}> = ({ queryPositions }) => {
  const { isSearchActive, showCreatedPools } = useGamma()

  const { getActiveRewardByPoolId } = useBoostedRewards()

  let noResultsTitle = ''
  let noResultsSubText = ''
  switch (true) {
    case !isSearchActive && !showCreatedPools:
      noResultsTitle = noPoolsFound.title
      noResultsSubText = noPoolsFound.subText
      break
    case Boolean(isSearchActive) && showCreatedPools:
      noResultsTitle = noPoolsFound.title
      noResultsSubText = noPoolsFound.subText
      break
    case Boolean(isSearchActive) && !showCreatedPools:
      noResultsTitle = noPoolsFound.title
      noResultsSubText = noPoolsFound.subText
      break
    case !isSearchActive && showCreatedPools:
      noResultsTitle = noPoolsFound.title
      noResultsSubText = noPoolsFound.subText
      break
  }

  const poolIds = queryPositions.map((pool) => pool.id)

  const { data: activeRewards } = useQuery({
    queryKey: [QUERY_KEY, 'activeRewards', poolIds],
    queryFn: async () => {
      const results = {}
      for (const poolId of poolIds) {
        if (poolId) {
          results[poolId] = getActiveRewardByPoolId(new PublicKey(poolId))
        }
      }
      return results
    },
    enabled: poolIds.length > 0
  })

  return (
    <div className={`flex flex-col gap-[15px] mt-[15px]`}>
      {queryPositions.length > 0 ? (
        queryPositions.map((pool) => <MyPositionItem key={pool.id} pool={pool} activeRewards={activeRewards} />)
      ) : (
        <NoResultsFound requestPool={false} str={noResultsTitle} subText={noResultsSubText} />
      )}
    </div>
  )
}

const MyPositionItem: FC<{
  pool: GAMMAPortfolioPool
  activeRewards: any
}> = ({ pool, activeRewards }) => {
  const { base58PublicKey } = useWalletBalance()

  const { updateGammaRoute, setModeOfOperation, sortConfig, viewRange } = useGamma()

  const { isTablet, isDesktop, isMobile } = useBreakPoint()
  const { mode } = useDarkMode()

  const { apyForPool } = useKamino()
  const activeReward = activeRewards?.[pool.id]
  const isOwner = base58PublicKey === pool.poolCreator
  const { formattedAPR, tradeAPR } = getPoolValuesByRange(pool, viewRange)

  const activeRewardsAmount = activeReward?.reduce((acc, curr) => acc.plus(curr.pricePerDayUsd), new BigNumber(0))
  const apr = activeReward
    ? mathNumberFormatter(
        new BigNumber(formattedAPR)
          .plus(activeRewardsAmount.div(pool.tvl).multipliedBy(100).multipliedBy(365).toNumber())
          .toNumber()
      )
    : mathNumberFormatter(formattedAPR)

  const lendingApy = apyForPool(pool)

  return (
    <div
      className={cn(
        `relative grid grid-flow-col grid-cols-[1.5fr_1fr_0.5fr_1fr_0.5fr_1fr] dark:bg-black-2 px-2.5 
        cursor-pointer h-15 border border-solid dark:border-black-4 border-grey-4 bg-white 
        rounded-tiny py-3.75 sm-lg:grid-cols-[1.25fr_0.75fr_0.75fr] overflow-visible`,
        isMobile && `grid-cols-[1.25fr_0.75fr_0.75fr]`,
        isTablet && `grid-cols-[1.5fr_1fr_1fr_0.5fr]`
      )}
      key={`${pool.id}_${sortConfig.id}`}
      onClick={() => {
        updateGammaRoute(pool)
        setModeOfOperation(ModeOfOperation.DEPOSIT)
      }}
    >
      {isOwner && (
        <Tooltip>
          <TooltipTrigger className="absolute">
            <Icon
              src={`/img/assets/owner-${mode}.svg`}
              alt="pool-owner"
              size={'sm'}
              className=" absolute top-[-10px] left-[-6px]"
            />
          </TooltipTrigger>
          <TooltipContent>
            <span>You are the owner of this pool</span>
          </TooltipContent>
        </Tooltip>
      )}
      {/* name */}
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
        <div
          className="font-poppins text-regular font-semibold
                              dark:text-grey-8 text-black-4 mr-2"
        >
          {pool.mintA.symbol} - {pool.mintB.symbol}
        </div>
        {activeReward && activeReward.length > 0 && !isMobile && (
          <Icon src={`/img/assets/rewards-icon-${mode}.svg`} alt="claim-rewards" size={'sm'} className="ml-2" />
        )}
      </div>
      {/* position */}
      <div
        className="flex items-center justify-center text-regular
                          font-semibold dark:text-grey-8 text-black-4"
      >
        ${mathNumberFormatter(pool.currentPositionUsd)}
      </div>
      {/* fees */}
      {isDesktop && (
        <div
          className="border border-solid dark:border-black-4 flex items-center
                            font-poppins text-tiny font-semibold dark:text-grey-8 text-black-4 mx-auto
                            border-grey-1 bg-grey-5 dark:bg-black-2 rounded-[2.5px] h-[25px] px-1"
        >
          {(
            new BigNumber(pool?.latestDynamicFeeRate || 0.0).div(10 ** 4).toNumber() ||
            new BigNumber(pool?.config.tradeFeeRate || 0.0).div(10 ** 4).toNumber()
          ).toFixed(2)}
          %
        </div>
      )}
      {/* token balance */}
      {isDesktop && (
        <div
          className="flex items-center justify-center text-black-4
                              text-regular font-semibold dark:text-grey-8"
        >
          {renderTokenBalance(pool)}
        </div>
      )}
      {/* apr */}
      <div className="flex items-center justify-center">
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
                <div className="flex flex-row justify-between mb-2">
                  <span className="font-poppins font-semibold text-[15px]">Trade APR</span>
                  <span className="font-display font-semibold text-[15px]">{tradeAPR}%</span>
                </div>
              ) : null}

              {lendingApy.length > 0 && !isMobile && (
                <div>
                  <h2 className="text-[13px] text-primary-gradient mb-2">Kamino Yield</h2>

                  {lendingApy.map(
                    ({ apy, token }, index) =>
                      apy > 0 && (
                        <div key={`${token.symbol}-${index}`} className="flex flex-row items-center mb-2">
                          <IconWithFallback
                            src={loadIconImage(token.logoURI, mode)}
                            className="border-solid dark:border-black-2 border-white
                            border-[2px] rounded-full h-5 w-5"
                          />
                          <span className="font-poppins font-semibold text-[15px]">{token.symbol}</span>
                          <span className="font-display font-semibold text-[15px] ml-auto">
                            {mathNumberFormatter(apy)}%
                          </span>
                        </div>
                      )
                  )}
                </div>
              )}

              {activeReward && activeReward.length > 0 && (
                <div>
                  <h2 className="text-[13px] text-primary-gradient mb-2">Boosted Rewards</h2>

                  {activeReward.map((reward, index) => (
                    <div key={`${reward.token.symbol}-${index}`} className="flex flex-row items-center mb-2">
                      <IconWithFallback
                        src={loadIconImage(reward.token.logoURI, mode)}
                        className="border-solid dark:border-black-2 border-white
                          border-[2px] rounded-full h-5 w-5"
                      />
                      <span className="font-poppins font-semibold text-[15px]">{reward.token.symbol}</span>
                      <span className="font-display font-semibold text-[15px] ml-auto">
                        {mathNumberFormatter(
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

              <div className="flex flex-row justify-between">
                <span className="font-poppins font-semibold text-[15px]">Total APR</span>
                <span className="font-display font-semibold text-[15px]">{apr}%</span>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* actions */}
      {(isTablet || isDesktop) && (
        <div className="flex items-center justify-center">
          {/* <Button
              className="h-[30px] w-[61px] cursor-pointer flex flex-row
                        justify-center items-center !rounded-[200px]"
              colorScheme={'secondaryGradient'}
              variant={'outline'}
              aria-disabled={!canClaim}
            >
              Claim
            </Button> */}
          <Button
            colorScheme={'blue'}
            className={'h-7.5 w-7.5 mr-4'}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              updateGammaRoute(pool)
              setModeOfOperation(ModeOfOperation.DEPOSIT)
            }}
          >
            +
          </Button>
          <Button
            colorScheme={'blue'}
            className={'h-7.5 w-7.5'}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              updateGammaRoute(pool)
              setModeOfOperation(ModeOfOperation.WITHDRAW)
            }}
          >
            -
          </Button>
        </div>
      )}
    </div>
  )
}

const MyPositionItems: FC = () => {
  const { selectedTokens, sortConfig, showCreatedPools, isPortfolio, viewRange } = useGamma()
  const query = useUserPortfolioPools({
    mintA: selectedTokens[0]?.address,
    mintB: selectedTokens[1]?.address,
    sortBy: getSortKey(sortConfig, isPortfolio, viewRange),
    sortDirection: sortConfig.direction.toLowerCase(),
    showCreated: showCreatedPools,
    enabled: isPortfolio
  })

  if (query.isFetching) {
    return (
      <div className={'flex flex-col gap-[15px] mt-[15px]'}>
        <FarmRowLoader />
        <FarmRowLoader />
        <FarmRowLoader />
        <FarmRowLoader />
      </div>
    )
  }

  return <MyPositions queryPositions={query.data.allPages} />
}
export default MyPositionItems
