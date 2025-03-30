import { FC, ReactElement } from 'react'
import { useGamma } from '@/context'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from 'gfx-component-lib'
import { PoolStats } from './PoolStats'
import { MyPositionStats } from '@/pages/FarmV4/MyPositionStats'
import BN from 'bn.js'
import { ClaimSinglePoolBoostedReward } from '@/components/token-rewards/ClaimSinglePoolBoostedReward'
const DepositWithdrawAccordion: FC<{
  withdrawableBalanceA: BN
  withdrawableBalanceB: BN
}> = ({ withdrawableBalanceA, withdrawableBalanceB }): ReactElement => {
  const { selectedCard } = useGamma()
  const token = selectedCard?.mintA
  // hasDeposit = pools flow ... currentPositionUSD = portfolio flow - this will be standardised once API is out
  return (
    <Accordion
      collapsible="true"
      type={'multiple'}
      variant="default"
      className="dark:bg-black-1 bg-grey-5 mx-2.5 my-3 !rounded-[4px]"
      defaultValue={selectedCard?.hasDeposit ? ['lp-stats'] : ['pool-stats']}
    >
      {token ? <ClaimSinglePoolBoostedReward pool={selectedCard} /> : null}
      {selectedCard?.hasDeposit || +selectedCard?.currentPositionUSD > 0 ? (
        <AccordionItem value="lp-stats">
          <AccordionTrigger>
            <h4>My Position</h4>
          </AccordionTrigger>
          <AccordionContent>
            <MyPositionStats
              withdrawableBalanceA={withdrawableBalanceA}
              withdrawableBalanceB={withdrawableBalanceB}
            />
          </AccordionContent>
        </AccordionItem>
      ) : null}
      <AccordionItem value="pool-stats">
        <AccordionTrigger>
          <h4>Pool Stats</h4>
        </AccordionTrigger>
        <AccordionContent>
          <PoolStats pool={selectedCard} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default DepositWithdrawAccordion
