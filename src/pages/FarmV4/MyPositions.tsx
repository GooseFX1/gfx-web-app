import { FC, useMemo } from 'react'
import { Badge, Button, cn } from 'gfx-component-lib'
import { useDarkMode, useGamma } from '@/context'
import { ModeOfOperation } from './constants'
import { bigNumberFormatter, loadIconImage, numberFormatter } from '@/utils'
import NoResultsFound from '@/pages/FarmV4/NoResultsFound'
import { noPoolsFound } from '@/pages/FarmV4/FarmItems'
import { GAMMAPoolWithUserLiquidity } from '@/types/gamma'
import useBreakPoint from '@/hooks/useBreakPoint'
import { FarmRowLoader } from '@/pages/FarmV4/FarmRow'
import { useWalletBalance } from '@/context/walletBalanceContext'
import { IconWithFallback } from '@/components/common/IconWithFallback'
import Decimal from 'decimal.js'
import BigNumber from 'bignumber.js'

const renderPosition = (p: GAMMAPoolWithUserLiquidity) => {
  const liq = p.userLpPosition
  if (!liq) return 0.0
  return numberFormatter(liq.totalValue, 2)
}

const renderTokenBalance = (p: GAMMAPoolWithUserLiquidity) => {
  // TEMP Solution - replace call on portfolio with /portfolio endpoint
  const liq = p.userLpPosition
  const tokensOwned = new Decimal(liq.lpTokensOwned);
  const supply = new Decimal(p.lpSupply);

  if (tokensOwned.isZero() || supply.isZero()) {
    return '0.00 / 0.00'
  }
  const swapAmountA = new Decimal(p.liquidityTokenA).sub(p.mintA.protocolFees).add(p.mintA.fundFees)
  const swapAmountB = new Decimal(p.liquidityTokenB).sub(p.mintB.protocolFees).add(p.mintB.fundFees)

  const amountA = tokensOwned.mul(swapAmountA).div(supply).div(Math.pow(10, p.mintA.decimals)).toString()
  const amountB = tokensOwned.mul(swapAmountB).div(supply).div(Math.pow(10, p.mintB.decimals)).toString()
  const tokenA = bigNumberFormatter(new BigNumber(amountA), 2)
  const tokenB = bigNumberFormatter(new BigNumber(amountB), 2)

  return `${tokenA} / ${tokenB}`
}

const MyPositions: FC = () => {
  const {
    setSelectedCard,
    setOpenDepositWithdrawSlider,
    setModeOfOperation,
    isSearchActive,
    showCreatedPools,
    filteredPools,
    sortConfig
  } = useGamma()
  const { isTablet, isDesktop, isMobile } = useBreakPoint()
  const { mode } = useDarkMode()
  const { base58PublicKey } = useWalletBalance()

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
  console.log({positions})
  return (
    <div className={`flex flex-col gap-[15px] mt-[15px]`}>
      {positions.length > 0 ? (
        positions.map((pool: GAMMAPoolWithUserLiquidity) => (
          <div
            className={cn(
              `grid grid-flow-col grid-cols-[1.5fr_1fr_0.5fr_1fr_0.5fr_1fr] dark:bg-black-2 px-2.5 cursor-pointer
                h-15 border border-solid dark:border-black-4 border-grey-4 bg-white rounded-tiny py-3.75
                sm-lg:grid-cols-[1.25fr_0.75fr_0.75fr]`,
              isMobile && `grid-cols-[1.25fr_0.75fr_0.75fr]`,
              isTablet && `grid-cols-[1.5fr_1fr_1fr_0.5fr]`
            )}
            key={`${pool.id}_${sortConfig.id}`}
            onClick={()=>{
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
              {pool.poolCreator == base58PublicKey && !isMobile &&  (
                <Badge size="sm" variant="default" className='h-5.5'>
                  Owner
                </Badge>
              )}
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
              <div className="flex items-center justify-center">
                <Badge variant="default" size={'lg'} className={'to-brand-secondaryGradient-secondary/50'}>
                  <span className={'font-poppins font-semibold my-0.5'}>
                    {numberFormatter(pool.stats.daily.feesAprUSD)}%
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
                  disabled={
                    pool.userLpPosition.tokenADeposited === '0' && pool.userLpPosition.tokenBDeposited === '0'
                  }
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
  const { isLoadingPools } = useGamma()

  if (isLoadingPools) {
    return <div className={'flex flex-col gap-[15px] mt-[15px]'}>
      <FarmRowLoader />
      <FarmRowLoader />
      <FarmRowLoader />
      <FarmRowLoader />
    </div>
  }

  return <MyPositions />
}
export default MyPositionItems
