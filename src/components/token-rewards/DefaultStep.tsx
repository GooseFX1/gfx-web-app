import { useDarkMode } from '@/context'
import useBreakPoint from '@/hooks/useBreakPoint'
import { DialogClose } from 'gfx-component-lib'

export const DefaultStep = ({ setCurrentStep }: { setCurrentStep: (step: number) => void; key: string }) => {
  const { isMobile } = useBreakPoint()
  const { mode } = useDarkMode()

  console.log(mode)

  return (
    <div className="grid grid-cols-5 gap-10 w-full">
      <div className={`p-6 flex flex-col ${isMobile ? 'col-span-5' : 'col-span-3'}`}>
        <div className="flex flex-row items-center justify-between gap-3 mb-2">
          <h1 className="text-lg font-semibold text-text-lightmode-primary dark:text-text-darkmode-primary">
            Create
          </h1>
          {isMobile && (
            <div className="flex flex-row items-center gap-3">
              <img
                src="img/assets/question-icn.svg"
                alt="primary"
                height={30}
                width={30}
                onClick={() => window.open('https://www.goosefx.io/gamma#faqs')}
                className="cursor-pointer"
              />
              <DialogClose>
                <img src="/img/assets/rewards_close.svg" alt="Close" className="w-4 h-4" />
              </DialogClose>
            </div>
          )}
        </div>
        <p className="text-sm text-text-lightmode-secondary dark:text-text-darkmode-secondary mb-6">
          Let's start by selecting what would you prefer to create
        </p>
        <div className="space-y-4">
          <button
            className={`w-full p-4 rounded-sm border bg-grey-5 dark:bg-black-1 border-border-lightmode-primary 
    dark:border-border-darkmode-primary hover:bg-background-lightmode-secondary 
    dark:hover:bg-background-darkmode-secondary transition-colors text-left`}
            onClick={() => setCurrentStep(1)}
          >
            <div className="flex items-center gap-3 mb-2">
              <img src={`/img/assets/token-rewards-${mode}.svg`} alt="Rewards" className="w-6 h-6" />
              <h3
                className="text-base font-semibold font-sans 
              text-text-lightmode-primary dark:text-text-darkmode-primary"
              >
                Add Token Rewards
              </h3>
            </div>
            <p className="text-sm text-text-lightmode-secondary dark:text-text-darkmode-secondary">
              You can additional token emissions as rewards to LPs in any pool. These boosted rewards accrue extra
              yield for LPs.
            </p>
          </button>
        </div>
      </div>
      {!isMobile && (
        <div className="py-6 px-10 flex flex-col items-center col-span-2 bg-grey-5 dark:bg-black-1">
          <h2 className="text-lg font-semibold mb-3 text-text-lightmode-primary dark:text-text-darkmode-primary">
            Not sure what to create?
          </h2>
          <DialogClose>
            <img src="/img/assets/rewards_close.svg" alt="Close" className="w-4 h-4 absolute right-5 top-5" />
          </DialogClose>
          <img
            src={`/img/assets/help-token-rewards-${mode}.svg`}
            alt="Rewards"
            className="mt-10 w-full max-w-[300px]"
          />
          <div className="mt-8 text-center text-sm text-text-lightmode-secondary dark:text-text-darkmode-secondary">
            See our{' '}
            <a href="#" className="text-primary-lightmode hover:underline">
              Pool Guide
            </a>{' '}
            Or{' '}
            <a href="#" className="text-primary-lightmode hover:underline">
              Farm Guide
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
