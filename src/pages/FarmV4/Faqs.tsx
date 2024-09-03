import { FC, ReactNode } from 'react'
import { faqs, faqsMigrate, poolType } from './constants'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, cn } from 'gfx-component-lib'
import { useGamma, useRewardToggle } from '../../context'


export const Faqs: FC = () => {
  const {pool} = useGamma()

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
      {(pool.name === poolType.migrate.name ? faqsMigrate : faqs).map((item) => (
        <FAQItem key={item.question} {...item} />
      ))}
    </Accordion>
  </div>
  )
}
const FAQItem:FC<{key: string, question:string, answer:ReactNode|ReactNode[]}> = ({question,answer}) => (
  <AccordionItem key={question} value={question}>
    <AccordionTrigger>{question}</AccordionTrigger>
    <AccordionContent>{answer}</AccordionContent>
  </AccordionItem>
)