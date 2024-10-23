import { FC, ReactElement } from 'react'
import { useGamma } from '@/context'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from 'gfx-component-lib'
import { PoolStats } from './PoolStats'
import { MyPositionStats } from '@/pages/FarmV4/MyPositionStats'

const DepositWithdrawAccordion: FC = (): ReactElement => {
  const { selectedCard } = useGamma()
    return(
        <Accordion collapsible='true' type={'multiple'} variant='default'
                   className="dark:bg-black-1 bg-grey-5 mx-2.5 my-3 !rounded-[4px]"
                   defaultValue={['pool-stats']}
        >
          {selectedCard?.hasDeposit ? <AccordionItem value="lp-stats">
            <AccordionTrigger><h4>My Position</h4></AccordionTrigger>
            <AccordionContent>
              <MyPositionStats />
            </AccordionContent>
          </AccordionItem> : null}
        <AccordionItem value="pool-stats">
          <AccordionTrigger><h4>Pool Stats</h4></AccordionTrigger>
          <AccordionContent>
            <PoolStats pool={selectedCard} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    )
}

export default DepositWithdrawAccordion