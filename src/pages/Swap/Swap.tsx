import React, { FC, useMemo, useState } from 'react'
import {
  Button,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  InputElementLeft,
  InputGroup,
  IntemediaryToast,
  IntemediaryToastHeading,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from 'gfx-component-lib'
import RadioOptionGroup from '@/components/common/RadioOptionGroup'
import { useConnectionConfig, useDarkMode, usePriceFeedFarm } from '@/context'
import { useSwap } from '@/context/newSwap'
import useBreakPoint from '@/hooks/useBreakPoint'
import { BASE_SLIPPAGE, JupToken } from '@/pages/FarmV4/constants'
import { toast } from 'sonner'
import { useWalletBalance } from '@/context/walletBalanceContext'
import { bigNumberFormatter, loadIconImage, numberFormatter, sleep } from '@/utils'
import SearchBar from '@/components/common/SearchBar'
import useBoolean from '@/hooks/useBoolean'
import { InfiniteTokenListSwap } from '@/pages/Swap/InfiniteTokenListSwap'
import { Connect } from '@/layouts'
import { IconWithFallback } from '@/components/common/IconWithFallback'
import useTransaction from '@/hooks/useTransaction'
import { getPriceQuotes, swapTokens } from '@/web3/Farm'
import BigNumber from 'bignumber.js'
import { forceCronUpdateWithConnectionAndTxSig } from '@/api/gamma'
import { ErrorToast } from '@/utils/perpsNotifications'
import Decimal from 'decimal.js'

import LottieSwapCountDown from './LottieSwapCountDown'
import { Skeleton } from 'gfx-component-lib'
import useGetGammaConfigIdQuery from '@/queries/GAMMA/pools/useGetGammaConfigIdQuery'
import useGammaPoolIdQuery from '@/queries/GAMMA/pools/useGammaPoolIdQuery'
import useGammaProgramPoolQuery from '@/queries/GAMMA/pools/useGammaProgramPoolQuery'
import useGammaProgramObservationState from '@/queries/GAMMA/pools/useGammaProgramObservationState'
import useGammaProgramAmmConfig from '@/queries/GAMMA/pools/useGammaProgramAmmConfig'
import { QUERY_KEY } from '@/queries/query.helper'
import { useMutation, useQuery } from '@tanstack/react-query'
import useGetGammaSwapAccounts from '@/queries/GAMMA/pools/useGetGammaSwapAccounts'
import { TokenAmount } from '@solana/web3.js'

export const Swap: FC = () => {
  const { isDarkMode, mode } = useDarkMode()
  const { isMobile } = useBreakPoint()
  const { connection } = useConnectionConfig()
  const {
    slippage,
    setSlippage,
    selectedTokenA,
    selectedTokenB,
    setSelectedTokenA,
    setSelectedTokenB,
    amountTokenACommands,
    amountTokenBCommands,
    amountTokenA,
    amountTokenB
  } = useSwap()
  const { balance, publicKey } = useWalletBalance()
  const [value, setValue] = useState(slippage)
  const [invertPrice, setInvertPrice] = useBoolean(false)
  const localIsCustomSlippage = !BASE_SLIPPAGE.includes(value)
  const { sendTransaction, createTransactionBuilder } = useTransaction()

  const { GammaProgram } = usePriceFeedFarm()

  const ammQuery = useGetGammaConfigIdQuery(0)
  const poolIdQuery = useGammaPoolIdQuery({
    configId: ammQuery.data,
    mintA: selectedTokenA?.address,
    mintB: selectedTokenB?.address
  })
  const ammConfigStateQuery = useGammaProgramAmmConfig()
  const poolStateQuery = useGammaProgramPoolQuery({
    poolId: poolIdQuery.data
  })
  const observationStateQuery = useGammaProgramObservationState({
    observerKey: poolStateQuery.data?.observationKey
  })
  const swapAccountsQuery = useGetGammaSwapAccounts({
    mintA: selectedTokenA?.address,
    mintB: selectedTokenB?.address,
    userSourceTokenType: balance[selectedTokenA?.address].tokenType,
    userTargetTokenType: balance[selectedTokenB?.address].tokenType,
    poolState: poolStateQuery.data,
    ammConfigId: ammQuery.data,
    poolIdKey: poolIdQuery.data
  })

  const approxSwapQuery = useQuery({
    queryKey: [
      QUERY_KEY,
      'swap-approx',
      selectedTokenA?.address,
      selectedTokenB?.address,
      observationStateQuery.data?.observations
    ],
    queryFn: async () => {
      await sleep(150)
      const aToB = getPriceQuotes(
        '1',
        selectedTokenA,
        selectedTokenB,
        ammConfigStateQuery.data,
        poolStateQuery.data,
        observationStateQuery.data
      )
      const bToA = getPriceQuotes(
        '1',
        selectedTokenB,
        selectedTokenA,
        ammConfigStateQuery.data,
        poolStateQuery.data,
        observationStateQuery.data
      )

      return {
        aToB: aToB.destinationAmountSwapped,
        bToA: bToA.destinationAmountSwapped
      }
    },
    keepPreviousData: true,
    enabled:
      !!selectedTokenA &&
      !!selectedTokenB &&
      !!poolStateQuery.data &&
      !!ammConfigStateQuery.data &&
      !!observationStateQuery.data
  })

  const priceQuoteQuery = useQuery({
    queryKey: [
      QUERY_KEY,
      'swap-price-quote',
      selectedTokenA?.address,
      selectedTokenB?.address,
      amountTokenA,
      observationStateQuery.data?.observations
    ],
    queryFn: async () => {
      await sleep(150)
      const quote = getPriceQuotes(
        amountTokenA,
        selectedTokenA,
        selectedTokenB,
        ammConfigStateQuery.data,
        poolStateQuery.data,
        observationStateQuery.data
      )
      amountTokenBCommands.set(quote.destinationAmountSwapped)
      return quote
    },
    onError: (e) => {
      console.log('erorr', e)
      toast(<ErrorToast />, {
        id: 'refresh-toast-swap'
      })
    },
    keepPreviousData: true,
    enabled:
      !!selectedTokenA?.address &&
      !!selectedTokenB?.address &&
      !!poolStateQuery.data &&
      !poolStateQuery.isLoading &&
      amountTokenA !== '' &&
      !isNaN(+amountTokenA) &&
      +amountTokenA > 0
  })

  const swapMutation = useMutation({
    mutationFn: async () => {
      const txBuilder = createTransactionBuilder()
      const tx = await swapTokens(
        amountTokenA,
        selectedTokenA,
        selectedTokenB,
        publicKey,
        slippage,
        GammaProgram,
        connection,
        ammConfigStateQuery.data,
        poolStateQuery.data,
        observationStateQuery.data,
        swapAccountsQuery.data
      )
      txBuilder.add(tx)
      // eslint-disable-next-line max-len
      const sourceAmount = `${bigNumberFormatter(new BigNumber(amountTokenA))} ${selectedTokenA?.symbol}`
      // eslint-disable-next-line max-len
      const targetAmount = `${bigNumberFormatter(new BigNumber(amountTokenB))} ${selectedTokenB?.symbol}`
      const { txSig } = await sendTransaction(
        txBuilder,
        {
          // eslint-disable-next-line max-len
          successMessage: `You successfully swapped ${sourceAmount} ${selectedTokenA?.symbol} to ${targetAmount} ${selectedTokenB?.symbol}`
        },
        undefined,
        undefined,
        true
      )
      return txSig
    },
    onSuccess: (txSig) => {
      amountTokenACommands.clear()
      amountTokenBCommands.clear()
      forceCronUpdateWithConnectionAndTxSig(connection, txSig)
    }
  })
  const swapNotValid = useMemo(
    () =>
      !selectedTokenA ||
      !selectedTokenB ||
      !amountTokenA ||
      !amountTokenB ||
      balance[selectedTokenA?.address].tokenAmount.uiAmount < +amountTokenA ||
      +amountTokenA == 0,
    [selectedTokenA, selectedTokenB, amountTokenA, amountTokenB, balance]
  )

  const handleSlippageSave = () => {
    setSlippage(value)
    toast(
      <IntemediaryToast>
        <IntemediaryToastHeading stage={'success'}>Settings Saved!</IntemediaryToastHeading>
        <p className={cn(`pt-1`)}>Swap slippage update to {value}%.</p>
      </IntemediaryToast>,
      { id: 'slippage-save' }
    )
  }

  const handleChange = async (e, isSource: boolean) => {
    if (!e?.target?.value) {
      isSource ? amountTokenACommands.clear() : amountTokenBCommands.clear()
    }
    isSource ? amountTokenACommands.onChange(e) : amountTokenBCommands.onChange(e)
  }

  const { usdValueA, usdValueB } = useMemo(() => {
    const returnValue = {
      usdValueA: '0.00',
      usdValueB: '0.00'
    }
    if (amountTokenA && selectedTokenA && selectedTokenA.price) {
      returnValue.usdValueA = numberFormatter(new Decimal(amountTokenA).mul(selectedTokenA.price).toNumber())
    }
    if (amountTokenB && selectedTokenB && selectedTokenB.price) {
      returnValue.usdValueB = numberFormatter(new Decimal(amountTokenB).mul(selectedTokenB.price).toNumber())
    }

    return returnValue
  }, [amountTokenA, amountTokenB, balance, selectedTokenA, selectedTokenB])

  const handleRefresh = async () => {
    approxSwapQuery.refetch()
    if (amountTokenA && !isNaN(+amountTokenA) && +amountTokenA > 0) {
      priceQuoteQuery.refetch()
    }
  }
  // anything is fetching
  const loadingPriceQuote = priceQuoteQuery.isFetching || approxSwapQuery.isFetching
  const isLoading =
    poolStateQuery.isFetching ||
    observationStateQuery.isFetching ||
    ammConfigStateQuery.isFetching ||
    swapAccountsQuery.isFetching ||
    swapMutation.isLoading
  const doesPoolExist = poolStateQuery.isFetched ? !!poolStateQuery.data : true
  const handleHalf = () => {
    const tokenBal: TokenAmount = balance[selectedTokenA?.address].tokenAmount
    if (tokenBal.uiAmount == 0.0) {
      return
    }
    amountTokenACommands.set(new Decimal(tokenBal.amount).div(Math.pow(10, tokenBal.decimals)).div(2).toString())
  }
  const handleMax = () => {
    const tokenBal: TokenAmount = balance[selectedTokenA?.address].tokenAmount
    if (tokenBal.uiAmount == 0.0) {
      return
    }
    let tokenValue = new Decimal(tokenBal.amount).div(Math.pow(10, tokenBal.decimals))
    if (selectedTokenA.symbol.toLowerCase() === 'sol') {
      tokenValue = tokenValue.minus(0.01)
    }
    amountTokenACommands.set(tokenValue.toString())
  }
  return (
    <div
      className={`
mt-8 flex items-center justify-center
`}
    >
      <div
        className={`max-w-[calc(100vw_-_20px)] md:max-w-[528px] w-full flex flex-col border-1 
    border-solid border-border-lightmode-secondary bg-white dark:bg-background-darkmode-secondary
      dark:border-border-darkmode-secondary rounded-[10px]`}
      >
        <div
          className={`flex items-center p-2.5 border-b-1 border-solid border-border-lightmode-secondary 
      dark:border-border-darkmode-secondary gap-2.5`}
        >
          <h3 className={'mr-auto text-text-lightmode-primary dark:text-text-darkmode-primary'}>Swap</h3>
          <Button
            colorScheme={isDarkMode ? 'white' : 'blue'}
            variant={'outline'}
            iconLeft={
              <IconWithFallback
                src={`/img/assets/refresh_${mode}.svg`}
                size={'sm'}
                className={cn(``, loadingPriceQuote && 'animate-spin')}
              />
            }
            disabled={loadingPriceQuote || !selectedTokenA || !selectedTokenB || !poolStateQuery.data}
            onClick={handleRefresh}
            className={'p-1.25 aspect-square'}
          />
          <Popover modal={false}>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                colorScheme={isDarkMode ? 'default' : 'blue'}
                className={'bg-white'}
                iconLeft={<IconWithFallback src={`img/assets/footer_filter_${mode}.svg`} size="sm" />}
              >
                <span className="font-bold text-regular text-black-4 dark:text-white">
                  {isNaN(slippage) ? '0.00' : slippage.toFixed(2)}%
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className={`flex flex-col max-sm:w-screen max-sm:rounded-b-none gap-2.5`}
              sideOffset={isMobile ? -44 : 5}
              align={isMobile ? 'center' : 'end'}
              alignOffset={0}
            >
              <div className={'flex gap-1 items-center'}>
                <Tooltip>
                  <TooltipTrigger
                    asChild
                    variant={'dotted'}
                    className={`text-text-lightmode-primary dark:text-text-darkmode-primary
                                  underline-offset-4
                                  `}
                  >
                    <h5>Liquidity Slippage</h5>
                  </TooltipTrigger>
                  <TooltipContent asChild>
                    <span className="font-semibold text-tiny">
                      The maximum slippage that you are willing to accept for this transaction.
                    </span>
                  </TooltipContent>
                </Tooltip>
              </div>
              <RadioOptionGroup
                defaultValue={'0.1'}
                value={localIsCustomSlippage ? 'custom' : value.toString()}
                options={[
                  {
                    label: '0.1%',
                    value: '0.1',
                    onClick: () => setValue(0.1)
                  },
                  {
                    label: '0.5%',
                    value: '0.5',
                    onClick: () => setValue(0.5)
                  },
                  {
                    label: '1%',
                    value: '1',
                    onClick: () => setValue(1)
                  },
                  {
                    label: 'Custom',
                    value: 'custom',
                    onClick: () => setValue(0)
                  }
                ]}
              />
              <Input
                className={'text-right'}
                value={value}
                onChange={(e) => setValue(parseFloat(e.target.value))}
                type={'number'}
              />
              <Button
                fullWidth
                colorScheme={'blue'}
                disabled={value == slippage || value <= 0.0}
                onClick={handleSlippageSave}
              >
                Save
              </Button>
            </PopoverContent>
          </Popover>
        </div>
        <div className={'flex flex-col px-2.5 py-3.75 gap-3'}>
          <div className={'flex w-full flex-col gap-3'}>
            <div className={'flex w-full md:items-center gap-2 flex-col md:flex-row'}>
              <div className={'flex w-full'}>
                <h4 className={'text-text-lightmode-primary dark:text-text-darkmode-primary'}>You're Selling:</h4>
                <p
                  className={cn(
                    `ml-auto text-b2 cursor-pointer text-text-lightmode-primary dark:text-text-darkmode-primary`,
                    balance[selectedTokenA?.address].tokenAmount.uiAmount == 0 &&
                      `cursor-not-allowed text-text-lightmode-tertiary dark:text-text-darkmode-tertiary`
                  )}
                  onClick={() => {
                    amountTokenACommands.set(balance[selectedTokenA?.address].tokenAmount.uiAmountString)
                  }}
                >
                  Balance: {numberFormatter(balance[selectedTokenA?.address].tokenAmount.uiAmount)}{' '}
                  {selectedTokenA?.symbol}
                </p>
              </div>
              {selectedTokenA && (
                <div className={'flex gap-2'}>
                  <Button
                    variant={'outline'}
                    size={'sm'}
                    colorScheme={!isDarkMode ? 'blue' : 'default'}
                    onClick={handleHalf}
                  >
                    Half
                  </Button>
                  <Button
                    variant={'outline'}
                    size={'sm'}
                    colorScheme={!isDarkMode ? 'blue' : 'default'}
                    onClick={handleMax}
                  >
                    Max
                  </Button>
                </div>
              )}
            </div>
            <div className={'flex flex-col gap-1.5'}>
              <TokenSelectInput
                token={selectedTokenA}
                setToken={setSelectedTokenA}
                otherToken={selectedTokenB}
                handleChange={(e) => handleChange(e, true)}
                amountToken={amountTokenA}
                disableInput={isLoading || !doesPoolExist}
                disableTokenDropDown={isLoading}
                setAmountTokenB={amountTokenBCommands.set}
                onBlur={amountTokenACommands.onBlur}
              />
              {selectedTokenA ? (
                <p
                  className={cn(`ml-auto text-b2 text-text-lightmode-tertiary dark:text-text-darkmode-tertiary
                `)}
                >
                  ${usdValueA}
                </p>
              ) : null}
            </div>
          </div>
          <IconWithFallback
            src={`/img/assets/swap-${mode}.svg`}
            className={cn(
              `min-w-[40px] min-h-[45px] mx-auto cursor-not-allowed opacity-75`,
              selectedTokenA && selectedTokenB && `cursor-pointer opacity-100`
            )}
            onClick={() => {
              setSelectedTokenB(selectedTokenA)
              setSelectedTokenA(selectedTokenB)
              amountTokenACommands.set(amountTokenB)
              amountTokenBCommands.set(amountTokenA)
            }}
          />
          <div className={'flex w-full flex-col gap-3'}>
            <div className={'flex w-full'}>
              <h4 className={'text-text-lightmode-primary dark:text-text-darkmode-primary'}>You're Buying:</h4>
              <p
                className={cn(
                  `ml-auto text-b2 text-text-lightmode-primary dark:text-text-darkmode-primary`,
                  balance[selectedTokenB?.address].tokenAmount.uiAmount == 0 &&
                    `cursor-not-allowed text-text-lightmode-tertiary dark:text-text-darkmode-tertiary`
                )}
              >
                Balance: {numberFormatter(balance[selectedTokenB?.address].tokenAmount.uiAmount)}{' '}
                {selectedTokenB?.symbol}
              </p>
            </div>
            <div className={'flex flex-col gap-1.5'}>
              <TokenSelectInput
                token={selectedTokenB}
                setToken={setSelectedTokenB}
                otherToken={selectedTokenA}
                // handleChange={(e) => handleChange(e, false)}
                amountToken={amountTokenB}
                disableInput={true}
                disableTokenDropDown={isLoading}
                isLocked={true}
                setAmountTokenB={amountTokenBCommands.set}
                onBlur={amountTokenACommands.onBlur}
              />
              {selectedTokenB ? (
                <p
                  className={cn(`ml-auto text-b2 text-text-lightmode-tertiary dark:text-text-darkmode-tertiary
                `)}
                >
                  ${usdValueB}
                </p>
              ) : null}
            </div>
          </div>
          {!doesPoolExist ? <h4 className={`font-semibold text-text-red`}>Current pool doesn't exist. </h4> : null}
          {selectedTokenA && selectedTokenB && (
            <div
              className={`flex flex-col gap-1.25 font-semibold text-text-lightmode-secondary
           dark:text-text-darkmode-secondary`}
            >
              <div
                className={`flex gap-1.25 text-b2 text-text-lightmode-primary dark:text-text-darkmode-primary
            items-center
            `}
              >
                <IconWithFallback
                  src={loadIconImage(invertPrice ? selectedTokenB?.logoURI : selectedTokenA?.logoURI, mode)}
                  size={'xs'}
                  className={'rounded-circle'}
                />
                <p>1 {invertPrice ? selectedTokenB?.symbol : selectedTokenA?.symbol} ≈ </p>
                <IconWithFallback
                  src={loadIconImage(invertPrice ? selectedTokenA?.logoURI : selectedTokenB?.logoURI, mode)}
                  size={'xs'}
                  className={'rounded-circle'}
                />
                {approxSwapQuery.isLoading ? (
                  <Skeleton className="w-[100px] h-[25px] rounded-[2px] inline-flex m-auto" />
                ) : (
                  <p>
                    {invertPrice ? approxSwapQuery.data?.bToA : approxSwapQuery.data?.aToB}&nbsp;
                    {invertPrice ? selectedTokenA?.symbol : selectedTokenB?.symbol}
                  </p>
                )}
                <IconWithFallback
                  src={`/img/assets/switch-value-${mode}.svg`}
                  size={'xs'}
                  className={'ml-auto cursor-pointer'}
                  onClick={setInvertPrice.toggle}
                />
                <LottieSwapCountDown
                  onFinish={handleRefresh}
                  isRefreshing={loadingPriceQuote || isLoading}
                  hasInput={+amountTokenA > 0}
                />
              </div>
              {/* <div className={'flex font-semibold text-b2 items-center'}>
                <p>Price Impact</p>
                <p
                  className={cn(`text-text-green ml-auto`, getImpactValue(impactPercent))}
                >{`< ${impactPercent}%`}</p>
              </div> */}
              {amountTokenA && (
                <div
                  className={`flex text-text-lightmode-secondary dark:text-text-darkmode-secondary font-semibold 
            text-b2 justify-center gap-1 items-center`}
                >
                  <Tooltip>
                    <TooltipTrigger asChild variant={'dotted'}>
                      <p>Estimated Fee</p>
                    </TooltipTrigger>
                    <TooltipContent asChild>
                      <span className={`text-text-lightmode-primary dark:text-text-darkmode-primary`}>
                        Swap fees include SOL network cost and fees to LPs, buybacks and treasury
                      </span>
                    </TooltipContent>
                  </Tooltip>
                  <p className={cn(`text-text-lightmode-primary dark:text-text-darkmode-primary ml-auto`)}>
                    {loadingPriceQuote ? (
                      <IconWithFallback
                        src={`/img/assets/refresh_${mode}.svg`}
                        size={'xs'}
                        className={cn('animate-spin')}
                      />
                    ) : (
                      priceQuoteQuery.data?.tradeFee ?? '0.00'
                    )}
                  </p>
                </div>
              )}
              {/*  <div*/}
              {/*    className={`flex text-text-lightmode-secondary dark:text-text-darkmode-secondary font-semibold */}
              {/*text-b2 items-center`}*/}
              {/*  >*/}
              {/*    <p>Minimum Received</p>*/}
              {/*    <p className={cn(`text-text-lightmode-primary dark:text-text-darkmode-primary ml-auto`,*/}
              {/*    loadingPriceQuote && 'opacity-70'*/}
              {/*    )}>*/}
              {/*      {minimumReceivedQuote} {selectedTokenB.symbol}*/}
              {/*    </p>*/}
              {/*  </div>*/}
            </div>
          )}
          {!publicKey ? (
            <Connect />
          ) : (
            <Button
              isLoading={loadingPriceQuote || isLoading}
              onClick={() => swapMutation.mutate()}
              variant={'primary'}
              colorScheme={'blue'}
              fullWidth
              className={'mt-1'}
              disabled={
                swapNotValid || loadingPriceQuote || isLoading || !swapAccountsQuery.data || !doesPoolExist
              }
            >
              {
                selectedTokenA?.address && selectedTokenB?.address ?
                  +amountTokenA > balance[selectedTokenA?.address].tokenAmount.uiAmount ?
                  `Insufficient ${selectedTokenA?.symbol}` : `Swap` : `Swap`
              }
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function TokenSelectInput({
  token,
  setToken,
  otherToken,
  handleChange,
  amountToken,
  disableInput,
  disableTokenDropDown,
  isLocked,
  setAmountTokenB,
  onBlur
}: {
  token: JupToken | null
  setToken: (token: JupToken) => void
  otherToken: JupToken | null
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>, isTokenA: boolean) => void
  amountToken: string
  disableInput?: boolean
  disableTokenDropDown?: boolean
  isLocked?: boolean
  setAmountTokenB: (amount: string) => void
  onBlur: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  const [isDropDownOpen, setIsDropdownOpen] = useBoolean(false)
  const { isDarkMode, mode } = useDarkMode()
  const { searchValue, setSearchValue, isLoadingTokenList, tokens } = useSwap()
  const { publicKey } = useWalletBalance()

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
                disabled={disableTokenDropDown}
              >
                {token ? token?.symbol : 'Select Token'}
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
                isLoading={isLoadingTokenList}
                disabled={disableTokenDropDown}
              />
              {searchValue && tokens.length == 0 && !isLoadingTokenList ? (
                <div className={'mb-auto p-2'}>No Tokens Found..</div>
              ) : null}
              <InfiniteTokenListSwap
                useRenderListLength={searchValue.trim().length > 0}
                tokenRenderList={tokens}
                onTokenSelect={(token) => {
                  setToken(token)
                  setSearchValue('')
                  setAmountTokenB('')
                }}
                RenderAs={DropdownMenuItem}
                checkDisabled={(t) => t?.address == otherToken?.address || isLoadingTokenList}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </InputElementLeft>
      }
    >
      <Input
        type="text"
        placeholder={`0.00 ${token ? token?.symbol : ''}`}
        onChange={(e) => handleChange(e, true)}
        onBlur={onBlur}
        value={amountToken}
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

// function getImpactValue(impactPercent: number) {
//   switch (true) {
//     case impactPercent <= 0.1:
//       return 'text-text-green'
//     case impactPercent <= 0.5:
//       return 'text-background-yellow'
//     default:
//       return 'text-text-red'
//   }
// }
