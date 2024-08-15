import { FC } from 'react'
import { CircularArrow } from '@/components/common/Arrow'
import UnusedTokens from './UnusedTokens'
import ComingSoon from './ComingSoon'
import Positions from './Positions'

const PortfolioScreen: FC = (): JSX.Element => (
    <div>
      <div className="flex items-center mb-3.75">
        <CircularArrow className={`h-5 w-5 rotate-180 mr-2`} />
        <h4 className="text-average dark:text-grey-8 text-black-4">My Stats</h4>
      </div>
      <div className="grid gap-[15px] lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 mb-3.75">
        <ComingSoon 
          header='Portfolio Value' 
          subHeader='Monitor your top pools and coin values with advanced, user-friendly graphs.' 
          value='711.98' 
          image="chart" 
        />
        <ComingSoon 
          header='Total Earned' 
          subHeader='Track the history of all your earnings across different time periods.' 
          value='21.31' 
          image="graph" 
        />
        <UnusedTokens />
      </div>
      <Positions />
    </div>
)


export default PortfolioScreen
