import { cn, Icon, Input, InputElementLeft, InputElementRight, InputGroup } from 'gfx-component-lib'
import React, { InputHTMLAttributes } from 'react'
import { useDarkMode } from '@/context'
import useBoolean from '@/hooks/useBoolean'

type SearchBarProps = {
  onClear?: () => void
  value?: string | number
  groupClassName?: string,
  additionalInputElementLeft?: JSX.Element
  additionalInputElementRight?: JSX.Element
} & InputHTMLAttributes<HTMLInputElement>
const SearchBar = ({
                     onClear,
                     value,
                     groupClassName,
                     className,
                     onChange,
                     additionalInputElementLeft,
                     additionalInputElementRight,
                     ...rest
                   }: SearchBarProps): JSX.Element => {
  const { mode } = useDarkMode()
  const [focus, setFocus] = useBoolean(false)
  const showRight = (typeof value == 'string' && value.trim().length > 0) || +value > 0
  return (
    <InputGroup
      className={cn('min-w-[200px] w-full', groupClassName)}
      leftItem={
        <InputElementLeft className={'flex gap-1.25'}>
          <Icon size={'sm'} src={`/img/assets/searchbar_${mode}${focus ? '_active' : ''}.svg`} alt="search-icon" />
          {additionalInputElementLeft}
        </InputElementLeft>
      }
      rightItem={
        showRight ?
          <InputElementRight
            className={'flex gap-1.25'}
            onClick={onClear}
            show={showRight}
          >
            {additionalInputElementRight}
            <Icon
              size={'sm'}
              src={`/img/assets/search_farm_${mode}.svg`}
              alt="search-icon"
              className={'cursor-pointer'}
            />
          </InputElementRight> :
          <InputElementRight
            className={'flex gap-1.25'}
            onClick={onClear}
          >
            {additionalInputElementRight}
          </InputElementRight>
      }
    >
      <Input
        {...rest}
        value={value}
        className={cn('min-w-[200px] w-full', className)}
        placeholder={'Search by token name symbol or address'}
        onChange={onChange}
        onFocus={setFocus.on}
        onBlur={setFocus.off}
      />
    </InputGroup>
  )
}

export default SearchBar
