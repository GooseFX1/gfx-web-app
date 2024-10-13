import { FC, useCallback, useEffect, useLayoutEffect, useMemo } from 'react'
import { PublicKey } from '@solana/web3.js'
import { useConnectionConfig, useDarkMode, useGamma, useRewardToggle } from '../../context'
import { GAMMA_SORT_CONFIG, POOL_TYPE } from './constants'
import { useWallet } from '@solana/wallet-adapter-react'
import { Badge, Button, cn, Dialog, DialogBody, DialogContent, DialogOverlay, Icon, Switch } from 'gfx-component-lib'
import RadioOptionGroup from '@/components/common/RadioOptionGroup'
import SearchBar from '@/components/common/SearchBar'
import useBoolean from '@/hooks/useBoolean'
import FarmItems from './FarmItems'
import Portfolio from './Portfolio'
import useBreakPoint from '../../hooks/useBreakPoint'
import FarmSort from '@/pages/FarmV4/FarmSort'

export const FarmContainer: FC = () => {
  const { mode } = useDarkMode()
  const breakpoint = useBreakPoint()
  const { userCache, updateUserCache } = useConnectionConfig()
  const {
    currentPoolType,
    openDepositWithdrawSlider,
    setCurrentPoolType,
    searchTokens,
    setSearchTokens,
    showCreatedPools,
    setShowCreatedPools,
    currentSort,
    setCurrentSort,
    showDeposited,
    setShowDeposited
  } = useGamma()
  const { wallet } = useWallet()
  const [isSortFilterOpen, setIsSortFilterOpen] = useBoolean(false)
  const { isPortfolio } = useRewardToggle()

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
    return ()=>{
      document.body.style.overflow = 'auto'
    }
  }, [openDepositWithdrawSlider])

  //TODO: need to change the calculation upon getting onchain data
  const numberOfTokensDeposited = 0

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
  
  const handleSort = useCallback(
    (id: string) => {
      // persists current sort in local storage
      setCurrentSort(() => {
        updateUserCache({
          gamma: {
            ...userCache.gamma,
            currentSort: id
          }
        })
        // sets value to context
        return id
      })
    },
    [setCurrentSort, userCache]
  )

  return (
    <div className={'flex flex-col gap-3.75'}>
      {!isPortfolio ? (
        <>
          <div className="flex items-center max-sm:flex-col max-sm:gap-">
            <RadioOptionGroup
              defaultValue={'All'}
              value={currentPoolType.name}
              className={'w-full min-md:w-max gap-1.25 max-sm:gap-0 max-sm:grid-cols-3 min-md:mr-2'}
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
            <div className="flex items-center w-full justify-between">
              <SearchBar
                onChange={(e) => setSearchTokens(e?.target?.value)}
                onClear={() => setSearchTokens('')}
                value={searchTokens}
                className={'!max-w-full flex-1 bg-white dark:bg-black-2'}
              />
              <div className="flex justify-between">
                {breakpoint.isMobile ? (
                  <div>
                    <Button className="p-0 !h-[35px] !w-[35px] mx-2" variant={'ghost'}>
                      <Icon
                        src={`img/assets/farm_filter_${mode}.svg`}
                        size={'md'}
                        className={'!max-h-[35px] !max-w-[35px] !h-[35px] !w-[35px]'}
                        onClick={() => (isSortFilterOpen ? setIsSortFilterOpen.off() : setIsSortFilterOpen.on())}
                      />
                    </Button>
                    <Dialog open={isSortFilterOpen} onOpenChange={setIsSortFilterOpen.set}>
                      <DialogOverlay />
                      <DialogContent
                        className={`flex flex-col gap-0 max-h-[500px] h-full border-1 border-solid z-[1001] 
                          overflow-hidden dark:border-border-darkmode-secondary 
                          border-border-lightmode-secondary max-sm:rounded-b-none`}
                        placement={'bottom'}
                      >
                        <DialogBody className={'flex-col flex-[1 0] p-2 overflow-auto pb-0'}>
                          <h4 className="dark:text-white text-black-4 pb-2">Filters</h4>
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
                          <h4 className="dark:text-white text-black-4 py-2">Sort By</h4>

                          <div className={'grid grid-cols-1 gap-3'}>
                            {GAMMA_SORT_CONFIG.map((s) => (
                              <label className={`flex items-center`} key={s.id}>
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
                                      `,
                                    `w-full h-[35px]`
                                  )}
                                >
                                  <input
                                    type="radio"
                                    name="sort"
                                    value={s.id}
                                    checked={currentSort === s.id}
                                    onChange={() => handleSort(s.id)}
                                    className={'hidden'}
                                  />
                                  <span className="m-0 text-regular font-bold pl-2">{s.name}</span>
                                </Badge>
                              </label>
                            ))}
                          </div>
                        </DialogBody>
                      </DialogContent>
                    </Dialog>
                  </div>
                ) : (
                  <FarmSort isOpen={isSortFilterOpen} setIsOpen={setIsSortFilterOpen.set} />
                )}

                <div className={'flex flex-row ml-auto gap-3.75'}>
                  {pubKey != null && (
                    <div className="flex items-center mr-2">
                      <Switch
                        variant={'default'}
                        size={'sm'}
                        colorScheme={'primary'}
                        checked={showDeposited}
                        onClick={handleShowDepositedToggle}
                      />
                      <div
                        className="h-full text-tiny text-left dark:text-grey-2 text-grey-1 
                        font-semibold ml-2 leading-1 py-1"
                      >
                        Show <br /> Deposited
                      </div>
                    </div>
                  )}
                </div>
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
