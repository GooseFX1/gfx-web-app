import { Button, cn, Input, InputElementLeft, InputElementRight, InputGroup, ShadButtonProps } from 'gfx-component-lib'
import { ChangeEvent, useCallback, useRef } from 'react'
import { useDarkMode } from '@/context'
import { PropsWithKey } from '@/pages/TradeV3/mobile/PlaceOrderMobi'

interface TokenInputProps {
  value?: number | string
  handleHalf?: () => void
  minMaxDisabled?: boolean
  handleMax?: () => void
  tokenSymbol?: string
  disabled?: boolean
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  outlineColorScheme?: Pick<ShadButtonProps, 'colorScheme'>
}

const TokenInput = ({
  value,
  handleHalf,
  minMaxDisabled = false,
  handleMax,
  tokenSymbol,
  disabled,
  onChange,
  outlineColorScheme
}: PropsWithKey<TokenInputProps>): JSX.Element => {
  const { isDarkMode } = useDarkMode()
  const inputRef = useRef<HTMLInputElement>(null)

  const focusInput = useCallback(() => {
    inputRef.current?.focus()
  }, [inputRef])

  return (
    <InputGroup
      onClick={focusInput}
      leftItem={
        <InputElementLeft>
          <Button
            variant={'outline'}
            onClick={handleHalf}
            colorScheme={outlineColorScheme ?? isDarkMode ? 'white' : 'blue'}
            className={cn(`p-1.5`, !disabled && `text-text-blue dark:text-text-darkmode-primary`)}
            size={'xs'}
            disabled={minMaxDisabled}
          >
            Half
          </Button>
          <Button
            variant={'outline'}
            onClick={handleMax}
            className={cn(`p-1.5`, !disabled && `text-text-blue dark:text-text-darkmode-primary`)}
            size={'xs'}
            colorScheme={outlineColorScheme ?? isDarkMode ? 'white' : 'blue'}
            disabled={minMaxDisabled}
          >
            Max
          </Button>
        </InputElementLeft>
      }
      rightItem={<InputElementRight>{tokenSymbol}</InputElementRight>}
    >
      <Input
        ref={inputRef}
        value={value ?? ''}
        placeholder={'0.00'}
        className={'text-right'}
        onChange={onChange}
      />
    </InputGroup>
  )
}
export default TokenInput
