import useBreakPoint from '@/hooks/useBreakPoint'
import { Connect } from '@/layouts'
import { useWallet } from '@solana/wallet-adapter-react'
import { DialogClose, Button, Icon } from 'gfx-component-lib'
import { useDarkMode } from '@/context'
import { IconWithFallback } from '../common/IconWithFallback'
import { loadIconImage } from '@/utils'
import { JupToken } from '@/pages/FarmV4/constants'
import dayjs from 'dayjs'
import DateTimeInputWithDialog from '../DateTimeInputWithDialog'

interface AddTimeframeStepProps {
  currentStep: number
  setCurrentStep: (step: number) => void
  summary: React.ReactNode
  selectedToken: JupToken
  key: string
  startDate: dayjs.Dayjs
  endDate: dayjs.Dayjs
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

  return (
    <div className="grid grid-cols-5 gap-10 w-full">
      <div className={`p-6 flex flex-col ${isMobile ? 'col-span-5' : 'col-span-3'}`}>
        <div className="flex flex-row items-center justify-between gap-3 mb-2">
          <h1 className="text-lg font-semibold text-text-lightmode-primary dark:text-text-darkmode-primary">
            Add Timeframe
          </h1>
          {isMobile && (
            <div className="flex flex-row items-center gap-3">
              <Icon
                src="/img/assets/question-icn.svg"
                alt="help"
                className="w-[30px] h-[30px] cursor-pointer"
                onClick={() => window.open('https://www.goosefx.io/gamma#faqs')}
              />
              <DialogClose>
                <Icon src="/img/assets/rewards_close.svg" alt="Close" className="w-4 h-4" />
              </DialogClose>
            </div>
          )}
        </div>

        <p className="text-sm text-text-lightmode-secondary dark:text-text-darkmode-secondary mb-6">
          Choose a date and time limit for token rewards, all timeframes are based on UTC time.
        </p>

        {connected ? (
          <>
            {selectedToken ? (
              <div className="grid grid-cols-[auto_auto_auto] w-max gap-1 items-center">
                <div className="flex flex-row items-center gap-3 mb-2">
                  <IconWithFallback
                    src={loadIconImage(selectedToken?.logoURI, mode)}
                    size={'sm'}
                    className={'rounded-circle'}
                  />
                  <p>{selectedToken?.symbol}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-end"> {dayjs(endDate).diff(startDate, 'days')} Days</p>
                </div>
                <DateTimeInputWithDialog value={startDate} onChange={setStartDate} />
                <p>to</p>
                <DateTimeInputWithDialog value={endDate} onChange={setEndDate} />
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

        <div className="flex justify-between pt-8 mt-auto">
          <Button
            onClick={() => setCurrentStep(currentStep - 1)}
            className="px-4 py-2 text-text-lightmode-primary dark:text-text-darkmode-primary"
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
        <div className="py-6 px-5 flex flex-col items-center col-span-2 bg-grey-5 dark:bg-black-1">
          <DialogClose>
            <Icon src="/img/assets/rewards_close.svg" alt="Close" className="w-4 h-4 absolute right-5 top-5" />
          </DialogClose>
          {summary}
        </div>
      )}
    </div>
  )
}
