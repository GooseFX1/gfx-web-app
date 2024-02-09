import { FC, useMemo, useState, useEffect, useCallback } from 'react'
import tw, { styled } from 'twin.macro'
import 'styled-components/macro'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Button, SkeletonCommon } from '../../components'
import { useAccounts, useConnectionConfig, usePriceFeedFarm, useSSLContext } from '../../context'
import { executeClaimRewards, executeDeposit, executeWithdraw, getPriceObject } from '../../web3'
import { useWallet } from '@solana/wallet-adapter-react'
import { Connect } from '../../layouts'
import {
  ModeOfOperation,
  insufficientSOLMsg,
  invalidDepositErrMsg,
  invalidInputErrMsg,
  genericErrMsg,
  //invalidWithdrawErrMsg,
  sslSuccessfulMessage,
  sslErrorMessage,
  SSLToken
} from './constants'
import { notify, truncateBigNumber, truncateBigString, commafy, withdrawBigString } from '../../utils'
import useBreakPoint from '../../hooks/useBreakPoint'
import { ActionModal } from './ActionModal'
import BN from 'bn.js'
import useSolSub from '../../hooks/useSolSub'

const CLAIM = styled.div`
  ${tw`h-8.75 w-[195px] rounded-circle flex items-center justify-center text-white cursor-pointer 
    ml-2 p-[1.5px] sm:w-full sm:mt-3.75 sm:ml-0`};
  background: linear-gradient(94deg, #f7931a 0%, #ac1cc7 100%);
`

