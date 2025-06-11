import React, { useEffect, useState } from 'react'
import { cn, RadioGroup, RadioGroupItem, Tooltip, TooltipContent, TooltipTrigger } from 'gfx-component-lib'
import { TokenListToken } from '@/context'
import TokenFeedLPTokenInput from '@/pages/TokenFeed/TokenFeedLPTokenInput'
import useTokenInput from '@/hooks/useTokenInput'
import { H4, P } from '@/components/text/TextComponents'
import { numberFormatter } from '@/utils'
import { useWalletBalance } from '@/context/walletBalanceContext'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEY } from '@/queries/query.helper'
import { getPriceQuotes, getPriceQuotesForOracleBasedSwaps } from '@/web3/Farm'
import { INTERVALS } from '@/utils/time'
import { toast } from 'sonner'
import { ErrorToast } from '@/utils/perpsNotifications'
import useGetGammaConfigIdQuery from '@/queries/GAMMA/pools/useGetGammaConfigIdQuery'
import useGammaPoolIdQuery from '@/queries/GAMMA/pools/useGammaPoolIdQuery'
import useGammaProgramAmmConfig from '@/queries/GAMMA/pools/useGammaProgramAmmConfig'
import useGammaProgramPoolQuery from '@/queries/GAMMA/pools/useGammaProgramPoolQuery'
import useGammaProgramObservationState from '@/queries/GAMMA/pools/useGammaProgramObservationState'
import { IconWithFallback } from '@/components/common/IconWithFallback'
import { useTokenFeed } from '@/context/tokenFeedContext'

