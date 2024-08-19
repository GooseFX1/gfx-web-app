import { FC, ReactElement } from 'react'
import { useFarmContext } from '@/context'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from 'gfx-component-lib'
import { PoolStats } from './PoolStats'

const DepositWithdrawAccordion: FC = (): ReactElement => {
  const { selectedCard } = useFarmContext()
    return(
        <Accordion collapsible type={'multiple'} variant='default'
                   className="dark:bg-black-1 bg-grey-5 mx-2.5 my-3">
        <AccordionItem value="pool-stats" >
          <AccordionTrigger><h4>Pool Stats</h4></AccordionTrigger>
          <AccordionContent>
            <PoolStats token={selectedCard} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    )
}

export default DepositWithdrawAccordion