import React, { FC, useCallback, useEffect, useLayoutEffect, useMemo } from 'react'
import { PublicKey } from '@solana/web3.js'
import {
  useConnectionConfig,
  useDarkMode,
  useGamma
} from '../../context'
import { GAMMA_SORT_CONFIG, POOL_TYPE } from './constants'
import { useWallet } from '@solana/wallet-adapter-react'
import {
  Badge,
  Button,
  cn,
  Dialog,
  DialogBody,
  DialogCloseDefault,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  Switch
} from 'gfx-component-lib'
import RadioOptionGroup from '@/components/common/RadioOptionGroup'
import useBoolean from '@/hooks/useBoolean'
import FarmItems from './FarmItems'
import Portfolio from './Portfolio'
import useBreakPoint from '../../hooks/useBreakPoint'
import FarmSort from '@/pages/FarmV4/FarmSort'
import { IconWithFallback } from '@/components/common/IconWithFallback'
import TokenSearchBar from '@/pages/FarmV4/TokenSearchBar'

export const FarmContainer: FC = () => {
  const { mode } = useDarkMode()
  const breakpoint = useBreakPoint()
  const { userCache, updateUserCache } = useConnectionConfig()
  const {
    currentPoolType,
    openDepositWithdrawSlider,
    setCurrentPoolType,
    showCreatedPools,
    setShowCreatedPools,
    currentSort,
    showDeposited,
    setShowDeposited,
    filteredPools,
    handlePoolSort,
    isPortfolio,
    isCardMode,
    setIsCardMode
  } = useGamma()
  const { wallet, publicKey } = useWallet()
  const [isSortFilterOpen, setIsSortFilterOpen] = useBoolean(false)
  const pubKey: PublicKey | null = useMemo(
    () => (wallet?.adapter?.publicKey ? wallet?.adapter?.publicKey : null),
    [wallet?.adapter?.publicKey]
  )

  useLayoutEffect(() => {
    if (openDepositWithdrawSlider) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [openDepositWithdrawSlider])

  const numberOfTokensDeposited = filteredPools.reduce((acc, data) => {
    if (data?.hasDeposit) return acc + 1

    return acc
  }, 0)

  useEffect(() => {
    if (pubKey === null && userCache.gamma.showDepositedFilter)
      setShowDeposited(() => {
        updateUserCache({
          gamma: {
            ...userCache.gamma,
            showDepositedFilter: false
          }
        })
        return false
      })
  }, [pubKey, userCache])

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

  const handleFilterByCreated = useCallback(() => {
    setShowCreatedPools((prev) => {
      updateUserCache({
        gamma: {
          ...userCache.gamma,
          showCreatedFilter: !prev
        }
      })

      return !prev
    })
  }, [showCreatedPools, userCache])
  const handleLayoutToggle = useCallback(() => {
    setIsCardMode((prev) => {
      updateUserCache({
        gamma: {
          ...userCache.gamma,
          viewMode: prev === 'card' ? 'row' : 'card'
        }
      })

      return prev === 'card' ? 'row' : 'card'
    })
  }, [isCardMode, userCache])

  return (
    <div className={'flex flex-col gap-3.75'}>
      {!isPortfolio ? (
        <>
          <div className="flex items-center max-sm:flex-col max-sm:gap-2 sm-lg:flex-col sm-lg:gap-2 mt-4.5">
            <RadioOptionGroup
              defaultValue={'All'}
              value={currentPoolType.name}
              className={'w-full min-md:w-max gap-1.25 max-sm:gap-0 min-md:mr-2 items-center'}
              optionClassName={`min-md:w-[85px]`}
              options={[
                {
                  value: POOL_TYPE.primary.name,
                  label: 'Primary',
                  onClick: () => setCurrentPoolType(POOL_TYPE.primary)
                },
                {
                  value: POOL_TYPE.hyper.name,
                  label: 'Hyper',
                  onClick: () => setCurrentPoolType(POOL_TYPE.hyper)
                }
                // {
                //   value: POOL_TYPE.migrate.name,
                //   label: 'Migrate',
                //   onClick: () => setCurrentPoolType(POOL_TYPE.migrate)
                // }
              ]}
            />
            <div className="flex items-center w-full justify-between relative">
              <TokenSearchBar poolType={currentPoolType.name} />
              <div className="flex justify-between items-center">
                {breakpoint.isMobile ? (
                  <div>
                    <Button className="p-0 !h-[35px] !w-[35px] mx-2 relative" variant={'ghost'}>
                      <IconWithFallback
                        src={`img/assets/farm_filter_${mode}.svg`}
                        size={'md'}
                        className={'!max-h-[35px] !max-w-[35px] !h-[35px] !w-[35px]'}
                        onClick={() => (isSortFilterOpen ? setIsSortFilterOpen.off() : setIsSortFilterOpen.on())}
                      />
                      {currentSort !== '1' || showCreatedPools || showDeposited ? (
                        <img
                          className={`absolute top-0.5 left-0 border-1 border-solid w-2.5 h-2.5
                        border-background-lightmode-primary dark:border-background-darkmode-primary rounded-full`}
                          src={'/img/assets/red-notification-circle.svg'}
                        />
                      ) : null}
                    </Button>
                    <Dialog open={isSortFilterOpen} onOpenChange={setIsSortFilterOpen.set}>
                      <DialogPortal>
                        <DialogOverlay />
                        <DialogContent
                          className={`flex flex-col gap-0 max-h-[500px] border-1 border-solid z-[1001] 
                          overflow-hidden dark:border-border-darkmode-secondary h-auto py-3 px-2.5
                          border-border-lightmode-secondary max-sm:rounded-b-none`}
                          placement={'bottom'}
                        >
                          <DialogBody className={'flex-col flex-[1 0] p-2 overflow-auto pb-0'}>
                            <DialogCloseDefault className={'top-5 text-white'} />
                            <h4 className="dark:text-white text-lg text-black-4 pb-2">Filters</h4>
                            <div className={'flex flex-col gap-3'}>
                              {!isPortfolio && (
                                <div className="flex items-center justify-between mb-2">
                                  <span
                                    className="h-full text-regular text-left dark:text-grey-2
                                  text-grey-1 font-semibold mr-3"
                                  >
                                    Layout
                                  </span>
                                  <Switch
                                    variant={'secondary'}
                                    size={'md'}
                                    switchType={'icon'}
                                    iconLeft={
                                      <IconWithFallback
                                        size={'xs'}
                                        src={
                                          isCardMode === 'card'
                                            ? '/img/assets/list.svg'
                                            : '/img/assets/list-active.svg'
                                        }
                                      />
                                    }
                                    iconRight={
                                      <IconWithFallback
                                        size={'xs'}
                                        src={
                                          isCardMode === 'card'
                                            ? '/img/assets/grid-active.svg'
                                            : '/img/assets/grid.svg'
                                        }
                                      />
                                    }
                                    checked={isCardMode === 'card'}
                                    onClick={handleLayoutToggle}
                                  />
                                </div>
                              )}
                              {pubKey != null && (
                                <>
                                  <div className="flex items-center justify-between ">
                                    <span
                                      className="h-full text-regular text-left dark:text-grey-2
                                    text-grey-1 font-semibold"
                                    >
                                      Show created pools
                                    </span>
                                    <Switch
                                      variant={'default'}
                                      size={'md'}
                                      colorScheme={'primary'}
                                      checked={showCreatedPools}
                                      onClick={handleFilterByCreated}
                                    />
                                  </div>
                                  {!isPortfolio && (
                                    <div className="flex items-center justify-between">
                                      <span
                                        className="h-full text-regular text-left dark:text-grey-2
                                    text-grey-1 font-semibold"
                                      >
                                        Show Deposited
                                      </span>
                                      <Switch
                                        variant={'default'}
                                        size={'md'}
                                        colorScheme={'primary'}
                                        checked={showDeposited}
                                        onClick={handleShowDepositedToggle}
                                      />
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                            <h4 className="dark:text-white text-black-4 py-2">Sort By</h4>
                            <div className={'grid grid-cols-2 gap-3'}>
                              {GAMMA_SORT_CONFIG.map((s) => {
                                const component = <label className={`flex items-center`} key={s.id}>
                                  <Badge
                                    className={cn(
                                      currentSort !== s.id &&
                                        `dark:bg-black-1
                                      bg-white
                                      dark:before:to-black-4
                                      dark:before:from-black-4
                                      dark:from-from-black-4
                                      dark:to-from-black-4
                                      before:to-white
                                      before:from-white
                                      from-from-white
                                      to-from-white
                                      justify-start p-1.25
                                      `,
                                      `w-full h-[35px]`
                                    )}
                                  >
                                    <input
                                      type="radio"
                                      name="sort"
                                      value={s.id}
                                      checked={currentSort === s.id}
                                      onChange={() => handlePoolSort(s.id)}
                                      className={'hidden'}
                                      disabled={Number(s.id) >= 9 && !publicKey}
                                    />
                                    <span
                                      className={`m-0 text-regular font-bold
                                     overflow-hidden
                                      overflow-ellipsis
                                      whitespace-nowrap`}
                                    >
                                      {s.name}
                                    </span>
                                  </Badge>
                                </label>
                                if ((!isPortfolio && +s.id < 9) || isPortfolio) {
                                  return component
                                } else {
                                  return null
                                }
                              })}
                            </div>
                          </DialogBody>
                        </DialogContent>
                      </DialogPortal>
                    </Dialog>
                  </div>
                ) : (
                  <FarmSort isOpen={isSortFilterOpen} setIsOpen={setIsSortFilterOpen.set} />
                )}
              </div>
            </div>
          </div>

          <FarmItems numberOfTokensDeposited={numberOfTokensDeposited} isCreatedActive={showCreatedPools} />
        </>
      ) : (
        <Portfolio />
      )}
    </div>
  )
}
