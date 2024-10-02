import { FC, useMemo } from 'react'
import { Badge, Button, Icon } from 'gfx-component-lib'
import { useDarkMode, useGamma } from '@/context'
import { ModeOfOperation } from './constants'
import { loadBackUpImage, loadUriImage } from '@/pages/FarmV4/Step2'
import NoResultsFound from '@/pages/FarmV4/NoResultsFound'
import { noPoolsFound } from '@/pages/FarmV4/FarmItems'
import { numberFormatter } from '@/utils'
import { GAMMAPoolWithUserLiquidity } from '@/types/gamma'
import Decimal from 'decimal.js-light'

const renderPosition = (p: GAMMAPoolWithUserLiquidity) => {
  const liq = p.userLpPosition
  if (!liq) return 0.0
  const positionA = new Decimal(liq.tokenADeposited).sub(liq.tokenAWithdrawn).div(liq.mintA.decimals)
  const positionB = new Decimal(liq.tokenBDeposited).sub(liq.tokenBWithdrawn).div(liq.mintB.decimals)
  const position = positionA.add(positionB)

  return numberFormatter(position.toNumber())
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
  const canClaim = false

  return (
    <div>
      {positions.length > 0 ?
        positions.map((pool: GAMMAPoolWithUserLiquidity) => (
            <div
              className="grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 dark:bg-black-2 px-2.5
                                my-3.75 h-15 border border-solid dark:border-black-4 border-grey-4 bg-white 
                                rounded-tiny py-3.75"
              key={pool.id}
            >
              <div className="flex flex-row items-center">
                <Icon
                  src={
                    loadUriImage(pool.mintA.logoURI) ? pool.mintA.logoURI : loadBackUpImage(pool.mintA.symbol, mode)
                  }
                  className="border-solid dark:border-black-2 border-white
                                  border-[2px] rounded-full h-[25px] w-[25px]"
                />
                <Icon
                  src={
                    loadUriImage(pool.mintB.logoURI) ? pool.mintB.logoURI : loadBackUpImage(pool.mintB.symbol, mode)
                  }
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
              <div
                className="flex items-center justify-center text-regular
                                font-semibold dark:text-grey-8 text-black-4"
              >
                {renderPosition(pool)}
              </div>
              <div
                className="border border-solid dark:border-black-4 flex items-center
                                  font-poppins text-tiny font-semibold dark:text-grey-8 text-black-4 mx-auto
                                  border-grey-1 bg-grey-5 dark:bg-black-2 rounded-[2.5px] h-[25px] px-1"
              >
                {numberFormatter(pool.stats.monthly.tradeFeesUSD)}%
              </div>
              <div
                className="flex items-center justify-center text-black-4
                                    text-regular font-semibold dark:text-grey-8"
              >
                ${numberFormatter(0)}
              </div>
              <div
                className="flex items-center justify-center text-black-4
                                    text-regular font-semibold dark:text-grey-8"
              >
                ${numberFormatter(0)}
              </div>
              <div className="flex items-center justify-center">
                <Badge variant="default" size={'lg'} className={'to-brand-secondaryGradient-secondary/50'}>
                <span className={'font-poppins font-semibold my-0.5'}>
                  {numberFormatter(pool.stats.monthly.feesAprUSD)}%
                </span>
                </Badge>
              </div>
              <div className="flex items-center justify-evenly">
                <Button
                  className="h-[30px] w-[61px] cursor-pointer flex flex-row
                            justify-center items-center !rounded-[200px]"
                  colorScheme={'secondaryGradient'}
                  variant={'outline'}
                  aria-disabled={!canClaim}
                >
                  Claim
                </Button>
                <Button
                  colorScheme={'blue'}
                  className={'h-7.5 w-7.5'}
                  onClick={() => {
                    setSelectedCard(pool)
                    setOpenDepositWithdrawSlider(true)
                    setModeOfOperation(ModeOfOperation.DEPOSIT)
                  }}>
                  +
                </Button>
                <Button colorScheme={'blue'}
                        className={'h-7.5 w-7.5'}
                        disabled={pool.userLpPosition.tokenADeposited === '0' &&
                          pool.userLpPosition.tokenBDeposited === '0'}
                        onClick={() => {
                          setSelectedCard(pool)
                          setOpenDepositWithdrawSlider(true)
                          setModeOfOperation(ModeOfOperation.WITHDRAW)
                        }}>
                  -
                </Button>
              </div>
            </div>
          )
        )
        :
        <NoResultsFound requestPool={false} str={noResultsTitle} subText={noResultsSubText} />
      }
    </div>
  )
}

export default MyPositions
