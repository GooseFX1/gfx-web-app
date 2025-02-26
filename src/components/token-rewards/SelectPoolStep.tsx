import useBreakPoint from '@/hooks/useBreakPoint'
import { Connect } from '@/layouts'
import { useWallet } from '@solana/wallet-adapter-react'
import {
  DialogClose,
  DropdownMenuTrigger,
  DropdownMenu,
  InputElementLeft,
  InputGroup,
  Button,
  Badge,
  cn,
  DropdownMenuContent,
  Input,
  DropdownMenuItem,
  Icon
} from 'gfx-component-lib'
import SearchBar from '../common/SearchBar'
import { GAMMAPool, GAMMAPoolWithUserLiquidity } from '@/types/gamma'
import useBoolean from '@/hooks/useBoolean'
import { useDarkMode } from '@/context'
import { useWalletBalance } from '@/context/walletBalanceContext'
import { IconWithFallback } from '../common/IconWithFallback'
import { loadIconImage, numberFormatter, truncateAddress } from '@/utils'
import { CSSProperties, ElementType, useMemo, useState } from 'react'
import { InfiniteProPoolScrollView } from '@/pages/FarmV4/InfiniteProPoolList'
import { usePools } from '@/hooks/usePools'

interface SelectPoolStepProps {
  currentStep: number
  setCurrentStep: (step: number) => void
  summary: React.ReactNode
  pool: GAMMAPool | null
  setPool: (pool: GAMMAPool | null) => void
  key: string
}

export const SelectPoolStep = ({ currentStep, setCurrentStep, summary, pool, setPool }: SelectPoolStepProps) => {
  const { isMobile } = useBreakPoint()
  const { connected } = useWallet()
  const { mode } = useDarkMode()

  const {
    pools: createdPools,
    poolsHasMoreData: poolsHasMoreDataCreatedPools,
    loadMorePools: loadMoreCreatedPools
  } = usePools({
    poolType: 'all',
    sortKey: 'volume24h',
    searchTokens: '',
    showDeposited: false,
    showCreated: false,
    pageSize: 10,
    sortOrder: 'desc'
  })

  return (
    <div className="grid grid-cols-5 w-full">
      <div className={`flex flex-col ${isMobile ? 'col-span-5' : 'col-span-3'}`}>
        <div className="py-2.5 px-6 flex flex-col">
          <div className="flex flex-row items-center justify-between gap-3 mb-2">
            <h1 className="text-lg font-semibold text-text-lightmode-primary dark:text-text-darkmode-primary">
              Select Pool
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

          <p className="text-sm text-text-lightmode-secondary dark:text-text-darkmode-secondary mb-6">
            Connect your wallet and select the pool you would like to add boosted rewards to:
          </p>

          {connected ? (
            <>
              <div className="relative mb-6">
                <PoolSelectInput pool={pool} setPool={setPool} />
              </div>

              <p className="text-sm text-text-lightmode-secondary dark:text-text-darkmode-secondary mb-4">
                Or select from the pools you already created
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 max-h-[300px] overflow-y-auto">
                {createdPools.length === 0 && <div className="text-red-600">No pools created</div>}
                {createdPools.map((createdPool, index) => (
                  <Button
                    key={index}
                    className={`h-[44px] p-3 rounded-sm border 
                      dark:bg-black-1 border-border-lightmode-primary 
              dark:border-border-darkmode-primary hover:bg-background-lightmode-secondary 
              dark:hover:bg-background-darkmode-secondary transition-colors ${
                pool?.id === createdPool.id ? 'border-2' : ''
              }`}
                    onClick={() => setPool(createdPool)}
                  >
                    <div className="flex justify-between items-center gap-1">
                      <div className="flex items-center">
                        <div className="flex flex-row items-center">
                          <IconWithFallback
                            src={loadIconImage(createdPool.mintA.logoURI, mode)}
                            className="border-solid dark:border-black-2 border-white
                          border-[2px] rounded-full h-[25px] w-[25px]"
                          />
                          <IconWithFallback
                            src={loadIconImage(createdPool.mintB.logoURI, mode)}
                            className="relative right-[5px] border-solid dark:border-black-2
                          border-white border-[2px] rounded-full h-[25px] w-[25px]"
                          />
                        </div>
                        <span
                          className="text-start text-sm font-poppins font-semibold 
                      dark:text-grey-8 text-black-4 max-sm:text-tiny"
                        >
                          {createdPool.mintA.symbol} - {createdPool.mintB.symbol}
                        </span>
                      </div>
                      <div className="text-sm text-text-lightmode-secondary dark:text-text-darkmode-secondary">
                        Liq. $
                        {parseFloat(createdPool?.tvl || '0')
                          ? numberFormatter(Math.max(0, parseFloat(createdPool?.tvl || '0')))
                          : '0.00'}
                      </div>
                    </div>
                  </Button>
                ))}
                {poolsHasMoreDataCreatedPools && (
                  <Button className="w-full h-full" onClick={() => loadMoreCreatedPools()}>
                    Load more
                  </Button>
                )}
              </div>
            </>
          ) : (
            <Connect containerStyle="w-max" />
          )}
        </div>

        <div className="px-6 py-2.5 flex justify-between mt-auto border-t-1">
          <Button
            onClick={() => setCurrentStep(currentStep - 1)}
            className="px-4 py-2 text-text-lightmode-primary dark:text-text-darkmode-primary underline"
          >
            Back
          </Button>
          {pool && (
            <Button
              className="px-4 py-2 cursor-pointer"
              colorScheme={'blue'}
              variant={'secondary'}
              onClick={() => setCurrentStep(currentStep + 1)}
            >
              Next
            </Button>
          )}
        </div>
      </div>

      {!isMobile && (
        <div className="py-6 px-5 flex flex-col items-center col-span-2 bg-grey-5 dark:bg-black-1">
          <DialogClose>
            <Icon src="/img/assets/rewards_close.svg" alt="Close" className="w-4 h-4 absolute right-5 top-5" />
          </DialogClose>
          {summary}
        </div>
      )}
    </div>
  )
}

