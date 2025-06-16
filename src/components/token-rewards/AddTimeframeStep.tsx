import useBreakPoint from '@/hooks/useBreakPoint'
import { Connect } from '@/layouts'
import { useWallet } from '@/hooks/useWallet'
import { DialogClose, Button, Icon } from 'gfx-component-lib'
import { useDarkMode } from '@/context'
import { IconWithFallback } from '../common/IconWithFallback'
import { loadIconImage } from '@/utils'
import { JupToken } from '@/pages/FarmV4/constants'
import dayjs from 'dayjs'
import DateTimeInputWithDialog from '../DateTimeInputWithDialog'
import { useMemo } from 'react'
import { StepCounter, totalSteps } from './StepCounter'

interface AddTimeframeStepProps {
  currentStep: number
  setCurrentStep: (step: number) => void
  summary: React.ReactNode
  selectedToken: JupToken
  key: string
  startDate: dayjs.Dayjs | null
  endDate: dayjs.Dayjs | null
  setStartDate: (date: dayjs.Dayjs) => void
  setEndDate: (date: dayjs.Dayjs) => void
}

export const AddTimeframeStep = ({
  currentStep,
  setCurrentStep,
  summary,
  selectedToken,
  startDate,
  endDate,
  setStartDate,
  setEndDate
}: AddTimeframeStepProps) => {
  const { isMobile } = useBreakPoint()
  const { connected } = useWallet()
  const { mode } = useDarkMode()
  const endBefore = useMemo(() => startDate?.add(1, 'day').toDate(), [startDate])

  return (
    <div className="grid grid-cols-5 w-full h-full">
      <div className={`flex flex-col h-full ${isMobile ? 'col-span-5' : 'col-span-3'}`}>
        <div
          className={`pb-2.5 ${isMobile ? ' pt-3' : 'pt-4'} px-4 flex flex-col`}
        >
          <div
            className={`flex flex-row items-center justify-between gap-3 mb-2 ${
              isMobile
                ? 'pb-2 border-b-1 border-border-lightmode-secondary dark:border-border-darkmode-secondary'
                : ''
            }`}
          >
            <h1 className="text-lg font-semibold text-text-lightmode-primary dark:text-text-darkmode-primary">
              Add Timeframe
            </h1>
            {isMobile ? (
              <div className="flex flex-row items-center gap-3">
                <StepCounter currentStep={3} totalSteps={totalSteps()} />
                <Icon
                  src="/img/assets/question-icn.svg"
                  alt="help"
                  className="w-[30px] h-[30px] cursor-pointer"
                  onClick={() => window.open('https://www.goosefx.io/gamma#faqs')}
                />
                <DialogClose>
                  <Icon
                    src={`/img/assets/rewards_close-${mode}.svg`}
                    alt="Close"
                    className="w-4 h-4 min-w-[25px] min-h-[25px]"
                  />
                </DialogClose>
              </div>
            ) : (
              <div className="flex flex-row items-center gap-3">
                <StepCounter currentStep={3} totalSteps={totalSteps()} />
                <Icon
                  src="/img/assets/question-icn.svg"
                  alt="help"
                  className="w-[30px] h-[30px] cursor-pointer"
                  onClick={() => window.open('https://www.goosefx.io/gamma#faqs')}
                />
              </div>
            )}
          </div>

          <p className="text-sm text-text-lightmode-secondary dark:text-text-darkmode-secondary mb-6">
            Choose a date and time limit for token rewards, all timeframes are based on UTC time.
          </p>

          {connected ? (
            <>
              {selectedToken ? (
                <div className="flex flex-col w-full gap-1">
                  <div className="flex flex-row justify-between items-center gap-1 mb-2">
                    <div className="flex flex-row items-center gap-3">
                      <IconWithFallback
                        src={loadIconImage(selectedToken?.logoURI, mode)}
                        size={'sm'}
                        className={'rounded-circle'}
                      />
                      <p>{selectedToken?.symbol}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-end">
                        {endDate && startDate ? Math.ceil(dayjs(endDate).diff(startDate, 'days',true)): 0} Days
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-[auto_14px_auto] items-center gap-1 *:w-full">
                    <div className="col-span-1">
                      <DateTimeInputWithDialog
                        value={startDate}
                        onChange={setStartDate}
                        triggerClassName={'w-full'}
                      />
                    </div>
                    <p className="w-max">to</p>
                    <div className="col-span-1">
                      <DateTimeInputWithDialog
                        value={endDate}
                        onChange={setEndDate}
                        disabled={{
                          before: endBefore
                        }}
                        triggerClassName={'w-full'}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-4 py-2 text-text-lightmode-primary dark:text-text-darkmode-primary"
                >
                  Back
                </Button>
              )}
            </>
          ) : (
            <Connect containerStyle="w-max" />
          )}
        </div>

        <div
          className="px-4 py-2.5 flex justify-between mt-auto border-t-1 
        border-border-lightmode-secondary dark:border-border-darkmode-secondary"
        >
          <Button
            onClick={() => setCurrentStep(currentStep - 1)}
            className="px-4 py-2 text-text-lightmode-primary dark:text-text-darkmode-primary underline"
          >
            Back
          </Button>
          {startDate && endDate && isMobile && (
            <Button
              className="px-4 py-2 cursor-pointer"
              colorScheme={'blue'}
              variant={'secondary'}
              onClick={() => setCurrentStep(currentStep + 1)}
            >
              Next
            </Button>
          )}
        </div>
      </div>

      {!isMobile && (
        <div className="py-4 px-4 flex flex-col items-center col-span-2 bg-grey-5 dark:bg-black-1">
          <DialogClose>
            <Icon
              src={`/img/assets/rewards_close-${mode}.svg`}
              alt="Close"
              className="w-4 h-4 absolute right-5 top-5 min-w-[25px] min-h-[25px]"
            />
          </DialogClose>
          {summary}
        </div>
      )}
    </div>
  )
}
