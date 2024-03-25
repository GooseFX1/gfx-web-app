import { cn, Icon, Input, InputElementLeft, InputElementRight, InputGroup } from 'gfx-component-lib'
import React from 'react'
import { useDarkMode } from '@/context'
interface SearchBarProps {
  onClear?: () => void
  value?: string | number
  className?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}
const SearchBar = ({ onClear, value, className, onChange }: SearchBarProps): JSX.Element => {
  const { mode } = useDarkMode()
  return (
    <InputGroup
      className={cn('min-w-[200px] w-full max-w-[400px]', className)}
      leftItem={
        <InputElementLeft>
          <Icon size={'sm'} src={`/img/assets/search_${mode}.svg`} alt="search-icon" />
        </InputElementLeft>
      }
      rightItem={
        <InputElementRight
          onClick={onClear}
          show={(typeof value == 'string' && value.trim().length > 0) || value > 0}
        >
          <Icon
            size={'sm'}
            src={`/img/assets/search_farm_${mode}.svg`}
            alt="search-icon"
            className={'cursor-pointer'}
          />
        </InputElementRight>
      }
    >
      <Input
        value={value}
        className={cn('min-w-[200px] w-full max-w-[400px]', className)}
        placeholder={'Search by token symbol'}
        onChange={onChange}
      />
    </InputGroup>
  )
}

export default SearchBar
