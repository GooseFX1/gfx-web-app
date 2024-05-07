/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, ReactElement, useMemo, useState } from 'react'
import { DepositWithdrawDialog } from '../perps/DepositWithdraw'
import { Button, cn } from 'gfx-component-lib'
import { useWallet } from '@solana/wallet-adapter-react'
import { Connect } from '../../../layouts/Connect'
import { TradeConfirmation } from '../TradeConfirmation'

const ButtonStatesMobi: FC<{
  tabs: string[]
  selectedTab: string
  setSelectedTab: (tab: string) => void
}> = ({ tabs, selectedTab, setSelectedTab }): ReactElement => {
  const [depositWithdrawModal, setDepositWithdrawModal] = useState<boolean>(false)
  const { wallet } = useWallet()
  const publicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter?.publicKey])
  if (!publicKey)
    return (
      <div
        className="fixed bottom-0 left-0 w-full h-20  gradient-lite-3 dark:bg-gradient-2
      z-50 flex justify-center items-center"
      >
        <Connect customButtonStyle={`sm:w-[80vw] w-[90%] !h-10`} />
      </div>
    )
  else if (selectedTab === tabs[1] || selectedTab === tabs[2])
    return (
      <div
        className="fixed bottom-0 left-0 w-full h-20 gradient-lite-3 dark:bg-gradient-2
              z-50 flex justify-center items-center"
      >
        <Button
          variant="default"
          className={cn('h-10 w-[90%]')}
          colorScheme="blue"
          onClick={() => setDepositWithdrawModal(true)}
        >
          Deposit / Withdraw
        </Button>

        <DepositWithdrawDialog
          depositWithdrawModal={depositWithdrawModal}
          setDepositWithdrawModal={setDepositWithdrawModal}
        />
      </div>
    )
  return null
}

export default ButtonStatesMobi
