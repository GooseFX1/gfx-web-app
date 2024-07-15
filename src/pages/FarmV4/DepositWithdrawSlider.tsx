/* eslint-disable */
import { FC, useEffect, useMemo, useState, useCallback } from 'react'
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogBody,
  Button,
  Icon,
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger
} from 'gfx-component-lib'
import { useSSLContext, useAccounts, useConnectionConfig } from '@/context'
import RewardsClose from '@/assets/rewards_close.svg?react'
import { PoolStats } from './PoolStats'
import DepositWithdrawInput from './DepositWithdrawInput'
import { TokenRow } from './TokenRow'
import { ReviewConfirm } from './ReviewConfirm'
import { useWallet } from '@solana/wallet-adapter-react'
import BigNumber from 'bignumber.js'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { ModeOfOperation } from './constants'
import RadioOptionGroup from '@/components/common/RadioOptionGroup'

export const DepositWithdrawSlider: FC = () => {
  const { wallet } = useWallet()
  const { getUIAmount } = useAccounts()
  const { connection } = useConnectionConfig()
  const { selectedCard, setOperationPending } = useSSLContext()
  const userPublicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter, wallet?.adapter?.publicKey])
  const [userSolBalance, setUserSOLBalance] = useState<number>(0)
  const [modeOfOperation, setModeOfOperation] = useState<string>(ModeOfOperation.DEPOSIT)
  const [userSourceTokenBal, setUserSourceTokenBal] = useState<BigNumber>(new BigNumber(0))
  const [userTargetTokenBal, setUserTargetTokenBal] = useState<BigNumber>(new BigNumber(0))
  const [userSourceDepositAmount, setUserSourceDepositAmount] = useState<string>('')
  const [userTargetDepositAmount, setUserTargetDepositAmount] = useState<string>('')
  const [userSourceWithdrawAmount, setUserSourceWithdrawAmount] = useState<string>('')
  const [userTargetWithdrawAmount, setUserTargetWithdrawAmount] = useState<string>('')

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
      console.log('handleInputChange', input, sourceToken, inputValue)
      if (!isNaN(inputValue)) {
        if (modeOfOperation === ModeOfOperation.DEPOSIT) {
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

  return (
    <Dialog open={true}>
      <DialogOverlay />
      <DialogContent
        className={`w-[393px] max-h-screen overflow-y-scroll rounded-b-none`}
        fullScreen={true}
        placement={'right'}
      >
        <DialogBody className={`bg-white dark:bg-black-2 relative w-full py-2 block`}>
          <>
            <div className="w-full h-14 flex flex-row items-center border-b border-solid dark:border-black-4 border-grey-4 px-2.5">
              <Icon src={`img/crypto/${selectedCard?.sourceToken}.svg`} size="lg" />
              <Icon src={`img/crypto/${selectedCard?.targetToken}.svg`} size="lg" className="mr-1.5" />
              <div className="font-poppins font-semibold text-average text-black-4 dark:text-grey-8 ">
                {selectedCard.sourceToken + ' - ' + selectedCard.targetToken}
              </div>
              <Button
                onClick={() => setOperationPending(false)}
                variant={'ghost'}
                className={`hidden min-md:inline-block absolute p-[inherit] right-3.75 top-5 min-md:right-5
                   min-md:top-5 z-[1] w-max p-0`}
                size={'sm'}
              >
                <RewardsClose
                  className={`h-3 w-3 min-md:h-5 min-md:w-5 stroke-border-lightmode-primary 
          min-md:stroke-border-darkmode-primary min-md:dark:stroke-border-darkmode-primary`}
                />
              </Button>
            </div>
            <div>
              <RadioOptionGroup
                defaultValue={'deposit'}
                value={modeOfOperation == ModeOfOperation.DEPOSIT ? 'deposit' : 'withdraw'}
                className={`w-full mt-3 max-sm:mt-1 px-2.5`}
                optionClassName={`w-full text-h5`}
                options={[
                  {
                    value: 'deposit',
                    label: 'Deposit',
                    onClick: () => setModeOfOperation(ModeOfOperation.DEPOSIT)
                  },
                  {
                    value: 'withdraw',
                    label: 'Withdraw',
                    onClick: () => setModeOfOperation(ModeOfOperation.WITHDRAW)
                  }
                ]}
              />
            </div>
            <Accordion collapsible type={'multiple'}>
              <AccordionItem value="pool-stats" className="dark:bg-black-1 bg-grey-5 mx-2.5 my-3">
                <AccordionTrigger>Pool Stats</AccordionTrigger>
                <AccordionContent>
                  <PoolStats token={selectedCard} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <div className="text-regular font-semibold font-poppins dark:text-grey-8 text-black-4 mb-2.5 mx-2.5">
              1. Add Deposits
            </div>
            <TokenRow token={selectedCard?.sourceToken} balance={userSourceTokenBal} />
            <DepositWithdrawInput
              isDeposit={modeOfOperation === ModeOfOperation.DEPOSIT}
              onChange={(e) => handleInputChange(e.target.value, true)}
              depositAmount={userSourceDepositAmount}
              withdrawAmount={userSourceWithdrawAmount}
            />
            <TokenRow token={selectedCard?.targetToken} balance={userTargetTokenBal} />
            <DepositWithdrawInput
              isDeposit={modeOfOperation === ModeOfOperation.DEPOSIT}
              onChange={(e) => handleInputChange(e.target.value, false)}
              depositAmount={userTargetDepositAmount}
              withdrawAmount={userTargetWithdrawAmount}
            />
            <ReviewConfirm />
          </>
        </DialogBody>
      </DialogContent>
    </Dialog>
  )
}
