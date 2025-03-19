import React, { FC } from 'react'
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
import { useDarkMode } from '@/context'
import { IconWithFallback } from '../common/IconWithFallback'
import { loadIconImage } from '@/utils/misc'
import { GAMMAToken } from '@/types/gamma'
import useBreakPoint from '@/hooks/useBreakPoint'
import { TERMS_OF_SERVICE } from '@/constants'

type ClaimAllRewardsDialogProps = {
  rewards: {
    token: GAMMAToken
    amount: number
  }[]
  openClaimAllRewardsDialog: boolean
  setOpenClaimAllRewardsDialog: (open: boolean) => void
}

export const ClaimAllRewardsDialog: FC<ClaimAllRewardsDialogProps> = ({
  rewards,
  openClaimAllRewardsDialog,
  setOpenClaimAllRewardsDialog
}): JSX.Element => {
  const { mode } = useDarkMode()
  const { isMobile } = useBreakPoint()
  const total = 0

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
                      {rewards.map((reward) => (
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
                            {reward.amount}
                            {reward.token.symbol}
                            <span className="text-text-lightmode-tertiary dark:text-text-darkmode-tertiary">
                              (~${0.0})
                            </span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <Button className="w-full py-[7.5px] px-[10px] mt-[10px]" colorScheme={'blue'} variant={'primary'}>
                Claim ${total}
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
