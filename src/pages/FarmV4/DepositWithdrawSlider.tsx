import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { Dialog, DialogBody, DialogContent } from 'gfx-component-lib'
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

export const DepositWithdrawSlider: FC = () => {
  const { wallet } = useWallet()
  const {isMobile} = useBreakPoint()
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
        if (modeOfOperation === ModeOfOperation.DEPOSIT) {
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
        if (modeOfOperation === ModeOfOperation.DEPOSIT) {
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
      if (modeOfOperation === ModeOfOperation.DEPOSIT) {
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
      if (modeOfOperation === ModeOfOperation.DEPOSIT) {
        if (sourceToken) {
          setUserSourceDepositAmount(userSourceTokenBal ? new BigNumber(userSourceTokenBal) : new BigNumber(0))
        } else {
          setUserTargetDepositAmount(userTargetTokenBal ? new BigNumber(userTargetTokenBal) : new BigNumber(0))
        }
      }
    },
    [modeOfOperation, userSourceTokenBal, userTargetTokenBal]
  )

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
        <DialogBody className={`bg-white dark:bg-black-2 relative w-full py-2 block overflow-y-hidden`}>
          <DepositWithdrawHeader />
          <div className="flex flex-col overflow-y-scroll h-full pb-[110px]">
            <DepositWithdrawToggle modeOfOperation={modeOfOperation} setModeOfOperation={setModeOfOperation} />
            <DepositWithdrawAccordion />
            <DepositWithdrawLabel text="1. Add Deposits" />
            <TokenRow token={selectedCard?.sourceToken} balance={userSourceTokenBal} />
            <DepositWithdrawInput
              isDeposit={modeOfOperation === ModeOfOperation.DEPOSIT}
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
              isDeposit={modeOfOperation === ModeOfOperation.DEPOSIT}
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
          <StickyFooter />
        </DialogBody>
      </DialogContent>
    </Dialog>
  )
}
