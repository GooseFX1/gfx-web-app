import { FC, useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { cn, Dialog, DialogBody, DialogContent, DialogFooter } from 'gfx-component-lib'
import { useAccounts, useConnectionConfig, useGamma, usePriceFeedFarm } from '@/context'
import DepositWithdrawInput from './DepositWithdrawInput'
import DepositWithdrawToggle from './DepositWithdrawToggle'
import DepositWithdrawAccordion from './DepositWithdrawAccordion'
import DepositWithdrawLabel from './DepositWithdrawLabel'
import SwapNow from './SwapNow'
import { TokenRow } from './TokenRow'
import { ReviewConfirm } from './ReviewConfirm'
import StickyFooter from './StickyFooter'
import { useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { ModeOfOperation } from './constants'
import { DepositWithdrawHeader } from './DepositWithdrawHeader'
import useBreakPoint from '@/hooks/useBreakPoint'
import useBoolean from '@/hooks/useBoolean'
import GammaActionModal from '@/pages/FarmV4/GammaActionModal'
import GammaActionModalContentStack from '@/pages/FarmV4/GammaActionModalContentStack'
import useTransaction from '@/hooks/useTransaction'
import { deposit, withdraw, calculateOtherTokenAndLPAmount } from '@/web3/Farm'

export const DepositWithdrawSlider: FC = () => {
  const { wallet } = useWallet()
  const { isMobile } = useBreakPoint()
  const { getUIAmount } = useAccounts()
  const { connection } = useConnectionConfig()
  const { selectedCard, openDepositWithdrawSlider, setOpenDepositWithdrawSlider, selectedCardPool } = useGamma()
  const userPublicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter, wallet?.adapter?.publicKey])
  const [userSolBalance, setUserSOLBalance] = useState<number>(0)
  const [modeOfOperation, setModeOfOperation] = useState<string>(ModeOfOperation.DEPOSIT)
  const [userSourceTokenBal, setUserSourceTokenBal] = useState<number>()
  const [userTargetTokenBal, setUserTargetTokenBal] = useState<number>()
  const [userSourceDepositAmount, setUserSourceDepositAmount] = useState<string>('')
  const [userTargetDepositAmount, setUserTargetDepositAmount] = useState<string>('')
  const [userSourceWithdrawAmount, setUserSourceWithdrawAmount] = useState<string>('')
  const [userTargetWithdrawAmount, setUserTargetWithdrawAmount] = useState<string>('')
  //eslint-disable-next-line
  const [isButtonLoading, setIsButtonLoading] = useBoolean()
  const [actionType, setActionType] = useState<string>('')
  const [isClaim, setIsClaim] = useBoolean(false)
  const isDeposit = modeOfOperation === ModeOfOperation.DEPOSIT
  const { GammaProgram } = usePriceFeedFarm()
  const { sendTransaction, createTransactionBuilder } = useTransaction()

  useEffect(() => {
    ; (async () => {
      if (userPublicKey) {
        const solAmount = await connection.getBalance(userPublicKey)
        setUserSOLBalance(solAmount / LAMPORTS_PER_SOL)
      }
    })()
  }, [userPublicKey])

  useEffect(() => {
    if (userPublicKey) {
      if (selectedCard?.sourceToken === 'SOL') setUserSourceTokenBal(userSolBalance)
      else setUserSourceTokenBal(getUIAmount(selectedCard?.sourceTokenMintAddress))
      if (selectedCard?.targetToken === 'SOL') setUserTargetTokenBal(userSolBalance)
      else setUserTargetTokenBal(getUIAmount(selectedCard?.targetTokenMintAddress))
    }
  }, [selectedCard, userPublicKey, userSolBalance, getUIAmount])

  const handleInputChange = useCallback(
    (input: string, sourceToken: boolean) => {
      // handle if the user sends '' or undefined in input box
      if (input === '') {
        if (isDeposit) {
          if (sourceToken) setUserSourceDepositAmount('')
          else setUserTargetDepositAmount('')
        } else {
          if (sourceToken) setUserSourceWithdrawAmount('')
          else setUserTargetWithdrawAmount('')
        }
        return
      }
      const inputValue = +input
      if (!isNaN(inputValue)) {
        if (isDeposit) {
          if (sourceToken) setUserSourceDepositAmount(input)
          else setUserTargetDepositAmount(input)
        } else {
          if (sourceToken) setUserSourceWithdrawAmount(input)
          else setUserTargetWithdrawAmount(input)
        }
      }
    },
    [modeOfOperation]
  )

  useEffect(() => {
    ; (async () => {
      if (userSourceDepositAmount && Object.keys(selectedCardPool)?.length) {
        const { lpTokenAmount, otherTokenAmount } = await calculateOtherTokenAndLPAmount(
          userSourceDepositAmount,
          0,
          selectedCardPool,
          connection
        )
        console.log("amount 3", lpTokenAmount?.toNumber(), otherTokenAmount?.toNumber())
      }
    })()
  }, [userSourceDepositAmount, selectedCardPool])


  //TODO::need to handle the half case for withdraw once we get the onChain data
  const handleHalf = useCallback(
    (sourceToken: boolean) => {
      if (isDeposit) {
        if (sourceToken) {
          setUserSourceDepositAmount(
            userSourceTokenBal ? (userSourceTokenBal / 2)?.toString() : ''
          )
        } else {
          setUserTargetDepositAmount(
            userTargetTokenBal ? (userTargetTokenBal / 2)?.toString() : ''
          )
        }
      }
    },
    [modeOfOperation, userSourceTokenBal, userTargetTokenBal]
  )

  //TODO::need to handle the max case for withdraw once we get the onChain data
  const handleMax = useCallback(
    (sourceToken: boolean) => {
      if (isDeposit) {
        if (sourceToken) {
          setUserSourceDepositAmount(userSourceTokenBal ? userSourceTokenBal?.toString() : '')
        } else {
          setUserTargetDepositAmount(userTargetTokenBal ? userTargetTokenBal?.toString() : '')
        }
      }
    },
    [modeOfOperation, userSourceTokenBal, userTargetTokenBal]
  )

  const handleDeposit = async () => {
    const txBuilder = createTransactionBuilder()
    const tx = await deposit(userSourceDepositAmount,
      userTargetDepositAmount,
      selectedCard,
      userPublicKey,
      GammaProgram,
      connection
    )
    txBuilder.add(tx)
    const { success } = await sendTransaction(txBuilder)
    console.log('success', success)

    if (!success) {
      console.log('failure')
      return
    }
    setActionType('deposit')
  }

  const handleWithdraw = async () => {
    const txBuilder = createTransactionBuilder()
    const tx = await withdraw(
      userSourceWithdrawAmount,
      userTargetWithdrawAmount,
      selectedCard,
      userPublicKey,
      GammaProgram
    )
    txBuilder.add(tx)
    const { success } = await sendTransaction(txBuilder)
    console.log('success', success)

    if (!success) {
      console.log('failure')
      return
    }
  }

  const handleClaim = () => {
    console.log('withdraw')
    setIsButtonLoading.on()
    setOpenDepositWithdrawSlider(true)
    setActionType('claim')
  }

  //eslint-disable-next-line
  const handleProcessStart = (type: 'claim' | 'withdraw') => {
    return () => {
      if (type === 'claim') {
        setIsClaim.on()
      }
      console.log('performing', type)
      setOpenDepositWithdrawSlider(true)
      setActionType(type)
    }
  }

  const handleActionCancel = () => {
    setActionType('')
    setIsClaim.off()
    setIsButtonLoading.off()
  }

  const claimableReward = 0

  const { actionLabel, actionModalTitle } = useMemo(() => {
    let actionModalTitle = 'Withdraw'
    let actionLabel = `Withdraw ${userSourceWithdrawAmount} ${selectedCard?.sourceToken} +
     ${userTargetWithdrawAmount} ${selectedCard?.targetToken}`

    if (isClaim) {
      actionModalTitle = 'Claim'
      actionLabel = `Claim ${claimableReward} SOME REWARD HERE`
    }

    return { actionLabel, actionModalTitle }
  }, [isDeposit, isClaim])
  useLayoutEffect(() => {
    if (openDepositWithdrawSlider) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [openDepositWithdrawSlider])
  return (
    <Dialog modal={false} open={openDepositWithdrawSlider} onOpenChange={setOpenDepositWithdrawSlider}>
      <div className={cn(`absolute top-0 left-0 w-screen h-screen z-10 bg-black-4 dark:bg-black-4 bg-opacity-50
      dark:bg-opacity-50 backdrop-blur-sm
      `)}
      />
      <DialogContent className={`sm:w-[393px] sm:max-h-screen border-1 border-solid sm:border-r-0 dark:border-black-4
      sm:rounded-none border-b-0 rounded-b-[0px] max-h-[525px] gap-0
      `}
        fullScreen={true}
        placement={isMobile ? 'bottom' : 'right'}
        onInteractOutside={(e) => e.preventDefault()}

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
          onActionClick={!isDeposit ? handleWithdraw : isClaim ? handleClaim : handleDeposit}
          actionType={actionType}
        >
          <GammaActionModalContentStack options={[
            {
              textLeft: 'SOL Amount',
              textRight: '≈ 0.5 SOL'
            },
            {
              textLeft: 'USDC Amount',
              textRight: '$12.0'
            },
            {
              textLeft: 'Claim Reward',
              textRight: '2500 GOFX'
            },
            {
              textLeft: 'Total USDC',
              textRight: '≈ $90.00'
            }
          ]} />
        </GammaActionModal>
        <DialogBody className={`bg-white dark:bg-black-2 relative w-full py-2 block overflow-y-hidden`}>
          <DepositWithdrawHeader
            setUserSourceDepositAmount={setUserSourceDepositAmount}
            setUserSourceWithdrawAmount={setUserSourceWithdrawAmount}
            setUserTargetDepositAmount={setUserTargetDepositAmount}
            setUserTargetWithdrawAmount={setUserTargetWithdrawAmount}
          />
          <div className="flex flex-col overflow-y-scroll h-full pb-[110px]">
            <DepositWithdrawToggle modeOfOperation={modeOfOperation} setModeOfOperation={setModeOfOperation} />
            <DepositWithdrawAccordion />
            <DepositWithdrawLabel text={`1. Add ${isDeposit ? 'Deposit' : 'Withdraw'}`} />
            <TokenRow token={selectedCard?.sourceToken} balance={userSourceTokenBal} />
            <DepositWithdrawInput
              isDeposit={isDeposit}
              onChange={(e) => handleInputChange(e.target.value, true)}
              depositAmount={userSourceDepositAmount}
              withdrawAmount={userSourceWithdrawAmount}
              handleHalf={() => handleHalf(true)}
              handleMax={() => handleMax(true)}
              userSourceTokenBal={userSourceTokenBal}
              sourceToken={true}
            />
            <TokenRow token={selectedCard?.targetToken} balance={userTargetTokenBal} />
            <DepositWithdrawInput
              isDeposit={isDeposit}
              onChange={(e) => handleInputChange(e.target.value, false)}
              depositAmount={userTargetDepositAmount}
              withdrawAmount={userTargetWithdrawAmount}
              handleHalf={() => handleHalf(false)}
              handleMax={() => handleMax(false)}
              userTargetTokenBal={userTargetTokenBal}
            />
            <ReviewConfirm />
            {userPublicKey && (userSourceTokenBal === 0 || userTargetTokenBal === 0) && (
              <SwapNow />
            )}
          </div>
        </DialogBody>
        <DialogFooter>
          <StickyFooter
            disableActionButton={false}
            isLoading={false}
            onActionClick={isDeposit ? handleDeposit : handleProcessStart('withdraw')}
            isDeposit={isDeposit}
            canClaim={true || isClaim}
            claimText={'Claim 0.5 SOL + 12.0 USDC'}
            onClaimClick={handleProcessStart('claim')}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
