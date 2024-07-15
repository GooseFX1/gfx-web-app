/* eslint-disable */
import { Button, cn, Input, InputElementRight, InputGroup } from 'gfx-component-lib'
import { useCallback, useRef, FC } from 'react'
import { useDarkMode } from '@/context'

const DepositWithdrawInput: FC<{
  isDeposit: boolean
  onChange: any
  depositAmount: string
  withdrawAmount: string
}> = ({ isDeposit, onChange, depositAmount, withdrawAmount }): JSX.Element => {
  const { isDarkMode } = useDarkMode()
  const inputRef = useRef<HTMLInputElement>(null)

  const focusInput = useCallback(() => {
    inputRef.current?.focus()
  }, [inputRef])

  const calculateValue = () => {
    if (isDeposit) return depositAmount
    else return withdrawAmount
  }

  return (
    <div className="m-2.5">
      <InputGroup
        onClick={focusInput}
        rightItem={
          <InputElementRight>
            <Button
              variant={'outline'}
              colorScheme={isDarkMode ? 'white' : 'blue'}
              className={cn(`p-1.5 text-text-black-4 dark:text-text-darkmode-primary`)}
              size={'xs'}
            >
              Half
            </Button>
            <Button
              variant={'outline'}
              className={cn(`p-1.5 text-text-black-4 dark:text-text-darkmode-primary`)}
              size={'xs'}
              colorScheme={isDarkMode ? 'white' : 'blue'}
            >
              Max
            </Button>
          </InputElementRight>
        }
      >
        <Input
          ref={inputRef}
          placeholder={'0.00'}
          className={'text-left !p-1.5'}
          onChange={onChange}
          value={calculateValue()}
        />
      </InputGroup>
    </div>
  )
}
export default DepositWithdrawInput
