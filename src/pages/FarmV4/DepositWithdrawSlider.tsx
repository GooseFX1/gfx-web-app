import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogOverlay,
  DialogPortal,
  Skeleton
} from 'gfx-component-lib'
import {
  CreationPoolFlowStateEnum,
  useConnectionConfig,
  useDarkMode,
  useGamma,
  usePriceFeedFarm
} from '@/context'
import DepositWithdrawInput from './DepositWithdrawInput'
import DepositWithdrawToggle from './DepositWithdrawToggle'
import DepositWithdrawAccordion from './DepositWithdrawAccordion'
import DepositWithdrawLabel from './DepositWithdrawLabel'
import { TokenRow } from './TokenRow'
import { ReviewConfirm } from './ReviewConfirm'
import StickyFooter from './StickyFooter'
import { useWallet } from '@solana/wallet-adapter-react'
import { ModeOfOperation } from './constants'
import { DepositWithdrawHeader } from './DepositWithdrawHeader'
import useBreakPoint from '@/hooks/useBreakPoint'
import GammaActionModal from '@/pages/FarmV4/GammaActionModal'
import GammaActionModalContentStack from '@/pages/FarmV4/GammaActionModalContentStack'
import useTransaction from '@/hooks/useTransaction'
import {
  calculateOtherTokenAndLPAmount,
  deposit,
  getMaxSolDepositAmount,
  lpTokensToTradingTokens,
  withdraw
} from '@/web3/Farm'
import BN from 'bn.js'
import BigNumber from 'bignumber.js'
import { withdrawBigStringFarm } from '@/utils/misc'
import { useWalletBalance } from '@/context/walletBalanceContext'
import { bigNumberFormatter } from '@/utils'
import useDebounce from '@/hooks/useDebounce'
import useGetAMMConfigIdQuery from '@/queries/GAMMA/pools/useGetGammaConfigIdQuery'
import useGammaPoolIdQuery from '@/queries/GAMMA/pools/useGammaPoolIdQuery'
import useGammaPoolLiquidityKey from '@/queries/GAMMA/pools/useGammaPoolLiquidityKey'
import useGammaProgramPoolQuery from '@/queries/GAMMA/pools/useGammaProgramPoolQuery'
import useGammaProgramUserLiquidityQuery from '@/queries/GAMMA/pools/useGammaProgramUserLiquidityQuery'
import { useMutation } from '@tanstack/react-query'
import { MUTATION_KEY } from '@/queries/query.helper'
import txnInProgressDark from "@/animations/txn_in_progress_dark.json"
import txnInProgressLite from "@/animations/txn_in_progress_lite.json"

import Lottie from 'lottie-react'

