/* eslint-disable */
import { FC, useState } from 'react'
// import { StatsModal } from '@/pages/FarmV3/StatsModal'
import NoResultsFound from './NoResultsFound'
import { useFarmContext, useRewardToggle } from '@/context'
import { truncateBigString } from '@/utils'
import FarmCard from './FarmCard'
import FarmRow from './FarmRow'
import FarmFilter from './FarmFilter'
import { Button } from 'gfx-component-lib'

const FarmItems: FC<{
  tokens: any
  numberOfTokensDeposited: number
  searchTokens: string
  showDeposited: boolean
}> = ({ tokens, numberOfTokensDeposited, showDeposited, searchTokens }) => {
  // const [statsModal, setStatsModal] = useState<boolean>(false)
  const { filteredLiquidityAccounts, pool } = useFarmContext()
  const { isProMode } = useRewardToggle()
  const [sort, setSort] = useState<string>('ASC')
  const [sortType, setSortType] = useState<string>(null)

  // const handleColumnSort = (sortValue: string) => {
  //   if (sortValue === 'balance') {
  //     sortUserBalances(sortValue)
  //     return
  //   }
  //   farmTableRow.sort((a, b) => {
  //     if (sort === 'DESC') return a[sortValue] > b[sortValue] ? -1 : 1
  //     else return a[sortValue] > b[sortValue] ? 1 : -1
  //   })
  //   setSort((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'))
  //   setSortType(sortValue)
  // }

  return (
    <div className={''}>
      {(numberOfTokensDeposited === 0 && showDeposited) || tokens?.length === 0 ? (
        <NoResultsFound requestPool={!showDeposited} str={"No Deposits"}
                        subText={"Don’t worry, explore or create a pool to get started and start earning!"} />
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
                    (showDeposited && Boolean(userDepositedAmount) && userDepositedAmount != '0.00') ||
                    !showDeposited

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
                (showDeposited && Boolean(userDepositedAmount) && userDepositedAmount != '0.00') || !showDeposited

              return show ? (
                <FarmCard token={token} key={`${token?.sourceToken}-${token?.targetToken}-${i}`} />
              ) : null
            })}
        </div>
      )}
      {(numberOfTokensDeposited === 0 && showDeposited) || tokens?.length === 0 ? (
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
