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

interface TokenInputProps {
  value?: number | string
  handleHalf?: () => void
  handleMax?: () => void
  tokenSymbol?: string
  disabled?: boolean
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  outlineColorScheme?: Pick<ShadButtonProps, 'colorScheme'>
}
const TokenInput = ({
  value,
  handleHalf,
  handleMax,
  tokenSymbol,
  disabled,
  onChange,
  outlineColorScheme
}: TokenInputProps): JSX.Element => (
  <InputGroup
    leftItem={
      <InputElementLeft>
        <Button
          variant={'outline'}
          onClick={handleHalf}
          colorScheme={outlineColorScheme ?? 'blue'}
          className={cn(`p-1.5`, !disabled && `text-text-blue dark:text-text-darkmode-primary`)}
          size={'xs'}
          disabled={disabled}
        >
          Half
        </Button>
        <Button
          variant={'outline'}
          onClick={handleMax}
          className={cn(`p-1.5`, !disabled && `text-text-blue dark:text-text-darkmode-primary`)}
          size={'xs'}
          colorScheme={outlineColorScheme ?? 'blue'}
          disabled={disabled}
        >
          Max
        </Button>
      </InputElementLeft>
    }
    rightItem={<InputElementRight>{tokenSymbol}</InputElementRight>}
  >
    <Input value={value > 0 ? value : ''} placeholder={'0.00'} className={'text-right'} onChange={onChange} />
  </InputGroup>
)
export default TokenInput
