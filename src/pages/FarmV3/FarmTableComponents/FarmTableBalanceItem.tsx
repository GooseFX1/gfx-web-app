import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { AccordionContent, Button, cn, Tooltip, TooltipContent, TooltipTrigger } from 'gfx-component-lib'
import {
  depositCapError,
  genericErrMsg,
  insufficientSOLMsg,
  invalidDepositErrMsg,
  invalidInputErrMsg,
  ModeOfOperation,
  SSLToken
} from '@/pages/FarmV3/constants'
import { useWallet } from '@solana/wallet-adapter-react'
import { APP_RPC, useAccounts, useConnectionConfig, usePriceFeedFarm, useSSLContext } from '@/context'
import { Connection, LAMPORTS_PER_SOL } from '@solana/web3.js'
import useSolSub from '@/hooks/useSolSub'
import useBreakPoint from '@/hooks/useBreakPoint'
import { executeClaimRewards, executeDeposit, executeWithdraw, getPriceObject } from '@/web3'
import { bigNumberFormatter, numberFormatter, truncateBigString, withdrawBigStringSSL } from '@/utils'
import { SkeletonCommon } from '@/components'
import RadioOptionGroup from '@/components/common/RadioOptionGroup'
import TokenInput from '@/components/common/TokenInput'
import { Connect } from '@/layouts'
import { ActionModal } from '@/pages/FarmV3/ActionModal'
import OracleIcon from '@/pages/FarmV3/FarmTableComponents/OracleIcon'
import FarmItemHead from '@/pages/FarmV3/FarmTableComponents/FarmItemHead'
import { toast } from 'sonner'
import BigNumber from 'bignumber.js'
import useTransaction from '@/hooks/useTransaction'
import { PropsWithKey } from '@/pages/TradeV3/mobile/PlaceOrderMobi'

const MIN_AMOUNT_DEPOSIT = 0.01
const MIN_AMOUNT_WITHDRAW = 0.01
export const MIN_AMOUNT_CLAIM = 0.01
const FarmBalanceItem = ({
  title,
  value,
  titlePosition = 'text-start',
  asZero,
  token,
  earnedUSD = 0
}: PropsWithKey<{
  title: string
  value: React.ReactNode
  titlePosition?: 'text-end' | 'text-start'
  asZero?: boolean
  token?: string
  earnedUSD?: number | string
}>) => (
  <div className={cn('flex flex-row md-xl:flex-col md-xl:w-max justify-between md-xl:justify-normal max-sm:mb-1')}>
    <h4 className={cn(`dark:text-grey-8 text-black-4 font-semibold text-regular`, titlePosition)}>{title}</h4>
    <div
      className={cn(
        `flex flex-col min-md:flex-row text-right dark:text-grey-1 text-grey-2 text-b2 font-semibold 
    items-center gap-1
    `,
        !asZero && 'dark:text-grey-8 text-black-4 text-end'
      )}
    >
      <h4 className={'font-nunito'}>
        {value} {token}
      </h4>
      {(earnedUSD || earnedUSD != 0) && <h4 className={'font-nunito'}>(${earnedUSD} USD)</h4>}
    </div>
  </div>
)

