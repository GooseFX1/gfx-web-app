import { FC } from 'react'
import { Faq, faqs } from './constants'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, cn } from 'gfx-component-lib'
import { useRewardToggle } from '../../context'


export const Faqs: FC = () => {
  const { isPortfolio } = useRewardToggle()
  return !isPortfolio && (
    <div className={cn(`max-sm:w-[calc(100% - 15px)]`)}>
    <div className="flex flex-row mt-10 mb-5 items-center">
      <h2 className="mr-auto text-[20px] font-semibold h-[35px] dark:text-grey-5 text-black-4 max-sm:text-lg pl-2">
        FAQs
      </h2>
      <a
        className="font-bold text-regular dark:text-white text-blue-1 underline hover:underline"
        href="https://docs.goosefx.io/features/farm"
        target="_blank"
        rel="noopener noreferrer"
      >
        Go To Docs
      </a>
    </div>
    <Accordion collapsible="true" type={'multiple'}>
      {faqs.map((item: Faq) => (
        <AccordionItem key={item.question} value={item.question}>
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent>{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </div>
  )
}
