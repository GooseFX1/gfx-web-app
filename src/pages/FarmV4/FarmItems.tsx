/* eslint-disable */
import { FC, useState } from 'react'
import NoResultsFound from './NoResultsFound'
import { useGamma, useRewardToggle } from '@/context'
import { truncateBigString } from '@/utils'
import FarmCard from './FarmCard'
import FarmRow from './FarmRow'
import FarmFilter from './FarmFilter'
import { Button } from 'gfx-component-lib'

const FarmItems: FC<{
  tokens: any
  numberOfTokensDeposited: number
  isSearchActive: string
  isDepositedActive: boolean
  isCreatedActive: boolean
}> = ({ tokens, numberOfTokensDeposited, isDepositedActive, isSearchActive, isCreatedActive }) => {
  const { filteredLiquidityAccounts, pool } = useGamma()
  const { isProMode } = useRewardToggle()
  const [sort, setSort] = useState<string>('ASC')
  const [sortType, setSortType] = useState<string>(null)

  const noPoolsFound = {
    title: 'Oops, no pools found',
    subText: 'Don’t worry, there are more pools coming soon...'
  }
  const noPoolsDeposited = {
    title: 'Oops, no pools deposited',
    subText: 'Don’t worry, explore our pools and start earning!'
  }
  const noCreatedPools = {
    title: 'Oops, no created pools',
    subText: 'Don’t worry, you can always create one!'
  }
  let noResultsTitle = ''
  let noResultsSubText = ''
  switch (true) {
    case !Boolean(isSearchActive) && !isDepositedActive && !isCreatedActive:
      noResultsTitle = noPoolsFound.title
      noResultsSubText = noPoolsFound.subText
      break
    case Boolean(isSearchActive) && isDepositedActive && isCreatedActive:
      noResultsTitle = noPoolsFound.title
      noResultsSubText = noPoolsFound.subText
      break
    case Boolean(isSearchActive) && !isDepositedActive && !isCreatedActive:
      noResultsTitle = noPoolsFound.title
      noResultsSubText = noPoolsFound.subText
      break
    case Boolean(isSearchActive) && !isDepositedActive && isCreatedActive:
      noResultsTitle = noPoolsFound.title
      noResultsSubText = noPoolsFound.subText
      break
    case Boolean(isSearchActive) && isDepositedActive && !isCreatedActive:
      noResultsTitle = noPoolsDeposited.title
      noResultsSubText = noPoolsDeposited.subText
      break
    case !Boolean(isSearchActive) && isDepositedActive && isCreatedActive:
      noResultsTitle = noPoolsDeposited.title
      noResultsSubText = noPoolsDeposited.subText
      break
    case !Boolean(isSearchActive) && isDepositedActive && !isCreatedActive:
      noResultsTitle = noPoolsDeposited.title
      noResultsSubText = noPoolsDeposited.subText
      break
    case !Boolean(isSearchActive) && !isDepositedActive && isCreatedActive:
      noResultsTitle = noPoolsFound.title
      noResultsSubText = noPoolsFound.subText
      break
    case !isDepositedActive && isCreatedActive:
      noResultsTitle = noPoolsFound.title
      noResultsSubText = noPoolsFound.subText
      break
  }

  return (
    <div className={''}>
      {(numberOfTokensDeposited === 0 && isDepositedActive) || tokens?.length === 0 ? (
        <NoResultsFound requestPool={!isDepositedActive} str={noResultsTitle} subText={noResultsSubText} />
      ) : isProMode ? (
        <>
          <FarmFilter sort={sort} sortType={sortType} />
          <div>
            <div>
              {tokens
                .filter((token: any) => {
                  if (pool.name === 'All') return true
                  else return pool.name === token.type
                })
                .map((token, i) => {
                  if (!token || !filteredLiquidityAccounts) return null
                  const liqAcc = filteredLiquidityAccounts[token.sourceTokenMintAddress]
                  const userDepositedAmount = truncateBigString(
                    liqAcc?.amountDeposited.toString(),
                    token.sourceTokenMintDecimals
                  )

                  const show =
                    (isDepositedActive && Boolean(userDepositedAmount) && userDepositedAmount != '0.00') ||
                    !isDepositedActive

                  return show ? (
                    <FarmRow token={token} key={`${token?.sourceToken}-${token?.targetToken}-${i}`} />
                  ) : null
                })}
            </div>
          </div>
        </>
      ) : (
        <div className="border-top grid gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {tokens
            .filter((token: any) => {
              if (pool.name === 'All') return true
              else return pool.name === token.type
            })
            .map((token, i) => {
              if (!token || !filteredLiquidityAccounts) return null
              const liqAcc = filteredLiquidityAccounts[token.sourceTokenMintAddress]
              const userDepositedAmount = truncateBigString(
                liqAcc?.amountDeposited.toString(),
                token.sourceTokenMintDecimals
              )

              const show =
                (isDepositedActive && Boolean(userDepositedAmount) && userDepositedAmount != '0.00') || !isDepositedActive

              return show ? (
                <FarmCard token={token} key={`${token?.sourceToken}-${token?.targetToken}-${i}`} />
              ) : null
            })}
        </div>
      )}
      {(numberOfTokensDeposited === 0 && isDepositedActive) || tokens?.length === 0 ? (
        <></>
      ) : (
        <div className={'w-full flex items-center mt-4'}>
          <Button
            className="cursor-pointer rounded-full border-[1.5px] border-solid border-purple-5 
            dark:bg-black-1 dark:text-white bg-grey-5 mx-auto font-bold text-regular text-black-4"
            variant={'primary'}
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  )
}
export default FarmItems
