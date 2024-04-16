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
