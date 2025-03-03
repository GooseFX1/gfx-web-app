import { FC, useMemo } from 'react'
import UnusedTokens from './UnusedTokens'
import ComingSoon from './ComingSoon'
import ProPositions from './ProPositions'
import Decimal from 'decimal.js-light'
import { commafy } from '@/utils'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from 'gfx-component-lib'
import useUserLiquidityQuery from '@/queries/GAMMA/userLiquidity/useUserLiquidityQuery'

const PortfolioScreen: FC = (): JSX.Element => {
  const userLiqQuery = useUserLiquidityQuery()
  const totalValue = useMemo(
    () => userLiqQuery.data.reduce((acc, pos) => acc.add(Number(pos.totalValue)), new Decimal(0.0)),
    [userLiqQuery.data]
  )

  return (
    <div>
      <Accordion
        collapsible="true"
        variant="default"
        type={'multiple'}
        className="dark:bg-black-1 bg-grey-5"
        defaultValue={['portfolio-stats']}
      >
        <AccordionItem value="portfolio-stats" className="p-0">
          <AccordionTrigger>
            <div className="flex items-center mb-3.75">
              <h5 className="text-average dark:text-grey-8 text-black-4">My Stats</h5>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-[15px] lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 mb-3.75">
              <ComingSoon
                header="Portfolio Value"
                tooltip={'Portfolio Value is the total worth of all your investments across all pools.'}
                subHeader="Monitor your top pools and coin values with advanced, user-friendly graphs."
                value={commafy(totalValue, 2)}
                image="chart"
              />
              <ComingSoon
                header="Total Earned"
                tooltip={
                  "Total Earned is the total rewards you've claimed from all your pools since your first deposit."
                }
                subHeader="Track the history of all your earnings across different time periods."
                value="0.00"
                image="graph"
              />
              <UnusedTokens />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <ProPositions />
    </div>
  )
}

export default PortfolioScreen
