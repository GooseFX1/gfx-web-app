import React, { FC, useEffect, useMemo, useState } from 'react'
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
import { bigNumberFormatter, loadIconImage, numberFormatter } from '@/utils'
import SearchBar from '@/components/common/SearchBar'
import useBoolean from '@/hooks/useBoolean'
import { InfiniteTokenListSwap } from '@/pages/Swap/InfiniteTokenListSwap'
import { Connect } from '@/layouts'
import { IconWithFallback } from '@/components/common/IconWithFallback'
import useTransaction from '@/hooks/useTransaction'
import { doesPoolWithMintsExist, getPriceQuotes, swapTokens } from '@/web3/Farm'
import { useWallet } from '@solana/wallet-adapter-react'
import BigNumber from 'bignumber.js'
import { forceCronUpdateWithConnectionAndTxSig } from '@/api/gamma'
import { ErrorToast } from '@/utils/perpsNotifications'
import Decimal from 'decimal.js'

import LottieSwapCountDown from './LottieSwapCountDown'

export const Swap: FC = () => {
  const { isDarkMode, mode } = useDarkMode()
  const { isMobile } = useBreakPoint()
  const { wallet } = useWallet()
  const { connection } = useConnectionConfig()
  const {
    slippage,
    setSlippage,
    selectedTokenA,
    selectedTokenB,
    setSelectedTokenA,
    setSelectedTokenB,
    setAmountTokenA,
    setAmountTokenB,
    amountTokenA,
    amountTokenB
  } = useSwap()
  const { balance, publicKey } = useWalletBalance()
  const [value, setValue] = useState(slippage)
  const [invertPrice, setInvertPrice] = useBoolean(false)
  const [doesPoolExist, setDoesPoolExist] = useBoolean(true)
  const localIsCustomSlippage = !BASE_SLIPPAGE.includes(value)
  const { sendTransaction, createTransactionBuilder } = useTransaction()
  const userPublicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter, wallet?.adapter?.publicKey])
  const [userSourceTokenType, setUserSourceTokenType] = useState<'spl-token' | 'native' | 'spl-token-2022' | ''>(
    ''
  )
  const [userTargetTokenType, setUserTargetTokenType] = useState<'spl-token' | 'native' | 'spl-token-2022' | ''>(
    ''
  )

  const { GammaProgram } = usePriceFeedFarm()
  const [sendingTransaction, setSendingTransaction] = useState(false)
  const [loadingPriceQuote, setLoadingPriceQuote] = useState(false)
  const [fee, setFee] = useState<string>('')
  const [isRefreshing, setIsRefreshing] = useBoolean(false)
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

  useEffect(() => {
    if (selectedTokenA && selectedTokenB && userPublicKey) {
      setUserSourceTokenType(balance[selectedTokenA?.address].tokenType)
      setUserTargetTokenType(balance[selectedTokenB?.address].tokenType)
    }
  }, [selectedTokenA, selectedTokenB, balance, userPublicKey])

  // useEffect(() => {
  //   if (!doesPoolExist) return
  //   handleRefresh()
  //   const handler = setInterval(async () => {
  //     await handleRefresh()
  //   }, 15000)
  //
  //   return () => {
  //     clearInterval(handler)
  //   }
  // }, [selectedTokenA, selectedTokenB, amountTokenA, doesPoolExist])

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
  const checkIfPoolExists = async () =>
    doesPoolWithMintsExist(selectedTokenA.address, selectedTokenB.address, GammaProgram).then((res) => {
      setDoesPoolExist.set(res)
      return res
    })

  const handleRefresh = async () => {
    console.log('REFRESH')
    setIsRefreshing.on()
    await checkIfPoolExists()
    if (!doesPoolExist) {
      setIsRefreshing.off()
      return
    }
    if (+amountTokenA === 0) setAmountTokenB('')
    if (amountTokenA !== '' && !isNaN(+amountTokenA) && +amountTokenA > 0 && selectedTokenA && selectedTokenB) {
      setLoadingPriceQuote(true)

      await getPriceQuotes(amountTokenA, selectedTokenA, selectedTokenB, GammaProgram, connection)
        .then(({ destinationAmountSwapped: price, tradeFee }) => {
          setAmountTokenB(price)
          setFee(tradeFee)
        })
        .catch((e) => {
          toast(<ErrorToast />, {
            id: 'refresh-toast-swap'
          })
          console.error(e)
        })
        .finally(() => {
          setLoadingPriceQuote(false)
        })
    }
    setIsRefreshing.off()
  }
  const handleChange = async (e, isSource: boolean) => {
    const inputNumber = e?.target?.value
    if (!e?.target?.value) {
      isSource ? setAmountTokenA('') : setAmountTokenB('')
    }
    if (!isNaN(+inputNumber)) {
      isSource ? setAmountTokenA(inputNumber) : setAmountTokenB(inputNumber)
    }
  }
  const { approxAmountB, approxAmountA } = useMemo(() => {
    if (!selectedTokenA || !selectedTokenB)
      return {
        approxAmountB: '0.00',
        approxAmountA: '0.00'
      }

    const balanceA = balance[selectedTokenA.address]
    const balanceB = balance[selectedTokenB.address]

    if (balanceA.price == 0 || balanceB.price == 0)
      return {
        approxAmountB: '0.00',
        approxAmountA: '0.00'
      }

    console.log(numberFormatter(balanceA.price / balanceB.price, balanceB.decimals ?? 7))
    return {
      approxAmountB: numberFormatter(balanceA.price / balanceB.price, balanceB.decimals ?? 7),
      approxAmountA: numberFormatter(balanceB.price / balanceA.price, balanceA.decimals ?? 7)
    }
  }, [balance, selectedTokenA, selectedTokenB])
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

  const handleSwap = async () => {
    try {
      setSendingTransaction(true)
      const txBuilder = createTransactionBuilder()
      const tx = await swapTokens(
        amountTokenA,
        selectedTokenA,
        selectedTokenB,
        userPublicKey,
        userSourceTokenType,
        userTargetTokenType,
        slippage,
        GammaProgram,
        connection
      )
      txBuilder.add(tx)
      // eslint-disable-next-line max-len
      const sourceAmount = `${bigNumberFormatter(new BigNumber(amountTokenA))} ${selectedTokenA?.symbol}`
      // eslint-disable-next-line max-len
      const targetAmount = `${bigNumberFormatter(new BigNumber(amountTokenB))} ${selectedTokenB?.symbol}`
      const { success, txSig } = await sendTransaction(txBuilder, {
        // eslint-disable-next-line max-len
        successMessage: `You successfully swapped ${sourceAmount} ${selectedTokenA?.symbol} to ${targetAmount} ${selectedTokenB?.symbol}`
      })
      console.log('SwapResponse', success)
      if (!success) {
        //off(connectionId)
        console.log('An error occurred while Swapping!')
      } else {
        setAmountTokenA('')
        setAmountTokenB('')
        await forceCronUpdateWithConnectionAndTxSig(connection, txSig)
      }
    } catch (e) {
      console.log('An error occurred while depositing.', e)
    }
    setSendingTransaction(false)
  }

  useEffect(() => {
    if (!(selectedTokenA && selectedTokenB)) return
    checkIfPoolExists()
  }, [selectedTokenA, selectedTokenB])

  useEffect(() => {
    const timeout = setTimeout(async () => {
      await handleRefresh()
    }, 250)

    return () => {
      clearTimeout(timeout)
    }
  }, [amountTokenA])

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
            disabled={loadingPriceQuote || !selectedTokenA || !selectedTokenB}
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
        <div className={'flex flex-col px-2.5 py-3.75 gap-3.75'}>
          <div className={'flex w-full flex-col gap-3.75'}>
            <div className={'flex w-full'}>
              <h4 className={'text-text-lightmode-primary dark:text-text-darkmode-primary'}>You're Selling:</h4>
              <p
                className={cn(
                  `ml-auto text-b2 cursor-pointer text-text-lightmode-primary dark:text-text-darkmode-primary`,
                  balance[selectedTokenA?.address].tokenAmount.uiAmount == 0 &&
                    `cursor-not-allowed text-text-lightmode-tertiary dark:text-text-darkmode-tertiary`
                )}
                onClick={() => {
                  setAmountTokenA(balance[selectedTokenA?.address].tokenAmount.uiAmountString)
                }}
              >
                Balance: {numberFormatter(balance[selectedTokenA?.address].tokenAmount.uiAmount)}{' '}
                {selectedTokenA?.symbol}
              </p>
            </div>
            <div className={'flex flex-col gap-1.5'}>
              <TokenSelectInput
                token={selectedTokenA}
                setToken={setSelectedTokenA}
                otherToken={selectedTokenB}
                handleChange={(e) => handleChange(e, true)}
                amountToken={amountTokenA}
                disableInput={sendingTransaction || !doesPoolExist}
                disableTokenDropDown={sendingTransaction}
              />
              {selectedTokenA ? (
                <p
                  className={cn(`ml-auto text-b2 text-text-lightmode-tertiary dark:text-text-darkmode-tertiary
                font-bold
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
              setAmountTokenA(amountTokenB)
              setAmountTokenB(amountTokenA)
            }}
          />
          <div className={'flex w-full flex-col gap-3.75'}>
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
                disableTokenDropDown={sendingTransaction}
                isLocked={true}
              />
              {selectedTokenB ? (
                <p
                  className={cn(`ml-auto text-b2 text-text-lightmode-tertiary dark:text-text-darkmode-tertiary
                font-bold
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
                <p>
                  {invertPrice ? approxAmountA : approxAmountB}{' '}
                  {invertPrice ? selectedTokenA?.symbol : selectedTokenB?.symbol}
                </p>
                <IconWithFallback
                  src={`/img/assets/switch-value-${mode}.svg`}
                  size={'xs'}
                  className={'ml-auto cursor-pointer'}
                  onClick={setInvertPrice.toggle}
                />
                <LottieSwapCountDown
                  onFinish={handleRefresh}
                  isRefreshing={isRefreshing}
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
                      fee
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
              loading={sendingTransaction}
              onClick={handleSwap}
              variant={'primary'}
              colorScheme={'blue'}
              fullWidth
              disabled={swapNotValid}
            >
              Swap
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
  isLocked
}: {
  token: JupToken | null
  setToken: (token: JupToken) => void
  otherToken: JupToken | null
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>, isTokenA: boolean) => void
  amountToken: string
  disableInput?: boolean
  disableTokenDropDown?: boolean
  isLocked?: boolean
}) {
  const [isDropDownOpen, setIsDropdownOpen] = useBoolean(false)
  const { isDarkMode, mode } = useDarkMode()
  const { searchValue, setSearchValue, isLoadingTokenList, tokens, topBalancesWithTokenList } = useSwap()
  const { publicKey } = useWalletBalance()
  const tokenRenderList: JupToken[] = searchValue.length > 0 || !publicKey ? tokens : topBalancesWithTokenList

  return (
    <InputGroup
      leftItem={
        <InputElementLeft>
          <DropdownMenu open={isDropDownOpen} onOpenChange={setIsDropdownOpen.set}>
            <DropdownMenuTrigger asChild className={'focus-visible:outline-none'} disabled={disableTokenDropDown}>
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
              {searchValue && tokenRenderList.length == 0 && !isLoadingTokenList ? (
                <div className={'mb-auto p-2'}>No Tokens Found..</div>
              ) : null}
              <InfiniteTokenListSwap
                useRenderListLength={searchValue.trim().length > 0}
                tokenRenderList={tokenRenderList}
                onTokenSelect={(token) => {
                  setToken(token)
                  setSearchValue('')
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
