import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { cn, Dialog, DialogBody, DialogContent, DialogFooter } from 'gfx-component-lib'
import { useConnectionConfig, useGamma, usePriceFeedFarm } from '@/context'
import DepositWithdrawInput from './DepositWithdrawInput'
import DepositWithdrawToggle from './DepositWithdrawToggle'
import DepositWithdrawAccordion from './DepositWithdrawAccordion'
import DepositWithdrawLabel from './DepositWithdrawLabel'
import SwapNow from './SwapNow'
import { TokenRow } from './TokenRow'
import { ReviewConfirm } from './ReviewConfirm'
import StickyFooter from './StickyFooter'
import { useWallet } from '@solana/wallet-adapter-react'
import { ModeOfOperation } from './constants'
import { DepositWithdrawHeader } from './DepositWithdrawHeader'
import useBreakPoint from '@/hooks/useBreakPoint'
//import useBoolean from '@/hooks/useBoolean'
import GammaActionModal from '@/pages/FarmV4/GammaActionModal'
import GammaActionModalContentStack from '@/pages/FarmV4/GammaActionModalContentStack'
import useTransaction from '@/hooks/useTransaction'
import { calculateOtherTokenAndLPAmount, deposit, withdraw } from '@/web3/Farm'
import BN from 'bn.js'
import BigNumber from 'bignumber.js'
import { withdrawBigStringFarm } from '@/utils/misc'
import { useWalletBalance } from '@/context/walletBalanceContext'
import { bigNumberFormatter } from '@/utils'
import useSolSub from '@/hooks/useSolSub'

