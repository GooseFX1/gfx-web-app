import { FC, ReactElement } from "react"
import { useSSLContext } from '@/context'
import {
    Accordion,
    AccordionItem,
    AccordionContent,
    AccordionTrigger
  } from 'gfx-component-lib'
import { PoolStats } from './PoolStats'

const DepositWithdrawAccordion: FC = (): ReactElement => {
  const { selectedCard } = useSSLContext()
    return(
        <Accordion collapsible type={'multiple'}>
        <AccordionItem value="pool-stats" className="dark:bg-black-1 bg-grey-5 mx-2.5 my-3">
          <AccordionTrigger>Pool Stats</AccordionTrigger>
          <AccordionContent>
            <PoolStats token={selectedCard} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    )
}

export default DepositWithdrawAccordion