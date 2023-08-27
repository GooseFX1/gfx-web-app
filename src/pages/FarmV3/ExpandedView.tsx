import { FC, useMemo, useState, useEffect } from 'react'
import tw from 'twin.macro'
import 'styled-components/macro'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Button } from '../../components'
import { useAccounts, useConnectionConfig, usePriceFeedFarm, useSSLContext } from '../../context'
import { executeDeposit, executeWithdraw, getPriceObject } from '../../web3'
import { useWallet } from '@solana/wallet-adapter-react'
import { Connect } from '../../layouts'
import {
  ModeOfOperation,
  insufficientSOLMsg,
  invalidDepositErrMsg,
  invalidInputErrMsg,
  genericErrMsg,
  invalidWithdrawErrMsg,
  sslSuccessfulMessage,
  sslErrorMessage,
  SSLToken
} from './constants'
import { notify } from '../../utils'
import useBreakPoint from '../../hooks/useBreakPoint'

export const ExpandedView: FC<{ isExpanded: boolean; coin: SSLToken; userDepositedAmount: number }> = ({
  isExpanded,
  coin,
  userDepositedAmount
}) => {
  const { wallet } = useWallet()
  const wal = useWallet()
  const { connection, network } = useConnectionConfig()
  const breakpoint = useBreakPoint()
  const { getUIAmount } = useAccounts()
  const { prices, SSLProgram } = usePriceFeedFarm()
  const { operationPending, isTxnSuccessfull, setOperationPending, setIsTxnSuccessfull } = useSSLContext()
  const userPublicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter, wallet?.adapter?.publicKey])
  const tokenMintAddress = useMemo(() => coin?.mint?.toBase58(), [coin])
  const [userSolBalance, setUserSOLBalance] = useState<number>()
  const [depositAmount, setDepositAmount] = useState<number>()
  const [withdrawAmount, setWithdrawAmount] = useState<number>()
  const [modeOfOperation, setModeOfOperation] = useState<string>(ModeOfOperation.DEPOSIT)
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false)
  const { pool } = useSSLContext()

  useEffect(() => {
    ;(async () => {
      if (wallet?.adapter?.publicKey) {
        const SOL = await connection.getAccountInfo(wallet?.adapter?.publicKey)
        setUserSOLBalance(SOL.lamports / LAMPORTS_PER_SOL)
      }
    })()
  }, [wallet?.adapter?.publicKey, isTxnSuccessfull])

  const userTokenBalance = useMemo(
    () => (userPublicKey && tokenMintAddress ? getUIAmount(tokenMintAddress.toString()) : 0),
    [tokenMintAddress, getUIAmount, userPublicKey, isTxnSuccessfull]
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

  // Disable action button when deposit mode with zero user balance or no deposit amount,
  // or withdraw mode with zero user deposited amount or no withdraw amount
  const disableActionButton = useMemo(
    () =>
      (modeOfOperation === ModeOfOperation.DEPOSIT && (userTokenBalance === 0 || !depositAmount)) ||
      (modeOfOperation === ModeOfOperation.WITHDRAW && (userDepositedAmount === 0 || !withdrawAmount)),
    [userTokenBalance, modeOfOperation, pool, coin, depositAmount, withdrawAmount]
  )

  // Deposit mode and user has not token balance OR has not yet given input OR Withdraw has not deposited anything
  const actionButtonText = useMemo(() => {
    if (modeOfOperation === ModeOfOperation.DEPOSIT) {
      if (depositAmount) return modeOfOperation
      if (!depositAmount) return `Enter Amount`
      if (userTokenBalance === 0) return `Insufficient ${coin?.token}`
    }
    if (modeOfOperation === ModeOfOperation.WITHDRAW) {
      if (withdrawAmount) return modeOfOperation
      if (userDepositedAmount === 0) return `Insufficient ${coin?.token}`
      if (!withdrawAmount) return `Enter Amount`
    }
  }, [modeOfOperation, pool, coin, userTokenBalance, depositAmount, withdrawAmount])

  const checkConditionsForDepositWithdraw = (isDeposit: boolean) => {
    if (!enoughSOLInWallet()) return true
    if (isDeposit) {
      if (!userTokenBalance) {
        notify(genericErrMsg(`You have 0 ${coin.token} to deposit!`))
        setDepositAmount(0)
        return true
      } else if (isNaN(depositAmount) || depositAmount < 0.000001) {
        notify(invalidInputErrMsg(coin?.token))
        setDepositAmount(0)
        return true
      } else if (depositAmount > parseFloat(userTokenBalance && userTokenBalance.toFixed(3))) {
        notify(invalidDepositErrMsg(userTokenBalance, coin?.token))
        setDepositAmount(0)
        return true
      }
      return false
    } else {
      if (!userDepositedAmount) {
        notify(genericErrMsg(`You have 0 ${coin.token} to withdraw!`))
        setWithdrawAmount(0)
        return true
      } else if (isNaN(withdrawAmount) || withdrawAmount < 0.000001) {
        notify(invalidInputErrMsg(coin?.token))
        setWithdrawAmount(0)
        return true
      } else if (userDepositedAmount < withdrawAmount) {
        notify(invalidWithdrawErrMsg(userDepositedAmount, coin?.token))
        setWithdrawAmount(0)
        return true
      }
      return false
    }
  }
  const handleDeposit = (): void => {
    if (checkConditionsForDepositWithdraw(true)) return
    try {
      setIsButtonLoading(true)
      setOperationPending(true)
      setIsTxnSuccessfull(false)
      const confirm = executeDeposit(SSLProgram, wal, connection, depositAmount, coin, userPublicKey)
      confirm.then((con) => {
        setOperationPending(false)
        setIsButtonLoading(false)
        const { confirm, signature } = con
        if (confirm && confirm?.value && confirm.value.err === null) {
          notify(sslSuccessfulMessage(signature, depositAmount, coin?.token, network, 'Deposit'))
          setTimeout(() => setDepositAmount(0), 500)
          setIsTxnSuccessfull(true)
        } else {
          const { signature, error } = con
          notify(sslErrorMessage(coin?.token, error?.message, signature, network, 'Deposit'))
          setIsTxnSuccessfull(false)
          return
        }
      })
    } catch (error) {
      setOperationPending(false)
      setIsButtonLoading(false)
      notify(genericErrMsg(error))
      setIsTxnSuccessfull(false)
    }
  }
  const handleWithdraw = (): void => {
    if (checkConditionsForDepositWithdraw(false)) return
    try {
      setIsButtonLoading(true)
      setOperationPending(true)
      setIsTxnSuccessfull(false)
      executeWithdraw(SSLProgram, wal, connection, coin, withdrawAmount, userPublicKey).then((con) => {
        setIsButtonLoading(false)
        setOperationPending(false)
        const { confirm, signature } = con
        if (confirm && confirm?.value && confirm.value.err === null) {
          notify(sslSuccessfulMessage(signature, withdrawAmount, coin?.token, network, 'Withdraw'))
          setTimeout(() => setWithdrawAmount(0), 500)
          setIsTxnSuccessfull(true)
        } else {
          const { signature, error } = con
          notify(sslErrorMessage(coin?.token, error?.message, signature, network, 'Withdraw'))
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
      if (modeOfOperation === ModeOfOperation.DEPOSIT) setDepositAmount(inputValue)
      else setWithdrawAmount(inputValue)
    }
  }

  return (
    <div
      css={[
        tw`dark:bg-black-2 bg-white mx-3.75 sm:mx-3 rounded-[0 0 15px 15px] duration-300 
            flex justify-between sm:flex-col`,
        isExpanded ? tw`h-[115px] sm:h-[366px] visible  p-3.5 sm:p-4` : tw`h-0 invisible p-0 opacity-0 w-0`
      ]}
    >
      <div tw="flex flex-col">
        {breakpoint.isMobile && isExpanded && (
          <div tw="flex flex-col">
            <FarmStats isExpanded={isExpanded} keyStr="Liquidity" value={`${2} ${coin?.token}`} />
            <FarmStats isExpanded={isExpanded} keyStr="24H Volume" value={`${3} ${coin?.token}`} />
            <FarmStats isExpanded={isExpanded} keyStr="24H Fees" value={`${4} ${coin?.token}`} />
            <FarmStats isExpanded={isExpanded} keyStr="Balance" value={`${4} ${coin?.token}`} />
            <FarmStats
              isExpanded={isExpanded}
              keyStr="Wallet Balance"
              value={`${userTokenBalance.toFixed(2)} ${coin?.token}`}
            />
            <FarmStats isExpanded={isExpanded} keyStr="Total Earnings" value={`2.5 ${coin?.token}`} />
            <FarmStats isExpanded={isExpanded} keyStr="My Balance" value={`2.5 ${coin?.token}`} />
          </div>
        )}
        {isExpanded && (
          <>
            <div tw="flex font-semibold duration-500 relative sm:mt-2">
              <div
                css={[
                  tw`bg-blue-1 h-8.75 w-[100px] sm:w-[50%] rounded-full`,
                  modeOfOperation === ModeOfOperation.WITHDRAW
                    ? tw`absolute ml-[100px] sm:ml-[50%] duration-500`
                    : tw`absolute ml-0 duration-500`
                ]}
              ></div>
              <div
                css={[
                  tw`h-8.75 w-[100px] sm:w-[50%] z-10 flex items-center justify-center cursor-pointer`,
                  modeOfOperation === ModeOfOperation.DEPOSIT && tw`!text-white`
                ]}
                onClick={() => (operationPending ? null : setModeOfOperation(ModeOfOperation.DEPOSIT))}
              >
                Deposit
              </div>
              <div
                css={[
                  tw`h-8.75 w-[100px] sm:w-[50%] z-10 flex items-center justify-center cursor-pointer`,
                  modeOfOperation === ModeOfOperation.WITHDRAW && tw`!text-white`
                ]}
                onClick={() => (operationPending ? null : setModeOfOperation(ModeOfOperation.WITHDRAW))}
              >
                Withdraw
              </div>
            </div>
          </>
        )}
        {breakpoint.isDesktop && (
          <div tw="mt-4">
            <FarmStats
              isExpanded={isExpanded}
              keyStr="Wallet Balance"
              value={`${userTokenBalance.toFixed(2)} ${coin?.token} ($ ${userTokenBalanceInUSD.toFixed(2)} USD)`}
            />
          </div>
        )}
      </div>

      <div>
        <div tw="flex relative">
          {isExpanded && (
            <div tw="absolute flex z-[100]">
              <div
                onClick={() =>
                  modeOfOperation === ModeOfOperation.DEPOSIT
                    ? setDepositAmount(userTokenBalance ? parseFloat((userTokenBalance / 2).toFixed(2)) : 0)
                    : setWithdrawAmount(userDepositedAmount ? 0.01 : 0)
                }
                tw="font-semibold text-grey-1 dark:text-grey-2 mt-1.5 ml-4 cursor-pointer"
              >
                Min
              </div>
              <div
                onClick={() =>
                  modeOfOperation === ModeOfOperation.DEPOSIT
                    ? setDepositAmount(userTokenBalance ? parseFloat(userTokenBalance.toFixed(2)) : 0)
                    : setWithdrawAmount(userDepositedAmount ? userDepositedAmount : 0)
                }
                tw="font-semibold text-grey-1 dark:text-grey-2 mt-1.5 ml-2 cursor-pointer"
              >
                Max
              </div>
            </div>
          )}

          {isExpanded && (
            <>
              <input
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={`0.00`}
                value={modeOfOperation === ModeOfOperation.DEPOSIT ? depositAmount : withdrawAmount}
                css={[
                  tw`duration-500 rounded-[50px] relative !text-regular font-semibold outline-none dark:bg-black-1 
                bg-grey-5 border-none`,
                  isExpanded
                    ? tw`w-[400px] h-8.75 sm:w-[100%] p-4 pl-[100px] pr-[64px] text-right sm:pl-[65%]`
                    : tw`h-0 w-0 pl-0 invisible`
                ]}
                type="number"
              />
              <div tw="font-semibold text-grey-1 dark:text-grey-2 absolute ml-[345px] sm:ml-[85%] mt-1.5">
                {coin?.token}
              </div>
            </>
          )}
        </div>
        {isExpanded && (
          <div tw="mt-4">
            {wallet?.adapter?.publicKey ? (
              <div>
                <Button
                  height="35px"
                  disabledColor={tw`dark:bg-black-1 bg-grey-5 !text-grey-1 opacity-70`}
                  disabled={isButtonLoading || disableActionButton}
                  cssStyle={tw`duration-500 w-[400px] sm:w-[100%] !h-8.75 bg-blue-1 text-regular border-none
                    !text-white font-semibold rounded-[50px] flex items-center justify-center outline-none`}
                  onClick={modeOfOperation === ModeOfOperation.DEPOSIT ? handleDeposit : handleWithdraw}
                  loading={isButtonLoading}
                >
                  {actionButtonText}
                </Button>
              </div>
            ) : (
              <Connect customButtonStyle={[tw`sm:w-[80vw] w-[400px] !h-8.75`]} />
            )}
          </div>
        )}
      </div>

      {breakpoint.isDesktop && isExpanded && (
        <div tw="mt-1">
          <FarmStats
            alignRight={true}
            isExpanded={isExpanded}
            keyStr="Total Earnings"
            value={`2.5 ${coin?.token} ($12 USD)`}
          />
          <div tw="mt-3">
            <FarmStats
              alignRight={true}
              isExpanded={isExpanded}
              keyStr="My Balance"
              value={`2.5 ${coin?.token} ($12 USD)`}
            />
          </div>
        </div>
      )}
    </div>
  )
}

const FarmStats: FC<{ keyStr: string; value: string; isExpanded: boolean; alignRight?: boolean }> = ({
  keyStr,
  value,
  isExpanded,
  alignRight
}) => (
  <div
    css={[
      tw`font-semibold duration-500 sm:flex sm:w-[100%] sm:justify-between leading-[18px] sm:mb-2`,
      isExpanded ? tw`text-regular opacity-100` : tw` duration-100 invisible opacity-0`
    ]}
  >
    <div tw="text-grey-2" css={[!!alignRight && tw`text-right`]}>
      {keyStr}
    </div>
    <div tw="text-grey-2">{value}</div>
  </div>
)