function PoolSelectInput({
  pool,
  setPool,
  handleChange,
  disableInput,
  disableTokenDropDown,
  isLocked
}: {
  pool: GAMMAPool
  setPool: (pool: GAMMAPool) => void
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>, isTokenA: boolean) => void
  disableInput?: boolean
  disableTokenDropDown?: boolean
  isLocked?: boolean
}) {
  const [isDropDownOpen, setIsDropdownOpen] = useBoolean(false)
  const { isMobile } = useBreakPoint()
  const { isDarkMode, mode } = useDarkMode()
  const { publicKey, base58PublicKey } = useWalletBalance()

  const [searchValue, setSearchValue] = useState<string>('')

  const formattedTVL = useMemo(() => {
    const liquidity = parseFloat(pool?.tvl || '0')
    return liquidity ? numberFormatter(Math.max(0, liquidity)) : '0.00'
  }, [pool])

  const {
    pools: items,
    isLoadingPools,
    poolsHasMoreData,
    loadMorePools,
    poolPage,
    totalPoolCount
  } = usePools({
    poolType: 'all',
    sortKey: 'volume24h',
    searchTokens: searchValue,
    showDeposited: false,
    showCreated: false,
    pageSize: 10,
    sortOrder: 'desc'
  })

  return (
    <InputGroup
      leftItem={
        <InputElementLeft>
          <DropdownMenu open={isDropDownOpen} onOpenChange={setIsDropdownOpen.set}>
            <DropdownMenuTrigger asChild className={'focus-visible:outline-none'} disabled={disableTokenDropDown}>
              <Button
                colorScheme={'secondaryGradient'}
                variant={'outline'}
                className="min-w-[115px] h-[35px] rounded-full flex flex-row justify-between z-10"
                iconLeft={
                  pool ? (
                    <div className="flex flex-row items-center">
                      <IconWithFallback
                        src={loadIconImage(pool.mintA.logoURI, mode)}
                        className="border-solid dark:border-black-2 border-white
                          border-[2px] rounded-full h-[25px] w-[25px]"
                      />
                      <IconWithFallback
                        src={loadIconImage(pool.mintB.logoURI, mode)}
                        className="relative right-[10px] border-solid dark:border-black-2
                          border-white border-[2px] rounded-full h-[25px] w-[25px]"
                      />
                      <div
                        className="font-poppins text-regular font-semibold 
                      dark:text-grey-8 text-black-4 max-sm:text-tiny"
                      >
                        {pool.mintA.symbol} - {pool.mintB.symbol}
                      </div>

                      {pool.poolCreator === base58PublicKey && !isMobile && (
                        <Badge size="sm" variant="default" className={'ml-1 h-5.5'}>
                          Owner
                        </Badge>
                      )}
                    </div>
                  ) : null
                }
                iconRight={
                  <IconWithFallback
                    style={{
                      transform: `rotate(${isDropDownOpen ? '180deg' : '0deg'})`,
                      transition: 'transform 0.2s ease-in-out'
                    }}
                    src={`/img/assets/farm-chevron-${mode}.svg`}
                    className={cn(!isDarkMode ? 'stroke-background-blue' : '')}
                    size={'sm'}
                  />
                }
                disabled={disableTokenDropDown}
              >
                {!pool && 'Select or Search'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className={cn(
                `flex flex-col mt-1 z-[1001] h-auto max-h-[396px] w-[464px] max-sm:w-[338px] relative pb-0`,
                !publicKey && !searchValue.trim().length && 'pb-2'
              )}
              portal={true}
              align={'start'}
            >
              <SearchBar
                groupClassName={'sticky'}
                placeholder={'Search by token symbol'}
                value={searchValue}
                onKeyDown={(e) => e.stopPropagation()}
                onChange={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setSearchValue(e.target.value)
                }}
                onClear={() => setSearchValue('')}
                isLoading={isLoadingPools}
                disabled={disableTokenDropDown}
              />
              {searchValue && items.length == 0 && !isLoadingPools ? (
                <div className={'mb-auto p-2'}>No Tokens Found..</div>
              ) : null}
              <p className="text-sm text-text-lightmode-primary dark:text-text-darkmode-primary font-extrabold py-2">
                Top Pools
              </p>
              <InfiniteProPoolScrollView
                itemPadding={15}
                render={(pool: GAMMAPoolWithUserLiquidity) =>
                  pool ? (
                    <PoolSelectItem
                      pool={pool}
                      RenderAs={DropdownMenuItem}
                      style={{}}
                      onClick={() => setPool(pool)}
                      disabled={false}
                    />
                  ) : null
                }
                items={items}
                currentSort="desc"
                poolsHasMoreData={poolsHasMoreData}
                updatePools={loadMorePools}
                poolPage={poolPage}
                isLoadingPools={isLoadingPools}
                totalPoolCount={totalPoolCount}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </InputElementLeft>
      }
    >
      <Input
        type="text"
        placeholder=""
        onChange={(e) => handleChange(e, true)}
        value={`24H Liq. ${formattedTVL}`}
        className={cn(
          'h-[45px] text-right',
          disableInput &&
            isLocked &&
            'disabled:text-text-lightmode-secondary disabled:dark:text-text-darkmode-secondary'
        )}
        disabled={disableInput}
      />
    </InputGroup>
  )
}