function TokenFeedDrawerBuySell({
  selectedToken,
  onTokensUpdate
}: {
  selectedToken: any // TODO: replace with actual type
  onTokensUpdate: (tokenA: any, tokenB: any, amountA, amountB) => void
}) {
  const { quickBuyTokenQuery } = useTokenFeed()
  const { balance } = useWalletBalance()
  const [selectedBuySell, setSelectedBuySell] = useState<string>('buy')
  const [tokenB, setTokenB] = useState<TokenListToken>(selectedToken)
  const [tokenBAmount, tokenBAmountCommands] = useTokenInput()
  const [tokenA, setTokenA] = useState<TokenListToken>(() => quickBuyTokenQuery.data)
  const [tokenAAmount, tokenAAmountCommands] = useTokenInput()
  // swap handling
  const [swapType, _setSwapType] = useState<'oracleBasedSwap' | 'baseSwap'>('oracleBasedSwap')

  const query = window.location.search
  const urlParams = new URLSearchParams(query)
  const isOldSwapVersion = urlParams.get('old-swap-version')

  useEffect(() => {
    if (isOldSwapVersion) _setSwapType('baseSwap')
    else _setSwapType('oracleBasedSwap')
  }, [isOldSwapVersion])
  const ammQuery = useGetGammaConfigIdQuery(0)
  const poolIdQuery = useGammaPoolIdQuery({
    configId: ammQuery.data,
    mintA: tokenB?.address,
    mintB: tokenA?.address
  })
  const ammConfigStateQuery = useGammaProgramAmmConfig(ammQuery.data)
  const poolStateQuery = useGammaProgramPoolQuery({
    poolId: poolIdQuery.data
  })
  const observationStateQuery = useGammaProgramObservationState({
    observerKey: poolStateQuery.data?.account?.observationKey
  })
  const priceQuoteQuery = useQuery({
    queryKey: [
      QUERY_KEY,
      'lp-quote',
      tokenB?.address,
      tokenA?.address,
      tokenBAmount,
      observationStateQuery.data?.account?.observations,
      poolStateQuery.data?.account
    ],
    queryFn: async () => {
      const getPriceQuotesFunction =
        swapType === 'oracleBasedSwap' ? getPriceQuotesForOracleBasedSwaps : getPriceQuotes
      const quote = getPriceQuotesFunction(
        tokenAAmount,
        tokenA,
        tokenB,
        ammConfigStateQuery.data,
        poolStateQuery.data,
        observationStateQuery.data
      )
      tokenBAmountCommands.set(quote.destinationAmountSwapped)
      return quote
    },
    onError: (e) => {
      console.log('erorr', e)
      toast(<ErrorToast />, {
        id: 'refresh-toast-lp'
      })
    },
    keepPreviousData: true,
    staleTime: INTERVALS.SECOND * 10,
    enabled:
      !!tokenB?.address &&
      !!tokenA?.address &&
      !!poolStateQuery.data &&
      !poolStateQuery.isLoading &&
      tokenAAmount !== '' &&
      !isNaN(+tokenAAmount) &&
      +tokenAAmount > 0
  })
  const onSelectedBuySell = (value: string) => {
    setSelectedBuySell(value)
    setTokenB(tokenA)
    setTokenA(tokenB)
  }
  useEffect(
    () => onTokensUpdate(tokenA, tokenB, tokenAAmount, tokenBAmount),
    [tokenAAmount, tokenBAmount, balance, tokenA, tokenB, selectedBuySell]
  )
  return (
    <div
      className={`round flex flex-col bg-background-lightmode-primary dark:bg-background-darkmode-primary p-2 gap-2`}
    >
      <RadioGroup
        defaultValue={'buy'}
        value={selectedBuySell}
        onValueChange={onSelectedBuySell}
        className={`flex gap-2`}
      >
        <RadioGroupItem
          value={'buy'}
          variant={'primary'}
          className={`data-[state=checked]:bg-background-green h-7 w-1/2`}
        >
          Buy
        </RadioGroupItem>
        <RadioGroupItem
          value={'sell'}
          variant={'primary'}
          className={`data-[state=checked]:bg-background-red h-7 w-1/2`}
        >
          Sell
        </RadioGroupItem>
      </RadioGroup>
      <div className={`flex flex-col gap-4`}>
        <div className={`flex flex-col gap-2.5`}>
          <div className={'flex w-full'}>
            <H4>You're Selling:</H4>
            <P
              className={cn(
                `ml-auto text-b2 text-text-lightmode-primary dark:text-text-darkmode-primary`,
                balance[tokenA?.address].tokenAmount.uiAmount == 0 &&
                  `cursor-not-allowed text-text-lightmode-tertiary dark:text-text-darkmode-tertiary`
              )}
            >
              Balance: {numberFormatter(balance[tokenA?.address].tokenAmount.uiAmount)} {tokenA?.symbol}
            </P>
          </div>
          <TokenFeedLPTokenInput
            token={tokenA}
            otherToken={tokenB}
            setToken={setTokenA}
            onBlur={tokenAAmountCommands.onBlur}
            onChange={tokenAAmountCommands.onChange}
            amountToken={tokenAAmount}
            setAmountToken={tokenAAmountCommands.set}
            disableInput={!tokenA}
            disableTokenDropDown={selectedBuySell === 'sell'}
            isLocked={selectedBuySell === 'sell'}
          />
        </div>
        <div className={`flex flex-col gap-2.5`}>
          <div className={'flex w-full'}>
            <H4>You're Buying:</H4>
            <P
              className={cn(
                `ml-auto text-b2 text-text-lightmode-primary dark:text-text-darkmode-primary`,
                balance[tokenB?.address].tokenAmount.uiAmount == 0 &&
                  `cursor-not-allowed text-text-lightmode-tertiary dark:text-text-darkmode-tertiary`
              )}
            >
              Balance: {numberFormatter(balance[tokenB?.address].tokenAmount.uiAmount)} {tokenB?.symbol}
            </P>
          </div>
          <TokenFeedLPTokenInput
            token={tokenB}
            otherToken={tokenB}
            setToken={setTokenB}
            onBlur={tokenBAmountCommands.onBlur}
            onChange={tokenBAmountCommands.onChange}
            amountToken={tokenBAmount}
            setAmountToken={tokenBAmountCommands.set}
            disableInput={!tokenB}
            disableTokenDropDown={selectedBuySell === 'buy'}
            isLocked={selectedBuySell === 'buy'}
          />
        </div>
      </div>
      {!priceQuoteQuery.isLoading && !isNaN(+priceQuoteQuery.data?.priceImpact) && (
        <div
          className={`flex flex-col rounded border-1 border-solid border-border-lightmode-secondary 
      dark:border-border-darkmode-secondary p-2 gap-[5px]`}
        >
          <div className={`inline-flex gap-[5px]`}>
            <P className={`text-b2`}>Rate</P>
            <IconWithFallback src={tokenA?.logoURI} size={'sm'} />
            <P className={`text-b2`}>
              {numberFormatter(+tokenAAmount, 4)} {tokenA?.symbol}
            </P>
            <P className={`text-b2`}>≈</P>
            <IconWithFallback src={tokenB?.logoURI} size={'sm'} />
            <P className={`text-b2`}>
              {numberFormatter(+tokenBAmount, 4)} {tokenB?.symbol}
            </P>
            <div></div>
          </div>
          <div className={`inline-flex justify-between`}>
            <Tooltip>
              <TooltipTrigger>
                <P className={`text-b2 text`}>Price Impact</P>
              </TooltipTrigger>
              <TooltipContent></TooltipContent>
            </Tooltip>
            <P className={`text-b2 text-text-red dark:text-text-red`}>{priceQuoteQuery.data?.priceImpact}%</P>
          </div>
          <div className={`inline-flex justify-between`}>
            <Tooltip>
              <TooltipTrigger>
                <P className={`text-b2 text`}>Estimated Fee</P>
              </TooltipTrigger>
              <TooltipContent></TooltipContent>
            </Tooltip>
            <P className={`text-b2`}>{priceQuoteQuery.data?.tradeFee}</P>
          </div>
        </div>
      )}
    </div>
  )
}

export default TokenFeedDrawerBuySell
