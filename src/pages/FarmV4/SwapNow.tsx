import { FC, ReactElement, useCallback } from 'react'
import { useDarkMode, useGamma } from '@/context'
import { Button, Icon } from 'gfx-component-lib'
import useBreakPoint from '../../hooks/useBreakPoint'
import { loadBackUpImage, loadUriImage } from '@/pages/FarmV4/Step2'

const SwapNow: FC = (): ReactElement => {
  const { selectedCard } = useGamma()
  const { isMobile } = useBreakPoint()
  const {mode} = useDarkMode()
  const handleInitSwap = useCallback(() => {
    if (isMobile) {
      window.open('https://jup.ag/swap', '_blank')
    } else {
      const jupWrapper = document.getElementById('jupiter-terminal-instance')
      if (jupWrapper) {
        ((jupWrapper.childNodes[0] as HTMLElement).children[0] as HTMLElement).click()
      }
    }
  }, [])

  return (
    <div className="mx-2.5">
      <div className={`w-full p-[1px] bg-gradient-1 rounded-tiny`}>
        <div className={`bg-grey-5 dark:bg-black-1 h-full rounded-tiny p-2.5`}>
          <div className="flex flex-row items-center">
            <Icon src="img/assets/jupiter.svg" size="sm" />
            <span className="font-poppins text-average font-semibold dark:text-grey-8 text-black-4 ml-2">
              Swap Now!
            </span>
          </div>
          <div className="text-regular font-semibold dark:text-grey-2 text-grey-1 my-2.5">
            You don't have enough tokens to complete this transaction. No worries, you can quickly swap tokens now
            to get the right amount!
          </div>
          <Button
            className="cursor-pointer bg-blue-1 text-white block mx-auto !w-full"
            variant={'secondary'}
            disabled={!selectedCard}
            onClick={handleInitSwap}
          >
            {selectedCard ? (
              <span className={'flex align-center justify-center font-bold'}>
                <Icon
                  src={
                    loadUriImage(selectedCard?.mintB?.logoURI)
                      ? selectedCard?.mintB?.logoURI
                      : loadBackUpImage(selectedCard?.mintB?.symbol, mode)
                  }
                  size="sm"
                  className={'border-solid border-white border-1 rounded-full mr-1'}
                />
                Swap
                <span className={'font-bold mx-1'}>{selectedCard?.mintB?.symbol}</span>
                Now!
              </span>
            ) : (
              <span>No Selected Pair</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SwapNow
