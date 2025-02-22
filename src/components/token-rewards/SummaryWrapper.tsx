import useBreakPoint from '@/hooks/useBreakPoint'
import { Connect } from '@/layouts'
import { useWallet } from '@solana/wallet-adapter-react'
import { DialogClose, Icon } from 'gfx-component-lib'

interface SummaryWrapperProps {
  children: React.ReactNode
  key: string
}

export const SummaryWrapper = ({ children }: SummaryWrapperProps) => {
  const { isMobile } = useBreakPoint()
  const { connected } = useWallet()

  return (
    <div className="grid grid-cols-5 gap-10 w-full">
      <div className={`p-6 flex flex-col ${isMobile ? 'col-span-5' : 'col-span-3'}`}>
        <div className="flex flex-row items-center justify-between gap-3 mb-2">
          <h1 className="text-lg font-semibold text-text-lightmode-primary dark:text-text-darkmode-primary">
            Summary
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

        {connected ? <>{children}</> : <Connect containerStyle="w-max" />}
      </div>
    </div>
  )
}
