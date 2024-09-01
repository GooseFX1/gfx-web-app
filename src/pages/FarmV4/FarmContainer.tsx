import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { PublicKey } from '@solana/web3.js'
import { useConnectionConfig, useDarkMode, useGamma, useRewardToggle } from '../../context'
import { poolType } from './constants'
import { useWallet } from '@solana/wallet-adapter-react'
import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogOverlay,
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
  Switch,
  Badge,
  cn
} from 'gfx-component-lib'
import RadioOptionGroup from '@/components/common/RadioOptionGroup'
import SearchBar from '@/components/common/SearchBar'
import useBoolean from '@/hooks/useBoolean'
import FarmItems from './FarmItems'
import Portfolio from './Portfolio'
import useBreakPoint from '../../hooks/useBreakPoint'

export const FarmContainer: FC = () => {
  const { mode } = useDarkMode()
  const breakpoint = useBreakPoint()
  const { userCache, updateUserCache } = useConnectionConfig()
  const { pools, GAMMA_SORT_CONFIG, operationPending, pool, setPool } = useGamma()
  const { wallet } = useWallet()
  const [isSortFilterOpen, setIsSortFilterOpen] = useBoolean(false)
  const [searchTokens, setSearchTokens] = useState<string>('')
  const [showDeposited, setShowDeposited] = useState<boolean>(userCache.gamma.showDepositedFilter)
  const { isPortfolio } = useRewardToggle()
  const [currentSort, setCurrentSort] = useState<string>('1')
  const [showCreatedPools, setShowCreatedPools] = useBoolean(false)

  const pubKey: PublicKey | null = useMemo(
    () => (wallet?.adapter?.publicKey ? wallet?.adapter?.publicKey : null),
    [wallet?.adapter?.publicKey]
  )

  //TODO: need to change the calculation upon getting onchain data
  const numberOfTokensDeposited = 0

  const filteredPools = useMemo(() => {
    const filterPools = (pools) =>
      pools.filter((pool) => {
        const matchesSearch =
          !searchTokens ||
          pool.sourceToken.toLowerCase().includes(searchTokens.toLowerCase()) ||
          pool.targetToken.toLowerCase().includes(searchTokens.toLowerCase())
        const matchesCreated = !showCreatedPools || pool.isOwner === true
        return matchesSearch && matchesCreated
      })

    const sortPools = (filteredPools) => {
      const sort = GAMMA_SORT_CONFIG.find((config) => config.id === currentSort)
      if (!sort) return filteredPools
      return filteredPools.sort((a, b) => {
        switch (sort.name) {
          case GAMMA_SORT_CONFIG[0].name:
            return b.liquidity - a.liquidity
          case GAMMA_SORT_CONFIG[1].name:
            return a.liquidity - b.liquidity
          case GAMMA_SORT_CONFIG[2].name:
            return b.volume - a.volume
          case GAMMA_SORT_CONFIG[3].name:
            return a.volume - b.volume
          case GAMMA_SORT_CONFIG[4].name:
            return b.fees - a.fees
          case GAMMA_SORT_CONFIG[5].name:
            return a.fees - b.fees
          case GAMMA_SORT_CONFIG[6].name:
            return b.apr - a.apr
          case GAMMA_SORT_CONFIG[7].name:
            return a.apr - b.apr
          default:
            return 0
        }
      })
    }

    return sortPools(filterPools(pools))
  }, [searchTokens, showCreatedPools, pools, currentSort, GAMMA_SORT_CONFIG])

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

  const initiateGlobalSearch = (value: string) => {
    setPool(poolType.all)
    setSearchTokens(value)
  }

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
    (e: any) => {
      console.log(e)
      showCreatedPools ? setShowCreatedPools.off() : setShowCreatedPools.on()
    },
    [showCreatedPools]
  )

  return (
    <div className={'flex flex-col gap-3.75'}>
      {!isPortfolio ? (
        <>
          <div className="flex items-center max-sm:flex-col max-sm:gap-4">
            <RadioOptionGroup
              defaultValue={'All'}
              value={pool.name}
              className={'w-full min-md:w-max gap-1.25 max-sm:gap-0 max-sm:grid-cols-4 mr-2'}
              optionClassName={`min-md:w-[85px]`}
              options={[
                {
                  value: poolType.primary.name,
                  label: 'Primary',
                  onClick: () => (operationPending ? null : setPool(poolType.primary))
                },
                {
                  value: poolType.hyper.name,
                  label: 'Hyper',
                  onClick: () => (operationPending ? null : setPool(poolType.hyper))
                },
                {
                  value: poolType.migrate.name,
                  label: 'Migrate',
                  onClick: () => (operationPending ? null : setPool(poolType.migrate))
                }
              ]}
            />
            <div className="flex items-center w-full justify-between">
              <SearchBar
                onChange={(e) => initiateGlobalSearch(e.target.value)}
                onClear={() => setSearchTokens('')}
                value={searchTokens}
                className={'!max-w-full flex-1 bg-white dark:bg-black-2'}
              />
              <div className="flex justify-between ml-3">
                {breakpoint.isMobile ? (
                  <div>
                    <Button className="ml-auto p-0 !h-[35px] !w-[35px] mr-3" variant={'ghost'}>
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
                                    onChange={() => setCurrentSort(s.id)}
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
                  <DropdownMenu open={isSortFilterOpen} onOpenChange={setIsSortFilterOpen.set}>
                    <DropdownMenuTrigger asChild className={'focus-visible:outline-none'}>
                      <Button className="ml-auto p-0 !h-[35px] !w-[35px] mr-3" variant={'ghost'}>
                        <Icon
                          src={`img/assets/farm_filter_${mode}.svg`}
                          size={'md'}
                          className={'!max-h-[35px] !max-w-[35px] !h-[35px] !w-[35px]'}
                        />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent portal={false} align={'end'}>
                      <h4 className="dark:text-white text-black-4 pb-2">Filters</h4>
                      <div className="flex items-center justify-between ">
                        <span
                          className="h-full text-regular text-left dark:text-grey-2 text-grey-1 
                        font-semibold mr-3"
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

                      <DropdownMenuRadioGroup asChild value={currentSort} onValueChange={setCurrentSort}>
                        <div className={'grid grid-cols-1 gap-1.5 items-center'}>
                          {GAMMA_SORT_CONFIG.map((s) => (
                            <DropdownMenuItem  isActive={currentSort == s.id} asChild key={s.id}>
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
                        font-semibold ml-2 hidden min-lg:block"
                      >
                        Show <br /> Deposited
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <FarmItems
            tokens={filteredPools}
            numberOfTokensDeposited={numberOfTokensDeposited}
            isSearchActive={searchTokens}
            isDepositedActive={showDeposited}
            isCreatedActive={showCreatedPools}
          />
        </>
      ) : (
        <Portfolio />
      )}
    </div>
  )
}
