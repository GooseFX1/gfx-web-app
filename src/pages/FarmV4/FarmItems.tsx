/* eslint-disable */
import { SSLToken } from '@/pages/FarmV3/constants'
import { FC } from 'react'
// import { StatsModal } from '@/pages/FarmV3/StatsModal'
import NoResultsFound from '@/pages/FarmV3/FarmTableComponents/NoResultsFound'
import { useSSLContext } from '@/context'
import { truncateBigString } from '@/utils'
import { FarmCard } from './FarmCard'
import { Button } from 'gfx-component-lib'

const SSL_TOKENS = [
  {
    sourceToken: 'SOL',
    targetToken: 'USDC',
    liquidity: '$5.17M',
    volume: '$111.18K',
    fees: '$50.21K',
    apr: 185,
    sourceTokenMintAddress: 'So11111111111111111111111111111111111111112',
    sourceTokenMintDecimals: 9,
    targetTokenMintAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    targetTokenMintDecimals: 6,
    type: 'Primary'
  },
  {
    sourceToken: 'SOL',
    targetToken: 'BONK',
    liquidity: '$5.17M',
    volume: '$111.18K',
    fees: '$50.21K',
    apr: 185,
    sourceTokenMintAddress: 'So11111111111111111111111111111111111111112',
    sourceTokenMintDecimals: 9,
    targetTokenMintAddress: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    targetTokenMintDecimals: 5,
    type: 'Hyper'
  },
  {
    sourceToken: 'SOL',
    targetToken: 'JITOSOL',
    liquidity: '$5.17M',
    volume: '$111.18K',
    fees: '$50.21K',
    apr: 185,
    sourceTokenMintAddress: 'So11111111111111111111111111111111111111112',
    sourceTokenMintDecimals: 9,
    targetTokenMintAddress: 'J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn',
    targetTokenMintDecimals: 9,
    type: 'Primary'
  },
  {
    sourceToken: 'SOL',
    targetToken: 'HXRO',
    liquidity: '$5.17M',
    volume: '$111.18K',
    fees: '$50.21K',
    apr: 185,
    sourceTokenMintAddress: 'So11111111111111111111111111111111111111112',
    sourceTokenMintDecimals: 9,
    targetTokenMintAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    targetTokenMintDecimals: 6,
    type: 'Hyper'
  },
  {
    sourceToken: 'USDC',
    targetToken: 'SOL',
    liquidity: '$5.17M',
    volume: '$111.18K',
    fees: '$50.21K',
    apr: 185,
    sourceTokenMintAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    sourceTokenMintDecimals: 6,
    targetTokenMintAddress: 'So11111111111111111111111111111111111111112',
    targetTokenMintDecimals: 9,
    type: 'Primary'
  },
  {
    sourceToken: 'BONK',
    targetToken: 'SOL',
    liquidity: '$5.17M',
    volume: '$111.18K',
    fees: '$50.21K',
    apr: 185,
    sourceTokenMintAddress: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    sourceTokenMintDecimals: 5,
    targetTokenMintAddress: 'So11111111111111111111111111111111111111112',
    targetTokenMintDecimals: 9,
    type: 'Hyper'
  },
  {
    sourceToken: 'BONK',
    targetToken: 'USDC',
    liquidity: '$5.17M',
    volume: '$111.18K',
    fees: '$50.21K',
    apr: 185,
    sourceTokenMintAddress: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    sourceTokenMintDecimals: 5,
    targetTokenMintAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    targetTokenMintDecimals: 6,
    type: 'Hyper'
  },
  {
    sourceToken: 'SOL',
    targetToken: 'JITOSOL',
    liquidity: '$5.17M',
    volume: '$111.18K',
    fees: '$50.21K',
    apr: 185,
    sourceTokenMintAddress: 'So11111111111111111111111111111111111111112',
    sourceTokenMintDecimals: 9,
    targetTokenMintAddress: 'J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn',
    targetTokenMintDecimals: 9,
    type: 'Primary'
  }
]

const FarmItems: FC<{
  tokens: SSLToken[]
  numberOfCoinsDeposited: number
  searchTokens: string
  showDeposited: boolean
}> = ({ tokens, numberOfCoinsDeposited, showDeposited, searchTokens }) => {
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
      {/* {((numberOfCoinsDeposited === 0 && showDeposited) || tokens?.length === 0) && (
        <NoResultsFound requestPool={!showDeposited} str={noResultsTitle} subText={noResultsSubText} />
      )} */}
      <div className="border-top grid grid-cols-4 gap-3 max-sm:grid-cols-1">
        {SSL_TOKENS.filter((token) => {
          if (pool.name === 'All') return true
          else return pool.name === token.type
        }).map((token) => {
          if (!token || !filteredLiquidityAccounts) return null
          const liqAcc = filteredLiquidityAccounts[token.sourceTokenMintAddress]
          const userDepositedAmount = truncateBigString(
            liqAcc?.amountDeposited.toString(),
            token.sourceTokenMintDecimals
          )

          const show =
            (showDeposited && Boolean(userDepositedAmount) && userDepositedAmount != '0.00') || !showDeposited

          return show ? <FarmCard token={token} /> : null
        })}
      </div>
      <div className={'w-full flex items-center mt-4'}>
        <Button
          className="cursor-pointer text-white rounded-full border-[1.5px] border-solid dark:border-purple-5 bg-black-1 mx-auto"
          variant={'primary'}
        >
          Load More
        </Button>
      </div>
    </div>
  )
}
export default FarmItems
