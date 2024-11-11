import { FC, useMemo } from 'react'
import { Badge, Button, cn, Icon } from 'gfx-component-lib'
import { useDarkMode, useGamma } from '@/context'
import { ModeOfOperation } from './constants'
import { loadIconImage, numberFormatter } from '@/utils'
import NoResultsFound from '@/pages/FarmV4/NoResultsFound'
import { noPoolsFound } from '@/pages/FarmV4/FarmItems'
import { GAMMAPoolWithUserLiquidity } from '@/types/gamma'
import useBreakPoint from '@/hooks/useBreakPoint'

const renderPosition = (p: GAMMAPoolWithUserLiquidity) => {
  const liq = p.userLpPosition  
  if (!liq) return 0.0
  return numberFormatter(liq.totalValue, 2)
}

const renderTokenBalance = (p: GAMMAPoolWithUserLiquidity) => {
  const liq = p.userLpPosition
  const tokenA = numberFormatter(liq.uiValueA, 2)
  const tokenB = numberFormatter(liq.uiValueB, 2)

  return `${tokenA} / ${tokenB}`
}

const MyPositions: FC = () => {
  const {
    setSelectedCard,
    setOpenDepositWithdrawSlider,
    setModeOfOperation,
    isSearchActive,
    showCreatedPools,
    filteredPools
  } = useGamma()
  const { isTablet, isDesktop, isMobile } = useBreakPoint()
  const { mode } = useDarkMode()

  const positions = useMemo(() => filteredPools.filter((pool) => pool.userLpPosition), [filteredPools])

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
  //const canClaim = false

  return (
    <div className={`flex flex-col gap-2`}>
      {positions.length > 0 ? (
        positions.map((pool: GAMMAPoolWithUserLiquidity) => (
          <div
            className={cn(
              `grid grid-flow-col grid-cols-[1.5fr_1fr_0.5fr_1fr_0.5fr_1fr] dark:bg-black-2 px-2.5 cursor-pointer
                h-15 border border-solid dark:border-black-4 border-grey-4 bg-white rounded-tiny py-3.75`,
              isMobile && `grid-cols-[1.5fr_0.5fr]`,
              isTablet && `grid-cols-[1.5fr_1fr_1fr_0.5fr]`
            )}
            key={pool.id}
          >
            {/* name */}
            <div className="flex flex-row items-center">
              <Icon
                src={loadIconImage(pool.mintA.logoURI, mode)}
                className="border-solid dark:border-black-2 border-white
                                  border-[2px] rounded-full h-[25px] w-[25px]"
              />
              <Icon
                src={loadIconImage(pool.mintB.logoURI, mode)}
                className="relative right-[10px] border-solid dark:border-black-2
                                  border-white border-[2px] rounded-full h-[25px] w-[25px]"
              />
              <div
                className="font-poppins text-regular font-semibold
                                    dark:text-grey-8 text-black-4"
              >
                {pool.mintA.symbol} - {pool.mintB.symbol}
              </div>
            </div>

            {/* position */}
            <div
              className="flex items-center justify-center text-regular
                                font-semibold dark:text-grey-8 text-black-4"
            >
              ${renderPosition(pool)}
            </div>

            {/* fees */}
            {isDesktop && (
              <div
                className="border border-solid dark:border-black-4 flex items-center
                                  font-poppins text-tiny font-semibold dark:text-grey-8 text-black-4 mx-auto
                                  border-grey-1 bg-grey-5 dark:bg-black-2 rounded-[2.5px] h-[25px] px-1"
              >
                {numberFormatter(pool.stats.monthly.tradeFeesUSD)}%
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
            {(isTablet || isDesktop) && (
              <div className="flex items-center justify-center">
                <Badge variant="default" size={'lg'} className={'to-brand-secondaryGradient-secondary/50'}>
                  <span className={'font-poppins font-semibold my-0.5'}>
                    {numberFormatter(pool.stats.monthly.feesAprUSD)}%
                  </span>
                </Badge>
              </div>
            )}

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
                  onClick={() => {
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
                  disabled={
                    pool.userLpPosition.tokenADeposited === '0' && pool.userLpPosition.tokenBDeposited === '0'
                  }
                  onClick={() => {
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

export default MyPositions
