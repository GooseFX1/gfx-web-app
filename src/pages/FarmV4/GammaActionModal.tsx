import React, { FC } from 'react'
import {
  Button,
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  Icon
} from 'gfx-component-lib'
import useBreakPoint from '@/hooks/useBreakPoint'
import { NAV_LINKS, navigateToCurried } from '@/utils/requests'
import { useDarkMode } from '@/context'

type GammaActionModalProps = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  title: string
  children: React.ReactNode | React.ReactNode[]
  actionLabel: string
  onActionClick: () => void
  actionType: string
}
const GammaActionModal:FC<GammaActionModalProps> = ({
  isOpen,
  setIsOpen,
  title,
  children,
  actionLabel,
  onActionClick,
  actionType
                             }) => {
  const {mode} = useDarkMode()
  const {isMobile} = useBreakPoint()
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogOverlay/>
      <DialogContent
        size={'sm'}
        className={`p-2.5 pt-3 gap-1.25 border-1 border-solid border-border-lightmode-secondary 
        dark:border-border-darkmode-secondary z-[1002]`}
      placement={isMobile?'bottom':'default'}
      >
        <DialogHeader className={'flex-row justify-between pb-1.25'}>
          <h3 className={'text-start text-text-lightmode-primary dark:text-text-darkmode-primary'}>
            {title}
          </h3>
          <DialogClose className={'ml-auto'}><Icon
            className={'min-w-4 min-h-4 max-w-4 max-h-4'}
            src={`/img/assets/close-${mode}.svg`}/></DialogClose>
        </DialogHeader>
        <DialogBody>
          {children}
        </DialogBody>
        <DialogFooter className={'flex-col items-center gap-2.5'}>
          <Button
            fullWidth
            colorScheme={'blue'}
            onClick={onActionClick}
          >
            {actionLabel}
          </Button>
          <p
            className={`text-b3 text-text-darkmode-secondary`}
          >
            By selecting “{actionType}” you agree to
            <Button
              variant={'link'}
              onClick={navigateToCurried(NAV_LINKS.terms, '_blank')}
              size={'sm'}
              className={`max-sm:p-0 max-sm:text-h5 dark:text-text-darkmode-primary text-text-blue 
              text-h6 max-sm:h-[26px] p-0 h-max`}
            >
              &nbsp;Terms Of Service
            </Button>
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default GammaActionModal