export const ExpandedView: FC<{ isExpanded: boolean; coin: SSLToken; userDepositedAmount: BN }> = ({
  isExpanded,
  coin,
  userDepositedAmount
}) => {
  const { wallet } = useWallet()
  const wal = useWallet()
  const { connection } = useConnectionConfig()
  const breakpoint = useBreakPoint()
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
  const [userSolBalance, setUserSOLBalance] = useState<number>()
  const [depositAmount, setDepositAmount] = useState<string>()
  const [withdrawAmount, setWithdrawAmount] = useState<string>()
  const [modeOfOperation, setModeOfOperation] = useState<string>(ModeOfOperation.DEPOSIT)
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false)
  const [userTokenBalance, setUserTokenBalance] = useState<number>()
  const [actionModal, setActionModal] = useState<boolean>(false)
  const [actionType, setActionType] = useState<string>(null)
  const [currentSlot, setCurrentSlot] = useState<number>(0)
  const [earlyWithdrawFee, setEarlyWithdrawFee] = useState<number>(0)
  const { getUIAmount } = useAccounts()
  const { off } = useSolSub()

  useEffect(() => {
    if (userPublicKey) {
      setUserTokenBalance(getUIAmount(tokenMintAddress))
      if (coin.token === 'SOL') setUserTokenBalance(userSolBalance)
    }
  }, [tokenMintAddress, userPublicKey, isTxnSuccessfull, userSolBalance, getUIAmount])

  useEffect(() => {
    ;(async () => {
      try {
        const slot = await connection.getSlot()
        setCurrentSlot(slot)
      } catch (error) {
        console.error('Error getting current slot:', error)
        setCurrentSlot(0)
      }
    })()
  }, [connection, actionModal])

  const calculateEarlyWithdrawalPenalty = (actionValue: string) => {
    if (actionValue !== 'withdraw') return
    const depositSlot = filteredLiquidityAccounts[tokenMintAddress]?.lastDepositAt
    const slotDiff = new BN(currentSlot).sub(depositSlot)?.toNumber()
    // console.log("slotDiff", slotDiff);
    if (slotDiff < 216000) {
      const decayingFactor = ((216000 - slotDiff) / 216000) ** 2 * (2 / 100)
      const withdrawalFee = decayingFactor * +withdrawAmount
      setEarlyWithdrawFee(withdrawalFee)
    } else {
      setEarlyWithdrawFee(0)
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

  // const goToTwitter = () => {
  //   window.open('https://twitter.com/GooseFX1/status/1719447919437533535', '_blank')
  // }

  const openActionModal = (actionValue: string) => {
    if (actionValue === 'deposit' && window.location.pathname === '/farm/temp-withdraw') return
    calculateEarlyWithdrawalPenalty(actionValue)
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
  const handleWithdraw = (withdrawAmount: number): void => {
    if (checkConditionsForDepositWithdraw(false)) return
    try {
      setIsButtonLoading(true)
      setOperationPending(true)
      depositedBalanceConnection(userPublicKey, coin)
      setIsTxnSuccessfull(false)
      executeWithdraw(SSLProgram, wal, connection, coin, String(withdrawAmount), userPublicKey).then((con) => {
        setIsButtonLoading(false)
        setOperationPending(false)
        const { confirm } = con
        if (confirm && confirm?.value && confirm.value.err === null) {
          notify(sslSuccessfulMessage('withdrawn', String(withdrawAmount), coin?.token, walletName))
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

  const renderStatsAsZero = useCallback(
    (token: string | undefined) => (
      <div tw="text-right dark:text-grey-1 text-grey-2 font-semibold text-regular">
        <div>0.00 {token}</div>
      </div>
    ),
    []
  )

  return (
    <div
      css={[
        tw`dark:bg-black-2 bg-white mx-3.75 sm:mx-3 rounded-[0 0 15px 15px] duration-300 
            flex justify-between sm:flex-col sm:justify-around sm:w-[calc(100vw - 50px)] `,
        isExpanded
          ? tw`h-[115px] visible p-3.5 sm:h-auto sm:p-4`
          : tw`!h-0 invisible p-0 opacity-0 w-0 sm:h-[366px]`
      ]}
    >
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
        />
      )}
      <div tw="flex flex-col">
        {breakpoint.isMobile && isExpanded && (
          <div tw="flex flex-col">
            <FarmStats
              keyStr="Liquidity"
              value={
                <span tw="dark:text-grey-8 text-black-4 font-semibold text-regular">
                  {liquidity ? '$' + truncateBigNumber(liquidity) : <SkeletonCommon height="100%" />}
                </span>
              }
            />
            <FarmStats
              keyStr="24H Volume"
              value={
                <span tw="dark:text-grey-8 text-black-4 font-semibold text-regular">
                  ${truncateBigNumber(formattedapiSslData?.volume)}
                </span>
              }
            />
            <FarmStats
              keyStr="24H Fees"
              value={
                <span tw="dark:text-grey-8 text-black-4 font-semibold text-regular">
                  ${truncateBigNumber(formattedapiSslData?.fee * prices?.[getPriceObject(coin?.token)]?.current)}
                </span>
              }
            />
            <FarmStats
              keyStr="My Balance"
              value={
                userDepositedAmount && userDepositedAmount.toNumber() > 0 ? (
                  <span tw="dark:text-grey-8 text-black-4 font-semibold text-regular">
                    {truncateBigString(userDepositedAmount.toString(), coin?.mintDecimals)}
                  </span>
                ) : (
                  renderStatsAsZero(coin?.token)
                )
              }
            />
            <FarmStats
              keyStr="Wallet Balance"
              value={
                userTokenBalance > 0 ? (
                  <span tw="dark:text-grey-8 text-black-4 font-semibold text-regular">
                    {truncateBigNumber(userTokenBalance)} {coin?.token}
                  </span>
                ) : (
                  renderStatsAsZero(coin?.token)
                )
              }
            />
            <FarmStats
              keyStr="Total Earned"
              value={
                totalEarned > 0 ? (
                  <div tw="text-right dark:text-grey-8 text-black-4 font-semibold text-regular">
                    <div>{totalEarned.toFixed(4)}</div>
                    <div tw="dark:text-grey-1 text-grey-2">(${totalEarnedInUSD?.toFixed(2)} USD)</div>
                  </div>
                ) : (
                  renderStatsAsZero(coin?.token)
                )
              }
            />
            <FarmStats
              keyStr="Pending Rewards"
              value={
                claimableReward > 0 ? (
                  <div tw="text-right dark:text-grey-8 text-black-4 font-semibold text-regular">
                    <div>{commafy(claimableReward, 4)}</div>
                    <div tw="dark:text-grey-1 text-grey-2">(${commafy(claimableRewardInUSD, 2)} USD)</div>
                  </div>
                ) : (
                  renderStatsAsZero(coin?.token)
                )
              }
            />
          </div>
        )}
        {isExpanded && (
          <>
            <div tw="flex font-semibold duration-500 relative sm:my-1 sm:mb-[15px]">
              <div
                css={[
                  tw`bg-gradient-1 h-8.75 w-[100px] sm:w-[50%] rounded-full`,
                  modeOfOperation === ModeOfOperation.WITHDRAW
                    ? tw`absolute ml-[100px] sm:ml-[50%] duration-500`
                    : tw`absolute ml-0 duration-500`
                ]}
              ></div>
              <h6
                css={[
                  tw`h-8.75 w-[100px] sm:w-[50%] z-10 flex items-center justify-center 
                  cursor-pointer dark:text-white text-grey-1 text-regular`,
                  modeOfOperation === ModeOfOperation.DEPOSIT && tw`!text-white`
                ]}
                onClick={() => (operationPending ? null : setModeOfOperation(ModeOfOperation.DEPOSIT))}
              >
                Deposit
              </h6>
              <h6
                css={[
                  tw`h-8.75 w-[100px] sm:w-[50%] z-10 flex items-center justify-center 
                  cursor-pointer dark:text-white text-grey-1 text-regular`,
                  modeOfOperation === ModeOfOperation.WITHDRAW && tw`!text-white`
                ]}
                onClick={() => (operationPending ? null : setModeOfOperation(ModeOfOperation.WITHDRAW))}
              >
                Withdraw
              </h6>
            </div>
          </>
        )}
        {breakpoint.isDesktop && isExpanded && (
          <div tw="mt-4">
            <FarmStats
              keyStr="Wallet Balance"
              value={
                <span tw="dark:text-grey-8 text-black-4 font-semibold text-regular">
                  {truncateBigNumber(userTokenBalance)} {coin?.token} (${truncateBigNumber(userTokenBalanceInUSD)}{' '}
                  USD)
                </span>
              }
            />
          </div>
        )}
      </div>

      <div>
        <div tw="flex relative w-[400px] sm:w-[100%] dark:bg-black-1 bg-grey-5 rounded-[50px] items-center">
          {isExpanded && (
            <div tw="flex z-[100]">
              <div
                onClick={() =>
                  modeOfOperation === ModeOfOperation.DEPOSIT
                    ? setDepositAmount(userTokenBalance ? '0.01' : '0')
                    : setWithdrawAmount(userDepositedAmount ? '0.01' : '0')
                }
                tw="font-bold text-regular text-grey-1 dark:text-grey-2 ml-3 cursor-pointer"
              >
                Min
              </div>
              <div
                onClick={() =>
                  modeOfOperation === ModeOfOperation.DEPOSIT
                    ? setDepositAmount(userTokenBalance ? String(userTokenBalance) : '0')
                    : setWithdrawAmount(userDepositedAmount ? userDepositInUSD : '0')
                }
                tw="font-bold text-regular text-grey-1 dark:text-grey-2 ml-2 cursor-pointer"
              >
                Max
              </div>
            </div>
          )}

          {/*  */}
          {isExpanded && (
            <>
              <input
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={`0.00`}
                value={modeOfOperation === ModeOfOperation.DEPOSIT ? depositAmount ?? '' : withdrawAmount ?? ''}
                css={[
                  tw` relative !text-regular outline-none border-none
                  dark:text-white text-black-4`,
                  isExpanded
                    ? tw`w-[100%] h-8.75  dark:bg-black-1 bg-grey-5 p-1 pl-[100px] text-right`
                    : tw`h-0 w-0 pl-0 invisible`
                ]}
                type="number"
                key={modeOfOperation}
              />
              <div css={[tw`text-regular text-grey-1 dark:text-grey-2 text-[14px] pr-3`]}>{coin?.token}</div>
            </>
          )}
        </div>
        {isExpanded && (
          <div tw="mt-4">
            {userPublicKey ? (
              <div tw="flex flex-row sm:flex-col">
                <Button
                  height="35px"
                  disabledColor={tw`dark:bg-black-1 bg-grey-5 !text-grey-1 opacity-70`}
                  disabled={isButtonLoading || disableActionButton}
                  cssStyle={tw`duration-500 w-[195px] mr-[5px] sm:w-[100%] !h-8.75 bg-blue-1 text-regular border-none
                    !text-white font-bold rounded-[50px] flex items-center justify-center outline-none`}
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
                  loading={actionModal ? false : isButtonLoading ? true : false}
                >
                  {actionButtonText}
                </Button>
                {claimableReward > 0 ? (
                  <CLAIM onClick={() => openActionModal('claim')}>
                    <div
                      tw="h-full w-full dark:bg-black-2 bg-white rounded-circle flex sm:w-full
                    items-center justify-center dark:text-white text-black-4 text-regular font-bold"
                    >
                      Claim {truncateBigNumber(claimableReward)} {coin?.token}
                    </div>
                  </CLAIM>
                ) : (
                  <div
                    tw="h-8.75 w-[195px] rounded-circle flex items-center border-solid
                    text-regular cursor-pointer ml-2 p-[3px] border-[1.5px] border-grey-1
                    cursor-not-allowed justify-center text-grey-1 font-bold sm:w-full sm:mt-3.75 sm:ml-0"
                  >
                    No Claimable Rewards
                  </div>
                )}
              </div>
            ) : (
              <Connect customButtonStyle={[tw`sm:w-[80vw] w-[400px] !h-8.75`]} />
            )}
          </div>
        )}
      </div>

      {breakpoint.isDesktop && isExpanded && (
        <div tw="mt-1 flex flex-col">
          <FarmStats
            alignRight={true}
            keyStr="Total Earned"
            value={
              totalEarned ? (
                <div tw="text-right">
                  <span tw="dark:text-grey-8 text-black-4 font-semibold text-regular">
                    {`${commafy(totalEarned, 4)} ($${commafy(totalEarnedInUSD, 2)} USD)`}
                  </span>
                </div>
              ) : (
                <div tw="text-right">
                  <span tw="dark:text-grey-1 text-grey-2 font-semibold text-regular">
                    0.00 {coin?.token} ($0.00 USD)
                  </span>
                </div>
              )
            }
          />
          <div tw="mt-2">
            <FarmStats
              alignRight={true}
              keyStr="Pending Rewards"
              value={
                claimableReward > 0 ? (
                  <div tw="text-right">
                    <span tw="dark:text-grey-8 text-black-4 font-semibold text-regular">
                      {`${commafy(claimableReward, 4)} ($${commafy(claimableRewardInUSD, 2)} USD)`}
                    </span>
                  </div>
                ) : (
                  <div tw="text-right">
                    <span tw="dark:text-grey-1 text-grey-2 font-semibold text-regular">
                      0.00 {coin?.token} ($0.00 USD)
                    </span>
                  </div>
                )
              }
            />
          </div>
        </div>
      )}
    </div>
  )
}

const FarmStats: FC<{
  keyStr: string
  value: string | JSX.Element
  alignRight?: boolean
}> = ({ keyStr, value, alignRight }) => (
  <div
    css={[
      tw`font-semibold duration-500 sm:flex sm:w-[100%] sm:justify-between items-center 
  leading-[18px] sm:mb-2`
    ]}
  >
    <div tw="dark:text-grey-2 text-grey-1" css={[!!alignRight && tw`text-right`]}>
      {keyStr}
    </div>
    <div>{value}</div>
  </div>
)