export const DepositWithdrawSlider: FC = () => {
  const { wallet } = useWallet()
  const { isMobile } = useBreakPoint()
  const { connection } = useConnectionConfig()
  const {
    selectedCard,
    openDepositWithdrawSlider,
    setOpenDepositWithdrawSlider,
    selectedCardPool,
    modeOfOperation,
    setModeOfOperation,
    setSelectedCard,
    setSelectedCardPool,
    slippage,
    sendingTransaction,
    setSendingTransaction,
    selectedCardLiquidityAcc,
    setSelectedCardLiquidityAcc,
    liveBalanceTracking,
    connectionId
  } = useGamma()

  const userPublicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter, wallet?.adapter?.publicKey])
  const [userSourceTokenBal, setUserSourceTokenBal] = useState<number>()
  const [userTargetTokenBal, setUserTargetTokenBal] = useState<number>()
  const [userSourceDepositAmount, setUserSourceDepositAmount] = useState<string>('')
  const [userTargetDepositAmount, setUserTargetDepositAmount] = useState<string>('')
  const [userSourceWithdrawAmount, setUserSourceWithdrawAmount] = useState<string>('')
  const [userTargetWithdrawAmount, setUserTargetWithdrawAmount] = useState<string>('')
  const [transactionLPAmount, setTransactionLPAmount] = useState<BN>()
  //const [isButtonLoading, setIsButtonLoading] = useBoolean()
  const [actionType, setActionType] = useState<string>('')
  //const [isClaim, setIsClaim] = useBoolean(false)
  const isDeposit = modeOfOperation === ModeOfOperation.DEPOSIT
  const { GammaProgram } = usePriceFeedFarm()
  const { sendTransaction, createTransactionBuilder } = useTransaction()
  const { balance } = useWalletBalance()
  const { off } = useSolSub()

  //eslint-disable-next-line
  useEffect(() => {
    return () => {
      handleClose
    }
  }, [])

  useEffect(() => {
    if (selectedCard && userPublicKey) {
      setUserSourceTokenBal(balance[selectedCard?.mintA?.symbol].tokenAmount.uiAmount)
      setUserTargetTokenBal(balance[selectedCard?.mintB?.symbol].tokenAmount.uiAmount)
    }
  }, [selectedCard, balance, userPublicKey])

  const handleClose = () => {
    setUserSourceDepositAmount('')
    setUserSourceWithdrawAmount('')
    setUserTargetDepositAmount('')
    setUserTargetWithdrawAmount('')
    setSelectedCard({})
    setSelectedCardPool({})
    setSelectedCardLiquidityAcc({})
    setModeOfOperation(ModeOfOperation?.DEPOSIT)
    setOpenDepositWithdrawSlider(false)
  }

  const handleInputChange = useCallback(
    async (input: string, sourceToken: boolean) => {

      if (input === '') {
        if (isDeposit) {
          setUserSourceDepositAmount('')
          setUserTargetDepositAmount('')
        } else {
          setUserSourceWithdrawAmount('')
          setUserTargetWithdrawAmount('')
        }
        return
      }

      const inputValue = +input
      if (!isNaN(inputValue)) {
        if (isDeposit) {
          if (sourceToken) {
            setUserSourceDepositAmount(input)
            if (Object.keys(selectedCardPool)?.length) {
              const { lpTokenAmount, otherTokenAmountInString } = await calculateOtherTokenAndLPAmount(
                input,
                0,
                selectedCardPool,
                connection
              )
              setTransactionLPAmount(lpTokenAmount)
              setUserTargetDepositAmount(otherTokenAmountInString)
            }
          } else {
            setUserTargetDepositAmount(input)
            if (Object.keys(selectedCardPool)?.length) {
              const { lpTokenAmount, otherTokenAmountInString } = await calculateOtherTokenAndLPAmount(
                input,
                1,
                selectedCardPool,
                connection
              )
              setTransactionLPAmount(lpTokenAmount)
              setUserSourceDepositAmount(otherTokenAmountInString)
            }
          }
        } else {
          if (sourceToken) {
            setUserSourceWithdrawAmount(input)
            if (Object.keys(selectedCardPool)?.length) {
              const { lpTokenAmount, otherTokenAmountInString } = await calculateOtherTokenAndLPAmount(
                input,
                0,
                selectedCardPool,
                connection
              )
              setTransactionLPAmount(lpTokenAmount)
              setUserTargetWithdrawAmount(otherTokenAmountInString)
            }
          } else {
            setUserTargetWithdrawAmount(input)
            if (Object.keys(selectedCardPool)?.length) {
              const { lpTokenAmount, otherTokenAmountInString } = await calculateOtherTokenAndLPAmount(
                input,
                1,
                selectedCardPool,
                connection
              )
              setTransactionLPAmount(lpTokenAmount)
              setUserSourceWithdrawAmount(otherTokenAmountInString)
            }
          }
        }
      }
    },
    [modeOfOperation, selectedCardPool]
  )

  const actionButtonText = useMemo(() => {
    if (isDeposit && (!userSourceTokenBal && !userTargetTokenBal)) return `Insufficient Tokens`
    else if (isDeposit && !userSourceTokenBal) return `Insufficient ${selectedCard?.mintA?.symbol}`
    else if (isDeposit && !userTargetTokenBal) return `Insufficient ${selectedCard?.mintB?.symbol}`
    else if (isDeposit && (!userSourceDepositAmount || new BigNumber(userSourceDepositAmount)?.isZero()
      || !userTargetDepositAmount || new BigNumber(userTargetDepositAmount)?.isZero())) return `Enter Amounts`
    else if (!isDeposit && (!userSourceWithdrawAmount || new BigNumber(userSourceWithdrawAmount)?.isZero()
      || !userTargetWithdrawAmount || new BigNumber(userTargetWithdrawAmount)?.isZero())) return `Enter Amounts`
    else if (isDeposit) return `Deposit`
    else return `Withdraw`
  }, [selectedCard, userSourceTokenBal, userTargetTokenBal, userTargetWithdrawAmount,
    userSourceDepositAmount, userTargetDepositAmount, isDeposit, userSourceWithdrawAmount, selectedCardLiquidityAcc
  ])

  const isActionButtonDisabled = useMemo(() => {
    if (isDeposit && (!userSourceTokenBal || !userTargetTokenBal)) return true
    else if (isDeposit && (!userSourceDepositAmount || new BigNumber(userSourceDepositAmount)?.isZero()
      || !userTargetDepositAmount || new BigNumber(userTargetDepositAmount)?.isZero())) return true
    else if (!isDeposit && (!userSourceWithdrawAmount || new BigNumber(userSourceWithdrawAmount)?.isZero()
      || !userTargetWithdrawAmount || new BigNumber(userTargetWithdrawAmount)?.isZero())) return true
    else if (isDeposit && (new BigNumber(userSourceDepositAmount)?.isGreaterThan(new BigNumber(userSourceTokenBal))
      || new BigNumber(userTargetDepositAmount)?.isGreaterThan(new BigNumber(userTargetTokenBal)))) return true
    else if (!isDeposit &&
      new BigNumber(userSourceWithdrawAmount)?.isGreaterThan(
        new BigNumber(
          ((selectedCardLiquidityAcc?.token0Deposited)?.sub(selectedCardLiquidityAcc?.token0Withdrawn))
            ?.toString()
        ))
      || new BigNumber(userTargetWithdrawAmount)?.isGreaterThan(
        new BigNumber(
          ((selectedCardLiquidityAcc?.token1Deposited)?.sub(selectedCardLiquidityAcc?.token1Withdrawn))
            ?.toString()
        )))
      return true
  }, [userSourceTokenBal, userTargetTokenBal, userTargetWithdrawAmount, userSourceDepositAmount,
    userTargetDepositAmount, isDeposit, userSourceWithdrawAmount, selectedCardLiquidityAcc, selectedCardPool])

  const handleHalf = useCallback(
    async (sourceToken: boolean) => {
      if (isDeposit) {
        if (sourceToken) {
          setUserSourceDepositAmount(userSourceTokenBal ? (userSourceTokenBal / 2)?.toString() : '')
          if (Object.keys(selectedCardPool)?.length) {
            const { lpTokenAmount, otherTokenAmountInString } = await calculateOtherTokenAndLPAmount(
              (userSourceTokenBal / 2)?.toString(),
              0,
              selectedCardPool,
              connection
            )
            setTransactionLPAmount(lpTokenAmount)
            setUserTargetDepositAmount(otherTokenAmountInString)
          }
        } else {
          setUserTargetDepositAmount(userTargetTokenBal ? (userTargetTokenBal / 2)?.toString() : '')
          if (Object.keys(selectedCardPool)?.length) {
            const { lpTokenAmount, otherTokenAmountInString } = await calculateOtherTokenAndLPAmount(
              (userTargetTokenBal / 2)?.toString(),
              1,
              selectedCardPool,
              connection
            )
            setTransactionLPAmount(lpTokenAmount)
            setUserSourceDepositAmount(otherTokenAmountInString)
          }
        }
      } else {
        if (sourceToken) {
          const withdraw0Amount = selectedCardLiquidityAcc?.token0Deposited ?
            !selectedCardLiquidityAcc?.token0Deposited?.isZero() &&
            !(selectedCardLiquidityAcc?.token0Deposited?.sub(selectedCardLiquidityAcc?.token0Withdrawn))?.isZero() ?
              withdrawBigStringFarm(
                selectedCardLiquidityAcc?.token0Deposited?.sub(selectedCardLiquidityAcc?.token0Withdrawn)
                  ?.div(new BN(2))?.toString(), selectedCardPool?.mint0Decimals) : '0' : '0'
          setUserSourceWithdrawAmount(withdraw0Amount)
          if (Object.keys(selectedCardPool)?.length) {
            const { lpTokenAmount, otherTokenAmountInString } = await calculateOtherTokenAndLPAmount(
              withdraw0Amount,
              0,
              selectedCardPool,
              connection
            )
            setTransactionLPAmount(lpTokenAmount)
            setUserTargetWithdrawAmount(otherTokenAmountInString)
          }
        } else {
          const withdraw1Amount = selectedCardLiquidityAcc?.token1Deposited ?
            !selectedCardLiquidityAcc?.token1Deposited?.isZero() &&
            !(selectedCardLiquidityAcc?.token1Deposited?.sub(selectedCardLiquidityAcc?.token1Withdrawn)).isZero() ?
              withdrawBigStringFarm(
                selectedCardLiquidityAcc?.token1Deposited?.sub(selectedCardLiquidityAcc?.token1Withdrawn)
                  ?.div(new BN(2))?.toString(), selectedCardPool?.mint1Decimals) : '0' : '0'
          setUserTargetWithdrawAmount(withdraw1Amount)
          if (Object.keys(selectedCardPool)?.length) {
            const { lpTokenAmount, otherTokenAmountInString } = await calculateOtherTokenAndLPAmount(
              withdraw1Amount,
              1,
              selectedCardPool,
              connection
            )
            setTransactionLPAmount(lpTokenAmount)
            setUserSourceWithdrawAmount(otherTokenAmountInString)
          }
        }
      }
    },
    [modeOfOperation, userSourceTokenBal, userTargetTokenBal, selectedCardPool, selectedCardLiquidityAcc]
  )

  const handleMax = useCallback(
    async (sourceToken: boolean) => {
      if (isDeposit) {
        if (sourceToken) {
          setUserSourceDepositAmount(userSourceTokenBal ? userSourceTokenBal?.toString() : '')
          if (Object.keys(selectedCardPool)?.length) {
            const { lpTokenAmount, otherTokenAmountInString } = await calculateOtherTokenAndLPAmount(
              userSourceTokenBal?.toString(),
              0,
              selectedCardPool,
              connection
            )
            setTransactionLPAmount(lpTokenAmount)
            setUserTargetDepositAmount(otherTokenAmountInString)
          }
        } else {
          setUserTargetDepositAmount(userTargetTokenBal ? userTargetTokenBal?.toString() : '')
          if (Object.keys(selectedCardPool)?.length) {
            const { lpTokenAmount, otherTokenAmountInString } = await calculateOtherTokenAndLPAmount(
              userTargetTokenBal?.toString(),
              1,
              selectedCardPool,
              connection
            )
            setTransactionLPAmount(lpTokenAmount)
            setUserSourceDepositAmount(otherTokenAmountInString)
          }
        }
      } else {
        if (sourceToken) {
          const withdraw0Amount = selectedCardLiquidityAcc?.token0Deposited ?
            !selectedCardLiquidityAcc?.token0Deposited?.isZero() ?
              withdrawBigStringFarm((selectedCardLiquidityAcc?.token0Deposited)
                  ?.sub(selectedCardLiquidityAcc?.token0Withdrawn)?.toString()
                , selectedCardPool?.mint0Decimals) : '0' : '0'
          setUserSourceWithdrawAmount(withdraw0Amount)
          if (Object.keys(selectedCardPool)?.length) {
            const { lpTokenAmount, otherTokenAmountInString } = await calculateOtherTokenAndLPAmount(
              withdraw0Amount,
              0,
              selectedCardPool,
              connection
            )
            setTransactionLPAmount(lpTokenAmount)
            setUserTargetWithdrawAmount(otherTokenAmountInString)
          }
        } else {
          const withdraw1Amount = selectedCardLiquidityAcc?.token1Deposited ?
            !selectedCardLiquidityAcc?.token1Deposited?.isZero() ?
              withdrawBigStringFarm((selectedCardLiquidityAcc?.token1Deposited)
                  ?.sub(selectedCardLiquidityAcc?.token1Withdrawn)?.toString(),
                selectedCardPool?.mint1Decimals) : '0' : '0'
          setUserTargetWithdrawAmount(withdraw1Amount)
          if (Object.keys(selectedCardPool)?.length) {
            const { lpTokenAmount, otherTokenAmountInString } = await calculateOtherTokenAndLPAmount(
              withdraw1Amount,
              1,
              selectedCardPool,
              connection
            )
            setTransactionLPAmount(lpTokenAmount)
            setUserSourceWithdrawAmount(otherTokenAmountInString)
          }
        }
      }
    },
    [modeOfOperation, userSourceTokenBal, userTargetTokenBal, selectedCardPool, selectedCardLiquidityAcc]
  )

  const handleDeposit = async () => {
    try {
      const txBuilder = createTransactionBuilder()
      liveBalanceTracking(connection, userPublicKey, selectedCard)
      const tx = await deposit(
        userSourceDepositAmount,
        userTargetDepositAmount,
        transactionLPAmount,
        slippage,
        selectedCard,
        userPublicKey,
        GammaProgram,
        connection
      )
      txBuilder.add(tx)
      setSendingTransaction(true)
      const { success } = await sendTransaction(txBuilder)
      //console.log('success', success)

      if (!success) {
        off(connectionId)
        console.log('An error occurred while depositing!')
        setSendingTransaction(false)
        return
      } else {
        setSendingTransaction(false)
        setUserSourceDepositAmount('')
        setUserTargetDepositAmount('')
        //setOpenDepositWithdrawSlider(false)
        //setSelectedCardLiquidityAcc({})
      }
    } catch (e) {
      setSendingTransaction(false)
      console.log('An error occurred while depositing.', e)
    }
  }

  const handleWithdraw = async () => {
    try {
      const txBuilder = createTransactionBuilder()
      liveBalanceTracking(connection, userPublicKey, selectedCard)
      const tx = await withdraw(
        userSourceWithdrawAmount,
        userTargetWithdrawAmount,
        transactionLPAmount,
        slippage,
        selectedCard,
        userPublicKey,
        GammaProgram,
        connection
      )
      txBuilder.add(tx)
      setSendingTransaction(true)
      const { success } = await sendTransaction(txBuilder)

      if (!success) {
        off(connectionId)
        console.log('An error occurred while withdrawing!')
        setSendingTransaction(false)
        return
      } else {
        setSendingTransaction(false)
        setUserSourceWithdrawAmount('')
        setUserTargetWithdrawAmount('')
        //setOpenDepositWithdrawSlider(false)
        //setSelectedCardLiquidityAcc({})
        setActionType('')
        //setModeOfOperation(ModeOfOperation.DEPOSIT)
      }
    } catch (e) {
      setSendingTransaction(false)
      console.log('An error occurred while withdrawing.', e)
    }
  }

  // const handleClaim = () => {
  //   console.log('withdraw')
  //   setIsButtonLoading.on()
  //   setActionType('claim')
  // }

  //eslint-disable-next-line
  const handleProcessStart = (type: 'claim' | 'withdraw') => {
    return () => {
      // if (type === 'claim') {
      //   setIsClaim.on()
      // }
      //console.log('performing', type)
      setOpenDepositWithdrawSlider(true)
      setActionType(type)
    }
  }

  const handleActionCancel = () => {
    setActionType('')
    //setIsClaim.off()
    //setIsButtonLoading.off()
  }

  //const claimableReward = 0

  const { actionLabel, actionModalTitle } = useMemo(() => {
    const actionModalTitle = 'Withdraw'
    const actionLabel = `Withdraw ${(+userSourceWithdrawAmount)?.toFixed(2)} ${selectedCard?.mintA?.symbol} +
     ${(+userTargetWithdrawAmount)?.toFixed(2)} ${selectedCard?.mintB?.symbol}`

    // if (isClaim) {
    //   actionModalTitle = 'Claim'
    //   actionLabel = `Claim ${claimableReward} SOME REWARD HERE`
    // }

    return { actionLabel, actionModalTitle }
  }, [isDeposit, userSourceWithdrawAmount, userTargetWithdrawAmount])

  return (
    <Dialog modal={false} open={openDepositWithdrawSlider} onOpenChange={setOpenDepositWithdrawSlider}>
      <div
        className={cn(`fixed top-0 left-0 w-screen h-screen z-10 bg-black-4 dark:bg-black-4 bg-opacity-50
      dark:bg-opacity-50 backdrop-blur-sm
      `)}
      />
      <DialogContent
        className={`sm:w-[393px] sm:max-h-screen border-1 border-solid sm:border-r-0 dark:border-black-4
      sm:rounded-none border-b-0 rounded-b-[0px] max-h-[calc(100vh-56px)] gap-0
      `}
        fullScreen={true}
        placement={isMobile ? 'bottom' : 'right'}
        onInteractOutside={(e) => e.preventDefault()}
        aria-describedby={null}
      >
        <GammaActionModal
          isOpen={actionType != '' && actionType != 'deposit'}
          setIsOpen={(b) => {
            if (!b) {
              handleActionCancel()
            }
          }}
          title={actionModalTitle}
          actionLabel={actionLabel}
          onActionClick={!isDeposit ? handleWithdraw : handleDeposit}
          actionType={actionType}
          loading={sendingTransaction}
        >
          <GammaActionModalContentStack
            options={[
              {
                textLeft: `${selectedCard?.mintA?.symbol} Amount`,
                textRight: `≈ ${(+userSourceWithdrawAmount)?.toFixed(2)} ${selectedCard?.mintA?.symbol}`
              },
              {
                textLeft: `${selectedCard?.mintB?.symbol} Amount`,
                textRight: `≈ ${(+userTargetWithdrawAmount)?.toFixed(2)} ${selectedCard?.mintB?.symbol}`
              },
              // {
              //   textLeft: 'Claim Reward',
              //   textRight: '2500 GOFX'
              // },
              {
                textLeft: 'Total Amount in USDC',
                textRight: `≈ $${bigNumberFormatter(
                  new BigNumber(balance[selectedCard?.mintA?.symbol]?.price)
                    .multipliedBy(userSourceWithdrawAmount)
                    .plus(
                      new BigNumber(balance[selectedCard?.mintB?.symbol]?.price)
                        .multipliedBy(userTargetWithdrawAmount)
                    ),
                  4
                )}`
              }
            ]}
          />
        </GammaActionModal>
        <DialogBody className={`bg-white dark:bg-black-2 relative w-full py-2 block overflow-y-hidden`}>
          <DepositWithdrawHeader handleClose={handleClose} />
          <div className="flex flex-col overflow-y-scroll h-full pb-[110px]">
            <DepositWithdrawToggle
              setUserSourceDepositAmount={setUserSourceDepositAmount}
              setUserSourceWithdrawAmount={setUserSourceWithdrawAmount}
              setUserTargetDepositAmount={setUserTargetDepositAmount}
              setUserTargetWithdrawAmount={setUserTargetWithdrawAmount}
            />
            <DepositWithdrawAccordion />
            <DepositWithdrawLabel text={'1. Enter Amounts'} />
            <TokenRow isMintA={true} token={selectedCard?.mintA} balance={userSourceTokenBal} />
            <DepositWithdrawInput
              isDeposit={isDeposit}
              onChange={(e) => handleInputChange(e.target.value, true)}
              depositAmount={userSourceDepositAmount}
              withdrawAmount={userSourceWithdrawAmount}
              handleHalf={() => handleHalf(true)}
              handleMax={() => handleMax(true)}
              disabled={isDeposit && userSourceTokenBal <= 0}
            />
            <TokenRow isMintA={false} token={selectedCard?.mintB} balance={userTargetTokenBal} />
            <DepositWithdrawInput
              isDeposit={isDeposit}
              onChange={(e) => handleInputChange(e.target.value, false)}
              depositAmount={userTargetDepositAmount}
              withdrawAmount={userTargetWithdrawAmount}
              handleHalf={() => handleHalf(false)}
              handleMax={() => handleMax(false)}
              disabled={isDeposit && userTargetTokenBal <= 0}
            />
            <ReviewConfirm
              tokenAActionValue={isDeposit ? userSourceDepositAmount : userSourceWithdrawAmount}
              tokenBActionValue={isDeposit ? userTargetDepositAmount : userTargetWithdrawAmount} />
            {isDeposit && userPublicKey && (userSourceTokenBal === 0 || userTargetTokenBal === 0) && <SwapNow />}
          </div>
        </DialogBody>
        <DialogFooter>
          <StickyFooter
            disableActionButton={isActionButtonDisabled}
            isLoading={sendingTransaction}
            onActionClick={isDeposit ? handleDeposit : handleProcessStart('withdraw')}
            isDeposit={isDeposit}
            // canClaim={true || isClaim}
            // claimText={'Claim 0.5 SOL + 12.0 USDC'}
            // onClaimClick={handleProcessStart('claim')}
            actionButtonText={actionButtonText}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
