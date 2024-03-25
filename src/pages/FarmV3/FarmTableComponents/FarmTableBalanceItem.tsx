import React, { FC, useEffect, useMemo, useState } from 'react'
import {
  AccordionContent,
  Button,
  cn,
  RoundedGradientInner,
  RoundedGradientWrapper,
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from 'gfx-component-lib'
import {
  depositCapError,
  genericErrMsg,
  insufficientSOLMsg,
  invalidDepositErrMsg,
  invalidInputErrMsg,
  ModeOfOperation,
  sslErrorMessage,
  sslSuccessfulMessage,
  SSLToken
} from '@/pages/FarmV3/constants'
import { useWallet } from '@solana/wallet-adapter-react'
import { APP_RPC, useAccounts, useConnectionConfig, usePriceFeedFarm, useSSLContext } from '@/context'
import { Connection, LAMPORTS_PER_SOL } from '@solana/web3.js'
import useSolSub from '@/hooks/useSolSub'
import useBreakPoint from '@/hooks/useBreakPoint'
import BN from 'bn.js'
import { executeClaimRewards, executeDeposit, executeWithdraw, getPriceObject } from '@/web3'
import { notify, numberFormatter, truncateBigNumber, truncateBigString, withdrawBigString } from '@/utils'
import { Loader, SkeletonCommon } from '@/components'
import RadioOptionGroup from '@/components/common/RadioOptionGroup'
import TokenInput from '@/components/common/TokenInput'
import { Connect } from '@/layouts'
import { ActionModal } from '@/pages/FarmV3/ActionModal'
import OracleIcon from '@/pages/FarmV3/FarmTableComponents/OracleIcon'
import FarmItemHead from '@/pages/FarmV3/FarmTableComponents/FarmItemHead'

const FarmBalanceItem = ({
  title,
  value,
  titlePosition = 'text-start',
  asZero,
  includeUSD,
  token
}: {
  title: string
  value: React.ReactNode
  titlePosition?: 'text-end' | 'text-start'
  asZero?: boolean
  includeUSD?: boolean
  token?: string
}) => (
  <div className={cn('flex flex-row md-xl:flex-col md-xl:w-max justify-between md-xl:justify-normal')}>
    <h4 className={cn(`dark:text-grey-8 text-black-4 font-semibold text-regular`, titlePosition)}>{title}</h4>
    {asZero ? (
      <div className={'flex flex-col text-right dark:text-grey-1 text-grey-2 font-semibold text-regular'}>
        0.00 {token}
        {includeUSD && <span>($0.00 USD)</span>}
      </div>
    ) : (
      <div className={cn('text-b2 font-semibold dark:text-grey-8 text-black-4 text-end')}>{value}</div>
    )}
  </div>
)

const FarmContent: FC<{ coin: SSLToken }> = ({ coin }) => {
  const { wallet, connected } = useWallet()
  const wal = useWallet()
  const { connection } = useConnectionConfig()
  const slotConnection = new Connection(APP_RPC.endpoint, 'finalized')
  const { prices, SSLProgram } = usePriceFeedFarm()
  const {
    pool,
    operationPending,
    isTxnSuccessfull,
    setOperationPending,
    setIsTxnSuccessfull,
    filteredLiquidityAccounts,
    liquidityAmount,
    sslTableData,
    rewards,
    depositedBalanceConnection,
    connectionId
  } = useSSLContext()
  const userPublicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter, wallet?.adapter?.publicKey])
  const walletName = useMemo(() => wallet?.adapter?.name, [wallet?.adapter, wallet?.adapter?.name])
  const tokenMintAddress = useMemo(() => coin?.mint?.toBase58(), [coin])
  const [userSolBalance, setUserSOLBalance] = useState<number>(0)
  const [depositAmount, setDepositAmount] = useState<string>('')
  const [withdrawAmount, setWithdrawAmount] = useState<string>('')
  const [modeOfOperation, setModeOfOperation] = useState<string>(ModeOfOperation.DEPOSIT)
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false)
  const [userTokenBalance, setUserTokenBalance] = useState<number>(0)
  const [actionModal, setActionModal] = useState<boolean>(false)
  const [actionType, setActionType] = useState<string>('')
  const [currentSlot, setCurrentSlot] = useState<number>(0)
  const [diffTimer, setDiffTimer] = useState<number>(0)
  const [earlyWithdrawFee, setEarlyWithdrawFee] = useState<number>(0)
  const { getUIAmount } = useAccounts()
  const { off } = useSolSub()
  const { isMobile, isTablet } = useBreakPoint()
  const userDepositedAmount: BN = useMemo(() => {
    const account = filteredLiquidityAccounts?.[tokenMintAddress]
    return account?.amountDeposited
  }, [filteredLiquidityAccounts, tokenMintAddress, isTxnSuccessfull])
  useEffect(() => {
    if (userPublicKey) {
      setUserTokenBalance(getUIAmount(tokenMintAddress))
      if (coin.token === 'SOL') setUserTokenBalance(userSolBalance)
    }
  }, [tokenMintAddress, userPublicKey, isTxnSuccessfull, userSolBalance, getUIAmount])

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

  const calculateEarlyWithdrawalPenalty = () => {
    const depositSlot = filteredLiquidityAccounts[tokenMintAddress]?.lastDepositAt
    const slotDiff = new BN(currentSlot).sub(depositSlot)?.toNumber()
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
  }

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

  const formattedapiSslData = useMemo(
    () => ({
      apy: apiSslData?.apy,
      fee: apiSslData?.fee,
      volume: apiSslData?.volume
    }),
    [apiSslData]
  )

  const totalEarned = useMemo(
    () => filteredLiquidityAccounts[tokenMintAddress]?.totalEarned?.toNumber() / Math.pow(10, coin?.mintDecimals),
    [filteredLiquidityAccounts, tokenMintAddress, isTxnSuccessfull, coin]
  )

  const claimableReward = useMemo(
    () => rewards[tokenMintAddress]?.toNumber() / Math.pow(10, coin?.mintDecimals),
    [rewards, tokenMintAddress, isTxnSuccessfull, coin]
  )

  const totalEarnedInUSD = useMemo(
    () =>
      prices[getPriceObject(coin?.token)]?.current
        ? prices[getPriceObject(coin?.token)]?.current * totalEarned
        : 0,
    [totalEarned]
  )

  const claimableRewardInUSD = useMemo(
    () =>
      prices[getPriceObject(coin?.token)]?.current
        ? prices[getPriceObject(coin?.token)]?.current * claimableReward
        : 0,
    [claimableReward]
  )

  const userTokenBalanceInUSD = useMemo(
    () =>
      prices[getPriceObject(coin?.token)]?.current
        ? prices[getPriceObject(coin?.token)]?.current * userTokenBalance
        : 0,
    [prices, coin, prices[getPriceObject(coin?.token)], userTokenBalance]
  )
  const enoughSOLInWallet = (): boolean => {
    if (userSolBalance < 0.000001) {
      notify(insufficientSOLMsg())
      return false
    }
    return true
  }

  const openActionModal = (actionValue: string) => {
    if (actionValue === 'deposit' && window.location.pathname === '/farm/temp-withdraw') return
    // to check if the deposit value in USD + liquidity value in USD is not greater than caps
    const depositAmountInUSD =
      prices[getPriceObject(coin?.token)]?.current && prices[getPriceObject(coin?.token)]?.current * +depositAmount
    if (actionValue === 'deposit' && depositAmountInUSD + liquidity > coin?.cappedDeposit) {
      notify(depositCapError(coin, liquidity))
      return
    }
    if (actionValue === 'withdraw') calculateEarlyWithdrawalPenalty()
    setActionType(actionValue)
    setActionModal(true)
  }

  // Disable action button when deposit mode with zero user balance or no deposit amount,
  // or withdraw mode with zero user deposited amount or no withdraw amount
  const disableActionButton = useMemo(
    () =>
      !liquidity ||
      !coin?.cappedDeposit ||
      (modeOfOperation === ModeOfOperation.DEPOSIT && liquidity > coin?.cappedDeposit) ||
      (modeOfOperation === ModeOfOperation.DEPOSIT &&
        (userTokenBalance === 0 || !depositAmount || +depositAmount <= 0)) ||
      (modeOfOperation === ModeOfOperation.WITHDRAW &&
        (!userDepositedAmount || !withdrawAmount || +withdrawAmount <= 0)),
    [userTokenBalance, modeOfOperation, pool, coin, depositAmount, withdrawAmount, liquidity]
  )

  // Deposit mode and user has not token balance OR has not yet given input OR Withdraw has not deposited anything
  const actionButtonText = useMemo(() => {
    if (modeOfOperation === ModeOfOperation.DEPOSIT) {
      if (liquidity > coin?.cappedDeposit) return `Pool at Max Capacity`
      if (userTokenBalance === 0) return `Insufficient ${coin?.token}`
      if (!depositAmount || +depositAmount <= 0) return `Enter Amount`
      if (depositAmount) return modeOfOperation
    }
    if (modeOfOperation === ModeOfOperation.WITHDRAW) {
      if (userDepositedAmount) return modeOfOperation
      if (!userDepositedAmount) return `Insufficient ${coin?.token}`
      if (!withdrawAmount || +withdrawAmount <= 0) return `Enter Amount`
      if (withdrawAmount) return modeOfOperation
    }
  }, [modeOfOperation, pool, coin, userTokenBalance, depositAmount, withdrawAmount, liquidity])

  const checkConditionsForDepositWithdraw = (isDeposit: boolean) => {
    if (!enoughSOLInWallet()) return true
    if (isDeposit) {
      if (!userTokenBalance) {
        notify(genericErrMsg(`You have 0 ${coin.token} to deposit!`))
        setDepositAmount('0')
        return true
      } else if (!depositAmount || +depositAmount < 0.000001) {
        notify(invalidInputErrMsg(coin?.token))
        setDepositAmount('0')
        return true
      } else if (+depositAmount > userTokenBalance) {
        notify(invalidDepositErrMsg(userTokenBalance, coin?.token))
        setDepositAmount('0')
        return true
      }
      return false
    } else {
      if (!userDepositedAmount) {
        notify(genericErrMsg(`You have 0 ${coin.token} to withdraw!`))
        setWithdrawAmount('0')
        return true
      } else if (!withdrawAmount || +withdrawAmount < 0.000001) {
        notify(invalidInputErrMsg(coin?.token))
        setWithdrawAmount('0')
        return true
      } // else if (userDepositedAmount?.lte(new BN(withdrawAmount))) {
      //   notify(invalidWithdrawErrMsg(userDepositedAmount, coin?.token))
      //   return true
      // }
      return false
    }
  }

  const handleDeposit = (): void => {
    if (checkConditionsForDepositWithdraw(true)) return
    try {
      setIsButtonLoading(true)
      setOperationPending(true)
      depositedBalanceConnection(userPublicKey, coin)
      setIsTxnSuccessfull(false)
      const confirm = executeDeposit(SSLProgram, wal, connection, depositAmount, coin, userPublicKey)
      confirm.then((con) => {
        setOperationPending(false)
        setIsButtonLoading(false)
        const { confirm } = con
        if (confirm && confirm?.value && confirm.value.err === null) {
          notify(sslSuccessfulMessage('deposited', depositAmount, coin?.token, walletName))
          setTimeout(() => setDepositAmount('0'), 500)
          setActionModal(false)
          setIsTxnSuccessfull(true)
        } else {
          off(connectionId)
          notify(sslErrorMessage())
          setIsTxnSuccessfull(false)
          return
        }
      })
    } catch (error) {
      off(connectionId)
      setOperationPending(false)
      setIsButtonLoading(false)
      notify(genericErrMsg(error))
      setIsTxnSuccessfull(false)
    }
  }
  const handleWithdraw = (amount: number): void => {
    if (checkConditionsForDepositWithdraw(false)) return
    try {
      setIsButtonLoading(true)
      setOperationPending(true)
      depositedBalanceConnection(userPublicKey, coin)
      setIsTxnSuccessfull(false)
      executeWithdraw(SSLProgram, wal, connection, coin, withdrawAmount, userPublicKey).then((con) => {
        setIsButtonLoading(false)
        setOperationPending(false)
        const { confirm } = con
        if (confirm && confirm?.value && confirm.value.err === null) {
          notify(sslSuccessfulMessage('withdrawn', String(amount), coin?.token, walletName))
          setTimeout(() => setWithdrawAmount('0'), 500)
          setActionModal(false)
          setIsTxnSuccessfull(true)
        } else {
          off(connectionId)
          notify(sslErrorMessage())
          setIsTxnSuccessfull(false)
          return
        }
      })
    } catch (err) {
      off(connectionId)
      setIsButtonLoading(false)
      setOperationPending(false)
      notify(genericErrMsg(err))
      setIsTxnSuccessfull(false)
    }
  }
  const handleClaim = () => {
    try {
      setIsButtonLoading(true)
      setOperationPending(true)
      setIsTxnSuccessfull(false)
      executeClaimRewards(SSLProgram, wal, connection, coin, userPublicKey).then((con) => {
        setIsButtonLoading(false)
        setOperationPending(false)
        const { confirm } = con
        if (confirm && confirm?.value && confirm.value.err === null) {
          notify(sslSuccessfulMessage('claimed', claimableReward, coin?.token, walletName))
          setActionModal(false)
          setIsTxnSuccessfull(true)
        } else {
          notify(sslErrorMessage())
          setIsTxnSuccessfull(false)
          return
        }
      })
    } catch (err) {
      setIsButtonLoading(false)
      setOperationPending(false)
      notify(genericErrMsg(err))
      setIsTxnSuccessfull(false)
    }
  }
  const handleInputChange = (input: string) => {
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
  }

  const userDepositInUSD = useMemo(
    () => withdrawBigString(userDepositedAmount?.toString(), coin?.mintDecimals),
    [userDepositedAmount, coin?.mintDecimals]
  )
  const disabled =
    !connected ||
    operationPending ||
    isButtonLoading ||
    (modeOfOperation === ModeOfOperation.DEPOSIT
      ? parseFloat(depositAmount) == 0
      : parseFloat(withdrawAmount) == 0)
  const canClaim = claimableReward > 0
  const liquidityItem = (
    <FarmBalanceItem
      title={'Liquidity:'}
      asZero={liquidity === 0}
      value={liquidity ? '$' + truncateBigNumber(liquidity) : <SkeletonCommon height="100%" />}
    />
  )
  const volumeItem = (
    <FarmBalanceItem
      title={'24H Volume:'}
      asZero={formattedapiSslData?.volume === 0}
      value={'$' + truncateBigNumber(formattedapiSslData?.volume)}
    />
  )
  const feeItem = (
    <FarmBalanceItem
      title={'24H Fees:'}
      asZero={formattedapiSslData?.fee === 0}
      value={'$' + truncateBigNumber(formattedapiSslData?.fee * prices?.[getPriceObject(coin?.token)]?.current)}
    />
  )
  const balanceItem = (
    <FarmBalanceItem
      title={'My Balance:'}
      asZero={userDepositedAmount?.toNumber() == 0}
      value={truncateBigString(userDepositedAmount?.toString(), coin?.mintDecimals)}
    />
  )
  const walletBalance = (
    <FarmBalanceItem
      title={'Wallet Balance:'}
      asZero={userTokenBalance === 0}
      value={
        `$${truncateBigString(userTokenBalance?.toString(), coin?.mintDecimals)}  ${coin?.token}` +
        ` (${truncateBigNumber(userTokenBalanceInUSD)} USD)`
      }
    />
  )
  const totalEarnings = (
    <FarmBalanceItem
      title={'Total Earnings:'}
      asZero={totalEarned === 0}
      includeUSD
      titlePosition={isTablet ? 'text-start' : 'text-end'}
      value={
        <div className={`md-xl:items-end flex flex-col md-xl:flex-row gap-1`}>
          {truncateBigNumber(totalEarned)} {coin?.token}
          <div className={'text-end'}>(${truncateBigNumber(totalEarnedInUSD)} USD)</div>
        </div>
      }
    />
  )
  const pendingRewards = (
    <FarmBalanceItem
      title={'Pending Rewards:'}
      asZero={claimableReward === 0}
      includeUSD
      titlePosition={isTablet ? 'text-start' : 'text-end'}
      value={
        <div className={`md-xl:items-end flex flex-col md-xl:flex-row gap-1`}>
          {truncateBigNumber(claimableReward)} {coin?.token}
          <div className={'text-end'}>(${truncateBigNumber(claimableRewardInUSD)} USD)</div>
        </div>
      }
    />
  )
  const radioGroupItems = (
    <RadioOptionGroup
      defaultValue={'deposit'}
      value={modeOfOperation == ModeOfOperation.DEPOSIT ? 'deposit' : 'withdraw'}
      className={`w-full  md-xl:w-[190px]`}
      optionClassName={`w-full md-xl:w-[85px]`}
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
  const tokenInput = (
    <TokenInput
      handleHalf={() =>
        modeOfOperation === ModeOfOperation.DEPOSIT
          ? setDepositAmount(userTokenBalance ? numberFormatter(userTokenBalance / 2) : '0')
          : setWithdrawAmount(userDepositedAmount ? numberFormatter(userDepositedAmount?.toNumber() / 2) : '0')
      }
      handleMax={() =>
        modeOfOperation === ModeOfOperation.DEPOSIT
          ? setDepositAmount(userTokenBalance ? String(userTokenBalance) : '0')
          : setWithdrawAmount(userDepositedAmount ? userDepositInUSD : '0')
      }
      value={modeOfOperation === ModeOfOperation.DEPOSIT ? depositAmount ?? '' : withdrawAmount ?? ''}
      onChange={(e) => handleInputChange(e.target.value)}
      tokenSymbol={coin.token}
      disabled={disabled}
    />
  )

  const connectButtonClaimCombo = (
    <div className={'flex flex-col min-lg:flex-row  gap-2.5 '}>
      {connected ? (
        <Button
          colorScheme={'blue'}
          className={'basis-1/2'}
          disabled={disableActionButton || disabled}
          onClick={
            modeOfOperation === ModeOfOperation.WITHDRAW && userDepositedAmount
              ? () => {
                  openActionModal('withdraw')
                }
              : modeOfOperation === ModeOfOperation.DEPOSIT
              ? () => {
                  openActionModal('deposit')
                }
              : null
          }
          loading={actionModal ? false : isButtonLoading}
        >
          {actionButtonText}
        </Button>
      ) : (
        <Connect containerStyle={'inline-flex basis-1/2'} customButtonStyle={'h-[35px] w-full'} />
      )}
      <RoundedGradientWrapper
        className={cn('max-h-[35px] cursor-pointer basis-1/2', !canClaim && 'bg-white grayscale')}
        onClick={handleClaim}
        animated={canClaim && !isButtonLoading}
        isDisabled={isButtonLoading || disabled || !canClaim}
      >
        <RoundedGradientInner
          className={cn(
            `rounded-circle flex
                items-center justify-center dark:text-white text-text-lightmode-primary
                font-bold `,
            isButtonLoading || disabled || (!canClaim && 'cursor-not-allowed')
          )}
          borderWidth={'1.5'}
        >
          {isButtonLoading ? (
            <Loader />
          ) : canClaim ? (
            `Claim ${numberFormatter(claimableReward)} ${coin?.token}`
          ) : (
            'No Claimable Rewards'
          )}
        </RoundedGradientInner>
      </RoundedGradientWrapper>
    </div>
  )
  const oracleItem = <OracleIcon token={coin} />
  const claimable = rewards[coin?.mint?.toBase58()]?.toNumber() / Math.pow(10, coin?.mintDecimals)

  const depositPercentage = (liquidity / coin?.cappedDeposit) * 100
  return (
    <>
      <FarmItemHead
        icon={`/img/crypto/${coin?.token}.svg`}
        canClaim={claimable > 0}
        token={coin?.token}
        tooltip={
          <>
            Deposits are at {depositPercentage?.toFixed(2)}% capacity, the current cap is $
            {truncateBigNumber(coin?.cappedDeposit)}
          </>
        }
        apy={`${apiSslData?.apy ? Number(apiSslData?.apy)?.toFixed(2) : '0.00'}%`}
        liquidity={liquidity ? '$' + truncateBigNumber(liquidity) : <SkeletonCommon height="75%" width="75%" />}
        volume={<>${truncateBigNumber(apiSslData?.volume)}</>}
        fees={
          <Tooltip>
            <TooltipTrigger asChild>
              {truncateBigNumber(apiSslData?.fee * prices?.[getPriceObject(coin?.token)]?.current) ? (
                <h4 tw="flex justify-center items-center font-semibold">
                  ${truncateBigNumber(apiSslData?.fee * prices?.[getPriceObject(coin?.token)]?.current)}
                </h4>
              ) : (
                <h4 tw="flex justify-center items-center font-semibold">$0.00</h4>
              )}
            </TooltipTrigger>
            <TooltipContent className={`dark:text-black-4 text-grey-5 font-medium text-tiny`}>
              {truncateBigNumber(apiSslData?.fee * prices?.[getPriceObject(coin?.token)]?.current) ? (
                <>${truncateBigNumber(apiSslData?.fee * prices?.[getPriceObject(coin?.token)]?.current)}</>
              ) : (
                `$0.00`
              )}
            </TooltipContent>
          </Tooltip>
        }
        balance={<>{numberFormatter(parseFloat(userDepositInUSD))}</>}
      />
      <AccordionContent variant={'secondary'}>
        <div className={'grid grid-cols-1 md-xl:grid-cols-3 sm-lg:grid-cols-2 gap-3.75 '}>
          {actionModal && (
            <ActionModal
              actionModal={actionModal}
              setActionModal={setActionModal}
              handleWithdraw={handleWithdraw}
              handleDeposit={handleDeposit}
              handleClaim={handleClaim}
              isButtonLoading={isButtonLoading}
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
            <>
              {liquidityItem}
              {volumeItem}
              {feeItem}
              {balanceItem}
              {walletBalance}
              {totalEarnings}
              {pendingRewards}
              {radioGroupItems}
              {tokenInput}
              {connectButtonClaimCombo}
            </>
          ) : isTablet ? (
            <>
              <div className={'flex flex-col gap-3.75'}>
                {radioGroupItems}
                {tokenInput}
                {connectButtonClaimCombo}
              </div>
              <div className={'flex flex-col gap-3.75'}>
                {liquidityItem}
                {volumeItem}
                {feeItem}
                {balanceItem}
                {walletBalance}
                {totalEarnings}
                {pendingRewards}
              </div>
            </>
          ) : (
            <>
              <div className={'flex flex-col gap-3.75'}>
                {radioGroupItems}
                {walletBalance}
              </div>
              <div className={'flex flex-col gap-3.75'}>
                {tokenInput}
                {connectButtonClaimCombo}
              </div>
              <div className={'flex flex-col gap-3.75 items-end'}>
                {totalEarnings}
                {pendingRewards}
              </div>
            </>
          )}
          <div className={'col-span-1 md-xl:col-span-3 sm-lg:col-span-2'}>{oracleItem}</div>
        </div>
      </AccordionContent>
    </>
  )
}
export default FarmContent
