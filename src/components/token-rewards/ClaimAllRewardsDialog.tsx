import React, { FC, useMemo, useState } from 'react'
import 'styled-components/macro'
import {
  Button,
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  Icon
} from 'gfx-component-lib'
import { useConnectionConfig, useDarkMode, usePriceFeedFarm } from '@/context'
import { IconWithFallback } from '../common/IconWithFallback'
import { loadIconImage } from '@/utils/misc'
import useBreakPoint from '@/hooks/useBreakPoint'
import { TERMS_OF_SERVICE } from '@/constants'
import { useBoostedRewards } from '@/context/boostedRewardsContext'
import { numberFormatter } from '@/utils'
import { claimRewards } from '@/web3/Farm'
import useTransaction from '@/hooks/useTransaction'
import { useWallet } from '@solana/wallet-adapter-react'

type ClaimAllRewardsDialogProps = {
  openClaimAllRewardsDialog: boolean
  setOpenClaimAllRewardsDialog: (open: boolean) => void
}

export const ClaimAllRewardsDialog: FC<ClaimAllRewardsDialogProps> = ({
  openClaimAllRewardsDialog,
  setOpenClaimAllRewardsDialog
}): JSX.Element => {
  const { mode } = useDarkMode()
  const { isMobile } = useBreakPoint()
  const { claimableRewardsWithTokens } = useBoostedRewards()
  const [sendingTransaction, setSendingTransaction] = useState(false)
  const { sendTransaction, createTransactionBuilder } = useTransaction()
  const { connection } = useConnectionConfig()
  const { wallet } = useWallet()
  const { GammaProgram } = usePriceFeedFarm()
  const userPublicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter, wallet?.adapter?.publicKey])

  if (!claimableRewardsWithTokens.totalClaimableRewardsUsd.gt(0)) return null
  if (claimableRewardsWithTokens.rewards.length === 0) return null

  const handleClaimAll = async () => {
    try {
      setSendingTransaction(true)
      const txBuilder = createTransactionBuilder()

      for (const reward of claimableRewardsWithTokens.rewards) {
        const tx = await claimRewards(GammaProgram, userPublicKey, connection, reward)
        txBuilder.add(tx)
      }

      const { success } = await sendTransaction(
        txBuilder,
        {
          // eslint-disable-next-line max-len
          successMessage: `You claimed $${claimableRewardsWithTokens.totalClaimableRewardsUsd.toNumber()} in rewards`
        },
        undefined,
        undefined,
        true
      )
      console.log('ClaimAllRewardsResponse', success)
      if (!success) {
        //off(connectionId)
        console.log('An error occurred while claiming rewards!')
      }
    } catch (e) {
      console.log('An error occurred while claiming rewards.', e)
    }
    setSendingTransaction(false)
  }

  return (
    <Dialog open={openClaimAllRewardsDialog} onOpenChange={setOpenClaimAllRewardsDialog}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className="z-[1002]" placement={isMobile ? 'bottom' : 'default'} size={'lg'}>
          <DialogBody>
            <div className="flex flex-col p-[10px] pt-[12px] w-full">
              <div className="flex flex-row items-center justify-between w-full">
                <h2
                  className="text-[18px] font-semibold 
                    text-text-lightmode-primary dark:text-text-darkmode-primary"
                >
                  Claim All
                </h2>
                <DialogClose onClick={() => setOpenClaimAllRewardsDialog(false)}>
                  <Icon
                    src={`/img/assets/rewards_close-${mode}.svg`}
                    alt="Close"
                    className="w-4 h-4 min-w-[25px] min-h-[25px]"
                  />
                </DialogClose>
              </div>
              <div className="flex flex-col gap-2 mt-[10px]">
                <p
                  className="font-display 
                font-semibold text-[15px] text-text-lightmode-secondary dark:text-text-darkmode-secondary"
                >
                  By claiming, you will get any pending yield available.
                </p>
                <div className="flex flex-col justify-between">
                  <div className="flex flex-row items-center justify-between">
                    <div className="flex-1">
                      <p
                        className="font-display font-semibold text-[15px] 
                      text-text-lightmode-secondary dark:text-text-darkmode-secondary"
                      >
                        Claiming Yield
                      </p>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-2">
                      {claimableRewardsWithTokens.rewards.map((reward) => (
                        <div key={reward.token.address} className="flex flex-row items-center gap-[5px]">
                          <IconWithFallback
                            src={loadIconImage(reward.token.logoURI, mode)}
                            className="border-solid dark:border-black-2 border-white
                          border-[2px] rounded-full h-[25px] w-[25px]"
                          />
                          <p
                            className="font-display font-semibold text-[15px] 
                          text-text-lightmode-primary dark:text-text-darkmode-primary"
                          >
                            {numberFormatter(reward.claimableAmount.toNumber())}
                            {reward.token.symbol}
                            <span className="text-text-lightmode-tertiary dark:text-text-darkmode-tertiary">
                              (~$
                              {numberFormatter(reward.claimableAmountUsd.toNumber())})
                            </span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <Button
                className="w-full py-[7.5px] px-[10px] mt-[10px]"
                colorScheme={'blue'}
                variant={'primary'}
                onClick={handleClaimAll}
                isLoading={sendingTransaction}
              >
                Claim ${numberFormatter(claimableRewardsWithTokens.totalClaimableRewardsUsd.toNumber())}
              </Button>
              <p
                className="text-center mt-[10px] 
              text-[13px] text-text-lightmode-secondary dark:text-text-darkmode-secondary"
              >
                By selecting “withdraw” you agree to{' '}
                <a href={TERMS_OF_SERVICE} className="text-blue-500 dark:text-white underline">
                  Terms of Service
                </a>
              </p>
            </div>
          </DialogBody>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
