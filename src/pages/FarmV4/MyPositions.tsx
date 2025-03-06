import { FC } from 'react'
import { Badge, Button, cn } from 'gfx-component-lib'
import { useDarkMode, useGamma } from '@/context'
import { ModeOfOperation } from './constants'
import { loadIconImage, numberFormatter } from '@/utils'
import NoResultsFound from '@/pages/FarmV4/NoResultsFound'
import { noPoolsFound } from '@/pages/FarmV4/FarmItems'
import { GAMMAPortfolioPool } from '@/types/gamma'
import useBreakPoint from '@/hooks/useBreakPoint'
import { FarmRowLoader } from '@/pages/FarmV4/FarmRow'
import { useWalletBalance } from '@/context/walletBalanceContext'
import { IconWithFallback } from '@/components/common/IconWithFallback'
import BigNumber from 'bignumber.js'
import useUserPortfolioPools from '@/queries/GAMMA/pools/useUserPortfolioPools'
import { getSortKey } from '@/queries/GAMMA/gammaQueries.helpers'


const renderTokenBalance = (p: GAMMAPortfolioPool) => {
  const ratioA = numberFormatter(+p.tokenARatio, 2)
  const ratioB = numberFormatter(+p.tokenBRatio, 2)
  return `${ratioA} / ${ratioB}`
}

const MyPositions: FC<{
  queryPositions: GAMMAPortfolioPool[]
}> = ({queryPositions}) => {
  const {
    setSelectedCard,
    setOpenDepositWithdrawSlider,
    setModeOfOperation,
    isSearchActive,
    showCreatedPools,
    sortConfig
  } = useGamma()

  const { isTablet, isDesktop, isMobile } = useBreakPoint()
  const { mode } = useDarkMode()
  const { base58PublicKey } = useWalletBalance()

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

  return (
    <div className={`flex flex-col gap-[15px] mt-[15px]`}>
      {queryPositions.length > 0 ? (
        queryPositions.map((pool) => (
          <div
            className={cn(
              `grid grid-flow-col grid-cols-[1.5fr_1fr_0.5fr_1fr_0.5fr_1fr] dark:bg-black-2 px-2.5 cursor-pointer
                h-15 border border-solid dark:border-black-4 border-grey-4 bg-white rounded-tiny py-3.75
                sm-lg:grid-cols-[1.25fr_0.75fr_0.75fr]`,
              isMobile && `grid-cols-[1.25fr_0.75fr_0.75fr]`,
              isTablet && `grid-cols-[1.5fr_1fr_1fr_0.5fr]`
            )}
            key={`${pool.id}_${sortConfig.id}`}
            onClick={() => {
              setSelectedCard(pool)
              setOpenDepositWithdrawSlider(true)
              setModeOfOperation(ModeOfOperation.DEPOSIT)
            }}
          >
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
                                    dark:text-grey-8 text-black-4 mr-5"
              >
                {pool.mintA.symbol} - {pool.mintB.symbol}
              </div>
              {pool.poolCreator == base58PublicKey && !isMobile && (
                <Badge size="sm" variant="default" className="h-5.5">
                  Owner
                </Badge>
              )}
            </div>
            {/* position */}
            <div
              className="flex items-center justify-center text-regular
                                font-semibold dark:text-grey-8 text-black-4"
            >
              ${numberFormatter(+pool.currentPositionUSD)}
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
              <Badge variant="default" size={'lg'} className={'to-brand-secondaryGradient-secondary/50'}>
                <span className={'font-poppins font-semibold my-0.5'}>
                  {numberFormatter(Math.max(0, pool.stats.daily.feesAprUSD))}%
                </span>
              </Badge>
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
                    setSelectedCard(pool)
                    setOpenDepositWithdrawSlider(true)
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
                    setSelectedCard(pool)
                    setOpenDepositWithdrawSlider(true)
                    setModeOfOperation(ModeOfOperation.WITHDRAW)
                  }}
                >
                  -
                </Button>
              </div>
            )}
          </div>
        ))
      ) : (
        <NoResultsFound requestPool={false} str={noResultsTitle} subText={noResultsSubText} />
      )}
    </div>
  )
}
const MyPositionItems: FC = () => {
  const { selectedTokens, sortConfig, showDeposited, showCreatedPools, currentPoolType, isPortfolio, viewRange } =
    useGamma()
  const query = useUserPortfolioPools({
    mintA: selectedTokens[0]?.address,
    mintB: selectedTokens[1]?.address,
    poolType: currentPoolType.type,
    sortBy: getSortKey(sortConfig, isPortfolio, viewRange),
    sortDirection: sortConfig.direction.toLowerCase(),
    showCreated: showCreatedPools,
    showDeposited
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

  return <MyPositions queryPositions={query.data.allPages}/>
}
export default MyPositionItems
