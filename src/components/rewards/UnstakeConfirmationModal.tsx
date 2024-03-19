import React, { FC, useCallback } from 'react'
import useRewards from '../../context/rewardsContext'
import { numberFormatter } from '../../utils'
import CloseIcon from '../../assets/close-lite.svg?react'
import { useDarkMode } from '../../context'
import {
  Button,
  cn,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay
} from 'gfx-component-lib'
import useBreakPoint from '@/hooks/useBreakPoint'
interface UnstakeConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  amount: number
  setStakeLoading: (loading: boolean) => void
}

const UnstakeConfirmationModal: FC<UnstakeConfirmationModalProps> = ({
  isOpen,
  onClose,
  amount = 0.0,
  setStakeLoading
}) => {
  const { unstake, totalStaked } = useRewards()
  const handleStakeConfirmation = useCallback(() => {
    setStakeLoading(true)
    unstake(amount).finally(() => setStakeLoading(false))
    onClose()
  }, [amount])
  const { mode } = useDarkMode()
  const { isMobile } = useBreakPoint()
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className={''} />
      <DialogContent
        className={cn(' w-[400px] h-[270px] p-2.5', isMobile && 'w-full')}
        placement={isMobile ? 'bottom' : 'default'}
      >
        <DialogHeader className={'flex flex-row justify-between items-center'}>
          <h2
            className={`mb-0 text-black-4 dark:text-grey-8
             font-semibold text-center leading-none`}
          >
            Are you sure you want to unstake?
          </h2>
          <CloseIcon
            onClick={onClose}
            className={'w-4 h-4 !mt-0'}
            style={{
              stroke: mode == 'dark' ? '#b5b5b5' : '#3c3c3c',
              cursor: 'pointer'
            }}
            aria-label={'close-button'}
          />
        </DialogHeader>
        <DialogBody>
          <div
            className={` flex flex-col 
           rounded-t-[10px] min-md:rounded-[10px] bg-white dark:bg-black-2 relative gap-2.5 min-md:gap-4.75
           font-semibold
           `}
          >
            <div className={`flex flex-col gap-2.5`}>
              <p
                className={`mb-0 text-grey-1 dark:text-grey-2 text-[13px] min-md:text-[15px]
          font-semibold  mx-auto
          `}
              >
                Once the cooldown starts, the process cannot be undone. You will need to restake your GOFX
              </p>
              <div
                className={`flex items-center justify-between text-[15px] dark:text-grey-2 text-black-4
              font-semibold`}
              >
                <p className={`mb-0`}>Unstake Amount</p>
                <p className={`mb-0 dark:text-grey-8`}>{numberFormatter(amount, 2)} GOFX</p>
              </div>
            </div>

            <div className={`flex flex-col gap-2.5`}>
              <Button colorScheme={'red'} onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant={'link'}
                onClick={handleStakeConfirmation}
                className={'dark:text-white text-text-blue'}
                disabled={!(totalStaked >= amount)}
              >
                Yes, Continue With Cooldown
              </Button>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <p
            className={`text-[13px] leading-[16px] text-center mx-auto  text-grey-1
            dark:text-grey-2 font-semibold`}
          >
            By selecting “Yes” you agree to&nbsp;
            <a
              href={'https://docs.goosefx.io/'}
              target={'_blank'}
              rel="noopener noreferrer"
              className={`underline dark:text-white text-blue-1 font-semibold`}
            >
              Terms of Service
            </a>
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
export default UnstakeConfirmationModal
