import { FC } from 'react'
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
import { useWalletBalance } from '@/context/walletBalanceContext'
import { useMutation } from '@tanstack/react-query'
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
  const { claimableRewardsWithTokens, refreshRewards } = useBoostedRewards()
  const { createTransactionBuilder, sendBatchTransaction } = useTransaction()
  const { connection } = useConnectionConfig()
  const { GammaProgram } = usePriceFeedFarm()
  const { publicKey: userPublicKey } = useWalletBalance()
  const {wallet} = useWallet();

  const claimAllMutation = useMutation({
    mutationFn: async () => {
      // Split rewards into batches of 5
      const batchSize = 5
      const rewards = claimableRewardsWithTokens.rewards
      const batches = []

      for (let i = 0; i < rewards.length; i += batchSize) {
        batches.push(rewards.slice(i, i + batchSize))
      }

      const transactions = [];

      // Process each batch
      for (const batch of batches) {
        const batchTxBuilder = createTransactionBuilder()

        for (const reward of batch) {
          const tx = await claimRewards(GammaProgram, userPublicKey, connection, reward)
          batchTxBuilder.add(tx)
        }
        transactions.push(batchTxBuilder);
      }
      console.log(wallet);

      const { success } = await sendBatchTransaction(
        transactions,
        {
          successMessage: `You claimed $${numberFormatter(
            claimableRewardsWithTokens.totalClaimableRewardsUsd.toNumber(),
            4
          )} in rewards`
        },
        undefined,
        undefined,
        true
      )

      if (!success) {
        console.log('An error occurred while claiming rewards!')
        throw new Error('An error occurred while claiming rewards!')
      }
    },
    onError: (err) => {
      console.log(err)
    },
    onSuccess: async () => {
      await refreshRewards()
    },
    onSettled: () => {
      setOpenClaimAllRewardsDialog(false)
    }
  })

  if (!claimableRewardsWithTokens.totalClaimableRewardsUsd.gt(0)) return null
  if (claimableRewardsWithTokens.rewards.length === 0) return null

  return (
    <Dialog open={openClaimAllRewardsDialog} onOpenChange={setOpenClaimAllRewardsDialog}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent
          className="z-[1002] w-[340px] max-sm:w-full"
          placement={isMobile ? 'bottom' : 'default'}
          size={'lg'}
        >
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
                    className="w-3.75 h-3.75 min-w-[15px] min-h-[15px]"
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
                <div className="px-2 py-1">
                  <div className="flex flex-col gap-1 w-full">
                    {claimableRewardsWithTokens.rewards.map((reward, index) => (
                      <div
                        key={`${reward.token.address}-${index}`}
                        className="flex flex-row items-center justify-between w-full"
                      >
                        <div className="flex flex-row items-center">
                          <IconWithFallback
                            src={loadIconImage(reward.token.logoURI, mode)}
                            className="border-solid dark:border-black-2 border-white
                            border-[2px] rounded-full h-[25px] w-[25px]"
                          />
                          <p
                            className="font-display font-semibold text-[15px] 
                          text-text-lightmode-primary dark:text-text-darkmode-primary ml-2"
                          >
                            {reward.token.symbol}
                          </p>
                        </div>
                        <div
                          className="font-display font-semibold text-[15px] 
                          text-text-lightmode-primary dark:text-text-darkmode-primary"
                        >
                          {numberFormatter(reward.claimableAmount.toNumber())}
                          {'  '}
                          <span className="text-text-lightmode-tertiary dark:text-text-darkmode-tertiary">
                            (${numberFormatter(reward.claimableAmountUsd.toNumber())})
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <Button
                className="w-full py-[7.5px] px-[10px] mt-[10px]"
                colorScheme={'blue'}
                variant={'primary'}
                onClick={() => claimAllMutation.mutate()}
                isLoading={claimAllMutation.isLoading}
              >
                Claim ${numberFormatter(+claimableRewardsWithTokens.totalClaimableRewardsUsd.toFixed(2))}
              </Button>
              <p
                className="text-center mt-[10px] 
              text-[13px] text-text-lightmode-secondary dark:text-text-darkmode-secondary"
              >
                By selecting “Claim” you agree to{' '}
                <a
                  href={TERMS_OF_SERVICE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 dark:text-white underline"
                >
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
