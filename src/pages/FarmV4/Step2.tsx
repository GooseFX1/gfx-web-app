import { Dispatch, FC, SetStateAction, useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import {
  Badge,
  Button,
  cn,
  Container,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Icon,
  Input,
  InputElementLeft,
  InputGroup,
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from 'gfx-component-lib'
import { useDarkMode, useGamma } from '../../context'
import { JupToken, POPULAR_TOKENS, TOKEN_LIST_PAGE_SIZE } from './constants'
//import RadioOptionGroup from '@/components/common/RadioOptionGroup'
import useBoolean from '@/hooks/useBoolean'
import Text from '@/components/Text'
import ScrollingHydrateContainer from '@/components/common/ScrollingHydrateContainer'
import WindowingContainer from '@/pages/FarmV4/WindowingContainer'
import { fetchPoolsByMints, fetchTokensByPublicKey } from '@/api/gamma'
import { GAMMAPool } from '@/types/gamma'
import { useWallet } from '@solana/wallet-adapter-react'
import { aborter, bigNumberFormatter, loadIconImage, numberFormatter, truncateAddress } from '@/utils'
import SearchBar from '@/components/common/SearchBar'
import { useWalletBalance } from '@/context/walletBalanceContext'
import BigNumber from 'bignumber.js'

const Step2: FC<{
  tokenA: JupToken
  setTokenA: Dispatch<SetStateAction<JupToken>>
  tokenB: JupToken
  setTokenB: Dispatch<SetStateAction<JupToken>>
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
        setIsCreatePool
      }) => {
  const { mode } = useDarkMode()
  const [priceSwitch, setPriceSwitch] = useState(false)
  const [poolExistsText, setPoolExistsText] = useState<string>('')
  const [existingPool, setExistingPool] = useState<GAMMAPool>()
  const { setSelectedCard, setOpenDepositWithdrawSlider } = useGamma()
  const { connected } = useWallet()

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

  useLayoutEffect(() => {
    ;(async () => {
      if (!tokenA || !tokenB) return
      const response = await fetchPoolsByMints(tokenA?.address, tokenB?.address)
      if (!response || !response?.data?.pools || response?.data?.pools?.length <= 0 || !response?.success) return
      for (const pool of response?.data?.pools) {
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
    })()
  }, [tokenA, tokenB, setPoolExists])

  return (
    <>
      <div
        className="text-regular !text-grey-2 dark:!text-grey-1 border-b border-solid dark:border-black-4
              border-grey-4 p-2.5 h-17 "
      >
        <span className="text-purple-3">Step 2</span> of 3
        <h2 className="dark:text-grey-8 text-black-4 font-semibold font-sans text-[18px] mt-2">Pool Settings</h2>
      </div>
      <div
        className="p-3 flex flex-col overflow-scroll border-b-none border-solid
          dark:border-black-4 border-grey-4 gap-5"
      >
        <div>
          <div className="flex flex-row justify-between items-center mb-2.5">
            <div className="font-sans text-regular font-semibold dark:text-grey-8 text-black-4">
              1. Select Token A
            </div>
            <div className={cn('flex flex-row items-center', !tokenA && 'invisible')}>
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
                {walletTokenA} {tokenA?.symbol}
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
            <div className="font-sans text-regular font-semibold dark:text-grey-8 text-black-4">
              2. Select Token B
            </div>
            <div className={cn('flex flex-row items-center', !tokenB && 'invisible')}>
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
                {walletTokenB} {tokenB?.symbol}
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
              <TooltipTrigger
                className={`font-sans text-regular font-semibold dark:text-grey-8
                        text-black-4 underline !decoration-dotted`}
              >
                3. Initial Price
              </TooltipTrigger>
              <TooltipContent className={'z-[1001]'} align={'start'}>
                The initial price is based on the ratio of tokens you deposit for initial liquidity.
              </TooltipContent>
            </Tooltip>
            <div
              className={cn('flex flex-row items-center', (!tokenA || !tokenB) && 'invisible')}
              onClick={() => setPriceSwitch((prev) => !prev)}
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
                    flex-row justify-between rounded-[3px] border border-solid border-black-4
                    dark:border-grey-4 items-center"
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
        +amountTokenA &&
        +amountTokenB &&
        (+amountTokenA > +walletTokenA || +amountTokenB > +walletTokenB) ? (
          <span className="text-red-1 font-sembold text-regular">
            {connected ? 'You don\'t have enough tokens in the wallet!' : 'Please connect your wallet to proceed!'}
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
  const { tokenList, isLoadingTokenList, updateTokenList, page, setPage, maxTokensReached, createPoolType } =
    useGamma()
  const [isDropDownOpen, setIsDropdownOpen] = useBoolean(false)
  const { mode, isDarkMode } = useDarkMode()
  const [scrollingContainerRef, setScrollingContainerRef] = useState<HTMLDivElement>(null)
  const [searchValue, setSearchValue] = useState<string>('')
  const [popularTokens, setPopularTokens] = useState<JupToken[]>([])
  const { balance, topBalances } = useWalletBalance()
  const { wallet } = useWallet()
  const publicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter?.publicKey])

  const topBalancesWithTokenList: JupToken[] = useMemo(
    () => {
      const data = []
      const hasTokenSet = new Set()
      for (const tokenBalance of topBalances) {
        if (!hasTokenSet.has(tokenBalance.mint)) {
          hasTokenSet.add(tokenBalance.mint)
          data.push({
            ...tokenBalance,
            address: tokenBalance.mint
          })
        }
      }
      for (const token of tokenList) {
        if (!hasTokenSet.has(token.address)) {
          data.push(token)
        }
      }
      return data.sort((a,b)=>balance[a.address].value.gt(balance[b.address].value)?-1:1)
    },
    [topBalances, tokenList, balance, searchValue]
  )

  useEffect(() => {
    const abortSignal = aborter.addSignal('tokenList')
    // faking search
    if (searchValue.trim().length == 0) {
      updateTokenList({ page: 1, pageSize: TOKEN_LIST_PAGE_SIZE, signal: abortSignal }, false).then(() =>
        setPage(1)
      )
      return
    }
    const timeout = setTimeout(async () => {
      updateTokenList(
        {
          page: 1,
          pageSize: TOKEN_LIST_PAGE_SIZE,
          searchValue,
          signal: abortSignal
        },
        false
      )
    }, 233)
    return () => {
      clearTimeout(timeout)
      aborter.abortSignal('tokenList')
    }
  }, [searchValue])

  useEffect(() => {
    fetchTokensByPublicKey([...POPULAR_TOKENS].join(',')).then((res) => {
      if (res.success) {
        setPopularTokens(res.data.tokens)
      }
    })
  }, [])

  return (
    <InputGroup
      leftItem={
        <InputElementLeft>
          <DropdownMenu open={isDropDownOpen} onOpenChange={setIsDropdownOpen.set}>
            <DropdownMenuTrigger asChild className={'focus-visible:outline-none'}>
              <Button
                colorScheme={'secondaryGradient'}
                variant={'outline'}
                isLoading={false}
                className="min-w-[115px] h-[35px] rounded-full flex flex-row justify-between"
                iconLeft={
                  token ? (
                    <Icon src={loadIconImage(token?.logoURI, mode)} size={'sm'} className={'rounded-circle'} />
                  ) : null
                }
                iconRight={
                  <Icon
                    style={{
                      transform: `rotate(${isDropDownOpen ? '180deg' : '0deg'})`,
                      transition: 'transform 0.2s ease-in-out'
                    }}
                    src={`/img/assets/farm-chevron-${mode}.svg`}
                    className={cn(!isDarkMode ? 'stroke-background-blue' : '')}
                    size={'sm'}
                  />
                }
              >
                {token ? token.symbol : 'Select Token'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className={'flex flex-col mt-1 z-[1001] h-[396px] w-[464px] max-sm:w-[338px] relative'}
              portal={true}
              align={'start'}
            >
              {createPoolType === 'hyper' && (
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
                />
              )}
              {createPoolType === 'hyper' && (
                <div className={'border-b border-solid dark:border-black-4 border-grey-4'}>
                  <h5
                    className={`my-2 dark:text-text-darkmode-secondary 
                                        text-text-lightmode-secondary`}
                  >
                    Popular
                  </h5>
                  <div className={'flex pb-2 gap-1'}>
                    {popularTokens.map((token) => (
                      <Button
                        className={`border-solid dark:border-black-4 border-grey-4 border 
                          cursor-pointer p-1 flex rounded-[4px]`}
                        key={token?.address}
                        onClick={()=> {
                          setToken(token)
                          setIsDropdownOpen.off()
                        }}
                        disabled={otherToken?.address == token?.address}
                        iconLeft={<Icon
                          src={loadIconImage(token?.logoURI, mode)}
                          size={'sm'}
                          className={'rounded-circle'}
                        />}
                      >
                        <span
                          className={`font-bold dark:text-text-darkmode-secondary 
                                        text-text-lightmode-secondary`}
                        >
                          {token?.symbol}
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              <ScrollingHydrateContainer
                ref={(ref) => setScrollingContainerRef(ref)}
                callback={() => {
                  if (isLoadingTokenList || maxTokensReached) return
                  updateTokenList(
                    {
                      page: page + 1,
                      pageSize: TOKEN_LIST_PAGE_SIZE,
                      searchValue
                    },
                    false
                  ).then(() => setPage(page + 1))
                }}
              >
                {tokenList.length > 0 || topBalancesWithTokenList.length > 0 ? (
                  <WindowingContainer
                    className={'h-full'}
                    rootElement={scrollingContainerRef}
                    items={
                      searchValue.length > 0 || createPoolType === 'primary' || !publicKey
                        ? tokenList
                        : topBalancesWithTokenList
                    }
                    render={(curToken: JupToken) => (
                      <DropdownMenuItem
                        className={' cursor-pointer p-1.5 flex'}
                        onClick={() => {
                          setToken(curToken)
                          setSearchValue('')
                        }}
                        key={curToken?.address}
                        disabled={otherToken?.address === curToken?.address}
                      >
                        <div className={'flex w-full flex-1'}>
                          <div className={`flex gap-2`}>
                            <Icon
                              className={`rounded-circle h-[24px] w-[24px] border 
                                border-solid dark:border-black-4 border-grey-4`}
                              src={loadIconImage(curToken?.logoURI, mode)}
                            />
                            <div>
                              <p
                                className={`text-b2 font-bold 
                                  dark:text-text-darkmode-primary text-text-lightmode-primary`}
                              >
                                {curToken?.symbol}
                              </p>
                              <span className={'inline-flex gap-1'}>
                                <span className={'max-w-[118px] self-center'}>
                                  <p
                                    className={`text-b3 dark:text-text-darkmode-secondary 
                                      text-text-lightmode-secondary truncate font-semibold
                                `}
                                  >
                                    {curToken?.name}
                                  </p>
                                </span>
                                <a
                                  href={`https://solscan.io/account/${curToken?.address}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className={'ml-auto'}
                                >
                                  <Badge
                                    variant="default"
                                    size={'lg'}
                                    className={'to-brand-secondaryGradient-secondary/50 gap-1 h-[18px]'}
                                  >
                                    <h6 className={''}>{truncateAddress(curToken?.address, 3)}</h6>
                                    <Icon
                                      src={`/img/assets/arrowcircle-${mode}.svg`}
                                      className={'!h-[15px] !w-[15px] !min-h-[15px] !min-w-[15px]'}
                                    />
                                  </Badge>
                                </a>
                              </span>
                            </div>
                          </div>
                          <div className={'w-full ml-auto flex flex-col gap-1 items-end'}>
                            <p
                              className={`text-b2 font-bold dark:text-text-darkmode-primary 
                                text-text-lightmode-primary`}
                            >
                              {numberFormatter(balance[curToken?.address].tokenAmount.uiAmount)}
                            </p>
                            <p
                              className={`text-b3 dark:text-text-darkmode-secondary text-text-lightmode-secondary 
                                truncate font-semibold
                                `}
                            >
                              ${bigNumberFormatter(new BigNumber(balance[curToken?.address].value.toString()))}
                            </p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    )}
                  />
                ) : (
                  <DropdownMenuItem disabled={true}>No Tokens Found</DropdownMenuItem>
                )}
                {isLoadingTokenList ? <DropdownMenuItem disabled={true}>LOADING</DropdownMenuItem> : null}
              </ScrollingHydrateContainer>
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
        disabled={!token}
      />
    </InputGroup>
  )
}

export default Step2
