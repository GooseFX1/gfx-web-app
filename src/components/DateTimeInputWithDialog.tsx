/* eslint-disable */
import {
  cn,
  Dialog,
  DialogBody,
  DialogCloseDefault,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTrigger,
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger
} from 'gfx-component-lib'
import React, { useMemo } from 'react'
import useBreakPoint from '@/hooks/useBreakPoint'
import DateTimePicker, { DateTimePickerProps } from '@/components/DateTimePicker'
import useBoolean from '@/hooks/useBoolean'

const RootWrapper = ({
  children,
  isOpen,
  setIsOpen,
  isMobile
}: {
  isOpen: boolean
  setIsOpen: (b: boolean) => void
  children: React.ReactNode
  isMobile: boolean
}) => {
  if (isMobile) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogOverlay />
        {children}
      </Dialog>
    )
  }
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      {children}
    </Popover>
  )
}
const TriggerWrapper = ({
  children,
  isMobile,
  triggerClassName
}: {
  isMobile: boolean
  children: React.ReactNode
  triggerClassName?: string
}) => {
  if (isMobile) {
    return (
        <DialogTrigger className={triggerClassName}>{children}</DialogTrigger>
    )
  }
  return (
    <PopoverAnchor>
        <PopoverTrigger className={triggerClassName}>{children}</PopoverTrigger>
    </PopoverAnchor>
  )
}
const ContentWrapper = ({ children, isMobile }: { isMobile: boolean; children: React.ReactNode }) => {
  if (isMobile) {
    return (
      <DialogPortal>
        <DialogContent placement={'bottom'} className={'h-auto pt-3'}>
          <DialogCloseDefault className={'z-[100]'}/>
          <DialogBody>{children}</DialogBody>
        </DialogContent>
      </DialogPortal>
    )
  }
  return <PopoverContent className={'p-0 border-none w-max'}>{children}</PopoverContent>
}
type DateTimeInputWithDialog = DateTimePickerProps & {
  placeholder?: string
  triggerClassName?: string
}

function DateTimeInputWithDialog({
  value,
  onChange,
  placeholder,
  triggerClassName,
  ...rest
}: DateTimeInputWithDialog) {
  const [isOpen, setIsOpen] = useBoolean(false)
  const { isMobile } = useBreakPoint()
  const computedValue = useMemo(() => {
    if (!value) return ''
    return value.format('MMM D, YYYY h:mm A')
  }, [value])

  return (
    <RootWrapper isOpen={isOpen} setIsOpen={setIsOpen.set} isMobile={isMobile}>
      <TriggerWrapper isMobile={isMobile} triggerClassName={triggerClassName}>
        <div
          className={cn(
            `
        px-2.5 py-[3.5px] border-1 border-solid border-border-lightmode-secondary dark:border-border-darkmode-secondary
        bg-background-lightmode-primary dark:bg-background-darkmode-primary text-text-lightmode-tertiary
         dark:text-text-darkmode-tertiary rounded-0.75 min-h-[35px] min-w-[160px] w-full 
         text-b2 font-semibold flex items-center justify-center
        `,
            computedValue &&
              `text-text-lightmode-primary dark:text-text-darkmode-primary 
        border-border-lightmode-primary dark:border-border-darkmode-primary`
          )}
        >
          <p className={'my-auto'}>{computedValue ? computedValue : placeholder ?? 'Select a dates'}</p>
        </div>
      </TriggerWrapper>
      <ContentWrapper isMobile={isMobile}>
        <DateTimePicker
          className={cn(``, isMobile && 'w-full border-none p-0 pb-2.5 px-2.5')}
          value={value}
          onChange={onChange}
          classNames={{
            head_row: 'flex w-full justify-between',
            row: 'flex w-full justify-between',
            day: 'text-b2',
            nav: 'ml-4'
        }}
          {...rest}
        />
      </ContentWrapper>
    </RootWrapper>
  )
  // try {
  //   child = (
  //     <Wrapper isOpen={isOpen} setIsOpen={setIsOpen.set}>
  //       <TriggerWrapper></TriggerWrapper>
  //       <ContentWrapper>
  //
  //       </ContentWrapper>
  //     </Wrapper>
  //   )
  // } catch (e) {
  //   console.error('child')
  // }
  // return child
}

export default DateTimeInputWithDialog
