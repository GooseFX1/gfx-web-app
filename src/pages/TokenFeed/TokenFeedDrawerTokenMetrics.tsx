import React, { FC, useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  RadioGroup,
  RadioGroupItem
} from 'gfx-component-lib'
import { H4, P } from '@/components/text/TextComponents'
import ProgressBar from '@/components/ProgressBar'
const TokenFeedMetricRow: FC<{
  selectedToken: any // TODO: replace
  timeFrame: string
  isBuy?: boolean
}> = ({
  selectedToken,
  timeFrame,
  isBuy = true
                            })=><div className={`flex gap-2 justify-between`}>
  <div className={'flex flex-col w-full gap-1'}>
    <P className={`text-b2`}>{timeFrame.toUpperCase()} Volume</P>
    <H4>{selectedToken?.volume ?? '$70.5k'}</H4>
  </div>
  <div className={'flex flex-col w-full gap-1'}>
    <P className={`text-b2`}>Net Volume</P>
    <H4>{selectedToken?.netVolume ?? '$1.6k'}</H4>
  </div>
  <div className={'flex flex-col w-full gap-1'}>
    <P className={`text-b2`}>{isBuy ? 'Buy' : 'Sell'}</P>
    <ProgressBar progressPercentage={50} progressBarMeterClass={!isBuy ? 'bg-background-red' : ''}/>
  </div>
</div>
function TokenFeedDrawerTokenMetrics({selectedToken}:{
  selectedToken: any // TODO: replace
}) {
  const [timeFrame, setTimeFrame] = useState('24h')

  return (
    <Accordion type={'multiple'}
               className={`w-full bg-background-lightmode-primary dark:bg-background-darkmode-primary
                        rounded `}>
      <AccordionItem value={'toke-metrics'}>
        <AccordionTrigger>
          <H4 className={`text-text-lightmode-primary dark:text-text-darkmode-primary`}>
            Token Metrics
          </H4>
        </AccordionTrigger>
        <AccordionContent className={`flex flex-col gap-4 `}>
          <RadioGroup defaultValue={'24h'} value={timeFrame} onValueChange={setTimeFrame}>
            <RadioGroupItem value={'5m'} variant={'primary'} className={`h-7`}>
              5m
            </RadioGroupItem>
            <RadioGroupItem value={'1h'} variant={'primary'} className={`h-7`}>
              1h
            </RadioGroupItem>
            <RadioGroupItem value={'6h'} variant={'primary'} className={`h-7`}>
              6h
            </RadioGroupItem>
            <RadioGroupItem value={'24h'} variant={'primary'} className={`h-7`}>
              24h
            </RadioGroupItem>
          </RadioGroup>
          <div className={`flex flex-col gap-2`}>
            <TokenFeedMetricRow selectedToken={selectedToken} timeFrame={timeFrame}/>
            <TokenFeedMetricRow selectedToken={selectedToken} timeFrame={timeFrame} isBuy={false}/>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default TokenFeedDrawerTokenMetrics