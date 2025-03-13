import { Dispatch, ElementType, FC, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react'
import {
  Badge,
  Button,
  cn,
  Container,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  InputElementLeft,
  InputGroup,
  Skeleton,
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from 'gfx-component-lib'
import { TokenListToken, useDarkMode, useGamma } from '../../context'
import { JupToken, POOL_LIST_PAGE_SIZE, POPULAR_TOKENS } from './constants'
//import RadioOptionGroup from '@/components/common/RadioOptionGroup'
import useBoolean from '@/hooks/useBoolean'
import Text from '@/components/Text'
import { fetchAndConcatAllPoolsByMints, fetchTokensByPublicKey } from '@/api/gamma'
import { GAMMAPool } from '@/types/gamma'
import { useWallet } from '@solana/wallet-adapter-react'
import { loadIconImage, numberFormatter } from '@/utils'
import SearchBar from '@/components/common/SearchBar'
import { useWalletBalance } from '@/context/walletBalanceContext'
import Decimal from 'decimal.js-light'
import { InfiniteTokenList } from '@/pages/FarmV4/InfiniteTokenList'
import { IconWithFallback } from '@/components/common/IconWithFallback'
import useTokensQuery from '@/queries/useTokensQuery'

const Step2: FC<{
  tokenA: TokenListToken
  setTokenA: Dispatch<SetStateAction<TokenListToken>>
  tokenB: TokenListToken
  setTokenB: Dispatch<SetStateAction<TokenListToken>>
  handleChange: (e: any, boolean) => void
  amountTokenA: string
  amountTokenB: string
  feeTier: string
  setFeeTier: Dispatch<SetStateAction<string>>
  poolExists: boolean
  setPoolExists: (b: boolean) => void
  initialPrice: string
  setInitialPrice: Dispatch<SetStateAction<string>>
  walletTokenA: string
  walletTokenB: string
  setIsCreatePool: Dispatch<SetStateAction<boolean>>
  poolType: string | null
}> = ({
  tokenA,
  setTokenA,
  tokenB,
  setTokenB,
  handleChange,
  amountTokenA,
  amountTokenB,
  // feeTier,
  // setFeeTier,
  poolExists,
  setPoolExists,
  initialPrice,
  setInitialPrice,
  walletTokenA,
  walletTokenB,
  setIsCreatePool,
  poolType
}) => {
  const { mode } = useDarkMode()
  const [priceSwitch, setPriceSwitch] = useState(false)
  const [poolExistsText, setPoolExistsText] = useState<string>('')
  const [existingPool, setExistingPool] = useState<GAMMAPool>()
  const { setSelectedCard, setOpenDepositWithdrawSlider } = useGamma()
  const { connected } = useWallet()
  const { balance } = useWalletBalance()
  const [aToBRatio, setAToBRatio] = useBoolean(true)

  useEffect(() => {
    if (+amountTokenA && +amountTokenB) {
      !priceSwitch
        ? setInitialPrice((+amountTokenA / +amountTokenB)?.toString())
        : setInitialPrice((+amountTokenB / +amountTokenA)?.toString())
    } else {
      setInitialPrice('')
    }
  }, [amountTokenA, amountTokenB, priceSwitch])

  const navigateToPool = useCallback(async () => {
    if (!tokenA || !tokenB) return
    setSelectedCard(existingPool)
    setIsCreatePool(false)
    setOpenDepositWithdrawSlider(true)
  }, [tokenA, tokenB, existingPool, setSelectedCard])
  const { priceAToB, priceBToA, priceError } = useMemo(() => {
    if (!tokenA || !tokenB)
      return {
        priceAToB: '',
        priceBToA: ''
      }
    if (new Decimal(tokenA.price).isZero() || new Decimal(tokenB.price).isZero()) {
      return {
        priceAToB: '0.00',
        priceBToA: '0.00',
        priceError: `Price Data Unavailable`
      }
    }
    const priceAToB = new Decimal(tokenA.price).div(tokenB.price).toFixed(tokenA.decimals)
    const priceBToA = new Decimal(tokenB.price).div(tokenA.price).toFixed(tokenB.decimals)

    return {
      priceAToB,
      priceBToA
    }
  }, [tokenA, tokenB])

  useEffect(() => {
    if (!tokenA || !tokenB) return
    const fetchPools = async () => {
      console.log('fetching pools')
      const response = await fetchAndConcatAllPoolsByMints({
        mintA: tokenA?.address,
        mintB: tokenB?.address,
        page: 1,
        pageSize: POOL_LIST_PAGE_SIZE
      })
      console.log('here', response)
      if (!response || !response.pools || !response.pools || response.pools.length <= 0) return
      for (const pool of response.pools) {
        if (pool?.mintA?.address == tokenA?.address && pool?.mintB?.address == tokenB?.address) {
          setPoolExists(true)
          setPoolExistsText(`${tokenA?.symbol} - ${tokenB?.symbol}`)
          setExistingPool(pool)
          return
        }
        if (pool?.mintA?.address == tokenB?.address && pool?.mintB?.address == tokenA?.address) {
          setPoolExists(true)
          setPoolExistsText(`${tokenB?.symbol} - ${tokenA?.symbol}`)
          setExistingPool(pool)
          return
        }
      }
      setPoolExists(false)
    }

    fetchPools()
  }, [tokenA, tokenB, setPoolExists])

  return (
    <>
      <div
        className="text-regular !text-grey-2 dark:!text-grey-1 border-b border-solid dark:border-black-4
              border-grey-4 p-2.5 h-17"
      >
        <span className="text-purple-3">Step 1</span> of 2
        <h2 className="dark:text-grey-8 text-black-4 font-semibold font-sans text-[18px] mt-2">Pool Settings</h2>
      </div>
      <div
        className="p-3 flex flex-col overflow-scroll border-b-none border-solid
          dark:border-black-4 border-grey-4 gap-5"
      >
        <div>
          <div className="flex flex-row justify-between items-center mb-2.5">
            <h4>1. Select Token A</h4>
            <div
              className={cn('flex flex-row items-center', !tokenA && 'invisible')}
              onClick={() =>
                handleChange(
                  {
                    target: {
                      value: walletTokenA
                    }
                  },
                  true
                )
              }
            >
              <img
                src={`/img/assets/wallet-${mode}-${walletTokenA !== '0.00' ? 'enabled' : 'disabled'}.svg`}
                alt="wallet"
                className="mr-1.5"
              />
              <span
                className={cn(
                  'text-regular font-semibold dark:text-grey-2 text-black-4',
                  walletTokenA === '0.00' && 'text-text-lightmode-secondary dark:text-text-darkmode-secondary'
                )}
              >
                {numberFormatter(+walletTokenA)} {tokenA?.symbol}
              </span>
            </div>
          </div>
          <TokenSelectionInput
            token={tokenA}
            otherToken={tokenB}
            handleChange={handleChange}
            amountToken={amountTokenA}
            setToken={setTokenA}
          />
        </div>
        <div>
          <div className="flex flex-row justify-between items-center mb-2.5">
            <h4>2. Select Token B</h4>
            <div
              className={cn('flex flex-row items-center', !tokenB && 'invisible')}
              onClick={() =>
                handleChange(
                  {
                    target: {
                      value: walletTokenB
                    }
                  },
                  false
                )
              }
            >
              <img
                src={`/img/assets/wallet-${mode}-${walletTokenB !== '0.00' ? 'enabled' : 'disabled'}.svg`}
                alt="wallet"
                className="mr-1.5"
              />
              <span
                className={cn(
                  'text-regular font-semibold dark:text-grey-2 text-black-4',
                  walletTokenB === '0.00' && 'text-text-lightmode-secondary dark:text-text-darkmode-secondary'
                )}
              >
                {numberFormatter(+walletTokenB)} {tokenB?.symbol}
              </span>
            </div>
          </div>
          <TokenSelectionInput
            token={tokenB}
            otherToken={tokenA}
            handleChange={(e) => handleChange(e, false)}
            amountToken={amountTokenB}
            setToken={setTokenB}
          />
        </div>
        <div>
          <div className="flex flex-row justify-between items-center mb-2.5">
            <Tooltip>
              <TooltipTrigger className={`dark:text-grey-8 text-black-4 underline !decoration-dotted`}>
                <h4>3. Initial Price</h4>
              </TooltipTrigger>
              <TooltipContent className={'z-[1001]'} align={'start'}>
                The initial price is based on the ratio of tokens you deposit for initial liquidity.
              </TooltipContent>
            </Tooltip>
            <div
              className={cn('flex flex-row items-center cursor-pointer', (!tokenA || !tokenB) && 'invisible')}
              onClick={() => {
                setPriceSwitch((prev) => !prev)
                setAToBRatio.toggle()
              }}
            >
              <img src={`/img/assets/switch_${mode}.svg`} alt="switch" className="mr-1.5" />
              <span
                className={cn(`text-regular font-bold dark:text-white
                text-blue-1 underline cursor-pointer`)}
              >
                {!priceSwitch
                  ? `${tokenA?.symbol} per ${tokenB?.symbol}`
                  : `${tokenB?.symbol} per ${tokenA?.symbol}`}
              </span>
            </div>
          </div>
          <div
            className="h-[45px] dark:bg-black-1 bg-grey-5 flex p-2
                    flex-row justify-between rounded-[3px] border border-solid dark:border-black-4
                    border-grey-4 items-center"
          >
            <span className="text-regular font-semibold dark:text-grey-8 text-black-4">{initialPrice}</span>
            <span
              className={cn(
                'text-regular font-semibold dark:text-grey-1 text-grey-9',
                (!tokenA || !tokenB) && 'invisible'
              )}
            >
              {!priceSwitch ? `${tokenA?.symbol} / ${tokenB?.symbol}` : `${tokenB?.symbol} / ${tokenA?.symbol}`}
            </span>
          </div>
          {priceAToB && priceBToA && (
            <div className={'inline-flex justify-between items-center w-full'}>
              <p
                className={`text-text-lightmode-secondary dark:text-text-darkmode-secondary text-h4 font-semibold`}
              >
                1.0 {aToBRatio ? tokenA?.symbol : tokenB?.symbol}
                <Button
                  className={`cursor-pointer text-blue-1 dark:text-white text-[20px] font-bold p-1 h-max`}
                  variant={'link'}
                  onClick={setAToBRatio.toggle}
                >
                  ≈
                </Button>
                {aToBRatio ? priceAToB : priceBToA} {aToBRatio ? tokenB?.symbol : tokenA?.symbol}
              </p>
              {priceError && (
                <span
                  className={cn(`text-regular font-bold dark:text-text-red
                text-text-red underline `)}
                >
                  {priceError}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-row justify-between items-center">
          <Tooltip>
            <TooltipTrigger className={`dark:text-grey-8 text-black-4 underline !decoration-dotted`}>
              <h4>4. Type</h4>
            </TooltipTrigger>
            <TooltipContent className={'z-[1001]'} align={'start'}>
              Stable: Stablecoin to stablecoin token pools only <br />
              Primary: Tokens such as SOL, LSTs and bluechips <br />
              Hyper: Any other tokens or memecoins
            </TooltipContent>
          </Tooltip>

          {poolType ? (
            <Badge
              size={'lg'}
              className={`py-1.75 pl-1.75 pr-3 from-brand-secondaryGradient-primary/30
                                 to-brand-secondaryGradient-secondary/30`}
            >
              <img
                src={
                  poolType === 'Stable'
                    ? `/img/assets/farm_primary.svg`
                    : `/img/assets/farm_${poolType.toLowerCase()}.svg`
                }
                alt={poolType}
                height={20}
                width={20}
                className="mr-[5px]"
              />
              {poolType === 'Stable' ? 'Primary' : poolType}
            </Badge>
          ) : (
            <div
              className={`border border-solid dark:border-black-4 border-grey-4 rounded-[3px]
              py-1.75 px-3 bg-grey-5 dark:bg-black-1`}
            >
              <h5 className="text-grey-1">No Type</h5>
            </div>
          )}
        </div>
        {/* <div>
            <div className="font-sans text-regular font-semibold dark:text-grey-8 text-black-4">
              4. Fee Tier
            </div>
            <RadioOptionGroup
              defaultValue={'deposit'}
              value={feeTier}
              className={`w-full mt-3 max-sm:mt-1`}
              optionClassName={`w-full text-h5`}
              options={[
                {
                  value: '0.01',
                  label: '0.01%',
                  onClick: () => setFeeTier('0.01')
                },
                {
                  value: '0.04',
                  label: '0.04%',
                  onClick: () => setFeeTier('0.04')
                },
                {
                  value: '0.7',
                  label: '0.7%',
                  onClick: () => setFeeTier('0.7')
                },
                {
                  value: '1',
                  label: '1%',
                  onClick: () => setFeeTier('1')
                }
              ]}
            />
          </div> */}
        {/* We need the swap component here but later */}
        {tokenA &&
        tokenB &&
        ((+amountTokenA && +amountTokenB && (+amountTokenA > +walletTokenA || +amountTokenB > +walletTokenB)) ||
          balance[tokenA?.address].tokenAmount.uiAmount <= 0.0 ||
          balance[tokenB?.address].tokenAmount.uiAmount <= 0.0) ? (
          <span className="text-red-1 font-sembold text-regular">
            {connected ? "You don't have enough tokens in the wallet!" : 'Please connect your wallet to proceed!'}
          </span>
        ) : tokenA && tokenB && tokenA?.symbol === tokenB?.symbol ? (
          <span className="text-red-1 font-sembold text-regular">
            Token A and Token B cannot be same! Please create a pool with two different mints!
          </span>
        ) : (
          <></>
        )}
        {poolExists && (
          <div>
            <Container className={'flex flex-col gap-2.5 p-2.5'}>
              <Text as={'h3'}>Existing Pool!</Text>
              <Text as={'p'}>The {poolExistsText} pool exists. Start adding your funds now!</Text>
              <Button fullWidth colorScheme={'blue'} onClick={navigateToPool}>
                Go to {poolExistsText} Pool
              </Button>
            </Container>
          </div>
        )}
      </div>
    </>
  )
}

function TokenSelectionInput({
  token,
  handleChange,
  amountToken,
  setToken,
  otherToken
}: {
  token: JupToken | null
  otherToken: JupToken | null
  handleChange: (e: any, boolean) => void
  amountToken: string
  setToken: Dispatch<SetStateAction<JupToken>>
}) {
  const [searchValue, setSearchValue] = useState('')
  const query = useTokensQuery({searchValue})
  const [isDropDownOpen, setIsDropdownOpen] = useBoolean(false)
  const { mode, isDarkMode } = useDarkMode()
  // const [scrollingContainerRef, setScrollingContainerRef] = useState<HTMLDivElement>(null)
  const [popularTokens, setPopularTokens] = useState<JupToken[]>([])
  const [loadingPopularTokens, setLoadingPopularTokens] = useBoolean(false)
  const { publicKey } = useWalletBalance()

  useEffect(() => {
    setLoadingPopularTokens.on()
    fetchTokensByPublicKey([...POPULAR_TOKENS].join(','))
      .then((res) => {
        if (res.success) {
          setPopularTokens(res.data.tokens)
        }
      })
      .finally(() => setLoadingPopularTokens.off())
  }, [])
  const tokenList = query.data.allPages ?? [];
  return (
    <InputGroup
      leftItem={
        <InputElementLeft>
          <DropdownMenu open={isDropDownOpen} onOpenChange={setIsDropdownOpen.set}>
            <DropdownMenuTrigger asChild className={'focus-visible:outline-none'}>
              <Button
                colorScheme={'secondaryGradient'}
                variant={'outline'}
                className="min-w-[115px] h-[35px] rounded-full flex flex-row justify-between"
                iconLeft={
                  token ? (
                    <IconWithFallback
                      src={loadIconImage(token?.logoURI, mode)}
                      size={'sm'}
                      className={'rounded-circle'}
                    />
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
                disabled={false}
              >
                {token ? token.symbol : 'Select Token'}
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
                placeholder={'Search by token name symbol or address'}
                value={searchValue}
                onKeyDown={(e) => e.stopPropagation()}
                onChange={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setSearchValue(e.target.value)
                }}
                onClear={() => setSearchValue('')}
                isLoading={query.isFetching}
              />
              <div
                className={cn(
                  `border-b border-solid dark:border-black-4 border-grey-4`,
                  !publicKey && !searchValue.trim().length && 'border-none'
                )}
              >
                <h5
                  className={`my-2 dark:text-text-darkmode-secondary 
                                        text-text-lightmode-secondary`}
                >
                  Popular
                </h5>
                <div className={'flex md:pb-2 gap-3 overflow-scroll'}>
                  {loadingPopularTokens ? (
                    <>
                      <Skeleton className={'h-[35px] w-[80px]'} />
                      <Skeleton className={'h-[35px] w-[80px]'} />
                      <Skeleton className={'h-[35px] w-[80px]'} />
                      <Skeleton className={'h-[35px] w-[80px]'} />
                    </>
                  ) : (
                    popularTokens.map((token) => (
                      <Button
                        className={`border-solid dark:border-black-4 border-grey-4 border 
                          cursor-pointer p-1 flex rounded-[4px] min-w-[80px] md:min-w-[60px] grow shrink`}
                        key={token?.address}
                        onClick={() => {
                          setToken(token)
                          setIsDropdownOpen.off()
                        }}
                        disabled={otherToken?.address == token?.address || query.isFetching}
                        iconLeft={
                          <IconWithFallback
                            src={loadIconImage(token?.logoURI, mode)}
                            size={'sm'}
                            className={'rounded-circle'}
                          />
                        }
                      >
                        <span
                          className={`font-bold dark:text-text-darkmode-secondary 
                                        text-text-lightmode-secondary`}
                        >
                          {token?.symbol}
                        </span>
                      </Button>
                    ))
                  )}
                </div>
              </div>
              {searchValue && tokenList.length == 0 && !query.isFetching ? (
                <div className={'mb-auto p-2'}>No Tokens Found..</div>
              ) : null}
              {tokenList.length > 0 ? (
                <InfiniteTokenList
                  tokenList={tokenList}
                  isLoading={query.isFetching}
                  fetchNextPage={query.fetchNextPage}
                  maxTokensReached={query.data.maxPagesReached}
                  onTokenSelect={(token) => {
                    setToken(token)
                    setSearchValue('')
                  }}
                  RenderAs={DropdownMenuItem}
                  checkDisabled={(t) => t?.address == otherToken?.address || query.isFetching}
                />
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        </InputElementLeft>
      }
    >
      <Input
        type="text"
        placeholder={`0.00 ${token ? token.symbol : ''}`}
        onChange={(e) => handleChange(e, true)}
        value={amountToken}
        className={'h-[45px] text-right'}
        // disabled={!token}
      />
    </InputGroup>
  )
}

export default Step2

export function TokenListSkeleton({ RenderAs }: { RenderAs: ElementType }) {
  return (
    <RenderAs
      disabled={false}
      className={`
                cursor-wait p-1.5 border-1 border-transparent flex flex-row w-full gap-3 items-center
                        hover:border-border-lightmode-secondary dark:hover:border-border-darkmode-secondary`}
    >
      <Skeleton className={'w-[25px] h-[25px] rounded-full'} />
      <div className={'flex flex-col gap-1'}>
        <Skeleton className={`w-[56px] h-[20px] rounded-[2px]`} />
        <Skeleton className={`w-[88px] h-[18px] rounded-[2px]`} />
      </div>
      <div className={'flex flex-col gap-1 ml-auto'}>
        <Skeleton className={`w-[56px] h-[20px] rounded-[2px]`} />
        <Skeleton className={`w-[56px] h-[20px] rounded-[2px]`} />
      </div>
    </RenderAs>
  )
}
