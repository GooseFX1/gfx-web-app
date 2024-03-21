import { Button, cn, Input, InputElementLeft, InputElementRight, InputGroup } from 'gfx-component-lib'
import { ChangeEvent } from 'react'

interface TokenInputProps {
  value?: number | string
  handleHalf?: () => void
  handleMax?: () => void
  tokenSymbol?: string
  disabled?: boolean
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
}
const TokenInput = ({
  value,
  handleHalf,
  handleMax,
  tokenSymbol,
  disabled,
  onChange
}: TokenInputProps): JSX.Element => (
  <InputGroup
    leftItem={
      <InputElementLeft>
        <Button
          variant={'ghost'}
          onClick={handleHalf}
          className={cn(`p-1.5`, !disabled && `text-text-blue dark:text-text-darkmode-primary`)}
          size={'sm'}
          disabled={disabled}
        >
          Half
        </Button>
        <Button
          variant={'ghost'}
          onClick={handleMax}
          className={cn(`p-1.5`, !disabled && `text-text-blue dark:text-text-darkmode-primary`)}
          size={'sm'}
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
