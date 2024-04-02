import { cn, RadioGroup, RadioGroupItem } from 'gfx-component-lib'
import React from 'react'

interface Option {
  value: string
  label: string
  variant?: string
  onClick?: () => void
  className?: string
}

interface RadioGroupOptionProps {
  defaultValue?: string
  value?: string
  onChange?: (value: string) => void
  options: Option[]
  optionClassName?: string
  className?: string
  optionSize?: string
  orientation?: 'vertical' | 'horizontal'
}

const RadioOptionGroup = ({
  defaultValue,
  value,
  options,
  onChange,
  optionClassName,
  className,
  optionSize,
  orientation
}: RadioGroupOptionProps): JSX.Element => (
  <RadioGroup
    defaultValue={defaultValue}
    value={value}
    className={cn('self-stretch', className)}
    onValueChange={onChange}
    orientation={orientation}
  >
    {options.map((option, index) => (
      <RadioGroupItem
        value={option.value}
        key={index}
        variant={option.variant ?? 'primary'}
        size={optionSize ?? 'xl'}
        onClick={option.onClick}
        className={cn('', optionClassName, option.className)}
      >
        {option.label}
      </RadioGroupItem>
    ))}
  </RadioGroup>
)
export default RadioOptionGroup
// <RadioGroupItem value={'deposit'} size={'xl'} variant={'primary'} onClick={setDepositSelected.on}
//                 className={'w-full min-md:w-[85px]'}
// >
//   Deposit
// </RadioGroupItem>
// <RadioGroupItem value={'withdraw'} size={'xl'} variant={'primary'} onClick={setDepositSelected.off}
//                 className={'w-full min-md:w-[85px]'}
// >
//   Withdraw
// </RadioGroupItem>
