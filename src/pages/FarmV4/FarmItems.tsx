/* eslint-disable */
import { SSLToken } from '@/pages/FarmV3/constants'
import { FC } from 'react'
// import { StatsModal } from '@/pages/FarmV3/StatsModal'
import NoResultsFound from '@/pages/FarmV3/FarmTableComponents/NoResultsFound'
import { useSSLContext } from '@/context'
import { truncateBigString } from '@/utils'
import { FarmCard } from './FarmCard'
import { Button } from 'gfx-component-lib'
import FindPool from './FindPool'

const FarmItems: FC<{
  tokens: any
  numberOfTokensDeposited: number
  searchTokens: string
  showDeposited: boolean
}> = ({ tokens, numberOfTokensDeposited, showDeposited, searchTokens }) => {
  // const [statsModal, setStatsModal] = useState<boolean>(false)
  const { filteredLiquidityAccounts, pool } = useSSLContext()

  const noResultsTitle =
    Boolean(searchTokens) && !showDeposited ? 'Oops, no pools found' : 'Oops, no pools deposited'
  const noResultsSubText =
    Boolean(searchTokens) && !showDeposited
      ? 'Don’t worry, there are more pools coming soon...'
      : 'Don’t worry, explore our pools and start earning!'

  return (
    <div className={''}>
      {((numberOfTokensDeposited === 0 && showDeposited) || tokens?.length === 0) && (
        <NoResultsFound requestPool={!showDeposited} str={noResultsTitle} subText={noResultsSubText} />
      )}
      <div className="border-top grid gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {pool.name === 'All' && !showDeposited && !searchTokens && <FindPool />}
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
      {(numberOfTokensDeposited === 0 && showDeposited) || tokens?.length === 0 ? (
        <></>
      ) : (
        <div className={'w-full flex items-center mt-4'}>
          <Button
            className="cursor-pointer text-white rounded-full border-[1.5px] border-solid dark:border-purple-5 bg-black-1 mx-auto"
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