const FarmContent: FC<PropsWithKey<{ coin: SSLToken }>> = ({ coin }) => {
  const { prices } = usePriceFeedFarm()
  const { isTxnSuccessfull, filteredLiquidityAccounts, liquidityAmount, sslTableData, rewards } = useSSLContext()
  const tokenMintAddress = useMemo(() => coin?.mint?.toBase58(), [coin])

  const liquidity = useMemo(
    () =>
      prices[getPriceObject(coin?.token)]?.current &&
      prices[getPriceObject(coin?.token)]?.current * liquidityAmount?.[tokenMintAddress],
    [liquidityAmount, tokenMintAddress, isTxnSuccessfull, coin]
  )

  const apiSslData = useMemo(() => {
    try {
      if (sslTableData) {
        const key = coin.token === 'SOL' ? 'WSOL' : coin.token
        const decimal = coin.mintDecimals
        return {
          apy: sslTableData[key]?.apy,
          fee: sslTableData[key]?.fee / 10 ** decimal,
          volume: sslTableData[key]?.volume / 1_000_000
        }
      } else
        return {
          apy: 0,
          fee: 0,
          volume: 0
        }
    } catch (e) {
      console.log('error in ssl api data: ', e)
    }
  }, [coin, sslTableData])
  const userDepositedAmount: BigNumber = useMemo(() => {
    if (!filteredLiquidityAccounts) return new BigNumber(0)
    const account = filteredLiquidityAccounts[tokenMintAddress]
    if (!account) return new BigNumber(0)
    return new BigNumber(account.amountDeposited.toString())
  }, [filteredLiquidityAccounts, tokenMintAddress, isTxnSuccessfull])

  const userDepositInUSD = useMemo(
    () => withdrawBigStringSSL(userDepositedAmount?.toString(), coin?.mintDecimals),
    [userDepositedAmount, coin?.mintDecimals]
  )

  const claimable = rewards[coin?.mint?.toBase58()]?.toNumber() / Math.pow(10, coin?.mintDecimals)

  const depositPercentage = (liquidity / coin?.cappedDeposit) * 100

  return (
    <>
      <FarmItemHead
        icon={`/img/crypto/${coin?.token}.svg`}
        depositPercentage={depositPercentage}
        canClaim={claimable >= MIN_AMOUNT_CLAIM}
        token={coin?.token}
        tooltip={
          <>
            Deposits are at {depositPercentage?.toFixed(2)}% capacity, the current cap is $
            {numberFormatter(coin?.cappedDeposit)}
          </>
        }
        apy={`${apiSslData?.apy ? Number(apiSslData?.apy)?.toFixed(2) : '0.00'}%`}
        liquidity={
          liquidity != undefined ? (
            liquidity > 0 ? (
              '$' + numberFormatter(liquidity)
            ) : (
              '---'
            )
          ) : (
            <SkeletonCommon height="75%" width="75%" />
          )
        }
        volume={<>${numberFormatter(apiSslData?.volume)}</>}
        fees={
          <Tooltip>
            <TooltipTrigger asChild>
              {numberFormatter(apiSslData?.fee * prices?.[getPriceObject(coin?.token)]?.current) ? (
                <h4 tw="flex justify-center items-center font-semibold">
                  ${numberFormatter(apiSslData?.fee * prices?.[getPriceObject(coin?.token)]?.current)}
                </h4>
              ) : (
                <h4 tw="flex justify-center items-center font-semibold">$0.00</h4>
              )}
            </TooltipTrigger>
            <TooltipContent className={'text-center'}>
              {apiSslData?.fee ? (
                <>
                  {numberFormatter(apiSslData.fee)} {coin.token}
                </>
              ) : (
                `0 ${coin.token}`
              )}
            </TooltipContent>
          </Tooltip>
        }
        balance={<>{numberFormatter(parseFloat(userDepositInUSD))}</>}
      />
      <AccordionContent variant={'secondary'}>
        <CollapsibleContent
          coin={coin}
          apiSslData={apiSslData}
          liquidity={liquidity}
          userDepositedAmount={userDepositedAmount}
          userDepositInUSD={userDepositInUSD}
        />
      </AccordionContent>
    </>
  )
}
const CollapsibleContent: FC<{
  coin: SSLToken
  apiSslData: { apy: any; fee: number; volume: number }
  liquidity: number
  userDepositedAmount: BigNumber
  userDepositInUSD: string
}> = ({ coin, apiSslData, liquidity, userDepositedAmount, userDepositInUSD }) => {
  const { getUIAmount } = useAccounts()
  const [actionModal, setActionModal] = useState<boolean>(false)

  const tokenMintAddress = useMemo(() => coin?.mint?.toBase58(), [coin])
  const slotConnection = new Connection(APP_RPC.endpoint, 'finalized')
  const wal = useWallet()
  const { connection } = useConnectionConfig()
  const { prices, SSLProgram } = usePriceFeedFarm()
  const {
    pool,
    operationPending,
    isTxnSuccessfull,
    setOperationPending,
    setIsTxnSuccessfull,
    filteredLiquidityAccounts,
    rewards,
    depositedBalanceConnection,
    connectionId
  } = useSSLContext()
  const { wallet, connected } = useWallet()
  const userPublicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter, wallet?.adapter?.publicKey])
  const [currentSlot, setCurrentSlot] = useState<number>(0)
  useEffect(() => {
    ;(async () => {
      try {
        const slot = await slotConnection.getSlot()
        setCurrentSlot(slot)
      } catch (error) {
        console.error('Error getting current slot:', error)
        setCurrentSlot(0)
      }
    })()
  }, [connection, actionModal])
  const [userSolBalance, setUserSOLBalance] = useState<number>(0)
  const [userTokenBalance, setUserTokenBalance] = useState<BigNumber>(new BigNumber(0))

  const walletName = useMemo(() => wallet?.adapter?.name, [wallet?.adapter, wallet?.adapter?.name])
  const [modeOfOperation, setModeOfOperation] = useState<string>(ModeOfOperation.DEPOSIT)
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false)
  const [actionType, setActionType] = useState<string>('')
  const [diffTimer, setDiffTimer] = useState<number>(0)
  const [earlyWithdrawFee, setEarlyWithdrawFee] = useState<number>(0)
  const { off } = useSolSub()
  const { isMobile, isTablet } = useBreakPoint()
  const [depositAmount, setDepositAmount] = useState<string>('')
  const [withdrawAmount, setWithdrawAmount] = useState<string>('')
  const { sendTransaction, createTransactionBuilder } = useTransaction()
  useEffect(() => {
    if (userPublicKey) {
      if (coin.token === 'SOL') setUserTokenBalance(new BigNumber(userSolBalance))
      else setUserTokenBalance(new BigNumber(getUIAmount(tokenMintAddress)))
    }
  }, [tokenMintAddress, userPublicKey, isTxnSuccessfull, userSolBalance, getUIAmount])

  useEffect(() => {
    ;(async () => {
      if (userPublicKey) {
        const solAmount = await connection.getBalance(userPublicKey)
        setUserSOLBalance(solAmount / LAMPORTS_PER_SOL)
      } else {
        setDepositAmount(null)
        setWithdrawAmount(null)
      }
    })()
  }, [userPublicKey, isTxnSuccessfull])
  const formattedapiSslData = useMemo(
    () => ({
      apy: apiSslData?.apy,
      fee: apiSslData?.fee,
      volume: apiSslData?.volume
    }),
    [apiSslData]
  )

  const totalEarned = useMemo(() => {
    if (!coin) return new BigNumber(0)
    const liquidityAccount = filteredLiquidityAccounts[tokenMintAddress]
    if (!liquidityAccount) return new BigNumber(0)

    return new BigNumber(liquidityAccount.totalEarned.toString()).div(Math.pow(10, coin.mintDecimals))
  }, [filteredLiquidityAccounts, tokenMintAddress, isTxnSuccessfull, coin])

  const claimableReward = useMemo(() => {
    if (!coin) return new BigNumber(0)
    if (!rewards[tokenMintAddress]) return new BigNumber(0)
    return new BigNumber(rewards[tokenMintAddress].toString()).div(Math.pow(10, coin.mintDecimals))
  }, [rewards, tokenMintAddress, isTxnSuccessfull, coin])
  const totalEarnedInUSD = useMemo(() => {
    if (!coin) return new BigNumber(0)
    const priceObject = prices[getPriceObject(coin.token)]
    if (!priceObject) return new BigNumber(0)
    return totalEarned.multipliedBy(priceObject.current)
  }, [totalEarned])

  const claimableRewardInUSD = useMemo(() => {
    if (!coin) return new BigNumber(0)
    const priceObject = prices[getPriceObject(coin.token)]
    if (!priceObject) return new BigNumber(0)
    return claimableReward.multipliedBy(priceObject.current)
  }, [claimableReward])

  const userTokenBalanceInUSD = useMemo(() => {
    if (!coin) return new BigNumber(0)
    const priceObject = getPriceObject(coin.token)
    if (!prices[priceObject]) return new BigNumber(0)
    return userTokenBalance.multipliedBy(prices[priceObject].current)
  }, [prices, coin, prices[getPriceObject(coin?.token)], userTokenBalance])
  const enoughSOLInWallet = useCallback((): boolean => {
    if (userSolBalance < 0.000001) {
      toast.error(insufficientSOLMsg())
      return false
    }
    return true
  }, [userSolBalance])
  const calculateEarlyWithdrawalPenalty = useCallback(() => {
    const depositSlot = filteredLiquidityAccounts[tokenMintAddress]?.lastDepositAt
    const slotDiff = new BigNumber(currentSlot).minus(new BigNumber(depositSlot.toString()))?.toNumber()
    //const slotDiff = 117000;
    if (slotDiff < 216000) {
      const decayingFactor = ((216000 - slotDiff) / 216000) ** 2 * (2 / 100)
      const withdrawalFee = decayingFactor * +withdrawAmount
      const countdownUI = Math.floor((216000 - slotDiff) * 0.4)
      const countDownFiveMin = Math.ceil(countdownUI / 300) * 300
      setDiffTimer(countDownFiveMin)
      setEarlyWithdrawFee(withdrawalFee)
    } else {
      setEarlyWithdrawFee(0)
      setDiffTimer(0)
    }
  }, [filteredLiquidityAccounts, tokenMintAddress, currentSlot, withdrawAmount])
  const openActionModal = useCallback(
    (actionValue: string) => {
      if (actionValue === 'deposit' && window.location.pathname === '/farm/temp-withdraw') return
      // to check if the deposit value in USD + liquidity value in USD is not greater than caps
      const depositAmountInUSD =
        prices[getPriceObject(coin?.token)]?.current &&
        prices[getPriceObject(coin?.token)]?.current * +depositAmount
      if (actionValue === 'deposit' && depositAmountInUSD + liquidity > coin?.cappedDeposit) {
        toast.error(depositCapError(coin, liquidity))
        return
      }
      if (actionValue === 'withdraw') calculateEarlyWithdrawalPenalty()
      setActionType(actionValue)
      setActionModal(true)
    },
    [depositAmount, liquidity, coin, calculateEarlyWithdrawalPenalty, prices]
  )

  // Disable action button when deposit mode with zero user balance or no deposit amount,
  // or withdraw mode with zero user deposited amount or no withdraw amount
  const disableActionButton = useMemo(
    () =>
      !liquidity ||
      !coin?.cappedDeposit ||
      (modeOfOperation === ModeOfOperation.DEPOSIT && liquidity > coin?.cappedDeposit) ||
      (modeOfOperation === ModeOfOperation.DEPOSIT &&
        (userTokenBalance.isZero() || !depositAmount || +depositAmount < MIN_AMOUNT_DEPOSIT)) ||
      (modeOfOperation === ModeOfOperation.WITHDRAW &&
        (!userDepositedAmount || !withdrawAmount || +withdrawAmount < MIN_AMOUNT_WITHDRAW)),
    [userTokenBalance, modeOfOperation, pool, coin, depositAmount, withdrawAmount, liquidity]
  )

  // Deposit mode and user has not token balance OR has not yet given input OR Withdraw has not deposited anything
  const actionButtonText = useMemo(() => {
    if (modeOfOperation === ModeOfOperation.DEPOSIT) {
      if (liquidity > coin?.cappedDeposit) return `Pool at Max Capacity`
      if (userTokenBalance.isZero()) return `Insufficient ${coin?.token}`
      if (!depositAmount || +depositAmount <= 0) return `Enter Amount`
      if (!!depositAmount && +depositAmount < MIN_AMOUNT_DEPOSIT) return `${modeOfOperation} at least 0.01`
      if (depositAmount) return modeOfOperation
    }
    if (modeOfOperation === ModeOfOperation.WITHDRAW) {
      if (!userDepositedAmount) return `Insufficient ${coin?.token}`
      if (!!withdrawAmount && +withdrawAmount < MIN_AMOUNT_DEPOSIT) return `${modeOfOperation} at least 0.01`
      if (!withdrawAmount || +withdrawAmount <= 0) return `Enter Amount`
      if (withdrawAmount) return modeOfOperation
    }
  }, [modeOfOperation, pool, coin, userTokenBalance, depositAmount, withdrawAmount, liquidity])

  const checkConditionsForDepositWithdraw = useCallback(
    (isDeposit: boolean) => {
      if (!enoughSOLInWallet()) return true
      if (isDeposit) {
        const depBigNumber = new BigNumber(depositAmount)
        if (!userTokenBalance) {
          toast.error(genericErrMsg(`You have 0 ${coin.token} to deposit!`))
          setDepositAmount('0')
          return true
        } else if (depBigNumber.isNaN() || depBigNumber.lt(MIN_AMOUNT_DEPOSIT)) {
          toast.error(invalidInputErrMsg(coin?.token))
          setDepositAmount('0')
          return true
        } else if (userTokenBalance.lt(new BigNumber(depositAmount))) {
          toast.error(invalidDepositErrMsg(userTokenBalance.toFixed(2), coin?.token))
          setDepositAmount('0')
          return true
        }
        return false
      } else {
        if (!userDepositedAmount) {
          toast.error(genericErrMsg(`You have 0 ${coin.token} to withdraw!`))
          setWithdrawAmount('0')
          return true
        } else if (!withdrawAmount || +withdrawAmount < MIN_AMOUNT_WITHDRAW) {
          toast.error(invalidInputErrMsg(coin?.token))
          setWithdrawAmount('0')
          return true
        } // else if (userDepositedAmount?.lte(new BN(withdrawAmount))) {
        //   notify(invalidWithdrawErrMsg(userDepositedAmount, coin?.token))
        //   return true
        // }
        return false
      }
    },
    [enoughSOLInWallet, userTokenBalance, depositAmount, userDepositedAmount, withdrawAmount, coin?.token]
  )

  const handleDeposit = useCallback(async (): Promise<void> => {
    if (checkConditionsForDepositWithdraw(true)) return
    setIsButtonLoading(true)
    setOperationPending(true)
    depositedBalanceConnection(userPublicKey, coin)
    setIsTxnSuccessfull(false)
    const txBuilder = createTransactionBuilder()
    const tx = await executeDeposit(SSLProgram, wal, connection, depositAmount, coin, userPublicKey)
    txBuilder.add(tx)
    const { success } = await sendTransaction(txBuilder)
    console.log('success', success)
    setOperationPending(false)
    setIsButtonLoading(false)
    setActionModal(false)

    if (!success) {
      off(connectionId)
      setIsTxnSuccessfull(false)
      return
    }
    setTimeout(() => setDepositAmount('0'), 500)
    setIsTxnSuccessfull(true)
  }, [checkConditionsForDepositWithdraw, userPublicKey, SSLProgram, wal, connection, depositAmount, coin])
  const handleWithdraw = useCallback(
    async (amount: BigNumber): Promise<void> => {
      if (checkConditionsForDepositWithdraw(false)) return
      console.log('withdraw', amount.toString())
      setIsButtonLoading(true)
      setOperationPending(true)
      depositedBalanceConnection(userPublicKey, coin)
      setIsTxnSuccessfull(false)
      const txBuilder = createTransactionBuilder()
      const tx = await executeWithdraw(SSLProgram, wal, connection, coin, withdrawAmount, userPublicKey)
      txBuilder.add(tx)
      const { success } = await sendTransaction(txBuilder)
      setOperationPending(false)
      setIsButtonLoading(false)
      if (!success) {
        off(connectionId)
        setIsTxnSuccessfull(false)
        return
      }
      setTimeout(() => setWithdrawAmount('0'), 500)
      setActionModal(false)
      setIsTxnSuccessfull(true)
    },
    [
      checkConditionsForDepositWithdraw,
      userPublicKey,
      coin,
      connection,
      SSLProgram,
      wal,
      userPublicKey,
      withdrawAmount
    ]
  )
  const handleClaim = useCallback(async () => {
    setIsButtonLoading(true)
    setOperationPending(true)
    setIsTxnSuccessfull(false)
    const tx = await executeClaimRewards(SSLProgram, connection, coin, userPublicKey)
    const { success } = await sendTransaction(createTransactionBuilder().add(tx))
    setIsButtonLoading(false)
    setOperationPending(false)
    setActionModal(false)
    if (!success) {
      off(connectionId)
      setIsTxnSuccessfull(false)
      return
    }
    setIsTxnSuccessfull(true)
  }, [SSLProgram, wal, connection, coin, userPublicKey, claimableReward, walletName])
  const handleCancel = useCallback(() => {
    setIsButtonLoading(false)
    setOperationPending(false)
  }, [])
  const handleInputChange = useCallback(
    (input: string) => {
      // handle if the user sends '' or undefined in input box
      if (input === '') {
        if (modeOfOperation === ModeOfOperation.DEPOSIT) setDepositAmount(null)
        else setWithdrawAmount(null)
        return
      }
      const inputValue = +input
      if (!isNaN(inputValue)) {
        if (modeOfOperation === ModeOfOperation.DEPOSIT) setDepositAmount(input)
        else setWithdrawAmount(input)
      }
    },
    [modeOfOperation]
  )

  const handleHalf = useCallback(
    () =>
      modeOfOperation === ModeOfOperation.DEPOSIT
        ? setDepositAmount(userTokenBalance ? new BigNumber(userTokenBalance).div(2).toString() : '0')
        : setWithdrawAmount(
            userDepositedAmount
              ? !userDepositedAmount?.isZero()
                ? new BigNumber(userDepositedAmount.toString())
                    .div(new BigNumber(2 * 10 ** coin.mintDecimals))
                    .toString()
                : '0'
              : '0'
          ),
    [modeOfOperation, userTokenBalance, userDepositedAmount]
  )
  const handleMax = useCallback(
    () =>
      modeOfOperation === ModeOfOperation.DEPOSIT
        ? setDepositAmount(userTokenBalance ? String(userTokenBalance) : '0')
        : setWithdrawAmount(userDepositedAmount ? userDepositInUSD : '0'),
    [modeOfOperation, userTokenBalance, userDepositedAmount, userDepositInUSD]
  )

  const depositWithdrawOnClick = (): void => openActionModal(modeOfOperation.toLowerCase())
  const canDeposit = userTokenBalance.gte(MIN_AMOUNT_DEPOSIT)
  const canWithdraw =
    !userDepositedAmount?.isZero() &&
    new BigNumber(userDepositedAmount.toString())
      .div(new BigNumber(10 ** coin?.mintDecimals))
      .gte(new BigNumber(MIN_AMOUNT_WITHDRAW))
  const minMaxDisabled = modeOfOperation === ModeOfOperation.DEPOSIT ? !canDeposit : !canWithdraw
  const disabled =
    !connected ||
    operationPending ||
    isButtonLoading ||
    (modeOfOperation === ModeOfOperation.DEPOSIT
      ? !canDeposit || userTokenBalance.lt(new BigNumber(depositAmount))
      : !canWithdraw || userDepositedAmount.div(new BigNumber(10 ** coin?.mintDecimals)).lt(withdrawAmount))
  const canClaim = claimableReward.gte(MIN_AMOUNT_CLAIM)

  return (
    <div className={'grid grid-cols-1 md-xl:grid-cols-3 sm-lg:grid-cols-2 gap-3.75'}>
      {actionModal && (
        <ActionModal
          key={'action-modal'}
          actionModal={actionModal}
          setActionModal={setActionModal}
          handleWithdraw={handleWithdraw}
          handleDeposit={handleDeposit}
          handleClaim={handleClaim}
          isButtonLoading={isButtonLoading}
          handleCancel={handleCancel}
          withdrawAmount={withdrawAmount}
          depositAmount={depositAmount}
          claimAmount={claimableReward}
          actionType={actionType}
          token={coin}
          earlyWithdrawFee={earlyWithdrawFee}
          diffTimer={diffTimer}
          setDiffTimer={setDiffTimer}
        />
      )}
      {isMobile ? (
        <div className={'flex flex-col gap-1.25'}>
          <FarmBalanceItem
            title={'Liquidity:'}
            key={'mobile-liquidity'}
            asZero={liquidity === 0 || isNaN(liquidity)}
            value={liquidity ? '$' + numberFormatter(liquidity) : <SkeletonCommon height="100%" />}
            token={coin?.token}
          />
          <FarmBalanceItem
            title={'24H Volume:'}
            key={'mobile-24-h-volume'}
            asZero={formattedapiSslData?.volume === 0 || isNaN(formattedapiSslData?.volume)}
            value={'$' + numberFormatter(formattedapiSslData?.volume)}
            token={coin?.token}
          />
          <FarmBalanceItem
            title={'24H Fees:'}
            key={'mobile-24-h-fees'}
            asZero={formattedapiSslData?.fee === 0 || isNaN(formattedapiSslData?.fee)}
            value={
              '$' + numberFormatter(formattedapiSslData?.fee * prices?.[getPriceObject(coin?.token)]?.current)
            }
            token={coin?.token}
          />
          <FarmBalanceItem
            title={'My Balance:'}
            key={'mobile-my-balance'}
            asZero={userDepositedAmount?.isZero()}
            value={numberFormatter(parseFloat(userDepositInUSD))}
            token={coin?.token}
          />
          <FarmBalanceItem
            title={'Wallet Balance:'}
            key={'mobile-wallet-balance'}
            asZero={userTokenBalance.isZero() || userTokenBalance.isNaN()}
            earnedUSD={bigNumberFormatter(userTokenBalanceInUSD, 2)}
            value={bigNumberFormatter(userTokenBalance)}
            token={coin?.token}
          />
          <FarmBalanceItem
            title={'Total Earnings:'}
            key={'mobile-total-earnings'}
            asZero={totalEarned.isZero() || totalEarned.isNaN()}
            titlePosition={isTablet ? 'text-start' : 'text-end'}
            value={bigNumberFormatter(totalEarned)}
            earnedUSD={bigNumberFormatter(totalEarnedInUSD)}
            token={coin?.token}
          />
          <FarmBalanceItem
            title={'Pending Rewards:'}
            key={'mobile-pending-rewards'}
            asZero={claimableReward.isZero() || claimableReward.isNaN()}
            titlePosition={isTablet ? 'text-start' : 'text-end'}
            value={bigNumberFormatter(claimableReward)}
            earnedUSD={bigNumberFormatter(claimableRewardInUSD)}
            token={coin?.token}
          />
          <DepositAndWithdrawToggle
            key={'mobile-deposit-withdraw-toggle'}
            value={modeOfOperation == ModeOfOperation.DEPOSIT ? 'deposit' : 'withdraw'}
            operationPending={operationPending}
            setModeOfOperation={setModeOfOperation}
          />
          <TokenInput
            key={'mobile-token-input'}
            handleHalf={handleHalf}
            handleMax={handleMax}
            value={modeOfOperation === ModeOfOperation.DEPOSIT ? depositAmount ?? '' : withdrawAmount ?? ''}
            onChange={(e) => handleInputChange(e.target.value)}
            tokenSymbol={coin.token}
            disabled={disabled}
            minMaxDisabled={minMaxDisabled}
          />
          <ConnectClaimCombo
            key={'mobile-connect-claim-combo'}
            disabled={disabled}
            depositWithdrawOnClick={depositWithdrawOnClick}
            token={coin?.token}
            actionButtonText={actionButtonText}
            canClaim={canClaim && claimableReward.gte(MIN_AMOUNT_CLAIM)}
            claimableReward={claimableReward}
            handleClaim={handleClaim}
            disableActionButton={disableActionButton}
            isLoading={isButtonLoading}
          />
        </div>
      ) : isTablet ? (
        <>
          <div className={'flex flex-col gap-1.25'}>
            <DepositAndWithdrawToggle
              key={'tablet-deposit-withdraw-toggle'}
              value={modeOfOperation == ModeOfOperation.DEPOSIT ? 'deposit' : 'withdraw'}
              operationPending={operationPending}
              setModeOfOperation={setModeOfOperation}
            />
            <TokenInput
              key={'tablet-token-input'}
              handleHalf={handleHalf}
              handleMax={handleMax}
              value={modeOfOperation === ModeOfOperation.DEPOSIT ? depositAmount ?? '' : withdrawAmount ?? ''}
              onChange={(e) => handleInputChange(e.target.value)}
              tokenSymbol={coin.token}
              disabled={disabled}
              minMaxDisabled={minMaxDisabled}
            />
            <ConnectClaimCombo
              key={'tablet-connect-claim-combo'}
              disabled={disabled}
              depositWithdrawOnClick={depositWithdrawOnClick}
              token={coin?.token}
              actionButtonText={actionButtonText}
              canClaim={canClaim && claimableReward.gte(MIN_AMOUNT_CLAIM)}
              claimableReward={claimableReward}
              handleClaim={handleClaim}
              disableActionButton={disableActionButton}
              isLoading={isButtonLoading}
            />
          </div>
          <div className={'flex flex-col gap-3.75'}>
            <FarmBalanceItem
              title={'Liquidity:'}
              key={'tablet-liquidity'}
              asZero={liquidity === 0 || isNaN(liquidity)}
              value={liquidity ? '$' + numberFormatter(liquidity) : <SkeletonCommon height="100%" />}
              token={coin?.token}
            />
            <FarmBalanceItem
              title={'24H Volume:'}
              key={'tablet-24-h-volume'}
              asZero={formattedapiSslData?.volume === 0 || isNaN(formattedapiSslData?.volume)}
              value={'$' + numberFormatter(formattedapiSslData?.volume)}
              token={coin?.token}
            />
            <FarmBalanceItem
              title={'24H Fees:'}
              key={'tablet-24-h-fees'}
              asZero={formattedapiSslData?.fee === 0 || isNaN(formattedapiSslData?.fee)}
              value={
                '$' + numberFormatter(formattedapiSslData?.fee * prices?.[getPriceObject(coin?.token)]?.current)
              }
              token={coin?.token}
            />
            <FarmBalanceItem
              title={'My Balance:'}
              key={'tablet-my-balance'}
              asZero={userDepositedAmount?.isZero()}
              value={truncateBigString(userDepositedAmount?.toString(), coin?.mintDecimals)}
              token={coin?.token}
            />
            <FarmBalanceItem
              title={'Wallet Balance:'}
              key={'tablet-wallet-balance'}
              asZero={userTokenBalance.isZero() || userTokenBalance.isNaN()}
              earnedUSD={bigNumberFormatter(userTokenBalanceInUSD, 2)}
              value={bigNumberFormatter(userTokenBalance)}
              token={coin?.token}
            />
            <FarmBalanceItem
              title={'Total Earnings:'}
              key={'tablet-total-earnings'}
              asZero={totalEarned.isZero() || totalEarned.isNaN()}
              titlePosition={isTablet ? 'text-start' : 'text-end'}
              value={bigNumberFormatter(totalEarned)}
              earnedUSD={bigNumberFormatter(totalEarnedInUSD)}
              token={coin?.token}
            />
            <FarmBalanceItem
              title={'Pending Rewards:'}
              key={'tablet-pending-rewards'}
              asZero={claimableReward.isZero() || claimableReward.isNaN()}
              titlePosition={isTablet ? 'text-start' : 'text-end'}
              value={bigNumberFormatter(claimableReward)}
              earnedUSD={bigNumberFormatter(claimableRewardInUSD)}
              token={coin?.token}
            />
          </div>
        </>
      ) : (
        <>
          <div className={'flex flex-col gap-3.75'}>
            <DepositAndWithdrawToggle
              key={'desktop-deposit-withdraw-toggle'}
              value={modeOfOperation == ModeOfOperation.DEPOSIT ? 'deposit' : 'withdraw'}
              operationPending={operationPending}
              setModeOfOperation={setModeOfOperation}
            />
            <FarmBalanceItem
              title={'Wallet Balance:'}
              key={'desktop-wallet-balance'}
              asZero={userTokenBalance.isZero() || userTokenBalance.isNaN()}
              earnedUSD={bigNumberFormatter(userTokenBalanceInUSD, 2)}
              value={bigNumberFormatter(userTokenBalance)}
              token={coin?.token}
            />
          </div>
          <div className={'flex flex-col gap-3.75'}>
            <TokenInput
              key={'desktop-token-input'}
              handleHalf={handleHalf}
              handleMax={handleMax}
              value={modeOfOperation === ModeOfOperation.DEPOSIT ? depositAmount ?? '' : withdrawAmount ?? ''}
              onChange={(e) => handleInputChange(e.target.value)}
              tokenSymbol={coin.token}
              disabled={disabled}
              minMaxDisabled={minMaxDisabled}
            />
            <ConnectClaimCombo
              key={'desktop-connect-claim-combo'}
              disabled={disabled}
              depositWithdrawOnClick={depositWithdrawOnClick}
              token={coin?.token}
              actionButtonText={actionButtonText}
              canClaim={canClaim && claimableReward.gte(MIN_AMOUNT_CLAIM)}
              claimableReward={claimableReward}
              handleClaim={handleClaim}
              disableActionButton={disableActionButton}
              isLoading={isButtonLoading}
            />
          </div>
          <div className={'flex flex-col gap-3.75 items-end'}>
            <FarmBalanceItem
              title={'Total Earnings:'}
              key={'desktop-total-earnings'}
              asZero={totalEarned.isZero() || totalEarned.isNaN()}
              titlePosition={isTablet ? 'text-start' : 'text-end'}
              value={bigNumberFormatter(totalEarned)}
              earnedUSD={bigNumberFormatter(totalEarnedInUSD)}
              token={coin?.token}
            />
            <FarmBalanceItem
              title={'Pending Rewards:'}
              key={'desktop-pending-rewards'}
              asZero={claimableReward.isZero() || claimableReward.isNaN()}
              titlePosition={isTablet ? 'text-start' : 'text-end'}
              value={bigNumberFormatter(claimableReward)}
              earnedUSD={bigNumberFormatter(claimableRewardInUSD)}
              token={coin?.token}
            />
          </div>
        </>
      )}
      <div className={'flex justify-center col-span-1 md-xl:col-span-3 sm-lg:col-span-2'}>
        <OracleIcon key={'orcale-icons'} token={coin} />
      </div>
    </div>
  )
}
export default FarmContent