export const DepositWithdrawSlider: FC<{
  preventAutoClose: boolean
  container?: Element
}> = ({ preventAutoClose, container }) => {
  const { wallet } = useWallet()
  const { isMobile } = useBreakPoint()
  const { connection } = useConnectionConfig()
  const {
    selectedCard,
    modeOfOperation,
    setModeOfOperation,
    updateGammaRoute,
    slippage,
    forceCronAndUpdateLocalData,
    openDepositWithdrawSlider,
    createPoolState,
    setCreatePoolState
  } = useGamma()
  const { isDarkMode } = useDarkMode()
  const [userSourceTokenBal, setUserSourceTokenBal] = useState<number>()
  const [userTargetTokenBal, setUserTargetTokenBal] = useState<number>()
  const [userSourceDepositAmount, setUserSourceDepositAmount] = useState<string>('')
  const [userTargetDepositAmount, setUserTargetDepositAmount] = useState<string>('')
  const [userSourceWithdrawAmount, setUserSourceWithdrawAmount] = useState<string>('')
  const [userTargetWithdrawAmount, setUserTargetWithdrawAmount] = useState<string>('')
  const [transactionLPAmount, setTransactionLPAmount] = useState<BN>()
  //const [isButtonLoading, setIsButtonLoading] = useBoolean()
  //const [isClaim, setIsClaim] = useBoolean(false)
  const [actionType, setActionType] = useState<string>('')
  const isDeposit = useMemo(() => modeOfOperation === ModeOfOperation.DEPOSIT, [modeOfOperation])
  const { GammaProgram } = usePriceFeedFarm()
  const { sendTransaction, createTransactionBuilder } = useTransaction()
  const { balance, publicKey } = useWalletBalance()
  const [withdrawableBalanceA, setWithdrawableBalanceA] = useState<BN>(new BN(0))
  const [withdrawableBalanceB, setWithdrawableBalanceB] = useState<BN>(new BN(0))
  const [isUserTyping, setIsUserTyping] = useState<boolean>(false)
  const [isSolMaxDeposit, setIsSolMaxDeposit] = useState<boolean>(false)
  const [userSourceTokenType, setUserSourceTokenType] = useState<'spl-token' | 'native' | 'spl-token-2022' | ''>(
    ''
  )
  const [userTargetTokenType, setUserTargetTokenType] = useState<'spl-token' | 'native' | 'spl-token-2022' | ''>(
    ''
  )
  const { debounce, abortDebounce } = useDebounce()
  const ammConfigQuery = useGetAMMConfigIdQuery(0)
  const poolIdQuery = useGammaPoolIdQuery({
    configId: ammConfigQuery.data,
    mintA: selectedCard?.mintA?.address,
    mintB: selectedCard?.mintB?.address
  })
  const liqKeyQuery = useGammaPoolLiquidityKey({
    poolId: poolIdQuery.data,
    userPublicKey: publicKey
  })
  const { data: gammaOnChainPool, refetch: refetechUpdatedPoolState } = useGammaProgramPoolQuery({
    poolId: poolIdQuery.data
  })
  const { data: selectedCardLiquidityAcc, refetch: refetchSelectedCardLiquidityAcc } =
    useGammaProgramUserLiquidityQuery({
      liqKey: liqKeyQuery.data
    })
  const depositMutation = useMutation({
    mutationKey: [MUTATION_KEY, 'gamma-deposit', selectedCard?.mintA?.address, selectedCard?.mintB?.address],
    mutationFn: async () => {
      const txBuilder = createTransactionBuilder()
      const tx = await deposit(
        userSourceDepositAmount,
        userTargetDepositAmount,
        transactionLPAmount,
        slippage,
        selectedCard,
        publicKey,
        GammaProgram,
        connection,
        userSourceTokenType,
        userTargetTokenType,
        poolIdQuery.data,
        liqKeyQuery.data,
        isSolMaxDeposit
      )
      txBuilder.add(tx)
      const poolMessage = `(${selectedCard?.mintA?.symbol}-${selectedCard?.mintB?.symbol}) pool.`
      // eslint-disable-next-line max-len
      const sourceAmount = `${bigNumberFormatter(
        new BigNumber(isDeposit ? userSourceDepositAmount : userSourceWithdrawAmount)
      )} ${selectedCard?.mintA?.symbol}`
      // eslint-disable-next-line max-len
      const targetAmount = `${bigNumberFormatter(
        new BigNumber(isDeposit ? userTargetDepositAmount : userTargetWithdrawAmount)
      )} ${selectedCard?.mintB?.symbol}`
      const type = isDeposit ? 'deposited' : 'withdrew'
      const direction = isDeposit ? 'into' : 'from'
      const { success, txSig } = await sendTransaction(txBuilder, {
        successMessage: `You successfully ${type} ${sourceAmount}, ${targetAmount} ${direction} ${poolMessage}`
      })
      //console.log('success', success)
      console.log('DepositResponse', success)
      return txSig
    },
    onSuccess: (data) => {
      refetechUpdatedPoolState()
      refetchSelectedCardLiquidityAcc()
      setUserSourceDepositAmount('')
      setUserTargetDepositAmount('')
      forceCronAndUpdateLocalData(data)
    }
  })
  const withdrawMutation = useMutation({
    mutationKey: [MUTATION_KEY, 'gamma-withdraw', selectedCard?.mintA?.address, selectedCard?.mintB?.address],
    mutationFn: async () => {
      const txBuilder = createTransactionBuilder()
      const tx = await withdraw(
        userSourceWithdrawAmount,
        userTargetWithdrawAmount,
        transactionLPAmount,
        slippage,
        selectedCard,
        publicKey,
        GammaProgram,
        connection,
        userSourceTokenType,
        userTargetTokenType,
        wallet,
        poolIdQuery.data,
        liqKeyQuery.data
      )
      txBuilder.add(tx)
      const { txSig } = await sendTransaction(txBuilder, undefined, undefined, undefined, true)
      return txSig
    },
    onSuccess: (data) => {
      setUserSourceWithdrawAmount('')
      setUserTargetWithdrawAmount('')
      setActionType('')
      refetechUpdatedPoolState()
      refetchSelectedCardLiquidityAcc()
      forceCronAndUpdateLocalData(data)
    }
  })
  useEffect(() => {
    try {
      if (!!selectedCardLiquidityAcc && !!gammaOnChainPool) {
        const { tokenAmount0, tokenAmount1 } = lpTokensToTradingTokens(
          selectedCardLiquidityAcc?.lpTokensOwned,
          gammaOnChainPool.account
        )
        //console.log("tokenAmount", tokenAmount0?.toNumber(), tokenAmount1?.toNumber())
        setWithdrawableBalanceA(tokenAmount0)
        setWithdrawableBalanceB(tokenAmount1)
      } else {
        setWithdrawableBalanceA(new BN(0))
        setWithdrawableBalanceB(new BN(0))
      }
    } catch (e) {
      console.log('Error while setting token amounts for withdrawing', e)
    }
  }, [selectedCardLiquidityAcc, gammaOnChainPool])

  useEffect(() => {
    console.log('close slider')
    return () => {
      handleClose()
    }
  }, [])

  useEffect(() => {
    if (selectedCard && publicKey) {
      setUserSourceTokenBal(balance[selectedCard?.mintA?.address].tokenAmount.uiAmount)
      setUserTargetTokenBal(balance[selectedCard?.mintB?.address].tokenAmount.uiAmount)
    }
  }, [selectedCard, balance, publicKey])

  useEffect(() => {
    if (selectedCard && publicKey) {
      setUserSourceTokenType(balance[selectedCard?.mintA?.address].tokenType)
      setUserTargetTokenType(balance[selectedCard?.mintB?.address].tokenType)
    }
  }, [selectedCard, balance, publicKey])

  const handleClose = () => {
    setUserSourceDepositAmount('')
    setUserSourceWithdrawAmount('')
    setUserTargetDepositAmount('')
    setUserTargetWithdrawAmount('')
    setModeOfOperation(ModeOfOperation?.DEPOSIT)
    setCreatePoolState(CreationPoolFlowStateEnum.NONE)
  }

  const handleInputChange = async (input: string, sourceToken: boolean) => {
    abortDebounce()
    setIsUserTyping(true)
    setIsSolMaxDeposit(false)
    if (input === '') {
      if (isDeposit) {
        setUserSourceDepositAmount('')
        setUserTargetDepositAmount('')
      } else {
        setUserSourceWithdrawAmount('')
        setUserTargetWithdrawAmount('')
      }
      setIsUserTyping(false)
      return
    }
    if (isNaN(+input)) {
      setIsUserTyping(false)
      return
    }
    let funcToCallInDebounce
    const debouncedFunc = async () => {
      if (gammaOnChainPool) {
        const { lpTokenAmount, otherTokenAmountInString } = calculateOtherTokenAndLPAmount(
          input,
          sourceToken ? 0 : 1,
          gammaOnChainPool.account
        )
        setTransactionLPAmount(lpTokenAmount)
        funcToCallInDebounce(otherTokenAmountInString)
      }
    }

    switch (true) {
      case isDeposit && sourceToken: // deposit source
        setUserSourceDepositAmount(input)
        funcToCallInDebounce = setUserTargetDepositAmount
        console.log('deposit source')
        break
      case isDeposit && !sourceToken: // deposit target
        setUserTargetDepositAmount(input)
        funcToCallInDebounce = setUserSourceDepositAmount
        console.log('deposit target')
        break
      case !isDeposit && sourceToken: // withdraw source
        setUserSourceWithdrawAmount(input)
        funcToCallInDebounce = setUserTargetWithdrawAmount
        console.log('withdraw source')
        break
      case !isDeposit && !sourceToken: // withdraw target
        setUserTargetWithdrawAmount(input)
        funcToCallInDebounce = setUserSourceWithdrawAmount
        console.log('withdraw target')
        break
      default:
        break
    }

    debounce(debouncedFunc, 333)

    setIsUserTyping(false)
  }

  const actionButtonText = useMemo(() => {
    if (isDeposit && !userSourceTokenBal && !userTargetTokenBal) return `Insufficient Tokens`
    else if (isDeposit && !userSourceTokenBal) return `Insufficient ${selectedCard?.mintA?.symbol}`
    else if (isDeposit && !userTargetTokenBal) return `Insufficient ${selectedCard?.mintB?.symbol}`
    else if (
      isDeposit &&
      (+userSourceDepositAmount > userSourceTokenBal || +userTargetDepositAmount > userTargetTokenBal)
    )
      return `Insufficient funds!`
    else if (
      isDeposit &&
      (!userSourceDepositAmount ||
        new BigNumber(userSourceDepositAmount)?.isZero() ||
        !userTargetDepositAmount ||
        new BigNumber(userTargetDepositAmount)?.isZero())
    )
      return `Enter Amounts`
    else if (
      !isDeposit &&
      (!userSourceWithdrawAmount ||
        new BigNumber(userSourceWithdrawAmount)?.isZero() ||
        !userTargetWithdrawAmount ||
        new BigNumber(userTargetWithdrawAmount)?.isZero())
    )
      return `Enter Amounts`
    else if (
      !isDeposit &&
      (new BigNumber(userSourceWithdrawAmount)?.isGreaterThan(
        new BigNumber(
          withdrawBigStringFarm(withdrawableBalanceA?.toString(), gammaOnChainPool?.account?.mint0Decimals)
        )
      ) ||
        new BigNumber(userTargetWithdrawAmount)?.isGreaterThan(
          new BigNumber(
            withdrawBigStringFarm(withdrawableBalanceB?.toString(), gammaOnChainPool?.account?.mint1Decimals)
          )
        ))
    )
      return `Insufficient funds!`
    else if (isDeposit) return `Deposit`
    else return `Withdraw`
  }, [
    selectedCard,
    userSourceTokenBal,
    userTargetTokenBal,
    userTargetWithdrawAmount,
    userSourceDepositAmount,
    userTargetDepositAmount,
    isDeposit,
    userSourceWithdrawAmount,
    selectedCardLiquidityAcc
  ])

  const isActionButtonDisabled = useMemo(() => {
    if (isDeposit && (!userSourceTokenBal || !userTargetTokenBal)) return true
    else if (
      isDeposit &&
      (!userSourceDepositAmount ||
        new BigNumber(userSourceDepositAmount)?.isZero() ||
        !userTargetDepositAmount ||
        new BigNumber(userTargetDepositAmount)?.isZero())
    )
      return true
    else if (
      !isDeposit &&
      (!userSourceWithdrawAmount ||
        new BigNumber(userSourceWithdrawAmount)?.isZero() ||
        !userTargetWithdrawAmount ||
        new BigNumber(userTargetWithdrawAmount)?.isZero())
    )
      return true
    else if (
      isDeposit &&
      (+userSourceDepositAmount > userSourceTokenBal || +userTargetDepositAmount > userTargetTokenBal)
    )
      return true
    else if (
      !isDeposit &&
      (new BigNumber(userSourceWithdrawAmount)?.isGreaterThan(
        new BigNumber(
          withdrawBigStringFarm(withdrawableBalanceA?.toString(), gammaOnChainPool?.account?.mint0Decimals)
        )
      ) ||
        new BigNumber(userTargetWithdrawAmount)?.isGreaterThan(
          new BigNumber(
            withdrawBigStringFarm(withdrawableBalanceB?.toString(), gammaOnChainPool?.account?.mint1Decimals)
          )
        ))
    )
      return true
  }, [
    userSourceTokenBal,
    userTargetTokenBal,
    userTargetWithdrawAmount,
    userSourceDepositAmount,
    userTargetDepositAmount,
    isDeposit,
    userSourceWithdrawAmount,
    selectedCardLiquidityAcc,
    withdrawableBalanceA,
    withdrawableBalanceB,
    gammaOnChainPool
  ])

  const handleHalf = useCallback(
    async (sourceToken: boolean) => {
      setIsUserTyping(true)
      setIsSolMaxDeposit(false)
      if (isDeposit) {
        if (sourceToken) {
          setUserSourceDepositAmount(userSourceTokenBal ? (userSourceTokenBal / 2)?.toString() : '')
          if (gammaOnChainPool) {
            const { lpTokenAmount, otherTokenAmountInString } = calculateOtherTokenAndLPAmount(
              (userSourceTokenBal / 2)?.toString(),
              0,
              gammaOnChainPool.account
            )
            setTransactionLPAmount(lpTokenAmount)
            setUserTargetDepositAmount(otherTokenAmountInString)
          }
        } else {
          setUserTargetDepositAmount(userTargetTokenBal ? (userTargetTokenBal / 2)?.toString() : '')
          if (gammaOnChainPool) {
            const { lpTokenAmount, otherTokenAmountInString } = calculateOtherTokenAndLPAmount(
              (userTargetTokenBal / 2)?.toString(),
              1,
              gammaOnChainPool.account
            )
            setTransactionLPAmount(lpTokenAmount)
            setUserSourceDepositAmount(otherTokenAmountInString)
          }
        }
      } else {
        setTransactionLPAmount(selectedCardLiquidityAcc?.lpTokensOwned?.div(new BN(2)))
        setUserSourceWithdrawAmount(
          withdrawBigStringFarm(
            withdrawableBalanceA?.div(new BN(2))?.toString(),
            gammaOnChainPool?.account?.mint0Decimals
          )
        )
        setUserTargetWithdrawAmount(
          withdrawBigStringFarm(
            withdrawableBalanceB?.div(new BN(2))?.toString(),
            gammaOnChainPool?.account?.mint1Decimals
          )
        )
      }
      setIsUserTyping(false)
    },
    [
      modeOfOperation,
      userSourceTokenBal,
      userTargetTokenBal,
      gammaOnChainPool,
      selectedCardLiquidityAcc,
      withdrawableBalanceA,
      withdrawableBalanceB
    ]
  )

  const handleMax = useCallback(
    async (sourceToken: boolean) => {
      setIsUserTyping(true)
      if (isDeposit) {
        if (sourceToken) {
          selectedCard?.mintA?.symbol === 'SOL' ? setIsSolMaxDeposit(true) : setIsSolMaxDeposit(false)
          setUserSourceDepositAmount(userSourceTokenBal ? userSourceTokenBal?.toString() : '')
          if (gammaOnChainPool) {
            const { lpTokenAmount, otherTokenAmountInString } = calculateOtherTokenAndLPAmount(
              selectedCard?.mintA?.symbol === 'SOL'
                ? await getMaxSolDepositAmount(userSourceTokenBal, connection)
                : userSourceTokenBal?.toString(),
              0,
              gammaOnChainPool.account
            )
            setTransactionLPAmount(lpTokenAmount)
            setUserTargetDepositAmount(otherTokenAmountInString)
          }
        } else {
          selectedCard?.mintB?.symbol === 'SOL' ? setIsSolMaxDeposit(true) : setIsSolMaxDeposit(false)
          setUserTargetDepositAmount(userTargetTokenBal ? userTargetTokenBal?.toString() : '')
          if (gammaOnChainPool) {
            const { lpTokenAmount, otherTokenAmountInString } = calculateOtherTokenAndLPAmount(
              selectedCard?.mintB?.symbol === 'SOL'
                ? await getMaxSolDepositAmount(userTargetTokenBal, connection)
                : userTargetTokenBal?.toString(),
              1,
              gammaOnChainPool.account
            )
            setTransactionLPAmount(lpTokenAmount)
            setUserSourceDepositAmount(otherTokenAmountInString)
          }
        }
      } else {
        setTransactionLPAmount(selectedCardLiquidityAcc?.lpTokensOwned)
        setUserSourceWithdrawAmount(
          withdrawBigStringFarm(withdrawableBalanceA.toString(), gammaOnChainPool?.account?.mint0Decimals)
        )
        setUserTargetWithdrawAmount(
          withdrawBigStringFarm(withdrawableBalanceB.toString(), gammaOnChainPool?.account?.mint1Decimals)
        )
      }
      setIsUserTyping(false)
    },
    [
      modeOfOperation,
      userSourceTokenBal,
      userTargetTokenBal,
      gammaOnChainPool,
      selectedCardLiquidityAcc,
      withdrawableBalanceA,
      withdrawableBalanceB
    ]
  )

  //eslint-disable-next-line
  const handleProcessStart = (type: 'claim' | 'withdraw') => {
    return () => {
      // if (type === 'claim') {
      //   setIsClaim.on()
      // }
      //console.log('performing', type)
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
  const loadingStateText = useMemo(() => {
    switch (createPoolState) {
      case CreationPoolFlowStateEnum.ON_CHAIN:
        return {
          title: 'Creating pool on chain...',
          message: 'Please wait while the blockchain processes your transaction.'
        }
      case CreationPoolFlowStateEnum.GAMMA_API_UPDATING:
        return {
          title: 'Pool is being synced...',
          message: 'Please wait briefly until the pool is fully loaded.'
        }
      case CreationPoolFlowStateEnum.QUERY_FETCHING:
        return {
          title: 'Loading pool data...',
          message: 'Please wait briefly until the pool is fully loaded.'
        }
      case CreationPoolFlowStateEnum.NONE:
      default:
        return {
          title: '',
          message: ''
        }
    }
  }, [createPoolState])

  return (
    <Dialog
      open={openDepositWithdrawSlider}
      onOpenChange={(v) => {
        if (!v) {
          updateGammaRoute()
        }
      }}
      modal={!preventAutoClose}
    >
      <DialogPortal container={container}>
        <DialogOverlay/>
        {/*This one for not closing on click outside*/}
        {/*<div*/}
        {/*  className={cn(`fixed top-0 left-0 w-screen h-screen z-10 bg-black-4 dark:bg-black-4 bg-opacity-50*/}
        {/*dark:bg-opacity-50 backdrop-blur-sm*/}
        {/*`)}*/}
        {/*/>*/}
        <DialogContent
          className={`sm:w-[450px] sm:max-h-screen border-1 border-solid sm:border-r-0 dark:border-black-4
      sm:rounded-none border-b-0 rounded-b-[0px] max-h-[calc(100vh-56px)] gap-0
      `}
          fullScreen={true}
          placement={isMobile ? 'bottom' : 'right'}
          // onInteractOutside={(e) => e.preventDefault()}
          aria-describedby={null}
          autoFocus={false}
          onCloseAutoFocus={() => {
            handleClose()
          }}
          onInteractOutside={(e) => {
            if (preventAutoClose) {
              e.preventDefault()
            }
          }}
        >
          {createPoolState == CreationPoolFlowStateEnum.NONE ? (
            <>
              <GammaActionModal
                isOpen={actionType != '' && actionType != 'deposit'}
                setIsOpen={(b) => {
                  if (!b) {
                    handleActionCancel()
                  }
                }}
                title={actionModalTitle}
                actionLabel={actionLabel}
                onActionClick={!isDeposit ? withdrawMutation.mutate : depositMutation.mutate}
                actionType={actionType}
                loading={depositMutation.isLoading || withdrawMutation.isLoading}
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
                        new BigNumber(balance[selectedCard?.mintA?.address]?.price)
                          .multipliedBy(userSourceWithdrawAmount)
                          .plus(
                            new BigNumber(balance[selectedCard?.mintB?.address]?.price).multipliedBy(
                              userTargetWithdrawAmount
                            )
                          ),
                        4
                      )}`
                    }
                  ]}
                />
              </GammaActionModal>
              <DialogBody className={`bg-white dark:bg-black-2 relative w-full py-2 block overflow-y-hidden`}>
                <DepositWithdrawHeader />
                <div className="flex flex-col overflow-y-scroll h-full pb-[110px]">
                  <DepositWithdrawToggle
                    setUserSourceDepositAmount={setUserSourceDepositAmount}
                    setUserSourceWithdrawAmount={setUserSourceWithdrawAmount}
                    setUserTargetDepositAmount={setUserTargetDepositAmount}
                    setUserTargetWithdrawAmount={setUserTargetWithdrawAmount}
                  />
                  <DepositWithdrawAccordion
                    withdrawableBalanceA={withdrawableBalanceA}
                    withdrawableBalanceB={withdrawableBalanceB}
                  />
                  <DepositWithdrawLabel text={'1. Enter Amounts'} />
                  <TokenRow
                    isMintA={true}
                    token={selectedCard?.mintA}
                    balance={userSourceTokenBal}
                    isDeposit={isDeposit}
                  />
                  <DepositWithdrawInput
                    isDeposit={isDeposit}
                    onChange={(e) => handleInputChange(e.target.value, true)}
                    depositAmount={userSourceDepositAmount}
                    withdrawAmount={userSourceWithdrawAmount}
                    handleHalf={() => handleHalf(true)}
                    handleMax={() => handleMax(true)}
                    disabled={
                      publicKey == null ||
                      (isDeposit ? userSourceTokenBal <= 0 : withdrawableBalanceA?.lte(new BN(0)))
                    }
                  />
                  <TokenRow
                    isMintA={false}
                    token={selectedCard?.mintB}
                    balance={userTargetTokenBal}
                    isDeposit={isDeposit}
                  />
                  <DepositWithdrawInput
                    isDeposit={isDeposit}
                    onChange={(e) => handleInputChange(e.target.value, false)}
                    depositAmount={userTargetDepositAmount}
                    withdrawAmount={userTargetWithdrawAmount}
                    handleHalf={() => handleHalf(false)}
                    handleMax={() => handleMax(false)}
                    disabled={
                      publicKey == null ||
                      (isDeposit ? userTargetTokenBal <= 0 : withdrawableBalanceB?.lte(new BN(0)))
                    }
                  />
                  <ReviewConfirm
                    tokenAActionValue={isDeposit ? userSourceDepositAmount : userSourceWithdrawAmount}
                    tokenBActionValue={isDeposit ? userTargetDepositAmount : userTargetWithdrawAmount}
                    isDeposit={isDeposit}
                  />
                </div>
              </DialogBody>
              <DialogFooter>
                <StickyFooter
                  disableActionButton={isActionButtonDisabled}
                  isLoading={depositMutation.isLoading || withdrawMutation.isLoading || isUserTyping}
                  onActionClick={isDeposit ? depositMutation.mutate : handleProcessStart('withdraw')}
                  isDeposit={isDeposit}
                  // canClaim={true || isClaim}
                  // claimText={'Claim 0.5 SOL + 12.0 USDC'}
                  // onClaimClick={handleProcessStart('claim')}
                  actionButtonText={actionButtonText}
                />
              </DialogFooter>
            </>
          ) : (
            <DialogBody className={'p-0'}>
              <Skeleton className={`w-full h-full flex flex-col items-center justify-center p-2.5 gap-3
            from-[#F2E6FE] to-[#F2E6FE]
            dark:from-background-darkmode-secondary dark:to-background-darkmode-secondary
            dark:via-[#232323] via-white
            `}>
                <Lottie
                  animationData={isDarkMode ? txnInProgressDark : txnInProgressLite}
                  loop={true}
                  className={'w-[102px] h-[93px]'}
                />
                <h3
                  className={`text-h3 font-semibold text-text-lightmode-primary dark:text-text-darkmode-primary 
            text-center`}
                >
                  {loadingStateText.title}
                </h3>
                <p
                  className={`text-b2 font-semibold text-text-lightmode-secondary dark:text-text-darkmode-secondary 
            text-center`}
                >
                  {loadingStateText.message}
                </p>
              </Skeleton>
            </DialogBody>
          )}
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
