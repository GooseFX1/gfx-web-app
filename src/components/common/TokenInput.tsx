import {
  Button,
  cn,
  Input,
  InputElementLeft,
  InputElementRight,
  InputGroup,
  ShadButtonProps
} from 'gfx-component-lib'
import { ChangeEvent } from 'react'
import { useDarkMode } from '@/context'

interface TokenInputProps {
  value?: number | string
  handleHalf?: () => void
  minDisabled?: boolean
  maxDisabled?: boolean
  handleMax?: () => void
  tokenSymbol?: string
  disabled?: boolean
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  outlineColorScheme?: Pick<ShadButtonProps, 'colorScheme'>
}
const TokenInput = ({
  value,
  handleHalf,
  minDisabled = false,
  maxDisabled = false,
  handleMax,
  tokenSymbol,
  disabled,
  onChange,
  outlineColorScheme
}: TokenInputProps): JSX.Element => {
  const { mode } = useDarkMode()
  const isDarkMode = mode === 'dark'
  return (
    <InputGroup
      leftItem={
        <InputElementLeft>
          <Button
            variant={'outline'}
            onClick={handleHalf}
            colorScheme={outlineColorScheme ?? isDarkMode ? 'white' : 'blue'}
            className={cn(`p-1.5`, !disabled && `text-text-blue dark:text-text-darkmode-primary`)}
            size={'xs'}
            disabled={minDisabled}
          >
            Half
          </Button>
          <Button
            variant={'outline'}
            onClick={handleMax}
            className={cn(`p-1.5`, !disabled && `text-text-blue dark:text-text-darkmode-primary`)}
            size={'xs'}
            colorScheme={outlineColorScheme ?? isDarkMode ? 'white' : 'blue'}
            disabled={maxDisabled}
          >
            Max
          </Button>
        </InputElementLeft>
      }
      rightItem={<InputElementRight>{tokenSymbol}</InputElementRight>}
    >
      <Input value={value ?? ''} placeholder={'0.00'} className={'text-right'} onChange={onChange} />
    </InputGroup>
  )
}
export default TokenInput
