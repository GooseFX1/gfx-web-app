import React, { FC, useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { PublicKey } from '@solana/web3.js'
import { tokenListAbortTokenGamma, useConnectionConfig, useDarkMode, useGamma } from '../../context'
import { GAMMA_SORT_CONFIG, POOL_TYPE, TOKEN_LIST_PAGE_SIZE } from './constants'
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
  Popover,
  PopoverAnchor,
  PopoverContent,
  Switch
} from 'gfx-component-lib'
import RadioOptionGroup from '@/components/common/RadioOptionGroup'
import SearchBar from '@/components/common/SearchBar'
import useBoolean from '@/hooks/useBoolean'
import FarmItems from './FarmItems'
import Portfolio from './Portfolio'
import useBreakPoint from '../../hooks/useBreakPoint'
import FarmSort from '@/pages/FarmV4/FarmSort'
import { aborter, loadIconImage } from '@/utils'
import { InfiniteTokenList } from '@/pages/FarmV4/InfiniteTokenList'
import useFirstRender from '@/hooks/useFirstRender'
import { IconWithFallback } from '@/components/common/IconWithFallback'
import useDebounce from '@/hooks/useDebounce'

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
    selectedTokens,
    removeSelectedToken,
    addSelectedToken,
    hasSelectedToken,
    isLoadingTokenList,
    topBalancesWithTokenList,
    tokenList,
    createPoolType,
    updateTokenList,
    setTokenList,
    isPortfolio,
    isCardMode,
    setIsCardMode
  } = useGamma()
  const { wallet, publicKey } = useWallet()
  const [isSortFilterOpen, setIsSortFilterOpen] = useBoolean(false)
  const [focusOnSearch, setFocusOnSearch] = useBoolean(false)
  const [tokenListSearchValue, setTokenListSearchValue] = useState('')
  const pubKey: PublicKey | null = useMemo(
    () => (wallet?.adapter?.publicKey ? wallet?.adapter?.publicKey : null),
    [wallet?.adapter?.publicKey]
  )
  const searchBarRef = React.useRef<HTMLDivElement>(null)
  const isFirstRender = useFirstRender()
  const {debounce, abortDebounce} = useDebounce()
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

  useEffect(() => {
    if (isFirstRender) return
    console.log('farmTrigger')
    // faking search
    if (tokenListSearchValue.trim().length == 0) {
      aborter.abortSignal(tokenListAbortTokenGamma)
      setTokenList([])
      return
    }
    debounce(
      () =>
        updateTokenList(
          {
            page: 1,
            pageSize: TOKEN_LIST_PAGE_SIZE,
            tokenType: currentPoolType.name.toLowerCase(),
            searchValue: tokenListSearchValue
          },
          false
        ),
      250
    )
    return () => {
      abortDebounce()
    }
  }, [tokenListSearchValue, currentPoolType])
  const isExpandedSearchOpen = tokenListSearchValue.length > 0
  const tokenRenderList = tokenListSearchValue.length > 0 || createPoolType === 'primary' || !publicKey
    ? tokenList
    : topBalancesWithTokenList
  return (
    <div className={'flex flex-col gap-3.75'}>
      {!isPortfolio ? (
        <>
          <div className="flex items-center max-sm:flex-col max-sm:gap-2 sm-lg:flex-col sm-lg:gap-2 mt-7.5">
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
              <Popover open={isExpandedSearchOpen || focusOnSearch}>
                <PopoverAnchor className={'w-[550px] mr-auto'}
                  ref={searchBarRef}
                >
                  <SearchBar
                    onChange={(e) => setTokenListSearchValue(e?.target?.value)}
                    onClear={() => setTokenListSearchValue('')}
                    value={tokenListSearchValue}
                    className={'flex-1 bg-white dark:bg-black-2'}
                    onFocusCapture={setFocusOnSearch.on}
                    onBlurCapture={setFocusOnSearch.off}
                    isLoading={tokenListSearchValue.trim().length > 0 && isLoadingTokenList}
                    additionalInputElementLeft={
                      <div className={'inline-flex gap-2'}>
                        {selectedTokens.map((token) => (
                          <Badge variant="default" size={'lg'}
                            key={`main-search-${token.symbol}`}
                            className={`
                                 from-brand-secondaryGradient-primary/30
                                 to-brand-secondaryGradient-secondary/30 py-[2.5px] gap-1 before:z-0 
                                 `}>
                            <IconWithFallback size={'sm'} src={loadIconImage(token.logoURI, mode)}
                                  className={'rounded-full'}
                                  onClick={() => removeSelectedToken(token)} />
                            <h5 className={'text-text-lightmode-primary dark:text-text-white'}>{token.symbol}</h5>
                            <IconWithFallback
                              className={`!w-[11px] !h-[11px] !min-w-[11px] !min-h-[11px] z-0 cursor-pointer`}
                                  src={`/img/assets/close-${mode}.svg`}
                                  onClick={() => {
                                    removeSelectedToken(token)
                                  }} />
                          </Badge>
                        ))}</div>}
                  />
                </PopoverAnchor>
                <PopoverContent onOpenAutoFocus={(e) => e.preventDefault()}
                  onMouseDown={(e) => e.preventDefault()}
                  style={{
                    width: `${searchBarRef.current?.clientWidth ?? 600}px`
                  }}
                  align={'center'}
                  side={'bottom'}
                  avoidCollisions={false}
                >
                  {tokenListSearchValue && tokenRenderList.length == 0 && !isLoadingTokenList ?
                    <div className={`mb-auto p-2
                  text-text-lightmode-tertiary dark:text-text-darkmode-tertiary
                  `}>
                      No Tokens Found..
                    </div> : null}
                  {!tokenListSearchValue && focusOnSearch ? <div className={`mb-auto p-2
                  text-text-lightmode-tertiary dark:text-text-darkmode-tertiary
                  `}>
                    Search for token or paste mint address
                  </div> : null}
                  {tokenListSearchValue && <InfiniteTokenList
                    useRenderListLength={tokenListSearchValue.trim().length > 0}
                    tokenRenderList={tokenRenderList}
                    onTokenSelect={(t) => {
                      setTokenListSearchValue('')
                      addSelectedToken(t)
                    }}
                    checkDisabled={(t) => hasSelectedToken(t)
                      || isLoadingTokenList ||
                      selectedTokens.length == 2}
                    RenderAs={({ children, className, ...props }) => <Button
                      {...props}
                      fullWidth
                      variant={''}
                      className={cn(`p-1.5 text-start rounded-[3px] h-auto
                       hover:bg-background-lightmode-primary hover:dark:bg-background-darkmode-primary
                      `, className)}
                    >
                      {children}
                    </Button>}
                  />}
                </PopoverContent>
              </Popover>
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
                      {(currentSort !== '1' || showCreatedPools || showDeposited) ? <img
                        className={`absolute top-0.5 left-0 border-1 border-solid w-2.5 h-2.5
                        border-background-lightmode-primary dark:border-background-darkmode-primary rounded-full`}
                        src={'/img/assets/red-notification-circle.svg'}
                      /> : null}
                    </Button>
                    <Dialog open={isSortFilterOpen} onOpenChange={setIsSortFilterOpen.set}>
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
                            {!isPortfolio &&
                              <div className="flex items-center justify-between mb-2">
                                <span className="h-full text-regular text-left dark:text-grey-2 
                                  text-grey-1 font-semibold mr-3">
                                  Layout
                                </span>
                                <Switch
                                  variant={'secondary'}
                                  size={'md'}
                                  switchType={'icon'}
                                  iconLeft={
                                    <IconWithFallback
                                      size={'xs'}
                                      src={isCardMode === 'card' ? 
                                        "/img/assets/list.svg" : "/img/assets/list-active.svg"}
                                    />}
                                  iconRight={
                                    <IconWithFallback
                                      size={'xs'}
                                      src={isCardMode === 'card' ? 
                                        "/img/assets/grid-active.svg" : "/img/assets/grid.svg"} />}
                                      checked={isCardMode === 'card'}
                                      onClick={handleLayoutToggle}
                                />
                              </div>
                            }
                            {pubKey != null && (
                              <>
                                <div className="flex items-center justify-between ">
                                  <span
                                    className="h-full text-regular text-left dark:text-grey-2 
                                    text-grey-1 font-semibold">
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
                                <div className="flex items-center justify-between">
                                  <span
                                    className="h-full text-regular text-left dark:text-grey-2 
                                    text-grey-1 font-semibold">
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
                              </>
                            )}
                          </div>
                          <h4 className="dark:text-white text-black-4 py-2">Sort By</h4>
                          <div className={'grid grid-cols-2 gap-3'}>
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
                                  <span className="m-0 text-regular font-bold">{s.name}</span>
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
