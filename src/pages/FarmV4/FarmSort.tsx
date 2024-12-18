import React, { useCallback } from 'react'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemIndicator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  Icon,
  RadioGroup,
  RadioGroupItemAsIndicator,
  Switch
} from 'gfx-component-lib'
import { GAMMA_SORT_CONFIG } from '@/pages/FarmV4/constants'
import { useConnectionConfig, useDarkMode, useGamma } from '@/context'
import { useWalletBalance } from '@/context/walletBalanceContext'

function FarmSort({ isOpen, setIsOpen }: {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}) {
  const { userCache, updateUserCache } = useConnectionConfig()
  const {
    showCreatedPools,
    setShowCreatedPools,
    currentSort,
    handlePoolSort,
    showDeposited,
    setShowDeposited
  } = useGamma()
  const { mode } = useDarkMode()
  const { publicKey} = useWalletBalance();

  const handleFilterByCreated = useCallback(
    () => {
      setShowCreatedPools((prev) => {
        updateUserCache({
          gamma: {
            ...userCache.gamma,
            showCreatedFilter: !prev
          }
        })

        return !prev
      })
    },
    [showCreatedPools, userCache]
  )

  const handleShowDepositedToggle = () => {
    setShowDeposited((prev) => {
      updateUserCache({
        gamma: {
          ...userCache.gamma,
          showDepositedFilter: !prev
        }
      })

      return !prev
    })
  }
  console.log({publicKey})
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild className={'focus-visible:outline-none'}>
        <Button className="p-0 !h-[35px] !w-[35px] mx-3 relative" variant={'ghost'}>
          <Icon
            src={`img/assets/farm_filter_${mode}.svg`}
            size={'md'}
            className={'!max-h-[35px] !max-w-[35px] !h-[35px] !w-[35px]'}
          />
          {(currentSort !== '1' || showCreatedPools) ? <img
            className={`absolute top-0.5 left-0 border-1 border-solid w-2.5 h-2.5
                        border-background-lightmode-primary dark:border-background-darkmode-primary rounded-full`}
            src={'/img/assets/red-notification-circle.svg'}
          />:null}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent portal={false} align={'end'}>
        <>
          <h4 className="dark:text-white text-black-4 pb-2">Filters</h4>
          <div className={'flex flex-col gap-3'}>
            <div className="flex items-center justify-between ">
                            <span
                              className="h-full text-regular text-left dark:text-grey-2 text-grey-1
                                              font-semibold"
                            >
                            Show created pools
                            </span>
              <Switch
                variant={'default'}
                size={'sm'}
                colorScheme={'primary'}
                checked={showCreatedPools}
                onClick={handleFilterByCreated}
              />
            </div>
            {publicKey != null && (
              <div className="flex items-center justify-between">
                              <span
                                className="h-full text-regular text-left dark:text-grey-2 text-grey-1
                                              font-semibold"
                              >
                                Show Deposited
                              </span>
                <Switch
                  variant={'default'}
                  size={'sm'}
                  colorScheme={'primary'}
                  checked={showDeposited}
                  onClick={handleShowDepositedToggle}
                />
              </div>
            )}
          </div>

        </>

        <h4 className="dark:text-white text-black-4 py-2">Sort By</h4>

        <DropdownMenuRadioGroup asChild value={currentSort} onValueChange={(id) => handlePoolSort(id)}>
          <div className={'grid grid-cols-2 gap-1.5 items-center'}>
            {GAMMA_SORT_CONFIG.map((s) => (
              <DropdownMenuItem isActive={currentSort == s.id} asChild key={s.id}>
                <DropdownMenuRadioItem value={s.id}>
                  <DropdownMenuItemIndicator asChild forceMount className={'hidden'}>
                    <RadioGroup value={currentSort}>
                      <RadioGroupItemAsIndicator value={s.id} />
                    </RadioGroup>
                  </DropdownMenuItemIndicator>
                  <div className={'w-full text-center'}>
                    <p className={'text-b3 px-2 font-bold'}>{s.name}</p>
                  </div>
                </DropdownMenuRadioItem>
              </DropdownMenuItem>
            ))}
          </div>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default FarmSort