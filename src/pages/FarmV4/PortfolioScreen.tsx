import { FC, useMemo } from 'react'
import { CircularArrow } from '@/components/common/Arrow'
import UnusedTokens from './UnusedTokens'
import ComingSoon from './ComingSoon'
import Positions from './Positions'
import { useGamma } from '@/context'
import Decimal from 'decimal.js-light'
import { commafy } from '@/utils'

const PortfolioScreen: FC = (): JSX.Element => {
  const { lpPositions } = useGamma()
  const totalValue = useMemo(() =>
    lpPositions.reduce((acc, pos) => acc.add(pos.totalValue), new Decimal(0.0)), [lpPositions])

  return <div>
    <div className="flex items-center mb-3.75">
      <CircularArrow className={`h-5 w-5 rotate-180 mr-2`} />
      <h4 className="text-average dark:text-grey-8 text-black-4">My Stats</h4>
    </div>
    <div className="grid gap-[15px] lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 mb-3.75">
      <ComingSoon
        header="Portfolio Value"
        tooltip={'Portfolio Value is the total worth of all your investments across all pools.'}
        subHeader="Monitor your top pools and coin values with advanced, user-friendly graphs."
        value={commafy(totalValue)}
        image="chart"
      />
      <ComingSoon
        header="Total Earned"
        tooltip={'Total Earned is the total rewards you\'ve claimed from all your pools since your first deposit.'}
        subHeader="Track the history of all your earnings across different time periods."
        value="0.00"
        image="graph"
      />
      <UnusedTokens />
    </div>
    <Positions />
  </div>
}


export default PortfolioScreen
