import { FC, useEffect, useMemo, useState, useCallback } from 'react'
import { Dialog, DialogOverlay, DialogContent, DialogBody } from 'gfx-component-lib'
import { useSSLContext, useAccounts, useConnectionConfig } from '@/context'
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

export const DepositWithdrawSlider: FC = () => {
  const { wallet } = useWallet()
  const { getUIAmount } = useAccounts()
  const { connection } = useConnectionConfig()
  const { selectedCard } = useSSLContext()
  const userPublicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter, wallet?.adapter?.publicKey])
  const [userSolBalance, setUserSOLBalance] = useState<number>(0)
  const [modeOfOperation, setModeOfOperation] = useState<string>(ModeOfOperation.DEPOSIT)
  const [userSourceTokenBal, setUserSourceTokenBal] = useState<BigNumber>(new BigNumber(0))
  const [userTargetTokenBal, setUserTargetTokenBal] = useState<BigNumber>(new BigNumber(0))
  const [userSourceDepositAmount, setUserSourceDepositAmount] = useState<BigNumber>(new BigNumber(0))
  const [userTargetDepositAmount, setUserTargetDepositAmount] = useState<BigNumber>(new BigNumber(0))
  const [userSourceWithdrawAmount, setUserSourceWithdrawAmount] = useState<BigNumber>(new BigNumber(0))
  const [userTargetWithdrawAmount, setUserTargetWithdrawAmount] = useState<BigNumber>(new BigNumber(0))

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
      if (selectedCard.sourceToken === 'SOL') setUserSourceTokenBal(new BigNumber(userSolBalance))
      else setUserSourceTokenBal(new BigNumber(getUIAmount(selectedCard?.sourceTokenMintAddress)))
      if (selectedCard.targetToken === 'SOL') setUserTargetTokenBal(new BigNumber(userSolBalance))
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

  //need to handle the half case for withdraw once we get the onChain data
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

  //need to handle the max case for withdraw once we get the onChain data
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
    <Dialog open={true}>
      <DialogOverlay />
      <DialogContent className={`w-[393px] max-h-screen rounded-b-none`} fullScreen={true} placement={'right'}>
        <DialogBody className={`bg-white dark:bg-black-2 relative w-full py-2 block overflow-y-hidden`}>
          <DepositWithdrawHeader />
          <div className="overflow-y-scroll h-full pb-[110px]">
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
            />
            <TokenRow token={selectedCard?.targetToken} balance={userTargetTokenBal} />
            <DepositWithdrawInput
              isDeposit={modeOfOperation === ModeOfOperation.DEPOSIT}
              onChange={(e) => handleInputChange(e.target.value, false)}
              depositAmount={userTargetDepositAmount}
              withdrawAmount={userTargetWithdrawAmount}
              handleHalf={() => handleHalf(false)}
              handleMax={() => handleMax(false)}
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