function PoolSelectItem({
  pool,
  RenderAs,
  style,
  onClick,
  disabled
}: {
  pool: GAMMAPoolWithUserLiquidity
  RenderAs: ElementType
  style: CSSProperties
  onClick: () => void
  disabled: boolean
}) {
  const { mode } = useDarkMode()
  const { base58PublicKey } = useWalletBalance()
  const { isMobile } = useBreakPoint()

  return (
    <div style={style}>
      <RenderAs
        className={`cursor-pointer p-1.5 border-1 border-transparent flex 
                    hover:border-border-lightmode-secondary dark:hover:border-border-darkmode-secondary
                    py-2
                    `}
        onClick={onClick}
        key={pool?.mintA.address + pool?.mintB.address}
        disabled={disabled}
      >
        <div className={'flex w-full flex-1'}>
          <div className={`flex gap-2`}>
            <div className="flex flex-row items-center">
              <IconWithFallback
                src={loadIconImage(pool.mintA.logoURI, mode)}
                className="border-solid dark:border-black-2 border-white
          border-[2px] rounded-full h-[25px] w-[25px]"
              />
              <IconWithFallback
                src={loadIconImage(pool.mintB.logoURI, mode)}
                className="relative right-[10px] border-solid dark:border-black-2
          border-white border-[2px] rounded-full h-[25px] w-[25px]"
              />
              <div className="flex flex-col items-start">
                <div
                  className="font-poppins text-regular font-semibold dark:text-grey-8 text-black-4 
                max-sm:text-tiny whitespace-nowrap"
                >
                  {pool.mintA.symbol} - {pool.mintB.symbol}
                </div>
                <span className={'inline-flex gap-1'}>
                  <a
                    href={`https://solscan.io/account/${pool.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className={'ml-auto'}
                  >
                    <Badge
                      variant="default"
                      size={'lg'}
                      className={'to-brand-secondaryGradient-secondary/50 gap-1 h-[18px]'}
                    >
                      <h6 className={''}>{truncateAddress(pool.id, 3)}</h6>
                      <IconWithFallback
                        src={`/img/assets/arrowcircle-${mode}.svg`}
                        className={'!h-[15px] !w-[15px] !min-h-[15px] !min-w-[15px]'}
                      />
                    </Badge>
                  </a>
                </span>
              </div>

              {/* {!isMobile &&
          <IconWithFallback src={`img/assets/farm_${pool.pool_type}.svg`} size="sm" className="ml-1.5" />
        } */}
              {pool.poolCreator === base58PublicKey && !isMobile && (
                <Badge size="sm" variant="default" className={'ml-1 h-5.5'}>
                  Owner
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className={'w-full ml-auto flex flex-col gap-1 items-end'}>
          <p
            className={`text-b2 font-bold dark:text-text-darkmode-primary 
                            text-text-lightmode-primary`}
          >
            24H Volume
          </p>
          <p
            className={`text-b3 dark:text-text-darkmode-secondary text-text-lightmode-secondary 
                            truncate font-semibold
                            `}
          >
            ${numberFormatter(Math.max(0, pool.stats.daily.volumeTokenAUSD + pool.stats.daily.volumeTokenBUSD))}
          </p>
        </div>
      </RenderAs>
    </div>
  )
}