type DepositAndWithdrawToggleProps = {
  value: string
  operationPending: boolean
  setModeOfOperation: (mode: string) => void
}
const DepositAndWithdrawToggle: FC<PropsWithKey<DepositAndWithdrawToggleProps>> = ({
  value,
  operationPending,
  setModeOfOperation
}) => (
  <RadioOptionGroup
    defaultValue={'deposit'}
    value={value}
    className={`w-full md-xl:w-[190px] max-sm:mt-1`}
    optionClassName={`w-full md-xl:w-[85px] text-h5`}
    options={[
      {
        value: 'deposit',
        label: 'Deposit',
        onClick: () => (operationPending ? null : setModeOfOperation(ModeOfOperation.DEPOSIT))
      },
      {
        value: 'withdraw',
        label: 'Withdraw',
        onClick: () => (operationPending ? null : setModeOfOperation(ModeOfOperation.WITHDRAW))
      }
    ]}
  />
)
type ConnectClaimComboProps = {
  disabled: boolean
  depositWithdrawOnClick: () => void
  isLoading: boolean
  actionButtonText: string
  canClaim: boolean
  handleClaim: () => void
  claimableReward: BigNumber
  token: string
  disableActionButton: boolean
}
const ConnectClaimCombo: FC<PropsWithKey<ConnectClaimComboProps>> = ({
  disabled,
  depositWithdrawOnClick,
  isLoading,
  actionButtonText,
  canClaim,
  handleClaim,
  claimableReward,
  token,
  disableActionButton
}) => {
  const { connected } = useWallet()

  return (
    <div className={'flex flex-col min-lg:flex-row gap-2.5 max-sm:mt-3'}>
      {connected ? (
        <Button
          colorScheme={'blue'}
          className={'basis-1/2'}
          disabled={disableActionButton || disabled || isLoading}
          onClick={depositWithdrawOnClick}
          isLoading={isLoading}
        >
          {actionButtonText}
        </Button>
      ) : (
        <Connect containerStyle={'inline-flex basis-1/2 z-0'} customButtonStyle={'h-[35px] w-full'} />
      )}
      <Button
        variant={'outline'}
        colorScheme={isLoading || !canClaim ? 'grey' : 'secondaryGradient'}
        onClick={handleClaim}
        className={cn(
          'basis-1/2 duration-[2s]',
          !canClaim && 'bg-white grayscale',
          canClaim && !isLoading && 'before:animate-border-spin'
        )}
        disabled={isLoading || !canClaim || isLoading}
        isLoading={isLoading}
      >
        {canClaim ? (
          `Claim ${bigNumberFormatter(claimableReward)} ${token}`
        ) : (
          'No Claimable Rewards'
        )}
      </Button>
    </div>
  )
}
