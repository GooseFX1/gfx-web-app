import useBreakPoint from '@/hooks/useBreakPoint'
import { Connect } from '@/layouts'
import { useWallet } from '@solana/wallet-adapter-react'
import { DialogClose } from 'gfx-component-lib'

interface SelectPoolStepProps {
  setCurrentStep: (step: number) => void
  summary: React.ReactNode
}

export const SelectPoolStep = ({ setCurrentStep, summary }: SelectPoolStepProps) => {
  const { isMobile } = useBreakPoint()
  const { connected } = useWallet()

  const mockPools = [
    { pair: 'SOL-USDC', liquidity: '11.87K' },
    { pair: 'SOL-USDC', liquidity: '11.87K' },
    { pair: 'SOL-USDC', liquidity: '11.87K' },
    { pair: 'SOL-USDC', liquidity: '11.87K' },
    { pair: 'SOL-USDC', liquidity: '11.87K' }
  ]

  return (
    <div className="grid grid-cols-5 gap-10 w-full">
      <div className={`p-6 flex flex-col ${isMobile ? 'col-span-5' : 'col-span-3'}`}>
        <div className="flex flex-row items-center justify-between gap-3 mb-2">
          <h1 className="text-lg font-semibold text-text-lightmode-primary dark:text-text-darkmode-primary">
            Select Pool
          </h1>
          {isMobile && (
            <div className="flex flex-row items-center gap-3">
              <img
                src="/img/assets/question-icn.svg"
                alt="help"
                className="w-[30px] h-[30px] cursor-pointer"
                onClick={() => window.open('https://www.goosefx.io/gamma#faqs')}
              />
              <DialogClose>
                <img src="/img/assets/rewards_close.svg" alt="Close" className="w-4 h-4" />
              </DialogClose>
            </div>
          )}
        </div>

        <p className="text-sm text-text-lightmode-secondary dark:text-text-darkmode-secondary mb-6">
          Connect your wallet and select the pool you would like to add boosted rewards to:
        </p>

        {connected ? (
          <>
            <div className="relative mb-6">
              <button
                className="w-full p-3 rounded-sm border dark:bg-black-1 border-border-lightmode-primary 
          dark:border-border-darkmode-primary text-text-lightmode-secondary dark:text-text-darkmode-secondary
          hover:bg-background-lightmode-secondary dark:hover:bg-background-darkmode-secondary
          flex items-center justify-between"
              >
                <span>Select or search</span>
                <img src="/img/assets/chevron-down.svg" alt="dropdown" className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-text-lightmode-secondary dark:text-text-darkmode-secondary mb-4">
              Or select from the pools you already created
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockPools.map((pool, index) => (
                <button
                  key={index}
                  className="p-3 rounded-sm border dark:bg-black-1 border-border-lightmode-primary 
              dark:border-border-darkmode-primary hover:bg-background-lightmode-secondary 
              dark:hover:bg-background-darkmode-secondary transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <img src="/img/assets/sol-usdc.svg" alt="SOL-USDC" className="w-6 h-6" />
                    <span className="text-text-lightmode-primary dark:text-text-darkmode-primary">
                      {pool.pair}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-text-lightmode-secondary dark:text-text-darkmode-secondary">
                    Liq. ${pool.liquidity}
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <Connect containerStyle="w-max" />
        )}

        <div className="flex justify-between mt-8 mt-auto">
          <button
            onClick={() => setCurrentStep(0)}
            className="px-4 py-2 text-text-lightmode-primary dark:text-text-darkmode-primary"
          >
            Back
          </button>
          <button
            className="px-6 py-2 bg-primary-lightmode text-white rounded-sm
            hover:bg-primary-lightmode/90 transition-colors"
          >
            Next
          </button>
        </div>
      </div>

      {!isMobile && (
        <div className="py-6 px-10 flex flex-col items-center col-span-2 dark:bg-black-1">
          <DialogClose>
            <img src="/img/assets/rewards_close.svg" alt="Close" className="w-4 h-4 absolute right-5 top-5" />
          </DialogClose>
          {summary}
        </div>
      )}
    </div>
  )
}
