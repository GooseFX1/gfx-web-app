/* eslint-disable */
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { Dialog, DialogBody, DialogContent, DialogFooter } from 'gfx-component-lib'
import { useAccounts, useConnectionConfig, useFarmContext } from '@/context'
import DepositWithdrawInput from './DepositWithdrawInput'
import DepositWithdrawToggle from './DepositWithdrawToggle'
import DepositWithdrawAccordion from './DepositWithdrawAccordion'
import DepositWithdrawLabel from './DepositWithdrawLabel'
import SwapNow from './SwapNow'
import { TokenRow } from './TokenRow'
import { ReviewConfirm } from './ReviewConfirm'
import StickyFooter from './StickyFooter'
import { useWallet } from '@solana/wallet-adapter-react'
import BigNumber from 'bignumber.js'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { ModeOfOperation } from './constants'
import { DepositWithdrawHeader } from './DepositWithdrawHeader'
import useBreakPoint from '@/hooks/useBreakPoint'
import useBoolean from '@/hooks/useBoolean'
import GammaActionModal from '@/pages/FarmV4/GammaActionModal'
import GammaActionModalContentStack from '@/pages/FarmV4/GammaActionModalContentStack'

export const DepositWithdrawSlider: FC = () => {
  const { wallet } = useWallet()
  const { isMobile } = useBreakPoint()
  const { getUIAmount } = useAccounts()
  const { connection } = useConnectionConfig()
  const { selectedCard } = useFarmContext()
  const userPublicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter, wallet?.adapter?.publicKey])
  const [userSolBalance, setUserSOLBalance] = useState<number>(0)
  const [modeOfOperation, setModeOfOperation] = useState<string>(ModeOfOperation.DEPOSIT)
  const [userSourceTokenBal, setUserSourceTokenBal] = useState<BigNumber>(new BigNumber(0))
  const [userTargetTokenBal, setUserTargetTokenBal] = useState<BigNumber>(new BigNumber(0))
  const [userSourceDepositAmount, setUserSourceDepositAmount] = useState<BigNumber>(new BigNumber(0))
  const [userTargetDepositAmount, setUserTargetDepositAmount] = useState<BigNumber>(new BigNumber(0))
  const [userSourceWithdrawAmount, setUserSourceWithdrawAmount] = useState<BigNumber>(new BigNumber(0))
  const [userTargetWithdrawAmount, setUserTargetWithdrawAmount] = useState<BigNumber>(new BigNumber(0))
  const [isButtonLoading, setIsButtonLoading] = useBoolean()
  const [actionType, setActionType] = useState<string>('')
  const [isClaim, setIsClaim] = useBoolean(false)
  const isDeposit = modeOfOperation === ModeOfOperation.DEPOSIT

  const {
    operationPending,
    setOperationPending
  } = useFarmContext()
  useEffect(() => {
    ;(async () => {
      if (userPublicKey) {
        const solAmount = await connection.getBalance(userPublicKey)
        setUserSOLBalance(solAmount / LAMPORTS_PER_SOL)
      }
    })()
  }, [userPublicKey])

  useEffect(() => {
    if (userPublicKey) {
      if (selectedCard?.sourceToken === 'SOL') setUserSourceTokenBal(new BigNumber(userSolBalance))
      else setUserSourceTokenBal(new BigNumber(getUIAmount(selectedCard?.sourceTokenMintAddress)))
      if (selectedCard?.targetToken === 'SOL') setUserTargetTokenBal(new BigNumber(userSolBalance))
      else setUserTargetTokenBal(new BigNumber(getUIAmount(selectedCard?.targetTokenMintAddress)))
    }
  }, [selectedCard, userPublicKey, userSolBalance, getUIAmount])

  const handleInputChange = useCallback(
    (input: string, sourceToken: boolean) => {
      // handle if the user sends '' or undefined in input box
      if (input === '') {
        if (isDeposit) {
          if (sourceToken) setUserSourceDepositAmount(null)
          else setUserTargetDepositAmount(null)
        } else {
          if (sourceToken) setUserSourceWithdrawAmount(null)
          else setUserTargetWithdrawAmount(null)
        }
        return
      }
      const inputValue = +input
      if (!isNaN(inputValue)) {
        if (isDeposit) {
          if (sourceToken) setUserSourceDepositAmount(new BigNumber(input))
          else setUserTargetDepositAmount(new BigNumber(input))
        } else {
          if (sourceToken) setUserSourceWithdrawAmount(new BigNumber(input))
          else setUserTargetWithdrawAmount(new BigNumber(input))
        }
      }
    },
    [modeOfOperation]
  )

  //TODO::need to handle the half case for withdraw once we get the onChain data
  const handleHalf = useCallback(
    (sourceToken: boolean) => {
      if (isDeposit) {
        if (sourceToken) {
          setUserSourceDepositAmount(
            userSourceTokenBal ? new BigNumber(userSourceTokenBal).div(2) : new BigNumber(0)
          )
        } else {
          setUserTargetDepositAmount(
            userTargetTokenBal ? new BigNumber(userTargetTokenBal).div(2) : new BigNumber(0)
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
          setUserSourceDepositAmount(userSourceTokenBal ? new BigNumber(userSourceTokenBal) : new BigNumber(0))
        } else {
          setUserTargetDepositAmount(userTargetTokenBal ? new BigNumber(userTargetTokenBal) : new BigNumber(0))
        }
      }
    },
    [modeOfOperation, userSourceTokenBal, userTargetTokenBal]
  )
  const handleWithdraw = () => {
    console.log('withdraw')


  }
  const handleDeposit = () => {
    console.log('withdraw')
    setActionType('deposit')
    setOperationPending(true)

  }
  const handleClaim = () => {
    console.log('withdraw')
    setIsButtonLoading.on()
    setOperationPending(true)
    setActionType('claim')
  }
  const handleProcessStart = (type: 'claim' | 'withdraw') => {
    return ()=>{
      if (type === 'claim') {
        setIsClaim.on()
      }
      console.log('performing',type)
      setOperationPending(true)
      setActionType(type)
    }
  }

  const handleCancel = () => {
    console.log('cancel')
    setIsButtonLoading.off()
    setOperationPending(false)
    setIsClaim.off()
  }
  const claimableReward = new BigNumber(0)

  const { actionLabel,actionModalTitle } = useMemo(()=>{
    let actionModalTitle = 'Withdraw'
    let actionLabel = `Withdraw ${userSourceWithdrawAmount} ${selectedCard?.sourceToken} +
     ${userTargetWithdrawAmount} ${selectedCard?.targetToken}`

   if(isClaim) {
     actionModalTitle = 'Claim'
      actionLabel = `Claim ${claimableReward} SOME REWARD HERE`
    }

    return {actionLabel,actionModalTitle}
  },[isDeposit,isClaim])
  return (
    <Dialog modal={false} open={operationPending} onOpenChange={setOperationPending}
    >

      <div className={`absolute top-0 left-0 w-screen h-screen z-10 bg-black-4 dark:bg-black-4 bg-opacity-50
      backdrop-blur-sm
      `}
      />

      <DialogContent className={`sm:w-[393px] sm:max-h-screen border-1 border-solid sm:border-r-0 dark:border-black-4
      sm:rounded-none border-b-0 rounded-b-[0px] max-h-[525px]
      `}
        fullScreen={true}
        placement={isMobile?'bottom':'right'}
         onInteractOutside={(e) => e.preventDefault()}

      >
        fullScreen={true}
        placement={isMobile?'bottom':'right'}>
        <GammaActionModal
          isOpen={actionType!='' && actionType!='deposit'}
          setIsOpen={(b)=>{
            if (!b) {
              handleCancel()
            }
          }}
          title={actionModalTitle}
          actionLabel={actionLabel}
          onActionClick={!isDeposit?handleWithdraw:isClaim?handleClaim:handleDeposit}
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
          <DepositWithdrawHeader />
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
            {userPublicKey && (userSourceTokenBal?.isZero() || userTargetTokenBal?.isZero()) && (
              <SwapNow />
            )}
          </div>

        </DialogBody>
        <DialogFooter>
          <StickyFooter
            disableActionButton={false}
            isLoading={false}
            onActionClick={isDeposit?handleDeposit:handleProcessStart('withdraw')}
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
