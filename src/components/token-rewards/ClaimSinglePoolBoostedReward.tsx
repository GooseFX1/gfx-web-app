import { loadIconImage } from '@/utils/misc'
import { IconWithFallback } from '../common/IconWithFallback'
import { GAMMAToken } from '@/types/gamma'
import { useDarkMode } from '@/context'
import { Button } from 'gfx-component-lib'

export function ClaimSinglePoolBoostedReward({ token, amount }: { token: GAMMAToken; amount: string }) {
  const { mode } = useDarkMode()
  const total = 0

  return (
    <div className="flex flex-col gap-[10px]">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-[5px]">
          <IconWithFallback
            src={loadIconImage(token.logoURI, mode)}
            className="border-solid dark:border-black-2 border-white
                          border-[2px] rounded-full h-[25px] w-[25px]"
          />
          <p
            className="font-display font-semibold text-[15px] 
          text-text-lightmode-primary dark:text-text-darkmode-primary"
          >
            {token.symbol}
          </p>
        </div>
        <p
          className="font-display font-semibold text-[15px] 
        text-text-lightmode-secondary dark:text-text-darkmode-secondary"
        >
          {amount} {token.symbol} / day
        </p>
      </div>
      <Button
        className="w-full py-[5px] px-[10px] 
        border-[1px] border-transparent bg-gradient-to-r from-[#F7931A] to-[#C31AE3] p-[1px]
      "
        colorScheme={'blue'}
        variant={'outline'}
      >
        <div
          className="bg-white dark:bg-black-1 h-full w-full rounded-[999px] 
        flex items-center justify-center"
        >
          Claim ${total}
        </div>
      </Button>
    </div>
  )
}
