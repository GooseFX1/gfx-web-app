import { FC, useCallback } from 'react'
import { Badge, Container, Icon } from 'gfx-component-lib'
import { useDarkMode, useGamma } from '@/context'
import { ModeOfOperation } from './constants'
import { loadBackUpImage, loadUriImage } from '@/pages/FarmV4/Step2'
import NoResultsFound from '@/pages/FarmV4/NoResultsFound'
import { noPoolsFound } from '@/pages/FarmV4/FarmItems'
import { numberFormatter, truncateBigString, commafy } from '@/utils'
import { UserPortfolioLPPosition } from '@/types/gamma'

const MyPositions: FC = () => {
  const {
    lpPositions,
    setSelectedCard,
    setOpenDepositWithdrawSlider,
    setModeOfOperation,
    isSearchActive,
    showCreatedPools
  } = useGamma()
  const { mode } = useDarkMode()

  const renderPosition = useCallback(
    (p: UserPortfolioLPPosition) => {
      const position =
        (p.tokenADeposited - p.tokenAWithdrawn) +
        (p.tokenBDeposited - p.tokenBWithdrawn)
      
      return commafy(parseFloat(truncateBigString(position.toString(), 9)))
    },
    [lpPositions]
  )

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
    <div>
      {lpPositions && lpPositions.length > 0 ? (
        lpPositions.map((pool: UserPortfolioLPPosition) => (
          <div
            className="grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 dark:bg-black-2 px-2.5
                                my-3.75 h-15 border border-solid dark:border-black-4 border-grey-4 bg-white 
                                rounded-tiny py-3.75"
            key={pool.pdaPublicKey}
          >
            {console.log(pool)}
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
              {pool?.poolStats?.totalFees ? parseFloat(pool.poolStats.totalFees).toFixed(1) : 0}%
            </div>
            <div
              className="flex items-center justify-center text-black-4
                                    text-regular font-semibold dark:text-grey-8 w-[120%]"
            >
              {'---'} {pool.mintA.symbol} / {'---'} {pool.mintB.symbol}
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
                  {pool?.stats?.daily?.fees_apr_usd ? pool.stats.daily.fees_apr_usd : '---'}%
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
              <div
                className="h-[30px] w-[30px] flex flex-row justify-center items-center border-[1.5px]
                            border-solid dark:border-grey-8 border-blue-1 bg-grey-5 dark:bg-black-2 rounded-tiny 
                            cursor-pointer text-black-4 dark:text-white text-regular font-bold"
                onClick={() => {
                  setSelectedCard(pool)
                  setOpenDepositWithdrawSlider(true)
                  setModeOfOperation(ModeOfOperation?.DEPOSIT)
                }}
              >
                +
              </div>
              <div
                className="h-[30px] w-[30px] flex flex-row justify-center items-center border-[1.5px]
                            border-solid dark:border-grey-8 border-blue-1 bg-grey-5 dark:bg-black-2 
                            rounded-tiny cursor-pointer text-black-4 dark:text-white text-regular font-bold"
                onClick={() => {
                  setSelectedCard(pool)
                  setOpenDepositWithdrawSlider(true)
                  setModeOfOperation(ModeOfOperation?.WITHDRAW)
                }}
              >
                -
              </div>
            </div>
          </div>
        ))
      ) : (
        <NoResultsFound requestPool={false} str={noResultsTitle} subText={noResultsSubText} />
      )}
    </div>
  )
}

export default MyPositions
