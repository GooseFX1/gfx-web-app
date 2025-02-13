import {
  cn,
  Dialog,
  DialogBody,
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

const Wrapper = ({
  children,
  isOpen,
  setIsOpen
}: {
  isOpen: boolean
  setIsOpen: (b: boolean) => void
  children: React.ReactNode
}) => {
  const { isMobile } = useBreakPoint()
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
const TriggerWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isMobile } = useBreakPoint()
  if (isMobile) {
    return <DialogTrigger>{children}</DialogTrigger>
  }
  return (
    <PopoverAnchor>
      <PopoverTrigger>{children}</PopoverTrigger>
    </PopoverAnchor>
  )
}
const ContentWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isMobile } = useBreakPoint()
  if (isMobile) {
    return (
      <DialogPortal>
        <DialogContent placement={'bottom'} className={'h-auto pt-3'}>
          <DialogBody>{children}</DialogBody>
        </DialogContent>
      </DialogPortal>
    )
  }
  return <PopoverContent className={'p-0 border-none w-max'}>{children}</PopoverContent>
}
type DateTimeInputWithDialog = DateTimePickerProps & {
  placeholder?: string
}

function DateTimeInputWithDialog({ value, onChange, placeholder, ...rest }: DateTimeInputWithDialog) {
  const [isOpen, setIsOpen] = useBoolean(false)
  const { isMobile } = useBreakPoint()
  const computedValue = useMemo(() => value?.toDate()?.toISOString(), [value])
  let child;
  try {
    child = <Wrapper isOpen={isOpen} setIsOpen={setIsOpen.set}>
      <TriggerWrapper>
        <div
          className={`
        px-2.5 py-[3.5px] border-1 border-solid border-border-lightmode-secondary dark:border-border-darkmode-secondary
        bg-background-lightmode-primary dark:bg-background-darkmode-primary text-text-lightmode-tertiary
         dark:text-text-darkmode-tertiary rounded-0.75 
        `}
        >
          {computedValue ? computedValue : placeholder ?? 'Select a dates'}
        </div>
      </TriggerWrapper>
      <ContentWrapper>
        <DateTimePicker
          className={cn(``, isMobile && 'w-full border-none p-0 pb-2.5 px-2.5')}
          value={value}
          onChange={onChange}
          classNames={{
            head_row: 'flex w-full justify-between',
            row: 'flex w-full justify-between',
            day: 'text-b2'
          }}
          {...rest} />
      </ContentWrapper>
    </Wrapper>

  } catch (e) {
    console.error('child')
  }
  return child
}

export default DateTimeInputWithDialog
