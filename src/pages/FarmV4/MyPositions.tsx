import { FC } from 'react'
import { Badge, Container, Icon } from 'gfx-component-lib'
import { useDarkMode, useGamma } from '@/context'
import { ModeOfOperation } from './constants'
import { GAMMAPool } from '@/types/gamma'
import { loadBackUpImage, loadUriImage } from '@/pages/FarmV4/Step2'
import NoResultsFound from '@/pages/FarmV4/NoResultsFound'
import { noPoolsDeposited, noPoolsFound } from '@/pages/FarmV4/FarmItems'
import { numberFormatter } from '@/utils'

const MyPositions: FC<{ pools: GAMMAPool[] }> = ({ pools }) => {
  const {
    setSelectedCard,
    setOpenDepositWithdrawSlider,
    setModeOfOperation,
    showDeposited,
    isSearchActive,
    showCreatedPools
  } = useGamma()
  const { mode } = useDarkMode()
  let noResultsTitle = ''
  let noResultsSubText = ''
  switch (true) {
    case !isSearchActive && !showDeposited && !showCreatedPools:
      noResultsTitle = noPoolsFound.title
      noResultsSubText = noPoolsFound.subText
      break
    case Boolean(isSearchActive) && showDeposited && showCreatedPools:
      noResultsTitle = noPoolsFound.title
      noResultsSubText = noPoolsFound.subText
      break
    case Boolean(isSearchActive) && !showDeposited && !showCreatedPools:
      noResultsTitle = noPoolsFound.title
      noResultsSubText = noPoolsFound.subText
      break
    case Boolean(isSearchActive) && !showDeposited && showCreatedPools:
      noResultsTitle = noPoolsFound.title
      noResultsSubText = noPoolsFound.subText
      break
    case Boolean(isSearchActive) && showDeposited && !showCreatedPools:
      noResultsTitle = noPoolsDeposited.title
      noResultsSubText = noPoolsDeposited.subText
      break
    case !isSearchActive && showDeposited && showCreatedPools:
      noResultsTitle = noPoolsDeposited.title
      noResultsSubText = noPoolsDeposited.subText
      break
    case !isSearchActive && showDeposited && !showCreatedPools:
      noResultsTitle = noPoolsDeposited.title
      noResultsSubText = noPoolsDeposited.subText
      break
    case !isSearchActive && !showDeposited && showCreatedPools:
      noResultsTitle = noPoolsFound.title
      noResultsSubText = noPoolsFound.subText
      break
    case !showDeposited && showCreatedPools:
      noResultsTitle = noPoolsFound.title
      noResultsSubText = noPoolsFound.subText
      break
  }
  return (
    <div>
      {pools.length > 0 ? pools
          .map((pool, index) => (
              <div
                className="grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 dark:bg-black-2 px-2.5
                                my-3.75 h-15 border border-solid dark:border-black-4 border-grey-4 bg-white 
                                rounded-tiny py-3.75"
                key={`${pool.tvl}_${index}`}
              >
                <div className="flex flex-row items-center">
                  <Icon
                    src={loadUriImage(pool.mintA.logoURI) ?
                      pool.mintA.logoURI : loadBackUpImage(pool.mintA.symbol, mode)}
                    className="border-solid dark:border-black-2 border-white
                                  border-[2px] rounded-full h-[25px] w-[25px]"
                  />
                  <Icon
                    src={loadUriImage(pool.mintB.logoURI) ?
                      pool.mintB.logoURI : loadBackUpImage(pool.mintB.symbol, mode)}
                    className="relative right-[10px] border-solid dark:border-black-2
                                  border-white border-[2px] rounded-full h-[25px] w-[25px]"
                  />
                  <div className="font-poppins text-regular font-semibold
                                    dark:text-grey-8 text-black-4">
                    {pool.mintA.symbol} - {pool.mintB.symbol}
                  </div>
                </div>
                <div className="flex items-center justify-center text-regular
                                font-semibold dark:text-grey-8 text-black-4">
                  ${numberFormatter(0.44)}
                </div>
                <div className="border border-solid dark:border-black-4 flex items-center
                                  font-poppins text-tiny font-semibold dark:text-grey-8 text-black-4 mx-auto
                                  border-grey-1 bg-grey-5 dark:bg-black-2 rounded-[2.5px] w-10 h-[25px] px-1">
                  {numberFormatter(0.2)}%
                </div>
                <div className="flex items-center justify-center text-black-4
                                    text-regular font-semibold dark:text-grey-8 w-[120%]">
                  {numberFormatter(0.61)} {pool.mintA.symbol} / {numberFormatter(74.55)} {pool.mintB.symbol}
                </div>
                <div className="flex items-center justify-center text-black-4
                                    text-regular font-semibold dark:text-grey-8">
                  ${numberFormatter(1.22)}
                </div>
                <div className="flex items-center justify-center text-black-4
                                    text-regular font-semibold dark:text-grey-8">
                  ${numberFormatter(22.2)}
                </div>
                <div className="flex items-center justify-center">
                  <Badge variant="default" size={'lg'} className={'to-brand-secondaryGradient-secondary/50'}>
                                <span className={'font-poppins font-semibold my-0.5'}>
                                    {numberFormatter(pool.stats.daily.feesAprUSD)}%
                                </span>
                  </Badge>
                </div>
                <div className="flex items-center justify-evenly">
                  <Container
                    className="h-[30px] w-[61px] cursor-pointer flex flex-row
                            justify-center items-center !rounded-[200px]"
                    colorScheme={'primaryGradient'}
                    size={'lg'}
                  >
                    Claim
                  </Container>
                  <div className="h-[30px] w-[30px] flex flex-row justify-center items-center border-[1.5px]
                            border-solid dark:border-grey-8 border-blue-1 bg-grey-5 dark:bg-black-2 rounded-tiny 
                            cursor-pointer text-black-4 dark:text-white text-regular font-bold"
                       onClick={() => {
                         setSelectedCard(pool)
                         setOpenDepositWithdrawSlider(true)
                         setModeOfOperation(ModeOfOperation?.DEPOSIT)
                       }}>
                    +
                  </div>
                  <div className="h-[30px] w-[30px] flex flex-row justify-center items-center border-[1.5px]
                            border-solid dark:border-grey-8 border-blue-1 bg-grey-5 dark:bg-black-2 
                            rounded-tiny cursor-pointer text-black-4 dark:text-white text-regular font-bold"
                       onClick={() => {
                         setSelectedCard(pool)
                         setOpenDepositWithdrawSlider(true)
                         setModeOfOperation(ModeOfOperation?.WITHDRAW)
                       }}>
                    -
                  </div>
                </div>
              </div>
            )
          ) :
        <NoResultsFound requestPool={!showDeposited} str={noResultsTitle} subText={noResultsSubText} />
      }
    </div>
  )
}

export default MyPositions
